import path from "path";
import ts from "typescript";
import { mergeArrayMap } from "../util/mergeArrayMap";
import { upsert } from "../util/upsert";
import { getStatementDeclName } from "./ast/getStatementDeclName";
import {
  declareGlobalSymbol,
  ReplacementMap,
  ReplacementName,
  ReplacementTarget,
  scanBetterFile,
} from "./scanBetterFile";

type GenerateOptions = {
  emitOriginalAsComment?: boolean;
  emitNoDefaultLib?: boolean;
};

/**
 * Generate one better lib file.
 */
export function generate(
  tsLibDir: string,
  targetFile: string,
  sourceFile: string,
  { emitOriginalAsComment = false, emitNoDefaultLib = false }: GenerateOptions,
): string | undefined {
  const tsLibFile = path.join(tsLibDir, sourceFile);
  const originalProgram = ts.createProgram([tsLibFile], {});
  const originalFile = originalProgram.getSourceFile(tsLibFile);
  if (!originalFile) {
    return undefined;
  }

  const printer = ts.createPrinter();

  let result = emitNoDefaultLib
    ? // This is used as a good indicator of being a default lib file
      `/// <reference no-default-lib="true"/>
`
    : "";

  const replacementTargets = scanBetterFile(printer, targetFile);

  if (replacementTargets.size === 0) {
    return result + originalFile.text;
  }

  return (
    result +
    generateStatements(
      printer,
      originalFile,
      originalFile.statements,
      replacementTargets,
      emitOriginalAsComment,
    )
  );
}

function generateStatements(
  printer: ts.Printer,
  originalFile: ts.SourceFile,
  statements: readonly ts.Statement[],
  replacementTargets: ReplacementMap,
  emitOriginalAsComment: boolean,
): string {
  let result = "";
  const consumedReplacements = new Set<ReplacementName>();
  for (const statement of statements) {
    if (
      ts.isModuleDeclaration(statement) &&
      ts.isIdentifier(statement.name) &&
      statement.name.text === "global"
    ) {
      // declare global { ... }
      consumedReplacements.add(declareGlobalSymbol);

      const declareGlobalReplacement =
        replacementTargets.get(declareGlobalSymbol);
      if (declareGlobalReplacement === undefined) {
        result += statement.getFullText(originalFile);
        continue;
      }

      result += generateDeclareGlobalReplacement(
        printer,
        originalFile,
        statement,
        declareGlobalReplacement,
        emitOriginalAsComment,
      );
      continue;
    }

    const name = getStatementDeclName(statement);
    if (name === undefined) {
      result += statement.getFullText(originalFile);
      continue;
    }
    const replacementTarget = replacementTargets.get(name);
    if (replacementTarget === undefined) {
      result += statement.getFullText(originalFile);
      continue;
    }

    consumedReplacements.add(name);

    if (ts.isInterfaceDeclaration(statement)) {
      result += generateInterface(
        printer,
        originalFile,
        statement,
        replacementTarget,
        emitOriginalAsComment,
      );
      continue;
    }

    result += generateFullReplacement(
      originalFile,
      statement,
      replacementTarget,
      emitOriginalAsComment,
    );
  }
  result += originalFile.text.slice(originalFile.endOfFileToken.pos);

  // copy other statements
  for (const name of consumedReplacements) {
    replacementTargets.delete(name);
  }
  if (replacementTargets.size > 0) {
    result += "// --------------------\n";
  }
  for (const target of replacementTargets.values()) {
    for (const statement of target) {
      if (statement.type === "non-interface") {
        result += statement.statement.getFullText(statement.sourceFile);
      } else {
        result += statement.originalStatement.getFullText(statement.sourceFile);
      }
    }
  }
  return result;
}

function generateFullReplacement(
  originalFile: ts.SourceFile,
  statement: ts.Statement,
  replacementTarget: readonly ReplacementTarget[],
  emitOriginalAsComment: boolean,
) {
  // Find the replacement target of same kind.
  const replacementTargetOfSameKind = replacementTarget.flatMap((target) =>
    target.type === "non-interface" ? [target] : [],
  );
  if (replacementTargetOfSameKind.length === 0) {
    return statement.getFullText(originalFile);
  }
  // Emit replaced statements
  let result =
    replacementTargetOfSameKind
      .map(({ statement, sourceFile }) => statement.getFullText(sourceFile))
      .join("") ?? "";
  if (emitOriginalAsComment) {
    // Replaced statements are emitted as comments
    // to make it easier to detect original lib changes
    result += "\n" + commentOut(statement.getFullText(originalFile)) + "\n";
  }
  return result;
}

function generateDeclareGlobalReplacement(
  printer: ts.Printer,
  originalFile: ts.SourceFile,
  statement: ts.ModuleDeclaration,
  replacementTarget: readonly ReplacementTarget[],
  emitOriginalAsComment: boolean,
) {
  if (!replacementTarget.every((target) => target.type === "declare-global")) {
    throw new Error("Invalid replacement target");
  }
  if (!statement.body || !ts.isModuleBlock(statement.body)) {
    return statement.getFullText(originalFile);
  }

  const nestedStatements = statement.body.statements;

  let result = "";

  result += "declare global {\n";

  const nestedReplacementTarget = mergeArrayMap(
    replacementTarget.map((t) => t.statements),
  );

  result += generateStatements(
    printer,
    originalFile,
    nestedStatements,
    nestedReplacementTarget,
    emitOriginalAsComment,
  );

  result += "}\n";
  return result;
}

function generateInterface(
  printer: ts.Printer,
  originalFile: ts.SourceFile,
  statement: ts.InterfaceDeclaration,
  replacementTarget: readonly ReplacementTarget[],
  emitOriginalAsComment: boolean,
) {
  const replaceInterfaces = replacementTarget.flatMap((target) =>
    target.type === "interface" ? [target] : [],
  );
  if (
    replaceInterfaces.some(
      (target) =>
        !isPartialReplacement(
          statement,
          originalFile,
          target.originalStatement,
          target.sourceFile,
        ),
    )
  ) {
    // This needs to be a full replacement
    let result = "";
    for (const target of replaceInterfaces) {
      result += target.originalStatement.getFullText(target.sourceFile);
    }
    if (emitOriginalAsComment) {
      result += "\n" + commentOut(statement.getFullText(originalFile)) + "\n";
    }
    return result;
  }

  const replaceInterfaceMembers = new Map<
    string,
    {
      member: ts.TypeElement;
      text: string;
    }[]
  >();
  for (const target of replacementTarget) {
    if (target.type !== "interface") {
      continue;
    }
    for (const [memberName, elements] of target.members) {
      upsert(replaceInterfaceMembers, memberName, (members = []) => {
        members.push(...elements);
        return members;
      });
    }
  }
  const emittedMembers = new Map<string, ts.TypeElement[]>();
  const memberList = statement.members.flatMap((mem) => {
    const nameStr = mem.name?.getText(originalFile) ?? "";
    if (emittedMembers.has(nameStr)) {
      emittedMembers.get(nameStr)?.push(mem);
      return [];
    }
    const replacedMembers = replaceInterfaceMembers.get(nameStr);
    if (replacedMembers !== undefined) {
      emittedMembers.set(nameStr, [mem]);
      return replacedMembers;
    }
    return [
      {
        member: mem,
        text: mem.getFullText(originalFile),
      },
    ];
  });

  let result = "";
  result += printInterface(printer, statement, memberList, originalFile);

  if (emitOriginalAsComment) {
    result += "\n";
    for (const originalMems of emittedMembers.values()) {
      for (const originalMem of originalMems) {
        result += commentOut(originalMem.getFullText(originalFile));
      }
    }
    result += "\n";
  }

  return result;
}

/**
 * Determines whether interface can be partially replaced.
 */
function isPartialReplacement(
  interfaceDecl: ts.InterfaceDeclaration,
  originalFile: ts.SourceFile,
  replacementDecl: ts.InterfaceDeclaration,
  betterFile: ts.SourceFile,
): boolean {
  // Compare type parameters and herigate using full text.
  if (
    interfaceDecl.typeParameters !== undefined &&
    replacementDecl.typeParameters !== undefined &&
    interfaceDecl.typeParameters.length ===
      replacementDecl.typeParameters.length
  ) {
    const rtp = replacementDecl.typeParameters;
    if (
      interfaceDecl.typeParameters.some((typeParam, index) => {
        return (
          typeParam.getFullText(originalFile).trim() !==
          rtp[index].getFullText(betterFile).trim()
        );
      })
    ) {
      return false;
    }
  } else if (
    interfaceDecl.typeParameters !== undefined ||
    replacementDecl.typeParameters !== undefined
  ) {
    return false;
  }
  if (
    interfaceDecl.heritageClauses !== undefined &&
    replacementDecl.heritageClauses !== undefined &&
    interfaceDecl.heritageClauses.length ===
      replacementDecl.heritageClauses.length
  ) {
    const rhc = replacementDecl.heritageClauses;
    if (
      interfaceDecl.heritageClauses.some((heritageClause, index) => {
        return (
          heritageClause.getFullText(originalFile) !==
          rhc[index].getFullText(betterFile)
        );
      })
    ) {
      return false;
    }
  } else if (
    interfaceDecl.heritageClauses !== undefined ||
    replacementDecl.heritageClauses !== undefined
  ) {
    return false;
  }
  return true;
}

/**
 * Print an interface declaration where members may be from
 * mixed source files.
 */
function printInterface(
  printer: ts.Printer,
  originalNode: ts.InterfaceDeclaration,
  members: readonly { text: string }[],
  originalSourceFile: ts.SourceFile,
): string {
  let result = originalNode
    .getFullText(originalSourceFile)
    .slice(0, originalNode.getLeadingTriviaWidth(originalSourceFile));
  for (const mod of originalNode.modifiers ?? []) {
    result += printer.printNode(
      ts.EmitHint.Unspecified,
      mod,
      originalSourceFile,
    );
  }
  result += "interface ";
  result += printer.printNode(
    ts.EmitHint.Unspecified,
    originalNode.name,
    originalSourceFile,
  );
  if (originalNode.typeParameters) {
    result += printer.printList(
      ts.ListFormat.TypeParameters,
      originalNode.typeParameters,
      originalSourceFile,
    );
  }
  if (originalNode.heritageClauses) {
    result += printer.printList(
      ts.ListFormat.HeritageClauses,
      originalNode.heritageClauses,
      originalSourceFile,
    );
  }
  result += "{\n";
  for (const member of members) {
    result += member.text;
  }
  result += "\n}";
  return result;
}

function commentOut(code: string): string {
  const lines = code.split("\n").filter((line) => line.trim().length > 0);
  const result = lines.map((line) => `// ${line}`);
  return result.join("\n") + "\n";
}

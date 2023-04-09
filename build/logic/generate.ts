import path from "path";
import ts from "typescript";
import { alias } from "../util/alias";
import { upsert } from "../util/upsert";
import { projectDir } from "./projectDir";

const betterLibDir = path.join(projectDir, "lib");

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
  { emitOriginalAsComment = false, emitNoDefaultLib = false }: GenerateOptions
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

  const consumedReplacements = new Set<string>();

  for (const statement of originalFile.statements) {
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

    if (!ts.isInterfaceDeclaration(statement)) {
      // Find the replacement target of same kind.
      const replacementTargetOfSameKind = replacementTarget.flatMap((target) =>
        target.type === "non-interface" ? [target] : []
      );
      if (replacementTargetOfSameKind.length === 0) {
        result += statement.getFullText(originalFile);
        continue;
      }
      // Emit replaced statements
      result +=
        replacementTargetOfSameKind
          .map(({ statement, sourceFile }) => statement.getFullText(sourceFile))
          .join("") ?? "";
      if (emitOriginalAsComment) {
        // Replaced statements are emitted as comments
        // to make it easier to detect original lib changes
        result += "\n" + commentOut(statement.getFullText(originalFile)) + "\n";
      }
      continue;
    }
    const replaceInterfaces = replacementTarget.flatMap((target) =>
      target.type === "interface" ? [target] : []
    );
    if (
      replaceInterfaces.some(
        (target) =>
          !isPartialReplacement(
            statement,
            originalFile,
            target.originalStatement,
            target.sourceFile
          )
      )
    ) {
      // This needs to be a full replacement
      for (const target of replaceInterfaces) {
        result += target.originalStatement.getFullText(target.sourceFile);
      }
      if (emitOriginalAsComment) {
        result += "\n" + commentOut(statement.getFullText(originalFile)) + "\n";
      }
      continue;
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

type ReplacementTarget = (
  | {
      type: "interface";
      originalStatement: ts.InterfaceDeclaration;
      members: Map<
        string,
        {
          member: ts.TypeElement;
          text: string;
        }[]
      >;
    }
  | {
      type: "non-interface";
      statement: ts.Statement;
    }
) & {
  sourceFile: ts.SourceFile;
};

/**
 * Scan better lib file to determine which statements need to be replaced.
 */
function scanBetterFile(
  printer: ts.Printer,
  targetFile: string
): Map<string, ReplacementTarget[]> {
  const replacementTargets = new Map<string, ReplacementTarget[]>();
  {
    const betterLibFile = path.join(betterLibDir, targetFile);
    const betterProgram = ts.createProgram([betterLibFile], {});
    const betterFile = betterProgram.getSourceFile(betterLibFile);
    if (betterFile) {
      // Scan better file to determine which statements need to be replaced.
      for (const statement of betterFile.statements) {
        const name = getStatementDeclName(statement) ?? "";
        const aliasesMap =
          alias.get(name) ?? new Map([[name, new Map<string, string>()]]);
        for (const [targetName, typeMap] of aliasesMap) {
          const transformedStatement = replaceAliases(statement, typeMap);
          if (ts.isInterfaceDeclaration(transformedStatement)) {
            const members = new Map<
              string,
              {
                member: ts.TypeElement;
                text: string;
              }[]
            >();
            for (const member of transformedStatement.members) {
              const memberName = member.name?.getText(betterFile) ?? "";
              upsert(members, memberName, (members = []) => {
                const leadingSpacesMatch = /^\s*/.exec(
                  member.getFullText(betterFile)
                );
                const leadingSpaces =
                  leadingSpacesMatch !== null ? leadingSpacesMatch[0] : "";
                members.push({
                  member,
                  text:
                    leadingSpaces +
                    printer.printNode(
                      ts.EmitHint.Unspecified,
                      member,
                      betterFile
                    ),
                });
                return members;
              });
            }
            upsert(replacementTargets, targetName, (targets = []) => {
              targets.push({
                type: "interface",
                members,
                originalStatement: transformedStatement,
                sourceFile: betterFile,
              });
              return targets;
            });
          } else {
            upsert(replacementTargets, targetName, (statements = []) => {
              statements.push({
                type: "non-interface",
                statement: transformedStatement,
                sourceFile: betterFile,
              });
              return statements;
            });
          }
        }
      }
    }
  }
  return replacementTargets;
}

/**
 * Determines whether interface can be partially replaced.
 */
function isPartialReplacement(
  interfaceDecl: ts.InterfaceDeclaration,
  originalFile: ts.SourceFile,
  replacementDecl: ts.InterfaceDeclaration,
  betterFile: ts.SourceFile
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
          typeParam.getFullText(originalFile) !==
          rtp[index].getFullText(betterFile)
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
  originalSourceFile: ts.SourceFile
): string {
  let result = originalNode
    .getFullText(originalSourceFile)
    .slice(0, originalNode.getLeadingTriviaWidth(originalSourceFile));
  for (const dec of originalNode.decorators ?? []) {
    result += printer.printNode(
      ts.EmitHint.Unspecified,
      dec,
      originalSourceFile
    );
  }
  result += "interface ";
  result += printer.printNode(
    ts.EmitHint.Unspecified,
    originalNode.name,
    originalSourceFile
  );
  if (originalNode.typeParameters) {
    result += printer.printList(
      ts.ListFormat.TypeParameters,
      originalNode.typeParameters,
      originalSourceFile
    );
  }
  if (originalNode.heritageClauses) {
    result += printer.printList(
      ts.ListFormat.HeritageClauses,
      originalNode.heritageClauses,
      originalSourceFile
    );
  }
  result += "{\n";
  for (const member of members) {
    result += member.text;
  }
  result += "\n}";
  return result;
}

function getStatementDeclName(statement: ts.Statement): string | undefined {
  if (ts.isVariableStatement(statement)) {
    for (const dec of statement.declarationList.declarations) {
      if (ts.isIdentifier(dec.name)) {
        return dec.name.text;
      }
    }
  } else if (
    ts.isFunctionDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement) ||
    ts.isTypeAliasDeclaration(statement) ||
    ts.isModuleDeclaration(statement)
  ) {
    return statement.name?.text;
  } else if (ts.isInterfaceDeclaration(statement)) {
    return statement.name.text;
  }
  return undefined;
}

function commentOut(code: string): string {
  const lines = code.split("\n").filter((line) => line.trim().length > 0);
  const result = lines.map((line) => `// ${line}`);
  return result.join("\n") + "\n";
}

function replaceAliases(
  statement: ts.Statement,
  typeMap: Map<string, string>
): ts.Statement {
  if (typeMap.size === 0) return statement;
  return ts.transform(statement, [
    (context) => (sourceStatement) => {
      const visitor = (node: ts.Node): ts.Node => {
        if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
          const replacementType = typeMap.get(node.typeName.text);
          if (replacementType === undefined) {
            return node;
          }
          return ts.factory.updateTypeReferenceNode(
            node,
            ts.factory.createIdentifier(replacementType),
            node.typeArguments
          );
        }
        return ts.visitEachChild(node, visitor, context);
      };
      return ts.visitNode(sourceStatement, visitor);
    },
  ]).transformed[0];
}

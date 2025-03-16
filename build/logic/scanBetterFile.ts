import path from "path";
import ts from "typescript";
import { alias } from "../util/alias";
import { upsert } from "../util/upsert";
import { getStatementDeclName } from "./ast/getStatementDeclName";
import { projectDir } from "./projectDir";
import {
  declareGlobalSymbol,
  type ReplacementMap,
  type ReplacementName,
  type ReplacementTarget,
} from "./ReplacementMap";

const betterLibDir = path.join(projectDir, "lib");
const aliasFilePath = path.join(betterLibDir, "alias.d.ts");

type AliasFile = {
  replacementMap: ReplacementMap;
};

// Cache for alias file statements
let aliasFileCache: ts.SourceFile | undefined;

/**
 * Load the alias file applied to the target file.
 */
export function loadAliasFile(
  printer: ts.Printer,
  targetFileName: string,
): AliasFile {
  if (!aliasFileCache) {
    const aliasProgram = ts.createProgram([aliasFilePath], {});
    const aliasFile = aliasProgram.getSourceFile(aliasFilePath);

    if (!aliasFile) {
      throw new Error("Alias file not found in the program");
    }
    aliasFileCache = aliasFile;
  }
  const aliasFile = aliasFileCache;
  const statements = aliasFile.statements.flatMap((statement) => {
    const name = getStatementDeclName(statement) ?? "";
    const aliases = alias.get(name);
    if (!aliases) {
      return [statement];
    }
    return aliases.map((aliasDetails) => {
      if (aliasDetails.file !== targetFileName) {
        return statement;
      }
      return replaceAliases(statement, aliasDetails.replacement);
    });
  });

  // Scan the target file
  const replacementMap = scanStatements(printer, statements, aliasFile);
  // mark everything as optional
  for (const targets of replacementMap.values()) {
    for (const target of targets) {
      target.optional = true;
    }
  }

  return {
    replacementMap,
  };
}

/**
 * Scan better lib file to determine which statements need to be replaced.
 */
export function scanBetterFile(
  printer: ts.Printer,
  targetFile: string,
): ReplacementMap {
  const betterLibFile = path.join(betterLibDir, targetFile);
  const betterProgram = ts.createProgram([betterLibFile], {});
  const betterFile = betterProgram.getSourceFile(betterLibFile);
  if (!betterFile) {
    // This happens when the better file of that name does not exist.
    return new Map();
  }
  return scanStatements(printer, betterFile.statements, betterFile);
}

function scanStatements(
  printer: ts.Printer,
  statements: readonly ts.Statement[],
  sourceFile: ts.SourceFile,
): ReplacementMap {
  const replacementTargets = new Map<ReplacementName, ReplacementTarget[]>();
  for (const statement of statements) {
    const name = getStatementDeclName(statement) ?? "";
    const transformedStatement = statement;
    if (ts.isInterfaceDeclaration(transformedStatement)) {
      const members = new Map<
        string,
        {
          member: ts.TypeElement;
          text: string;
        }[]
      >();
      for (const member of transformedStatement.members) {
        const memberName = member.name?.getText(sourceFile) ?? "";
        upsert(members, memberName, (members = []) => {
          const leadingSpacesMatch = /^\s*/.exec(
            member.getFullText(sourceFile),
          );
          const leadingSpaces =
            leadingSpacesMatch !== null ? leadingSpacesMatch[0] : "";
          members.push({
            member,
            text:
              leadingSpaces +
              printer.printNode(ts.EmitHint.Unspecified, member, sourceFile),
          });
          return members;
        });
      }
      upsert(replacementTargets, name, (targets = []) => {
        targets.push({
          type: "interface",
          members,
          originalStatement: transformedStatement,
          optional: false,
          sourceFile: sourceFile,
        });
        return targets;
      });
    } else if (
      ts.isModuleDeclaration(transformedStatement) &&
      ts.isIdentifier(transformedStatement.name) &&
      transformedStatement.name.text === "global"
    ) {
      // declare global
      upsert(replacementTargets, declareGlobalSymbol, (targets = []) => {
        targets.push({
          type: "declare-global",
          originalStatement: transformedStatement,
          statements:
            transformedStatement.body &&
            ts.isModuleBlock(transformedStatement.body)
              ? scanStatements(
                  printer,
                  transformedStatement.body.statements,
                  sourceFile,
                )
              : new Map(),
          optional: false,
          sourceFile: sourceFile,
        });
        return targets;
      });
    } else {
      upsert(replacementTargets, name, (statements = []) => {
        statements.push({
          type: "non-interface",
          statement: transformedStatement,
          optional: false,
          sourceFile: sourceFile,
        });
        return statements;
      });
    }
  }
  return replacementTargets;
}

function replaceAliases(
  statement: ts.Statement,
  replacement: Map<string, string>,
): ts.Statement {
  return ts.transform(statement, [
    (context) => (sourceStatement) => {
      const visitor = (node: ts.Node): ts.Node => {
        if (ts.isInterfaceDeclaration(node)) {
          const toName = replacement.get(node.name.text);
          if (toName === undefined) {
            return node;
          }
          const visited = ts.visitEachChild(node, visitor, context);
          return ts.factory.updateInterfaceDeclaration(
            visited,
            visited.modifiers,
            ts.factory.createIdentifier(toName),
            visited.typeParameters,
            visited.heritageClauses,
            visited.members,
          );
        }
        if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
          const toName = replacement.get(node.typeName.text);
          if (toName === undefined) {
            return node;
          }
          return ts.factory.updateTypeReferenceNode(
            node,
            ts.factory.createIdentifier(toName),
            node.typeArguments,
          );
        }
        return ts.visitEachChild(node, visitor, context);
      };
      return ts.visitNode(sourceStatement, visitor, ts.isStatement);
    },
  ]).transformed[0];
}

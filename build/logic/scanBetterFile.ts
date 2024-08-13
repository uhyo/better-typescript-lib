import path from "path";
import ts from "typescript";
import { alias } from "../util/alias";
import { upsert } from "../util/upsert";
import { getStatementDeclName } from "./ast/getStatementDeclName";
import { projectDir } from "./projectDir";

const betterLibDir = path.join(projectDir, "lib");

export type ReplacementTarget = (
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
      type: "declare-global";
      originalStatement: ts.ModuleDeclaration;
      statements: readonly ts.Statement[];
    }
  | {
      type: "non-interface";
      statement: ts.Statement;
    }
) & {
  sourceFile: ts.SourceFile;
};

export const declareGlobalSymbol = Symbol("declare global");
export type ReplacementName = string | typeof declareGlobalSymbol;

/**
 * Scan better lib file to determine which statements need to be replaced.
 */
export function scanBetterFile(
  printer: ts.Printer,
  targetFile: string,
): Map<ReplacementName, ReplacementTarget[]> {
  const replacementTargets = new Map<ReplacementName, ReplacementTarget[]>();
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
                  member.getFullText(betterFile),
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
                      betterFile,
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
                    ? transformedStatement.body.statements
                    : [],
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

function replaceAliases(
  statement: ts.Statement,
  typeMap: Map<string, string>,
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
            node.typeArguments,
          );
        }
        return ts.visitEachChild(node, visitor, context);
      };
      return ts.visitNode(sourceStatement, visitor, ts.isStatement);
    },
  ]).transformed[0];
}

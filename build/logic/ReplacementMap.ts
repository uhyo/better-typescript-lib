import type ts from "typescript";

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
      statements: ReplacementMap;
    }
  | {
      type: "non-interface";
      statement: ts.Statement;
    }
) & {
  optional: boolean;
  sourceFile: ts.SourceFile;
};

export type ReplacementMap = Map<ReplacementName, ReplacementTarget[]>;

export const declareGlobalSymbol = Symbol("declare global");
export type ReplacementName = string | typeof declareGlobalSymbol;

export function mergeReplacementMapInto(
  target: ReplacementMap,
  source: ReplacementMap,
): void {
  for (const [key, value] of source) {
    target.set(key, [...(target.get(key) ?? []), ...value]);
  }
}

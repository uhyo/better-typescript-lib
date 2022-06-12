import path from "path";
import ts from "typescript";
import { upsert } from "../util/upsert";
import { projectDir } from "./projectDir";

const betterLibDir = path.join(projectDir, "lib");

/**
 * Generate one better lib file.
 */
export function generate(
  tsLibDir: string,
  libFile: string,
  emitOriginalAsComment: boolean
): string | undefined {
  const tsLibFile = path.join(tsLibDir, libFile);
  const originalProgram = ts.createProgram([tsLibFile], {});
  const originalFile = originalProgram.getSourceFile(tsLibFile);
  if (!originalFile) {
    return undefined;
  }
  let result = "";
  const replacementTargets = new Map<
    string,
    {
      statement: ts.Statement;
      sourceFile: ts.SourceFile;
    }[]
  >();
  {
    const betterLibFile = path.join(betterLibDir, `lib.${libFile}`);
    const betterProgram = ts.createProgram([betterLibFile], {});
    const betterFile = betterProgram.getSourceFile(betterLibFile);
    if (betterFile) {
      for (const statement of betterFile.statements) {
        const name = getStatementDeclName(statement) ?? "";
        upsert(replacementTargets, name, (statements = []) => [
          ...statements,
          {
            statement,
            sourceFile: betterFile,
          },
        ]);
      }
      // copy other statements
      result +=
        replacementTargets
          .get("")
          ?.map(({ statement, sourceFile }) =>
            statement.getFullText(sourceFile)
          )
          .join("") ?? "";
      if (result) {
        result += "// --------------------\n";
      }
    }
  }

  if (replacementTargets.size === 0) {
    for (const statement of originalFile.statements) {
      result += statement.getFullText(originalFile);
    }
  } else {
    const emittedNames = new Set<string>();
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
      if (!emittedNames.has(name)) {
        // Emit replaced statements
        result +=
          replacementTarget
            .map(({ statement, sourceFile }) =>
              statement.getFullText(sourceFile)
            )
            .join("") ?? "";
        emittedNames.add(name);
      }
      if (emitOriginalAsComment) {
        // Replaced statements are emitted as comments
        // to make it easier to detect original lib changes
        result += "\n" + commentOut(statement.getFullText(originalFile)) + "\n";
      }
    }
    // Emit remaining statements
    for (const name of emittedNames) {
      replacementTargets.delete(name);
    }
    const header = Array.from(replacementTargets.values())
      .map((statements) =>
        statements
          .map(({ statement, sourceFile }) => statement.getFullText(sourceFile))
          .join("")
      )
      .join("");
    result = (header ? header + "\n" : "") + result;
  }
  result += originalFile.text.slice(originalFile.endOfFileToken.pos);
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
  const lines = code.split("\n");
  const result = lines.map((line) => `// ${line}`);
  return result.join("\n");
}

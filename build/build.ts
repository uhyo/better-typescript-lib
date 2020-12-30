import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import ts from "typescript";
import { replacement } from "./replacement";

const projectDir = process.env.PROJECT || process.cwd();
const distDir = path.join(projectDir, "dist", "lib");
const tsDir = path.join(projectDir, "TypeScript");

async function main() {
  await mkdir(distDir, {
    recursive: true,
  });

  // copy TypeScript lib files
  const libs = await readdir(path.join(tsDir, "lib"));
  const libFiles: string[] = libs.filter((libFile) =>
    /(?:^|\/|\\)lib\..+\.d\.ts$/.test(libFile)
  );

  // modify each lib file
  for (const libFile of libFiles) {
    const tsLibFile = path.join(tsDir, "lib", libFile);
    const program = ts.createProgram([tsLibFile], {});
    const file = program.getSourceFile(tsLibFile);
    if (!file) {
      continue;
    }
    const repl = replacement.get(libFile);
    let result = repl ? `/// <reference path="../../lib/${libFile}" />\n` : "";
    if (!repl) {
      for (const statement of file.statements) {
        result += statement.getFullText(file);
      }
    } else {
      for (const statement of file.statements) {
        const res = checkStatement(statement, repl);
        if (res) {
          result += res.getFullText(file);
        }
      }
    }
    result += file.text.slice(file.endOfFileToken.pos);
    // Replace <reference lib="" /> to <reference path="" />
    result = result.replace(
      /^\/\/\/\s*<reference\s+lib="(.+?)"\s*\/>/gm,
      (_, lib) => `/// <reference path="./lib.${lib}.d.ts" />`
    );

    await writeFile(path.join(distDir, libFile), result);
    console.log(libFile);
  }
}

function checkStatement(
  statement: ts.Statement,
  replacement: Set<string>
): ts.Statement | undefined {
  // check for declrations
  if (ts.isVariableStatement(statement)) {
    for (const dec of statement.declarationList.declarations) {
      if (ts.isIdentifier(dec.name)) {
        if (replacement.has(dec.name.text)) {
          return undefined;
        }
      }
    }
  } else if (
    ts.isFunctionDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement) ||
    ts.isTypeAliasDeclaration(statement) ||
    ts.isModuleDeclaration(statement)
  ) {
    const repl = statement.name && replacement.has(statement.name.text);
    if (repl) {
      return undefined;
    }
  } else if (ts.isInterfaceDeclaration(statement)) {
    const repl = statement.name && replacement.has(statement.name.text);
    if (repl) {
      return undefined;
    }
  }
  return statement;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

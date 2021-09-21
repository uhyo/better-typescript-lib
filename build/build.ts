import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import ts from "typescript";
import { replacement } from "./replacement";

const projectDir = process.env.PROJECT || process.cwd();
const betterLibDir = path.join(projectDir, "lib");
const distDir = path.join(projectDir, "generated");
const tsDir = path.join(projectDir, "TypeScript");

async function main() {
  await rm(distDir, {
    force: true,
    recursive: true,
  });
  await mkdir(distDir, {
    recursive: true,
  });

  // copy TypeScript lib files
  const tsLibDir = path.join(tsDir, "src", "lib");
  const libs = await readdir(tsLibDir);
  const libFiles: string[] = libs.filter((libFile) =>
    /(?:^|\/|\\).+\.d\.ts$/.test(libFile)
  );

  // copy special "util" file
  const utilFile = path.join(betterLibDir, "util.d.ts");
  await writeFile(
    path.join(distDir, "util.d.ts"),
    await readFile(utilFile, "utf8")
  );

  // modify each lib file
  for (const libFile of libFiles) {
    const tsLibFile = path.join(tsLibDir, libFile);
    const program = ts.createProgram([tsLibFile], {});
    const file = program.getSourceFile(tsLibFile);
    if (!file) {
      continue;
    }
    let result = "";
    const repl = replacement.get(libFile);
    if (repl) {
      // copy better lib into the top of the file
      result += await readFile(
        path.join(betterLibDir, `lib.${libFile}`),
        "utf8"
      );
      result += "// --------------------\n";
    }

    if (!repl) {
      for (const statement of file.statements) {
        result += statement.getFullText(file);
      }
    } else {
      for (const statement of file.statements) {
        const res = checkStatement(statement, repl);
        if (res) {
          result += res.getFullText(file);
        } else {
          // Replaced statements are emitted as comments
          // to make it easier to detect original lib changes
          result += "\n" + commentOut(statement.getFullText(file)) + "\n";
        }
      }
    }
    result += file.text.slice(file.endOfFileToken.pos);
    // Replace <reference lib="" /> to <reference path="" />
    result = result.replace(
      /^\/\/\/\s*<reference\s+lib="(.+?)"\s*\/>/gm,
      (_, lib) => `/// <reference path="./lib.${lib}.d.ts" />`
    );

    await writeFile(path.join(distDir, "lib." + libFile), result);
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

function commentOut(code: string): string {
  const lines = code.split("\n");
  const result = lines.map((line) => `// ${line}`);
  return result.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

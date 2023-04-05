import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import prettier from "prettier";
import { generate } from "./logic/generate";
import { getLibFiles, tsLibDir } from "./logic/getLibFiles";
import { projectDir } from "./logic/projectDir";

const distDir = path.join(projectDir, "generated");

async function main() {
  await rm(distDir, {
    force: true,
    recursive: true,
  });
  await mkdir(distDir, {
    recursive: true,
  });

  // copy TypeScript lib files
  const libFiles = await getLibFiles();

  // modify each lib file
  for (const [targetFile, sourceFile] of libFiles.entries()) {
    let result = generate(tsLibDir, targetFile, sourceFile, true);
    if (result === undefined) {
      continue;
    }
    result = prettier.format(result, {
      parser: "typescript",
    });

    await writeFile(path.join(distDir, targetFile), result);
    console.log(sourceFile);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

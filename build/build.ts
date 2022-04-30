import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import prettier from "prettier";
import { generate } from "./logic/generate";
import { getLibFiles } from "./logic/getLibFiles";
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
  const { tsLibDir, libFiles } = await getLibFiles();

  // modify each lib file
  for (const libFile of libFiles) {
    let result = generate(tsLibDir, libFile, true);
    if (result === undefined) {
      continue;
    }
    result = prettier.format(result, {
      parser: "typescript",
    });

    await writeFile(path.join(distDir, "lib." + libFile), result);
    console.log(libFile);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { mkdir, readdir, rm, writeFile } from "fs/promises";
import path from "path";
import prettier from "prettier";
import { generate } from "./logic/generate";

const projectDir = process.env.PROJECT || process.cwd();
const betterLibDir = path.join(projectDir, "lib");
const distDir = path.join(projectDir, "generated");
const tsDir = path.join(projectDir, "TypeScript");
const tsLibDir = path.join(tsDir, "src", "lib");

async function main() {
  await rm(distDir, {
    force: true,
    recursive: true,
  });
  await mkdir(distDir, {
    recursive: true,
  });

  // copy TypeScript lib files
  const libs = await readdir(tsLibDir);
  const libFiles: string[] = libs.filter((libFile) =>
    /(?:^|\/|\\).+\.d\.ts$/.test(libFile)
  );

  // modify each lib file
  for (const libFile of libFiles) {
    let result = generate(libFile, true);
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

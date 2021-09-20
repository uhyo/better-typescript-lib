import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

const projectDir = process.env.PROJECT || process.cwd();
const libDir = path.join(projectDir, "generated");
const betterDir = path.join(projectDir, "lib");
const templateDir = path.join(projectDir, "package-template");
const packageDir = path.join(projectDir, "dist-package");

async function main() {
  await rm(packageDir, {
    force: true,
    recursive: true,
  });
  await mkdir(path.join(packageDir, "better"), {
    recursive: true,
  });

  // copy package template
  // copy lib files
  const files = (await readdir(libDir))
    .filter((libFile) => /\.d\.ts$/.test(libFile))
    .map((libFile) => path.join(libDir, libFile))
    .concat(
      (await readdir(templateDir)).map((file) => path.join(templateDir, file))
    )
    .concat([
      path.join(projectDir, "README.md"),
      path.join(projectDir, "LICENSE"),
    ]);
  await Promise.all(
    files
      .map(async (libFile) => {
        await writeFile(
          path.join(packageDir, path.basename(libFile)),
          await readFile(libFile)
        );
      })
      .concat(
        (await readdir(betterDir)).map(async (libFile) => {
          await writeFile(
            path.join(packageDir, "better", libFile),
            await readFile(path.join(betterDir, libFile))
          );
        })
      )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

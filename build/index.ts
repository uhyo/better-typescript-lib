import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const projectDir = process.env.PROJECT || process.cwd();
const distDir = path.join(projectDir, "dist", "lib");
const tsDir = path.join(projectDir, "TypeScript");

async function main() {
  await mkdir(distDir, {
    recursive: true,
  });

  // copy TypeScript lib files
  const libs = await readdir(path.join(tsDir, "lib"));
  for (const libFile of libs) {
    console.log(libFile);
    if (/(?:^|\/|\\)lib\..+\.d\.ts$/.test(libFile)) {
      await writeFile(
        path.join(distDir, libFile),
        await readFile(path.join(path.join(tsDir, "lib", libFile)))
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

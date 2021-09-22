import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

const scope = "better-typescript-lib";

const projectDir = process.env.PROJECT || process.cwd();
const libDir = path.join(projectDir, "generated");
const templateDir = path.join(projectDir, "package-template");
const packageDir = path.join(projectDir, "dist-package");

async function main() {
  await rm(packageDir, {
    force: true,
    recursive: true,
  });
  await mkdir(packageDir, {
    recursive: true,
  });

  const packageTemplateFiles = await readdir(templateDir);

  const libFiles = (await readdir(libDir)).filter((libFile) =>
    /\.d\.ts$/.test(libFile)
  );

  for (const libFile of libFiles) {
    console.log(`Processing ${libFile}`);
    const libFilePath = path.join(libDir, libFile);
    const { packageName, packagePath } =
      getPackageNameAndPathOfLib(libFilePath);

    const alreadyExisted = await mkdir(path.join(packageDir, packageName))
      .then(() => false)
      .catch((err) => {
        if (err.code !== "EEXIST") {
          throw err;
        }
        return true;
      });
    if (!alreadyExisted) {
      // install package template files
      for (const file of packageTemplateFiles) {
        const filePath = path.join(templateDir, file);
        const targetPath = path.join(packageDir, packageName, file);
        await writeFile(targetPath, await readFile(filePath));
      }
      // update package.json
      const packageJsonPath = path.join(
        packageDir,
        packageName,
        "package.json"
      );
      const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
      packageJson.name = `@${scope}/${packageName}`;

      await writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n"
      );
    }

    // copy lib file
    const targetPath = path.join(packageDir, packageName, packagePath);
    const targetDir = path.dirname(targetPath);
    await mkdir(targetDir, { recursive: true });
    await writeFile(targetPath, await readFile(libFilePath));
  }
}

function getPackageNameAndPathOfLib(libFile: string) {
  const libFileName = path.basename(libFile, ".d.ts");
  const components = libFileName.split(".");

  // lib.dom.d.ts -> @typescript/dom
  // lib.dom.iterable.d.ts -> @typescript/dom/iterable
  // lib.es2015.symbol.wellknown.d.ts -> @typescript/es2015/symbol-wellknown

  if (components[0] !== "lib") {
    throw new Error(`Invalid lib file: ${libFile}`);
  }

  const packageName = components[1];
  const packagePath =
    components.length > 2
      ? components.slice(2).join("-") + ".d.ts"
      : "index.d.ts";
  return {
    packageName,
    packagePath,
  };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

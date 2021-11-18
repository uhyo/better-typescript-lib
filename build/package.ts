import { mkdir, readdir, readFile, rm, symlink, writeFile } from "fs/promises";
import path from "path";

const scope = "better-typescript-lib";

const projectDir = process.env.PROJECT || process.cwd();
const libDir = path.join(projectDir, "generated");
const templateDir = path.join(projectDir, "package-template");
const packageDir = path.join(projectDir, "dist-package");
const testsDir = path.join(projectDir, "tests");

async function main() {
  await rm(packageDir, {
    force: true,
    recursive: true,
  });
  await mkdir(packageDir, {
    recursive: true,
  });

  // Read version from root package.json
  const rootPackageJson = JSON.parse(
    await readFile(path.join(projectDir, "package.json"), "utf-8")
  );
  const rootPackageName: string = rootPackageJson.name;
  const version: string = rootPackageJson.version;

  const packageTemplateFiles = await readdir(templateDir);

  const libFiles = (await readdir(libDir)).filter((libFile) =>
    /\.d\.ts$/.test(libFile)
  );

  const packageNames = new Set<string>();
  for (const libFile of libFiles) {
    console.log(`Processing ${libFile}`);
    const libFilePath = path.join(libDir, libFile);
    const { packageName, packagePath } =
      getPackageNameAndPathOfLib(libFilePath);
    packageNames.add(packageName);

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
      await installPackageTemplateFiles(path.join(packageDir, packageName));
      // update package.json
      const packageJsonPath = path.join(
        packageDir,
        packageName,
        "package.json"
      );
      await writeToPackageJson(packageJsonPath, () => ({
        name: toScopedPackageName(packageName),
        version,
      }));
    }

    // copy lib file
    const targetPath = path.join(packageDir, packageName, packagePath);
    const targetDir = path.dirname(targetPath);
    await mkdir(targetDir, { recursive: true });
    await writeFile(targetPath, await readFile(libFilePath));
  }
  // Prepare "main" package
  {
    const mainPackageDir = path.join(packageDir, "__main");
    await mkdir(mainPackageDir);

    // install package template files
    await installPackageTemplateFiles(mainPackageDir);
    // copy root README to main package
    await writeFile(
      path.join(mainPackageDir, "README.md"),
      await readFile(path.join(projectDir, "README.md"))
    );
    // update package.json
    const packageJsonPath = path.join(mainPackageDir, "package.json");
    await writeToPackageJson(packageJsonPath, () => ({
      name: rootPackageName,
      version,
      types: "./dist/index.d.ts",
      dependencies: Object.fromEntries(
        [...packageNames].map((packageName) => [
          `@typescript/lib-${packageName}`,
          `npm:${toScopedPackageName(packageName)}@${version}`,
        ])
      ),
    }));
    // prepare symlink to dist
    await symlink(
      path.join(projectDir, "dist"),
      path.join(mainPackageDir, "dist")
    );
  }
  // update package.json in "tests" folder
  {
    const packageJsonPath = path.join(testsDir, "package.json");
    await writeToPackageJson(packageJsonPath, (original) => ({
      dependencies: {
        ...original.dependencies,
        ...Object.fromEntries(
          [...packageNames].map((packageName) => [
            `@typescript/lib-${packageName}`,
            `file:${path.relative(
              path.dirname(packageJsonPath),
              path.join(packageDir, packageName)
            )}`,
          ])
        ),
      },
    }));
  }

  function installPackageTemplateFiles(dir: string) {
    return Promise.all(
      packageTemplateFiles.map(async (file) => {
        const filePath = path.join(templateDir, file);
        const targetPath = path.join(dir, file);
        return writeFile(targetPath, await readFile(filePath));
      })
    );
  }
  async function writeToPackageJson(
    packageJsonPath: string,
    updates: (original: any) => Record<string, unknown>
  ) {
    const original = JSON.parse(await readFile(packageJsonPath, "utf-8"));
    return writeFile(
      packageJsonPath,
      JSON.stringify(
        {
          ...original,
          ...updates(original),
        },
        null,
        2
      ) + "\n"
    );
  }
  function toScopedPackageName(packageName: string) {
    return `@${scope}/${packageName}`;
  }
}

function getPackageNameAndPathOfLib(libFile: string) {
  const libFileName = path.basename(libFile, ".d.ts");
  const components = libFileName.split(".");

  // lib.dom.d.ts -> @typescript/lib-dom
  // lib.dom.iterable.d.ts -> @typescript/lib-dom/iterable
  // lib.es2015.symbol.wellknown.d.ts -> @typescript/lib-es2015/symbol-wellknown

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

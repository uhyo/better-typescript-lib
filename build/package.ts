import { mkdir, readdir, readFile, rm, symlink, writeFile } from "fs/promises";
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

  const packageNames: string[] = [];
  for (const libFile of libFiles) {
    console.log(`Processing ${libFile}`);
    const libFilePath = path.join(libDir, libFile);
    const { packageName, packagePath } =
      getPackageNameAndPathOfLib(libFilePath);
    const p = `@${scope}/${packageName}`;
    packageNames.push(p);

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
      await writeToPackageJson(packageJsonPath, {
        name: p,
        version,
      });
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
    await writeToPackageJson(packageJsonPath, {
      name: rootPackageName,
      version,
      types: "./dist/index.d.ts",
      dependencies: Object.fromEntries(packageNames.map((p) => [p, version])),
    });
    // prepare symlink to dist
    await symlink(
      path.join(projectDir, "dist"),
      path.join(mainPackageDir, "dist")
    );
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
    obj: Record<string, unknown>
  ) {
    return writeFile(
      packageJsonPath,
      JSON.stringify(
        {
          ...JSON.parse(await readFile(packageJsonPath, "utf-8")),
          ...obj,
        },
        null,
        2
      ) + "\n"
    );
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

// Script to publish generated npm packages.
// Should be called from GitHub "publish" Action.
import npmPublish from "@jsdevtools/npm-publish";
import { readdir } from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const distPackageDir = path.join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist-package"
);
const packages = await readdir(distPackageDir);
const packageJsonPaths = packages.map((packageName) => path.join(
  distPackageDir,
  packageName,
  "package.json"
));

// To actually publish, you need to pass a NO_DRY_RUN environment variable.
const dryRun = !process.env.NO_DRY_RUN
const token = process.env.NPM_TOKEN

for (const packageJsonPath of packageJsonPaths) {
  const { type, package: packageName, version, oldVersion } = await npmPublish({
    dryRun,
    package: packageJsonPath,
    access: "public",
    token,
  });
  if (type === "none") {
    console.log(`${packageName} was not publsihed`)
  } else {
    console.log(`${packageName}: ${type} ${oldVersion} -> ${version}`)
  }
}

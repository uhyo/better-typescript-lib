import { readdir } from "fs/promises";
import path from "path";
import { projectDir } from "./projectDir";

const tsDir = path.join(projectDir, "TypeScript");
const tsLibDir = path.join(tsDir, "src", "lib");

export async function getLibFiles(): Promise<{
  tsLibDir: string;
  libFiles: string[];
}> {
  // copy TypeScript lib files
  const libs = await readdir(tsLibDir);
  const libFiles: string[] = libs.filter((libFile) =>
    /(?:^|\/|\\).+\.d\.ts$/.test(libFile)
  );
  return {
    tsLibDir,
    libFiles,
  };
}

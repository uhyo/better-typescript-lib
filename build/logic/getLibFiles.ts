import { readFile } from "fs/promises";
import JSON5 from "json5";
import path from "path";
import { array, record, string, unknown } from "../util/parsers";
import { projectDir } from "./projectDir";

export const tsLibDir = path.join(projectDir, "TypeScript", "src", "lib");

const libsFile = path.join(tsLibDir, "libs.json");

export const getLibFiles = async () => {
  const json5 = await readFile(libsFile, "utf8");
  const result = record(unknown)(JSON5.parse(json5));
  const libs = array(string)(result.libs);
  const paths = record(string)(result.paths);
  return new Map(
    libs.map((lib) => {
      const sourceFile = `${lib}.d.ts`;
      const targetFile = paths[lib] || `lib.${sourceFile}`;
      return [targetFile, sourceFile];
    })
  );
};

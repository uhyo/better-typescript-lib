// Generates diff per lib file.

import { createPatch } from "diff";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import prettier from "prettier";
import { generate } from "./logic/generate";
import { getLibFiles, tsLibDir } from "./logic/getLibFiles";
import { projectDir } from "./logic/projectDir";

const docsDir = path.join(projectDir, "docs");
const docsDiffDir = path.join(docsDir, "diff");

async function main() {
  await rm(docsDiffDir, {
    force: true,
    recursive: true,
  });
  await mkdir(docsDiffDir, {
    recursive: true,
  });

  const libFiles = await getLibFiles();
  const hasDiffFiles: string[] = [];
  for (const [targetFile, sourceFile] of libFiles.entries()) {
    const betterLib = generate(tsLibDir, targetFile, sourceFile, false);
    if (betterLib === undefined) {
      continue;
    }

    const diffFile = path.join(docsDiffDir, sourceFile + ".md");

    const originalLib = await readFile(path.join(tsLibDir, sourceFile), "utf8");
    const formattedOriginalLib = prettier.format(originalLib, {
      parser: "typescript",
    });
    const formattedBetterLib = prettier.format(betterLib, {
      parser: "typescript",
    });
    if (formattedOriginalLib === formattedBetterLib) {
      continue;
    }

    const diffPatch = createPatch(
      sourceFile,
      formattedOriginalLib,
      formattedBetterLib
    );

    const md = `# ${sourceFile} Diffs

\`\`\`diff
${diffPatch}
\`\`\`
`;

    await writeFile(diffFile, md);
    console.log(sourceFile);
    hasDiffFiles.push(sourceFile);
  }
  const diffDoc = `
# Diffs

The following files are improved in better-typescript-lib:

${hasDiffFiles
  .map((libFile) => `- [${libFile}](./diff/${libFile}.md)`)
  .join("\n")}
`;
  await writeFile(path.join(docsDir, "diff.md"), diffDoc);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const uiRoots = ["app/page.tsx", "app/components"];
const localizedTextSource = "app/content/invitation.ts";
const eastAsianText = /[가-힣ぁ-んァ-ヶ一-龯]/;
const literalUiAttribute =
  /\b(?:aria-label|aria-description|alt|placeholder|title)=(?:"[^"]+"|'[^']+')/g;
const literalJsxText =
  /<([A-Za-z][\w.]*)\b[^>]*>[\t\r\n ]*([A-Za-z][A-Za-z0-9 .,·'’&!?-]*)[\t\r\n ]*<\/\1>/g;

const collectTsxFiles = async (target) => {
  const absoluteTarget = path.join(projectRoot, target);

  if (target.endsWith(".tsx")) return [absoluteTarget];

  const entries = await readdir(absoluteTarget, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const child = path.join(target, entry.name);
      if (entry.isDirectory()) return collectTsxFiles(child);
      return child.endsWith(".tsx") ? [path.join(projectRoot, child)] : [];
    }),
  );

  return nestedFiles.flat();
};

const files = (await Promise.all(uiRoots.map(collectTsxFiles))).flat();
const violations = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const relativeFile = path.relative(projectRoot, file);

  source.split("\n").forEach((line, index) => {
    if (eastAsianText.test(line)) {
      violations.push(`${relativeFile}:${index + 1} localized text outside ${localizedTextSource}`);
    }
  });

  for (const match of source.matchAll(literalUiAttribute)) {
    const line = source.slice(0, match.index).split("\n").length;
    violations.push(`${relativeFile}:${line} hardcoded UI attribute ${match[0]}`);
  }

  for (const match of source.matchAll(literalJsxText)) {
    const line = source.slice(0, match.index).split("\n").length;
    violations.push(`${relativeFile}:${line} hardcoded JSX text ${match[2].trim()}`);
  }
}

if (violations.length > 0) {
  console.error("Localized UI governance failed:\n" + violations.join("\n"));
  process.exit(1);
}

console.log(`Localized UI governance passed for ${files.length} UI files.`);

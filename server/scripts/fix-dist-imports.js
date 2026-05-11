import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".js")) {
      continue;
    }

    const original = await readFile(fullPath, "utf8");
    const rewritten = original
      .replace(/(from\s+["'])(\.\.\/|\.\/)([^"']+?)(["'])/g, (match, prefix, base, specifier, suffix) => {
        const normalizedSpecifier = `${base}${specifier}`;

        if (normalizedSpecifier.endsWith(".js") || normalizedSpecifier.endsWith(".json")) {
          return match;
        }

        return `${prefix}${normalizedSpecifier}.js${suffix}`;
      })
      .replace(/(import\(\s*["'])(\.\.\/|\.\/)([^"']+?)(["']\s*\))/g, (match, prefix, base, specifier, suffix) => {
        const normalizedSpecifier = `${base}${specifier}`;

        if (normalizedSpecifier.endsWith(".js") || normalizedSpecifier.endsWith(".json")) {
          return match;
        }

        return `${prefix}${normalizedSpecifier}.js${suffix}`;
      });

    if (rewritten !== original) {
      await writeFile(fullPath, rewritten);
    }
  }
}

await walk(distDir);
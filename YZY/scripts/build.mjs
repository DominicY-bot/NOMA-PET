import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { extname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const copyExtensions = new Set([".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico"]);
const copyDirs = new Set(["assets", "scripts"]);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });

for (const entry of entries) {
  if (entry.name.startsWith(".") || entry.name === "dist" || entry.name === "node_modules") {
    continue;
  }

  const source = join(root, entry.name);
  const target = join(dist, entry.name);

  if (entry.isDirectory() && copyDirs.has(entry.name)) {
    await cp(source, target, { recursive: true });
    continue;
  }

  if (entry.isFile() && copyExtensions.has(extname(entry.name).toLowerCase())) {
    await cp(source, target);
  }
}

console.log("Built static site to dist/");

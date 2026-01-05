import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "artifact");
const bundleDir = path.join(outDir, "google-mcp");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(bundleDir, { recursive: true });

const copyDir = (from, to) => {
  if (!fs.existsSync(from)) {
    throw new Error(`Missing directory: ${from}`);
  }
  fs.cpSync(from, to, { recursive: true });
};

const copyFile = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.copyFileSync(from, to);
};

copyDir(path.join(root, "dist"), path.join(bundleDir, "dist"));
copyDir(path.join(root, "node_modules"), path.join(bundleDir, "node_modules"));
copyFile(path.join(root, "package.json"), path.join(bundleDir, "package.json"));
copyFile(path.join(root, "README.md"), path.join(bundleDir, "README.md"));
copyFile(path.join(root, "LICENSE"), path.join(bundleDir, "LICENSE"));

console.log(`Artifact prepared at ${bundleDir}`);

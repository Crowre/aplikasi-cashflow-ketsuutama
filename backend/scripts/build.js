import { cp, readdir, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const backendDir = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const sourceDir = path.join(backendDir, "src");
const outputDir = path.join(backendDir, "dist");

async function checkSyntax(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await checkSyntax(file);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
    }
  }
}

await checkSyntax(sourceDir);

// Only remove the generated dist directory inside this backend.
if (path.dirname(outputDir) !== backendDir || path.basename(outputDir) !== "dist") {
  throw new Error("Direktori output build tidak valid");
}
await rm(outputDir, { recursive: true, force: true });
await cp(sourceDir, outputDir, { recursive: true });
console.log("Build backend berhasil: dist/");

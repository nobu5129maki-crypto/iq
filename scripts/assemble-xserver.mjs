import { copyFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const names = [".htaccess", "auth.php", "gate.php", "index.php", "sw.js"];

for (const name of names) {
  copyFileSync(join(root, "xserver", name), join(dist, name));
}

const extras = readdirSync(dist);
for (const name of extras) {
  if (name.startsWith("workbox-")) {
    unlinkSync(join(dist, name));
  }
}

const assets = join(dist, "assets");
for (const name of readdirSync(assets)) {
  if (name.startsWith("workbox-")) {
    unlinkSync(join(assets, name));
  }
}

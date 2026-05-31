import { mkdirSync, renameSync } from "node:fs"
import { join } from "node:path"

const stashDir = ".aidd-scaffold-stash"
const files = [
  "SCAFFOLD-MANIFEST.yml",
  "README.md",
  "index.md",
  "stash.mjs",
  "restore.mjs",
]

mkdirSync(stashDir, { recursive: true })

for (const file of files) {
  try {
    renameSync(file, join(stashDir, file))
  } catch (e) {
    if (e.code !== "ENOENT") throw e
  }
}

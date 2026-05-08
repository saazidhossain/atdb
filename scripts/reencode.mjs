import sharp from "sharp";
import { readdir } from "fs/promises";
import path from "path";

const dir = "/dev-server/public/assets/hero";
const files = await readdir(dir);

// Group by base name (strip the trailing -768/-1280/-1920)
const groups = {};
for (const f of files) {
  const m = f.match(/^(.*)-(768|1280|1920)\.webp$/);
  if (!m) continue;
  groups[m[1]] ??= {};
  groups[m[1]][m[2]] = path.join(dir, f);
}

const targets = { 768: 768, 1280: 1280, 1920: 1920 };
const quality = { 768: 72, 1280: 76, 1920: 78 };

for (const [base, variants] of Object.entries(groups)) {
  // Use the largest existing file as the source
  const src = variants["1920"] || variants["1280"] || variants["768"];
  console.log(`\n=== ${base} ===`);
  console.log("source:", src);
  for (const w of Object.keys(targets)) {
    const out = path.join(dir, `${base}-${w}.webp`);
    await sharp(src)
      .resize({ width: targets[w], withoutEnlargement: false })
      .webp({ quality: quality[w], effort: 6 })
      .toFile(out + ".tmp");
  }
  // Move tmp -> final after all encoded (avoid in-place corruption)
  for (const w of Object.keys(targets)) {
    const out = path.join(dir, `${base}-${w}.webp`);
    const { rename, stat } = await import("fs/promises");
    await rename(out + ".tmp", out);
    const s = await stat(out);
    console.log(`  ${w}px → ${(s.size / 1024).toFixed(1)} KB`);
  }
}

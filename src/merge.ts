import PDFMerger from "npm:pdf-merger-js";
import config from "../config.json" with { type: "json" };

const dir = Deno.readDir(config.merger.source);
const files: bigint[] = [];

for await (const file of dir) {
  const name = BigInt(file.name.split(".")[0]);
  files.push(name);
}

files.sort((a, b) => Number(a - b));

const merger = new PDFMerger();
for (const file of files) {
  console.log(`Adding ${file}...`);
  await merger.add(`${config.merger.source}/${file}.pdf`);
}

console.log(`Saving to ${config.merger.source}.pdf...`);
merger.save(`${config.merger.source}.pdf`);

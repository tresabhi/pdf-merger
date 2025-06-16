import PDFMerger from "npm:pdf-merger-js";
import config from "../config.json" with { type: "json" };

const fragmentPattern = /^(.+) \((\d+)\)$/;
const formatPattern = /\.pdf$/;

const dir = Deno.readDir(config.combiner.source);
const groupIndices: Map<string, number[]> = new Map();

for await (const file of dir) {
  if (!file.isFile || !file.name.endsWith(".pdf")) continue;

  const name = file.name.replace(formatPattern, "");
  const matches = fragmentPattern.exec(name);

  if (matches === null) {
    throw new Error(
      `Invalid file name: "${file.name}"; was expecting a name and an index within brackets. Example: Company Name (3) or Cool restaurant (9)`,
    );
  }

  const group = matches[1];
  const index = parseInt(matches[2]);

  if (isNaN(index)) {
    throw new Error(
      `Invalid file index: "${index}"; was expecting a whole integer like 1 or 4`,
    );
  }

  if (groupIndices.has(group)) {
    groupIndices.get(group)!.push(index);
  } else {
    groupIndices.set(group, [index]);
  }
}

for (const [group, indices] of groupIndices) {
  const sorted = indices.sort((a, b) => a - b);
  const max = sorted.at(-1)!;

  if (max !== sorted.length) {
    throw new Error(
      `Group "${group}" has a wrong number of files! Expected ${sorted.length} files, but ${max} were found.`,
    );
  }

  const merger = new PDFMerger();

  for (const index of sorted) {
    await merger.add(`${config.combiner.source}/${group} (${index}).pdf`);
  }

  await merger.save(`${config.combiner.source}/${group}.pdf`);

  console.log(`Merged "${group}"`);
}

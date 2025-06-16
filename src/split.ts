import PDFMerger from "npm:pdf-merger-js";
import config from "../config.json" with { type: "json" };
const pattern = /(\d+) (.+)/;

const decoder = new TextDecoder();
const schema = await Deno.readFile("./split.txt").then((file) =>
  decoder.decode(file)
);
const lines = schema.split("\n");
const chunks: { name: string; page: number }[] = [];

for (const line of lines) {
  const matches = pattern.exec(line);

  if (matches === null) {
    throw new Error(
      `Invalid line: "${line}"; was expecting a number and a name. Example: 1 Company Name or 4 Cool Restaurant`,
    );
  }

  const page = parseInt(matches[1]);

  if (isNaN(page)) {
    throw new Error(
      `Invalid page number: "${page}"; was expecting a whole integer like 1 or 4`,
    );
  }

  const lastChunk = chunks.at(-1);

  if (lastChunk !== undefined && page < lastChunk.page) {
    throw new Error(
      `Page number "${page}" is smaller than the last page number "${lastChunk.page}"`,
    );
  }

  const name = matches[2];

  if (name.trim().length === 0) {
    throw new Error(`Invalid empty name for page "${page}`);
  }

  chunks.push({ name, page });
}

const groups: Map<string, { start: number; end: number }[]> = new Map();

let index = 0;
for (const chunk of chunks) {
  const pages = {
    start: chunk.page,
    end: (chunks.at(index + 1)?.page ?? config.splitter.total_pages + 1) - 1,
  };

  if (groups.has(chunk.name)) {
    groups.get(chunk.name)!.push(pages);
  } else {
    groups.set(chunk.name, [pages]);
  }

  index++;
}

for (const [group, pages] of groups) {
  const merger = new PDFMerger();

  for (const page of pages) {
    await merger.add(config.splitter.source, `${page.start}-${page.end}`);
  }

  await merger.save(`${config.splitter.target}/${group}.pdf`);

  console.log(`Merged ${pages.length} chunks into "${group}"`);
}

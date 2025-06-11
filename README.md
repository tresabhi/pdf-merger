# PDF Merger

A little script to merge multiple PDF files into one, hopefully saving time and money!

## Instructions

- Make sure you [download the latest version of the tool](https://github.com/tresabhi/pdf-merger/archive/refs/heads/main.zip) and [understand the code you are about to run](https://github.com/tresabhi/pdf-merger).

- Name files with their group name and then their indices in parentheses. Example: `Company Name (1)`, `Company Name (2)`, `Company Name (3)`, `Some Other Thing (1)`, `Some Other Thing (2)`, etc.

> [!TIP]
> On Windows, name all files ending with `(1)` as Windows will automatically rename the file to the next appropriate index. For example, if files `Company Name (1)` through `Company Name (11)` already exist, naming a new file `Company Name (1)` will result in it being renamed to `Company Name (12)`.

- Edit `config.json` with your source and target directories.

- Run `deno run merge` in your terminal, opened in this directory.

# SpaceClean Pro

A small text-cleanup tool for people who keep pasting text out of code editors, chat
windows and AI assistants — the kind that arrives with stray spaces, tabs and line
breaks in the wrong places.

One self-contained HTML file (`index.html`). Double-click it, no install, no server,
no dependencies.

Online version: https://voskamp099.github.io/SpaceClean/

[English](README.en.md) · [简体中文](README.md)

## Modes

- **Strip everything** — remove every space, newline and tab. Maximum compression.
- **Keep line breaks** — clean up spacing inside lines while keeping the paragraph structure.
- **Collapse** — squeeze runs of spaces down to one.
- **Mixed CJK and Latin** — drop the spaces between Chinese characters, keep the spaces
  between English words and between English and Chinese, and remove line breaks so the
  result reads as one paragraph. Built for text that mixes the two scripts.
- **Trim** — strip leading and trailing whitespace on every line, keeping the layout tidy.
- **Live or manual** — clean as you paste, or switch the trigger to manual.
- **Points and encouragement** — one point per character cleaned, with a line of
  encouragement each time you run it.

## Use

Open `index.html` in a browser, or use the online link:

1. Pick a mode on the left.
2. Paste the messy text into the INPUT box.
3. The OUTPUT box fills in as you type — copy the result with the copy button.

## Notes

- Everything runs in the browser. Nothing is uploaded, nothing is stored on a server.
- The tool is deliberately small and single-file so it keeps working when copied to
  another machine.

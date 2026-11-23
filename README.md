# Student Laptop Finder (SW302 Assignment 2)

Vanilla JavaScript (ES modules) + Tailwind CSS 4. No CDN, no frameworks.

## Install and build
```bash
npm install
npm run build      # one-time build -> dist/output.css
npm run watch      # rebuild while you edit
```

## Run
Open the folder in VS Code and use **Live Server** on `index.html` (fetch() does not work on file://).

## GitHub
https://github.com/YOURNAME/laptop_finder

## Structure
- `src/input.css` Tailwind setup: @theme (2 themes), @plugin forms, @layer components
- `src/js/` api, storage, ui, compare modules + one file per page
- `data/laptops.json` 21 laptops

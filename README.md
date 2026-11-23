# Student Laptop Finder (SW302 Assignment 2)


## Install and build
```bash
npm install
npm run build      # one-time build -> dist/output.css
npm run watch      # rebuild while you edit
```

## Run
Open the folder in VS Code and use **Live Server** on `index.html` (fetch() does not work on file://).

python -m http.server 

## GitHub
https://github.com/roaa-abdelghany/laptop_finder_Roaa_Abdelghany.git

## Structure
- `src/input.css` Tailwind setup: @theme (2 themes), @plugin forms, @layer components
- `src/js/` api, storage, ui, compare modules + one file per page
- `data/laptops.json` 21 laptops

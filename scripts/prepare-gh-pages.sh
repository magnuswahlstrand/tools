#!/bin/bash

# Clean and create gh-pages-public directory
rm -rf gh-pages-public
mkdir gh-pages-public

# Process each project directory
for dir in projects/*; do
  if [ -d "$dir/dist" ]; then
    cp -r "$dir/dist" "gh-pages-public/$(basename "$dir")"
  elif [ -d "$dir/out" ]; then
    cp -r "$dir/out" "gh-pages-public/$(basename "$dir")"
  elif [ -f "$dir/index.html" ]; then
    mkdir -p "gh-pages-public/$(basename "$dir")"
    cp "$dir/index.html" "gh-pages-public/$(basename "$dir")/"
  fi
done

# Generate index
node scripts/generate-index.js 
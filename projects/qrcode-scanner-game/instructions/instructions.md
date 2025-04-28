# Project Name: QR Code Game App

## Overview:
A simple app that uses a barcode scanner (1D and QR) to control simple user interface. Use to 

## Tech Stack:
* Frontend: React (Next.js), Shadcn, Lucide icons
* Barcode scanner
* pnpm for package management
* Server actions for requests

## File structure:

 app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
├── components.json
├── eslint.config.mjs
├── instructions
│   └── instructions.md
├── lib
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── tsconfig.json

## Features

When a 'game' is started, you will get a prompt like 'please scan the items in order according to their size. Starting with the smallest'. Each 'item' has a QR code and can be scanned.

There will be an additinal set of QR codes to scan to 'go back', 'reset', 'go left', 'go right', etc. Let's call these 'commands'.

### Main screen
Shows a menu with buttons. They are selected by scanning a QR code (up/down) and then a OK QR code is scanned.
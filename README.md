# AI Dashboard Builder (Hackathon Starter)

Drag-and-drop **fraud analytics dashboard builder** with AI suggestions and mock data.
Built with **Next.js 14**, **TailwindCSS**, **react-grid-layout**, and **Recharts**.

## Quick Start
```bash
pnpm install   # or npm i / yarn
pnpm dev       # http://localhost:3000
```

## Features
- 🧩 Drag-and-drop widgets (KPI, Donut, Time Series)
- 🤖 AI Suggest (stub) adds recommended widgets
- 💾 Auto-save to localStorage, export/import JSON
- 🌓 Light/Dark theme toggle
- 📈 Mock fraud dataset for instant demo

## Extend
- Add more widgets in `components/widgets/*`
- Persist layouts on server; multi-dashboard support
- Replace AI stub with your LLM: POST /api/suggest
- Add role-based visibility, global filters, real APIs

Happy hacking!

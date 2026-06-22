# Nozen

Personal daily planner: Diary with mood tracking, Notes, and Daily Tasks.

## Features

- **Diary** — mood tracking (emoji-based) + free writing per day with daily prompts
- **Writing Streak Calendar** — visual calendar showing your writing history
- **Notes** — standalone notes with full text search
- **Daily Tasks** — simple checklist per day
- **Zen Mode** — distraction-free writing with serif font toggle
- **Desktop App** — Tauri v2 wrapper for native experience
- **Themes** — dark/light mode
- **Export** — export diary entries and notes

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| Runtime | React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui + Radix UI |
| State | Zustand |
| Animation | Framer Motion |
| Icons | Lucide React |
| Desktop | Tauri v2 (Rust) |
| Package Manager | pnpm |

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Lint with Biome |
| `bun run format` | Format with Biome |
| `bun run check` | Lint + format + write fixes |
| `bun run tauri:dev` | Start Tauri desktop in dev mode |

## Shortcuts

- `T` — jump to today
- Arrow keys — navigate days in diary

## Project Structure

```
├── app/           # Next.js App Router pages
├── components/    # React components (ui/ + diary/)
├── store/         # Zustand stores (diary, notes, tasks, ui)
├── services/      # Storage, import/export
├── hooks/         # Custom React hooks
├── constants/     # Prompts, mood options
├── types/         # TypeScript types
└── src-tauri/     # Tauri v2 desktop wrapper
```

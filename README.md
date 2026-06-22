# Nozen

Personal daily planner with three main sections:

- **Diary** — mood tracking + free writing per day
- **Notes** — standalone casual notes
- **Daily Tasks** — simple checklist per day

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui + Radix UI |
| State | Zustand |
| Animation | Framer Motion |
| Icons | Lucide React |

## Getting Started

```bash
# Install dependencies
bun install

# Start development
bun run dev

# Build for production
bun run build

# Lint
bun run lint

# Format
bun run format
```

## Development

- Run `bun run dev` and open http://localhost:3000
- Press `T` to jump to today
- Use arrow keys to navigate days

## Project Structure

```
├── app/           # Next.js pages
├── components/   # React components
├── store/        # Zustand stores
├── services/     # Storage & import/export
└── types/        # TypeScript types
```

## Docs

See [AGENTS.md](AGENTS.md) for full documentation.
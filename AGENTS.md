# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms.
- Check `.agents/skills/` for detailed patterns on-demand.

## Available Skills

| Skill                         | Description                            | URL                                                                                                        |
| ----------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `clean-code`                  | Clean Code principles (Bob Martin)     | [.agents/skills/clean-code/SKILL.md](.agents/skills/clean-code/SKILL.md)                                   |
| `frontend-design`             | Production-grade UI/UX design          | [.agents/skills/frontend-design/SKILL.md](.agents/skills/frontend-design/SKILL.md)                         |
| `vercel-react-best-practices` | React/Next.js performance optimization | [.agents/skills/vercel-react-best-practices/SKILL.md](.agents/skills/vercel-react-best-practices/SKILL.md) |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                           | Skill                         |
| -------------------------------- | ----------------------------- |
| Building UI components           | `frontend-design`             |
| Writing React/Next.js code       | `vercel-react-best-practices` |
| Using Tailwind CSS               | `frontend-design`             |
| Writing clean, maintainable code | `clean-code`                  |

---

## Project Overview

| Field       | Value                                            |
| ----------- | ------------------------------------------------ |
| Name        | daily-agenda-app                                 |
| Description | Daily agenda/planner application                 |
| Tech Stack  | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |

### Tech Stack Details

| Category         | Technology         |
| ---------------- | ------------------ |
| Framework        | Next.js 16.0.10    |
| UI Library       | React 19.2.0       |
| Language         | TypeScript 5       |
| Styling          | Tailwind CSS 4.1.9 |
| State Management | Zustand 5.0.11     |
| UI Components    | Radix UI           |
| Animation        | Framer Motion 12   |
| Icons            | Lucide React       |

---

## Development

```bash
# Setup
bun install

# Development
bun dev

# Build
bun build

# Lint
bun lint

# Start production
bun start
```

---

## Code Conventions

- Follow Clean Code principles
- Use TypeScript strict typing
- Prefer functional components with React 19 patterns
- Use `cn()` utility (from tailwind-merge + clsx) for conditional classes
- Follow existing component patterns in `app/` and `components/`
- Use Zustand for global state management
- Use Radix UI primitives for accessible components
- Use Sonner for toast notifications

---

## Project Structure

```
├── app/                 # Next.js App Router pages
├── components/         # React components
├── lib/               # Utilities, hooks, stores
├── public/            # Static assets
└── .agents/skills/    # Agent skills
```

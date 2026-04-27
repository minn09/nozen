# Component Conventions

## General Guidelines

- Use shadcn/ui as the base for UI components
- Use Tailwind CSS for styling (no CSS modules, no styled-components)
- Use Framer Motion for animations

## Component Organization

| Location | Description |
|----------|-------------|
| `components/ui/` | Generic UI components (shadcn base) |
| `components/diary/` | Diary feature specific components |

## Client vs Server Components

- **Client Components**: Must include `"use client"` directive at the top
- **Server Components**: Do NOT include `"use client"` directive

```typescript
// Client Component
"use client";

import { useState } from "react";

export function MyComponent() {
  // ...
}
```

```typescript
// Server Component (no directive needed)
export function MyServerComponent() {
  // ...
}
```

## Styling Patterns

Use `cn()` utility for conditional classes:

```typescript
import { cn } from "@/lib/utils/cn";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" ? "primary-classes" : "secondary-classes"
)} />
```

## Animation

Use Framer Motion for animations:

```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  Content
</motion.div>
```
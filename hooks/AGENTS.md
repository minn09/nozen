# Hooks Conventions

## General Guidelines

- All custom hooks must use strict TypeScript with explicit types
- Hooks that wrap media queries are read-only and do not mutate global state
- Use `useCallback` and `useMemo` appropriately to prevent unnecessary re-renders

## Zustand Access Pattern

When a hook needs to access Zustand store without subscribing to changes, use `useStore.getState()` instead of including the store as a dependency in `useCallback` or `useEffect`. This is an intentional pattern, not a bug:

```typescript
// Correct - avoids subscription
const handleAction = useCallback(() => {
  const state = useStore.getState();
  // use state values
}, []);

// Incorrect - creates subscription
const handleAction = useCallback(() => {
  const state = useStore(); // DON'T do this
}, [state]);
```

## Existing Hooks

| Hook | Description |
|------|-------------|
| `use-mobile.ts` | Detects if viewport is mobile (< 768px) |
| `use-media-query.ts` | Detects if viewport matches a given media query |

## TypeScript Strict Mode

All hooks must declare return types explicitly:

```typescript
export function useMobile(): boolean {
  // implementation
}
```
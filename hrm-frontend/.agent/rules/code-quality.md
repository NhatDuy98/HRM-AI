---
trigger: always_on
---

---
title: React Code Quality Guidelines
applies_to:
  - "**/*.{ts,tsx}"
---

# React Code Quality Guidelines (TypeScript + Tailwind)

## 1. Component Design Principles

- Design components following the **Single Responsibility Principle (SRP)**.
- Prefer **functional components**.
- Explicitly define **props types** using `type` or `interface`.
- Keep components **pure** whenever possible.
- Split large components into **smaller, reusable components**.
- Avoid business logic inside JSX.

### ✅ Good Example

```tsx
type ButtonProps = {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      {label}
    </button>
  )
}
❌ Bad Example
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>
}
2. State Management Principles
Local State

Use useState for simple local state.

Use useReducer for complex state logic.

Do not store derived state unnecessarily.

const [count, setCount] = useState<number>(0)

Global State

Use Redux Toolkit / Zustand / Jotai for global state.

Avoid prop drilling for deeply nested state.

Store only shared & persistent state globally.

import { create } from 'zustand'

type CounterState = {
  count: number
  increment: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))

3. Custom Hooks Principles

Extract reusable logic into custom hooks.

Hooks must start with use.

Hooks must be pure and reusable.

Do not use hooks conditionally.

Example: Custom Hook
import { useState } from 'react'

export function useCounter() {
  const [count, setCount] = useState<number>(0)

  const increment = () => setCount((c) => c + 1)

  return { count, increment }
}

4. Type Safety Principles

Enable strict mode in tsconfig.json.

Define types for all props, state, and function returns.

Avoid using any. Prefer:

unknown

generics

type guards

Use union types instead of enums when possible.

✅ Good Example
type Status = 'idle' | 'loading' | 'success' | 'error'

function isLoading(status: Status): boolean {
  return status === 'loading'
}

❌ Bad Example
function handleData(data: any) {
  return data.value
}

5. JSX & Rendering Rules

Avoid inline logic inside JSX.

Use early returns for conditional rendering.

Prefer map with key over manual loops.

Never use array index as key unless list is static.

if (isLoading) return <Spinner />

return (
  <ul>
    {users.map((user) => (
      <UserItem key={user.id} user={user} />
    ))}
  </ul>
)

6. Tailwind CSS Principles

Use Tailwind utility classes instead of custom CSS when possible.

Avoid long unreadable class strings → extract with:

clsx

classnames

Do not use inline styles unless required.

Good Example
import clsx from 'clsx'

type BadgeProps = {
  active: boolean
}

export function Badge({ active }: BadgeProps) {
  return (
    <span
      className={clsx(
        'rounded-full px-3 py-1 text-sm font-medium',
        active ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
      )}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
7. File & Folder Structure
src/
├─ components/
│  ├─ common/
│  └─ ui/
├─ features/
│  └─ user/
│     ├─ components/
│     ├─ hooks/
│     ├─ services/
│     └─ types.ts
├─ hooks/
├─ services/
├─ store/
├─ types/
└─ utils/

8. Side Effects & Data Fetching

Use useEffect only for side effects.

Keep API logic in service layer, not components.

Cancel async effects when needed.

useEffect(() => {
  let mounted = true

  fetchUsers().then((data) => {
    if (mounted) setUsers(data)
  })

  return () => {
    mounted = false
  }
}, [])

9. Naming Conventions

Components: PascalCase

Hooks: useSomething

Files: kebab-case.tsx

Types: PascalCase

Constants: UPPER_SNAKE_CASE

10. Code Review Rules

No console.log in production code.

No commented-out code.

Every PR must:

Pass TypeScript check

Pass linting

Have clear commit message

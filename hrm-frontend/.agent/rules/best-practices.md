---
trigger: always_on
---

---
title: React + TypeScript Best Practices
applies_to:
  - "**/*.{ts,tsx}"
---

# React + TypeScript + Tailwind Best Practices

This document outlines the recommended practices for developing React applications using TypeScript and Tailwind CSS.

---

## Component Architecture

### Functional Components
- Use **function components** only (no class components)
- One component per file
- Component name must match file name
- Use **PascalCase** for component names

```tsx
export function UserProfile() {
  return <div>User Profile</div>
}

Component Organization (File Structure Order)

Type definitions

Constants

Custom hooks

Component logic

JSX return

// 1. Types
type Props = {
  userId: number
}

// 2. Constants
const MAX_ITEMS = 10

// 3. Hooks
import { useUser } from '@/hooks/use-user'

// 4. Component
export function UserProfile({ userId }: Props) {
  const { user } = useUser(userId)

  // 5. JSX
  return <div>{user.name}</div>
}

Component Design

Follow Single Responsibility Principle

Avoid business logic inside JSX

Extract complex logic into hooks

Avoid deeply nested JSX (>3 levels)

React Hooks Usage
useState

Use for local UI state

Always type explicitly when non-trivial

const [count, setCount] = useState<number>(0)

useReducer

Use for complex state transitions

type State = { count: number }
type Action = { type: 'increment' | 'decrement' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    default:
      return state
  }
}

useEffect

Use only for side effects

Keep effects small and focused

Always define dependency arrays correctly

Cleanup effects when necessary

useEffect(() => {
  const id = setInterval(fetchData, 1000)
  return () => clearInterval(id)
}, [])

Custom Hooks

Prefix with use

One responsibility per hook

Do not mutate external state

Reusable & framework-agnostic where possible

export function useCounter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount((c) => c + 1)

  return { count, increment }
}

TypeScript Integration
Props Typing
type Props = {
  id: number
  name: string
  isActive?: boolean
}

Event Typing
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}

Type Usage Rules

Prefer type over interface

Avoid any

Use unknown + type guards when needed

Enable strict mode

function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null
}

State Management
Local State

useState, useReducer for component-level state

Global State

Use Zustand / Redux Toolkit / Jotai

Store only shared state

Do NOT store derived state

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

API Handling
Service Layer

All API calls live in src/services

Components never call fetch / axios directly

Always type request & response

export async function fetchUser(id: number): Promise<User> {
  const res = await api.get<User>(`/users/${id}`)
  return res.data
}

Error Handling

Handle errors in service or query layer

Never swallow errors silently

Display user-friendly messages

Server State (Recommended)

Use TanStack Query (React Query)

Cache, retry, and invalidate properly

useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})

Performance Optimization
Memoization

Use useMemo for expensive calculations

Use useCallback for stable references

Avoid premature optimization

const total = useMemo(() => calculateTotal(items), [items])

Lazy Loading
const UserProfile = lazy(() => import('@/pages/user-profile'))

Styling (Tailwind CSS)
General Rules

Use Tailwind utilities first

Avoid inline styles

Avoid custom CSS unless necessary

Use clsx / classnames for conditionals

className={clsx(
  'rounded px-4 py-2',
  isActive && 'bg-blue-600 text-white'
)}

Component Styling

Do not bind logic to class names

Prefer semantic props (variant, size)

Accessibility (Required)

Use semantic HTML elements

All interactive elements must be keyboard-accessible

Always provide aria-* attributes when needed

<button aria-label="Close modal" />

Testing
Unit Tests

Test behavior, not implementation

Use React Testing Library

File naming: ComponentName.test.tsx

E2E Tests

Use Cypress / Playwright

Test critical business flows only

Code Quality

ESLint must pass

Prettier must format code

No console.log in production

No commented-out code

Meaningful commit messages

Project-Specific Practices

Internationalization

Use i18n library

No hardcoded strings in UI

Folder Structure

Feature-based organization

Co-locate components, hooks, tests

Imports

Absolute imports via @/

Type-only imports when possible

import type { User } from '@/types/user'

References

React Docs: https://react.dev

TypeScript Handbook

Tailwind CSS Docs

TanStack Query Docs
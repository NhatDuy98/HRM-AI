---
trigger: always_on
---

---
title: Naming Conventions Guide
applies_to:
  - "**/*.{ts,tsx}"
---

# Naming Conventions Guide  
**React + TypeScript + Tailwind CSS**

## Core Principles

1. **Consistency** – Follow the same naming patterns across the project
2. **Clarity** – Names must clearly express intent
3. **TypeScript Awareness** – Naming should leverage strong typing
4. **React Best Practices** – Follow React & community conventions
5. **Scalability** – Names should scale with feature-based architecture

---

## File Naming

### React Components
- Use **PascalCase** for component files  
  `UserProfile.tsx`, `AppHeader.tsx`
- Component name **must match file name**
- One React component per file

```tsx
// UserProfile.tsx
export function UserProfile() {}

Page Components (Routing)

Use kebab-case for route-level files

Group by domain or feature

pages/
├─ auth/
│  ├─ login.tsx
│  └─ register.tsx
├─ dashboard/
│  └─ index.tsx

Next.js: file name reflects route
Vite/SPA: use router config but keep same naming

Hooks

Use kebab-case for filenames

Prefix filename with use-

hooks/
├─ use-auth.ts
├─ use-pagination.ts

Utility / Helper Files

Use kebab-case

Suffix with -utils, -helper, or -formatter

utils/
├─ date-utils.ts
├─ string-helper.ts

Constants

Use kebab-case filenames

Group by domain

constants/
├─ auth.constants.ts
├─ api.constants.ts

Variable Naming
General Variables

Use camelCase

Avoid abbreviations unless common

const userCount = 10
const isLoading = true

Boolean Variables

Prefix with is, has, can, should

const isAuthenticated = false
const hasPermission = true

Arrays & Collections

Use plural nouns

const users: User[] = []
const permissionList: Permission[] = []

Function Naming
General Functions

Use camelCase

Start with a verb

formatDate()
validateEmail()
calculateTotal()

Event Handlers

Prefix with handle

const handleSubmit = () => {}
const handleClick = () => {}

Async Functions

Start with async verb (fetch, load, create, update)

Do NOT suffix with Async unless required

fetchUsers()
createOrder()

Component Naming
React Components

Use PascalCase

Nouns or noun phrases

UserCard
EmployeeTable
PageHeader

Shared / Global Components

Prefix with app or domain abbreviation (optional)

HrmButton
HrmModal

Custom Hooks

Prefix with use

Use descriptive names

One responsibility per hook

useAuth()
usePagination()
useFormValidation()

TypeScript Naming
Type Aliases

Use PascalCase

Prefer type over interface unless extending

type User = {
  id: number
  name: string
}

Interfaces

Use PascalCase

NO I prefix (recommended modern TS practice)

interface ApiResponse<T> {
  data: T
  error?: string
}

Enums / Union Types

Prefer union types

Use PascalCase

type UserRole = 'admin' | 'hr' | 'employee'

State Management
Zustand / Redux / Store Hooks

Prefix with use

Suffix with Store

useUserStore()
useAuthStore()

Store State & Actions

State: nouns

Actions: verbs

users
isLoading
fetchUsers()
resetState()

API & Services
Service Files

Use kebab-case

Suffix with .service.ts

services/
├─ auth.service.ts
├─ user.service.ts

Service Methods

Follow REST semantics

getUser()
getUsers()
createUser()
updateUser()
deleteUser()

Tailwind CSS Naming Rules
Class Names

Use Tailwind utility classes directly

Avoid inline styles

Extract complex conditions with clsx

className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2"

Conditional Styles

Use semantic prop names

type ButtonProps = {
  variant: 'primary' | 'secondary'
}

Folder Naming

Use kebab-case

Feature-based structure preferred

features/
├─ user-management/
│  ├─ components/
│  ├─ hooks/
│  ├─ services/
│  └─ types.ts

Import Naming

Use named imports

Use type-only imports when possible

import type { User, UserRole } from '@/types/user'

Best Practices

1. Avoid unnecessary abbreviations

2. Prefer clarity over brevity

3. Do not encode types into variable names (userObj, userStr)

4. Align naming with domain language (HRM terms)

5. Update this guide when new patterns are introduced
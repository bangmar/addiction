# 📘 Project Structure Guide (AI Agent Friendly)

This guide explains how the project is structured and how each part should be used. The goal is to make it easy for an AI agent (or developer) to understand where things belong and how to navigate the codebase.

---

# 🧱 High-Level Structure

```
/app
/components
/hooks
/lib
/providers
```

---

# 📂 1. Components

This is the core of the UI layer.

## 🔹 Component Structure (Standard Pattern)

Each component MUST follow this structure:

```
component-name/
│── index.tsx      # Main UI component
│── hook.ts        # Local logic (state, effects, react-query)
│── api.ts         # API calls (if needed)
│── types.d.ts     # Type definitions
```

### ✅ Rules

- `index.tsx` = UI only (no heavy logic)
- `hook.ts` = all logic (state, handlers, API calls via hooks)
- `api.ts` = isolate API request logic
- `types.d.ts` = all types related to this component

---

## 🔹 Feature-Based Components

```
components/features/<feature-name>/
```

Used for **specific modules tied to a page**.

### Example:

```
components/features/home/
```

A feature can be split into smaller sections:

```
components/features/home/
│── index.tsx
│── hook.ts
│── types.d.ts
│── api.ts
│
└── section_name/
    │── index.tsx
    │── hook.ts
    │── types.d.ts
    │── api.ts
```

### ✅ Rules

- Each section follows the SAME structure as a normal component
- Keep sections modular and reusable within the feature

---

## 🔹 UI Components (Shared)

```
components/ui/
```

Used for **reusable and generic components**.

### Examples:

- Button
- Input
- Modal
- Card

### ✅ Rules

- No business logic
- Highly reusable
- Used across features/pages

---

# 📂 2. App (Routing Layer)

```
app/
```

Handles routing and page entry points.

### Example:

```
app/home/page.tsx
```

This page will call:

```
components/features/home
```

### ✅ Rules

- Keep pages thin
- Only compose features/components
- No heavy logic here

---

# 📂 3. Hooks (Global Shared Hooks)

```
hooks/<hook-name>/hook.ts
```

Used for **shared logic across the app**.

### Examples:

- Authentication hook
- Debounce hook
- Global state logic

### ✅ Rules

- Reusable across multiple features
- Should NOT be tied to a single component
- Can use React Query

---

# 📂 4. Providers

```
providers/
```

Used to wrap the application with global providers.

### Example:

```
ReactQueryProvider
```

### ✅ Rules

- Handles global context (React Query, Theme, Auth, etc.)
- Used in root layout

---

# 📂 5. Lib (Utilities & Core Logic)

```
lib/
```

Contains shared non-UI logic.

---

## 🔹 API Config

```
lib/api/
```

### Purpose:

- Axios instance
- Interceptors
- Base config

---

## 🔹 Constants

```
lib/constant/
```

### Purpose:

- Global constants
- Enums
- Static config values

---

## 🔹 Helpers

```
lib/helper/
```

Organized by functionality:

### Example:

```
lib/helper/converter/
lib/helper/math/
```

### ✅ Rules

- Group helpers by domain
- Avoid dumping everything in one file
- Pure functions only (no side effects)

---

# 🔁 Data Flow Pattern

```
UI (index.tsx)
   ↓
hook.ts (logic + state)
   ↓
api.ts (fetch data)
   ↓
lib/api (axios config)
```

---

# 📏 Best Practices

### 1. Separation of Concerns

- UI → `index.tsx`
- Logic → `hook.ts`
- API → `api.ts`
- Types → `types.d.ts`

---

### 2. Reusability First

- Shared → `components/ui`
- Feature-specific → `components/features`

---

### 3. Scalability

- Break large features into sections
- Keep files small and focused

---

### 4. Consistency

- Always follow the same structure
- Naming must be predictable

---

# 🧠 AI Agent Guidelines

When working in this project:

### ✅ To Add a Feature

1. Create folder in `components/features/<feature-name>`
2. Follow standard structure
3. Split into sections if needed

---

### ✅ To Add API Call

- Put inside `api.ts` (feature-level)
- Use `lib/api` axios instance

---

### ✅ To Add Shared Logic

- Put in `/hooks`

---

### ✅ To Add Shared UI

- Put in `/components/ui`

---

### ❌ Avoid

- Mixing UI and logic
- Calling API directly in components
- Duplicating helpers

---

# 🚀 Summary

This architecture is designed for:

- Scalability
- Maintainability
- Clear separation of concerns
- AI-friendly navigation

Every part of the codebase has a **single responsibility**, making it predictable and easy to extend.

---

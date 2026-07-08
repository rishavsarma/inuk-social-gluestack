# Project Rules — Expo App

Before building any UI, check @docs/gluestack-components.md for the available component and its docs link.

## Stack (non-negotiable)

| Concern      | Use                                         | Never use                                            |
| ------------ | ------------------------------------------- | ---------------------------------------------------- |
| Framework    | Expo v57, New Architecture                  | Bare RN CLI patterns                                 |
| Language     | TypeScript only                             | JavaScript                                           |
| Navigation   | Expo Router (typed routes)                  | React Navigation directly                            |
| UI Kit       | gluestack UI v5                             | Custom UI when a gluestack component exists          |
| Styling      | NativeWind + semantic theme tokens          | `StyleSheet.create`, inline styles, hardcoded colors |
| Lists        | `@shopify/flash-list`                       | `FlatList`, `ScrollView` + `.map()` for large data   |
| Networking   | Axios (shared instance, inside `services/`) | `fetch`, API calls in components                     |
| Global state | Zustand (split by feature)                  | Redux, Context API for global state                  |
| Dates        | `date-fns`                                  | `Moment.js`, manual date math                        |
| Icons        | `@gluestack-ui/icon` (Lucide)               | Mixed icon libraries                                 |
| i18n         | `react-i18next`, every string via `t()`     | Hardcoded user-facing text                           |

---

## Component Style

- Functional components only.
- Use `function` declarations for components, hooks, and named exports.
- Use arrow functions only for: the final `export default`, inline callbacks, and event handlers.
- Prefer composition over inheritance; compose gluestack primitives before writing custom components.
- Keep components presentation-only — business logic lives outside the UI layer (hooks/services/stores).

## Before Writing Any Code — Decision Order

1. **UI needed** → search gluestack UI docs → use existing component → compose primitives → build custom only as last resort (place in `components/custom/`).
2. **Form needed** → use gluestack form components only (`FormControl`, `FormControlLabel`, `FormControlLabelText`, `Input`, `InputField`, `FormControlHelper`, `FormControlHelperText`, `FormControlError`, `FormControlErrorIcon`, `FormControlErrorText`). Never raw `TextInput`. Never custom validation UI — always surface errors via `FormControlError`. Every form must handle loading, disabled, error, and success states.
3. **Data fetching** → Axios, inside `services/`, never called directly from components.
4. **State** → Zustand for global/shared state, `useState` for local component state, `persist` middleware only when persistence is required.
5. **Large list** → FlashList, always with `estimatedItemSize`, `keyExtractor`, `ListEmptyComponent`, `refreshing`, `onRefresh`.
6. **Dates** → `date-fns`.
7. **Any visible text** → `t("...")` via i18next. This includes buttons, labels, headings, placeholders, helper/validation/error/success text, empty & loading states, toasts, alerts, dialog titles/descriptions, menu/drawer/tab labels. No exceptions.

## File Structure

```
app/
components/
components/custom/   # only for UI with no gluestack equivalent
features/
hooks/
services/            # all API calls
stores/              # zustand, split by feature
lib/
constants/           # all constants — never hardcode values in UI
utils/
types/               # all shared types → global.d.ts
locales/
assets/
```

Organize by feature wherever possible.

## Naming

| Item       | Convention     | Example             |
| ---------- | -------------- | ------------------- |
| Components | PascalCase     | `UserCard.tsx`      |
| Hooks      | `useX`         | `useAuth.ts`        |
| Stores     | `x.store.ts`   | `cart.store.ts`     |
| Services   | `x.service.ts` | `orders.service.ts` |
| Variables  | camelCase      | `userId`            |
| Constants  | UPPER_CASE     | `MAX_RETRIES`       |
| Folders    | kebab-case     | `order-details/`    |

## Import Order

React → Expo → React Native → gluestack UI → third-party libs → services → stores → hooks → components → utils → constants → types

## Performance

- `React.memo` where it reduces real re-renders.
- `useMemo` for expensive computations, `useCallback` for stable callback references.
- Lazy-load heavy screens.
- Optimize images.
- Avoid unnecessary re-renders — don't over-apply memoization where it adds no value.

## Accessibility & Theming

- Every interactive element needs appropriate accessibility props and screen reader support.
- Support light and dark mode via semantic tokens — never hardcode colors.

## Anti-Patterns (check before generating code)

Never: `StyleSheet.create` (unless truly unavoidable) · inline styles (except runtime/animated values) · Redux · Context for global state · `Moment.js` · `FlatList` when FlashList works · `fetch` · raw `TextInput` in forms · hardcoded strings · hardcoded colors · hardcoded constants in UI · custom UI duplicating an existing gluestack component.

## Definition of Done

- [ ] gluestack UI used, no duplicated components
- [ ] NativeWind + semantic tokens, no hardcoded colors
- [ ] FlashList for lists, with all required props
- [ ] Axios inside `services/`, none in components
- [ ] Zustand for global state
- [ ] `date-fns` for dates
- [ ] All strings via `react-i18next`
- [ ] Light + dark mode supported
- [ ] Accessible
- [ ] TypeScript only, types in `global.d.ts`
- [ ] Optimized (memo/useMemo/useCallback where warranted)
- [ ] Production ready

# UI Design based on the website

This are my website ui take this ui referrence for my app
https://www.inukaangan.com
https://www.inukmovement.com/

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

## Design Tokens

Two spacing mechanisms coexist by necessity — gluestack's `space` prop only covers the gap between `VStack`/`HStack` children, it has no padding/margin equivalent. Typography is a single scale used everywhere.

**Spacing — gap between Stack children.** Use `VStack`/`HStack`'s `space` prop. Allowed values only: `xs` `sm` `md` `lg` `xl` `2xl`. Never `2xs`, `3xl`, `4xl`, or a raw number.

**Spacing — padding, margin, and gap outside a Stack.** Use NativeWind classNames. Allowed step values only: `1` `2` `3` `4` `6` `8` `12` (e.g. `p-4`, `px-6`, `gap-2`, `mb-8`). Never an arbitrary bracket value (`p-[13px]`) or an off-scale/fractional number (`p-2.75`, `gap-3.5`, `px-4.5`).

Exempt from the spacing scale (different purpose, not visual rhythm — don't "fix" these):
- `contentContainerStyle`'s `paddingBottom` on scrollable screens, which reserves clearance for floating chrome (tab bar / floating action buttons), sized to that chrome's height rather than a rhythm step.
- Hairline grid-seam padding (e.g. the profile post grid's tile gutters) — sub-pixel seams, not content padding.

**Typography.** Allowed sizes only, always via `Text`/`Heading`'s `size` prop where the component allows it, otherwise the matching `text-*` className. Never `fontSize: N` or `text-[Npx]`.

| Token | px | Tailwind class | `Text` `size` | `Heading` `size` |
| ----- | -- | --------------- | -------------- | ------------------ |
| xs    | 12 | `text-xs`   | `xs`  | — *(Heading has no 12px step; use `Text` instead)* |
| sm    | 14 | `text-sm`   | `sm`  | `xs` |
| base  | 16 | `text-base` | `md`  | `sm` |
| lg    | 18 | `text-lg`   | `lg`  | `md` |
| xl    | 20 | `text-xl`   | `xl`  | `lg` |
| 2xl   | 24 | `text-2xl`  | `2xl` | `xl` |
| 3xl   | 30 | `text-3xl`  | `3xl` | `2xl` |

`Heading`'s `size` scale is shifted one step up from `Text`'s (by design — a heading is never the smallest text on screen), so to land on the same px value pick the row *below* the one you'd use for `Text`.

Raw pixel numbers for the rare case where neither a class nor a `size` prop is reachable (third-party component style props, Skia canvas text) live in `constants/index.ts` as `FONT_SIZE_PX` / `SPACING_PX` — reference those, never retype the number.

Arena, Discover, Awards, and anything importing `constants/web-reference-theme.ts` are pixel-matched to the reference website and previously used bespoke fractional values (`text-[13.5px]`, `gap-2.75`, etc.) for that reason — they've been normalized onto the scales above like the rest of the app; no standing exception remains for them.

## Anti-Patterns (check before generating code)

Never: `StyleSheet.create` (unless truly unavoidable) · inline styles (except runtime/animated values) · Redux · Context for global state · `Moment.js` · `FlatList` when FlashList works · `fetch` · raw `TextInput` in forms · hardcoded strings · hardcoded colors · hardcoded constants in UI · custom UI duplicating an existing gluestack component · off-scale spacing or font sizes (see Design Tokens).

## Definition of Done

- [ ] gluestack UI used, no duplicated components
- [ ] NativeWind + semantic tokens, no hardcoded colors
- [ ] Spacing and typography follow the Design Tokens scale — no raw/off-scale numbers
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

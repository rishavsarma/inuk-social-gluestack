---
trigger: always_on
---

# AI Development Rules

## General

- Use Expo v57.
- Use Expo Router for navigation.
- Use TypeScript only.
- Use Functional Components only.
- Follow React Native New Architecture.
- Keep components modular and reusable.
- Prefer composition over inheritance.

---

# UI

- Use gluestack UI v5 components whenever possible.
- Never recreate an existing gluestack component.
- Search the gluestack documentation before creating custom UI.
- Compose gluestack primitives before creating custom components.
- Only build custom components when no gluestack component exists.
- The cumpome components should be inside custom folder

Preferred Layout Components

- Box
- VStack
- HStack
- Grid
- Center
- Card

Preferred Typography

- Heading
- Text

---

# Styling

- Use NativeWind exclusively.
- Never use StyleSheet.create unless absolutely necessary.
- Never use inline styles except for animated or runtime-calculated values.
- Always use semantic theme tokens.
- Support both Light and Dark mode.
- Never hardcode colors.

---

# Internationalization

- Use react-i18next.
- Never hardcode user-facing text.
- Every visible string must come from translation files.

This includes:

- Button text
- Labels
- Headings
- Placeholders
- Helper text
- Validation messages
- Error messages
- Success messages
- Empty states
- Loading states
- Toasts
- Alerts
- Dialog titles
- Dialog descriptions
- Menu items
- Drawer items
- Tab labels

Always use

t("...")

---

# Forms

- Always use gluestack UI form components.
- Never use plain React Native TextInput.
- Always use:
  - FormControl
  - FormControlLabel
  - FormControlLabelText
  - Input
  - InputField
  - FormControlHelper
  - FormControlHelperText
  - FormControlError
  - FormControlErrorIcon
  - FormControlErrorText

- Use the official gluestack form APIs/controllers when implementing forms.
- Do not build custom validation UI.
- Always display validation using FormControlError.
- Every label, placeholder, helper text, and validation message must use i18n.
- Every form should support:
  - Loading
  - Disabled
  - Error
  - Success

---

# Lists

- Always use FlashList.
- Never use FlatList unless FlashList is incompatible.
- Never use ScrollView + map() for large datasets.

Every FlashList should include:

- estimatedItemSize
- keyExtractor
- ListEmptyComponent
- refreshing
- onRefresh

---

# Networking

- Use Axios exclusively.
- Never use fetch.
- Create a shared axios instance.
- Keep all API calls inside services/.

Never call APIs directly from UI components.

---

# Global State

- Use Zustand.
- Never use Redux.
- Never use Context API for global application state.
- Split stores by feature.
- Use persist middleware when persistence is required.

---

# Date Handling

- Use date-fns exclusively.
- Never use Moment.js.
- Never manually manipulate dates.

---

# Icons

- Use @gluestack-ui/icon.
- Prefer Lucide icons.
- Never mix multiple icon libraries unless explicitly requested.

---

# Navigation

- Use Expo Router.
- Organize routes using route groups.
- Use typed routes whenever possible.

---

# File Structure

app/
components/
components/ui/
features/
hooks/
services/
stores/
lib/
constants/
utils/
types/
assets/
locales/

Organize by feature whenever possible.

---

# Performance

- Always optimize rendering.
- Use React.memo where appropriate.
- Use useMemo for expensive computations.
- Use useCallback for stable callbacks.
- Lazy-load heavy screens.
- Optimize images.
- Avoid unnecessary re-renders.
- Always use function not arrow function
- Use arrow function only the the final export default

---

# Accessibility

Every interactive component must include appropriate accessibility props.

Support screen readers.

---

# Imports

Import order:

1. React
2. Expo
3. React Native
4. gluestack UI
5. Third-party libraries
6. Services
7. Stores
8. Hooks
9. Components
10. Utils
11. Constants
12. Types

---

# Constants

Keep all constants in constants folder
Dont keep any constant hardcoded value in the ui

---

# Types

Declare all types in global.d.ts

---

# Naming

Components

- PascalCase

Hooks

- useSomething

Stores

- something.store.ts

Services

- something.service.ts

Variables

- camelCase

Constants

- UPPER_CASE

Folders

- kebab-case

---

# Code Style

- Use arrow functions.
- Prefer named exports.
- Keep components focused on presentation.
- Move business logic outside UI components.
- Avoid duplicated code.

---

# AI Decision Rules

Before creating UI

1. Search gluestack UI.
2. Use an existing component if available.
3. Compose existing primitives if needed.
4. Build custom UI only as a last resort.

Before creating a form

1. Use gluestack form components.
2. Use the official gluestack form APIs/controllers.
3. Never use React Native TextInput directly.
4. Never build custom validation UI.
5. Localize every visible string.

Before fetching data

1. Use Axios.
2. Keep API calls inside services.
3. Never call APIs directly from components.

Before storing state

1. Global state → Zustand.
2. Local component state → useState.

Before displaying large lists

Always use FlashList.

Before formatting dates

Always use date-fns.

Before writing text

1. Use i18n.
2. Never hardcode strings.

---

# Preferred Libraries

UI

- gluestack UI v5

Styling

- NativeWind

Navigation

- Expo Router

Lists

- @shopify/flash-list

Networking

- Axios

Global State

- Zustand

Date Utilities

- date-fns

Icons

- @gluestack-ui/icon

Internationalization

- react-i18next

---

# Quality Checklist

- ✅ Uses gluestack UI
- ✅ Uses NativeWind
- ✅ Uses FlashList
- ✅ Uses Axios
- ✅ Uses Zustand
- ✅ Uses date-fns
- ✅ Uses react-i18next
- ✅ Uses semantic theme tokens
- ✅ No hardcoded colors
- ✅ No hardcoded user-facing text
- ✅ Supports Dark Mode
- ✅ Accessible
- ✅ Responsive
- ✅ Optimized
- ✅ TypeScript only
- ✅ Production ready

# UI Design based on the website

This are my website take this ui referrence for my app
https://www.inukaangan.com
https://www.inukmovement.com/

# gluestack UI v5 — Component Reference

Companion to `CLAUDE.md`. Check here before building any custom UI — if a component is
listed, use it (and compose primitives) instead of writing raw View/Text/TextInput.

Stack: NativeWind v5 (or UniWind) styling engine, Tailwind CSS v4, CSS-first theme config.

## Install a component

```bash
npx gluestack-ui@alpha add <component>
```

Add components on demand — don't bulk-install ones you're not using yet.

## Layout Primitives

| Component | Use for                                            | Docs                                                                      |
| --------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| `Box`     | Generic flex container, base of most custom layout | [/components/box](https://v5.gluestack.io/ui/docs/components/box)         |
| `VStack`  | Vertical stacking with spacing                     | [/components/vstack](https://v5.gluestack.io/ui/docs/components/vstack)   |
| `HStack`  | Horizontal stacking with spacing                   | [/components/hstack](https://v5.gluestack.io/ui/docs/components/hstack)   |
| `Grid`    | Grid layouts                                       | [/components/grid](https://v5.gluestack.io/ui/docs/components/grid)       |
| `Center`  | Center-align content                               | [/components/center](https://v5.gluestack.io/ui/docs/components/center)   |
| `Card`    | Elevated content container                         | [/components/card](https://v5.gluestack.io/ui/docs/components/card)       |
| `Divider` | Content separation                                 | [/components/divider](https://v5.gluestack.io/ui/docs/components/divider) |

## Typography

| Component | Use for                                               | Docs                                                                      |
| --------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| `Heading` | All headings — never raw `<Text>` styled as a heading | [/components/heading](https://v5.gluestack.io/ui/docs/components/heading) |
| `Text`    | Body text                                             | [/components/text](https://v5.gluestack.io/ui/docs/components/text)       |

## Forms (mandatory per project rules — never raw `TextInput`)

| Component                 | Use for                                           | Docs                                                                                        |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `FormControl` + sub-parts | Wraps every form field (Label, HelperText, Error) | [/components/form-control](https://v5.gluestack.io/ui/docs/components/form-control)         |
| `Input` / `InputField`    | Text entry                                        | [/components/input](https://v5.gluestack.io/ui/docs/components/input)                       |
| `TextArea`                | Multi-line entry                                  | [/components/textarea](https://v5.gluestack.io/ui/docs/components/textarea)                 |
| `Checkbox`                | Boolean input                                     | [/components/checkbox](https://v5.gluestack.io/ui/docs/components/checkbox)                 |
| `Radio`                   | Single-select input                               | [/components/radio](https://v5.gluestack.io/ui/docs/components/radio)                       |
| `Select`                  | Dropdown                                          | [/components/select](https://v5.gluestack.io/ui/docs/components/select)                     |
| `Switch`                  | Toggle                                            | [/components/switch](https://v5.gluestack.io/ui/docs/components/switch)                     |
| `Slider`                  | Range input                                       | [/components/slider](https://v5.gluestack.io/ui/docs/components/slider)                     |
| `DateTimePicker`          | Date/time input — native on mobile                | [/components/date-time-picker](https://v5.gluestack.io/ui/docs/components/date-time-picker) |

## Actions / Feedback

| Component     | Use for                             | Docs                                                                                |
| ------------- | ----------------------------------- | ----------------------------------------------------------------------------------- |
| `Button`      | All tappable actions                | [/components/button](https://v5.gluestack.io/ui/docs/components/button)             |
| `Fab`         | Floating action button              | [/components/fab](https://v5.gluestack.io/ui/docs/components/fab)                   |
| `Toast`       | Transient feedback — must be i18n'd | [/components/toast](https://v5.gluestack.io/ui/docs/components/toast)               |
| `Alert`       | Inline status messaging             | [/components/alert](https://v5.gluestack.io/ui/docs/components/alert)               |
| `AlertDialog` | Confirm/destructive action dialogs  | [/components/alert-dialog](https://v5.gluestack.io/ui/docs/components/alert-dialog) |
| `Spinner`     | Loading indicator                   | [/components/spinner](https://v5.gluestack.io/ui/docs/components/spinner)           |
| `Skeleton`    | Loading placeholder                 | [/components/skeleton](https://v5.gluestack.io/ui/docs/components/skeleton)         |
| `Progress`    | Progress bar                        | [/components/progress](https://v5.gluestack.io/ui/docs/components/progress)         |

## Overlays / Navigation

| Component     | Use for                                                                | Docs                                                                              |
| ------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Modal`       | Blocking overlay                                                       | [/components/modal](https://v5.gluestack.io/ui/docs/components/modal)             |
| `ActionSheet` | Mobile-native bottom action menu                                       | [/components/actionsheet](https://v5.gluestack.io/ui/docs/components/actionsheet) |
| `BottomSheet` | Custom bottom sheet (built on `@gorhom/bottom-sheet`)                  | [/components/bottomsheet](https://v5.gluestack.io/ui/docs/components/bottomsheet) |
| `Drawer`      | Side navigation/content panel                                          | [/components/drawer](https://v5.gluestack.io/ui/docs/components/drawer)           |
| `Popover`     | Contextual floating content                                            | [/components/popover](https://v5.gluestack.io/ui/docs/components/popover)         |
| `Tooltip`     | Hover/press hints                                                      | [/components/tooltip](https://v5.gluestack.io/ui/docs/components/tooltip)         |
| `Menu`        | Dropdown/context menu                                                  | [/components/menu](https://v5.gluestack.io/ui/docs/components/menu)               |
| `Tabs`        | Tabbed navigation (not for route-level nav — use Expo Router for that) | [/components/tabs](https://v5.gluestack.io/ui/docs/components/tabs)               |
| `Accordion`   | Expand/collapse sections                                               | [/components/accordion](https://v5.gluestack.io/ui/docs/components/accordion)     |
| `Portal`      | Render outside normal hierarchy                                        | [/components/portal](https://v5.gluestack.io/ui/docs/components/portal)           |

## Data Display

| Component            | Use for                                                         | Docs                                                                                |
| -------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `Avatar`             | User/profile images                                             | [/components/avatar](https://v5.gluestack.io/ui/docs/components/avatar)             |
| `Badge`              | Status indicators, counts                                       | [/components/badge](https://v5.gluestack.io/ui/docs/components/badge)               |
| `Table`              | Tabular data (rare on mobile — prefer FlashList for large data) | [/components/table](https://v5.gluestack.io/ui/docs/components/table)               |
| `Image`              | Images                                                          | [/components/image](https://v5.gluestack.io/ui/docs/components/image)               |
| `ImageViewer`        | Gesture-enabled image viewing                                   | [/components/image-viewer](https://v5.gluestack.io/ui/docs/components/image-viewer) |
| `Icon` (with Lucide) | Iconography — per project rules                                 | [/components/icon](https://v5.gluestack.io/ui/docs/components/icon)                 |
| `LiquidGlass`        | Glass-effect surface (built on `expo-glass-effect`)             | [/components/liquid-glass](https://v5.gluestack.io/ui/docs/components/liquid-glass) |

## Hooks

| Hook                 | Use for                    | Docs                                                                                        |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------- |
| `useBreakpointValue` | Responsive value switching | [/hooks/use-break-point-value](https://v5.gluestack.io/ui/docs/hooks/use-break-point-value) |
| `useMediaQuery`      | Responsive conditionals    | [/hooks/use-media-query](https://v5.gluestack.io/ui/docs/hooks/use-media-query)             |

## Theming

- Theme is CSS-first: tokens defined in `global.css` under `@theme inline`, shadcn-inspired semantic tokens.
- Dark mode: handled via Tailwind dark mode + gluestack theme dark values — see [Dark Mode guide](https://v5.gluestack.io/ui/docs/home/theme-configuration/dark-mode).
- Never hand-roll color values — check [Default Tokens](https://v5.gluestack.io/ui/docs/home/theme-configuration/default-tokens) and [Customizing Theme](https://v5.gluestack.io/ui/docs/home/theme-configuration/customizing-theme) first.

## Not in this list?

Before building custom: check [All Components](https://v5.gluestack.io/ui/docs/components/all-components) — 30+ components exist, this table covers the ones this project uses most. If genuinely missing, build in `components/custom/` composing the primitives above.

## Note on the MCP Server

gluestack publishes an MCP server for codebase generation, but it currently targets **gluestack-ui v2**, not v5 — don't wire it in for this project without confirming v5 support first.

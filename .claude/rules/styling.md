# Styling

## Tailwind CSS — Utility-First

**IMPORTANT:** Use Tailwind utility classes exclusively. No inline styles unless absolutely necessary. No separate CSS files per component.

## PDCL Brand Palette

| Token | Value | Usage |
|-------|-------|-------|
| `PDCL-green` | `#006642` | Primary brand color, headers, CTAs |
| `PDCL-green-light` | `#00984a` | Hover states, accents |
| `secondary` | `#01DF74` | Secondary accent |
| `tertiary` | `#151030` | Dark backgrounds |

## Font

- **Ubuntu** font family (`font-ubuntu` utility)
- Imported via `@fontsource/ubuntu`

## Custom Utilities

- `.gradient-alt-flow` — animated gradient text (PDCL green → cyan)
- `.gradient-sidebar-flow` — sidebar gradient text
- `.glass` / `.glass-dark` / `.glass-medical` — glassmorphism effects
- `.hover-lift` / `.hover-lift-lg` — interactive lift on hover
- `.emergency-pulse` — pulsing emergency indicator
- `.scroll-fade` + `.is-visible` — scroll-triggered fade-in

## Shadows

Use depth scale for elevation: `shadow-depth-1` through `shadow-depth-5`.
Special: `shadow-glass`, `shadow-medical`, `shadow-emergency`.

## Animations

Available: `animate-blob`, `animate-upDown`, `animate-float`, `animate-shimmer`, `animate-fadeIn`, `animate-slideIn`, `animate-glow`.

## Responsive

- Mobile-first approach
- Custom breakpoint: `xs: 300px` for extra-small screens
- Safe area insets configured for mobile viewports

## Rules

- Use Tailwind's spacing scale consistently — avoid arbitrary values
- Responsive: `xs:` → `sm:` → `md:` → `lg:` → `xl:`
- Use `clsx` for conditional class composition
- Global styles in `src/index.css` and `src/App.css`

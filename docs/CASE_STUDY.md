# UI Forge — Product Case Study

## Overview

UI Forge is a focused design-system laboratory that lets a user shape visual foundations and judge them against a realistic product immediately. It was created as a portfolio project to demonstrate that frontend quality is not limited to attractive components: a system must remain coherent through navigation, dense data, forms, feedback, responsive layouts, accessibility checks, persistence, and developer handoff.

## The challenge

Token editors often show isolated buttons, swatches, or typography samples. Those views make individual values easy to inspect but make it difficult to answer the more important question: does the system work as a product?

UI Forge addresses that gap with one continuous workflow:

1. Choose a visual foundation.
2. Edit semantic design tokens.
3. Observe a complete application react in real time.
4. Test alternate modes, viewports, and interface states.
5. Audit contrast combinations.
6. Save, share, or export the result.

## Product direction

The interface follows an industrial design-lab direction. Near-black working surfaces keep attention on the live specimen, while ember accents identify primary actions and active tooling. Monospaced metadata, numbered sections, calibration lines, and restrained glow effects create the feeling of an instrument rather than a generic dashboard.

Northstar, the fictional product inside the preview, intentionally uses a quieter visual language. This separation makes it clear which interface belongs to the tool and which belongs to the theme being evaluated.

## Core experience

### Theme construction

The editor covers colors, typography, radii, spacing, shadows, and control dimensions. Six presets provide distinct starting points rather than superficial palette swaps. Light and dark modes are independent theme objects, so the user can make deliberate decisions for each environment.

### Live product specimen

The preview includes a sidebar, dashboard, metrics, project table, team view, form dialog, dropdown menu, alerts, notifications, loading skeleton, empty state, and recoverable error state. Desktop, tablet, and mobile frames expose layout weaknesses before export.

### Accessibility lab

Semantic foreground and background pairs are evaluated against WCAG contrast thresholds. Results distinguish normal text, large text, and interface requirements and return the user directly to the color editor when a combination needs work.

### Persistence and sharing

The browser stores a versioned project library with migration support. Projects can be duplicated, archived, restored, and switched without a backend. Share links contain a validated theme snapshot and require explicit import, preventing received data from replacing local work.

### Developer handoff

CSS variables, structured JSON, and Tailwind v4 CSS-first themes can be copied or downloaded for one mode or both. Exported filenames are safe, manifests expose size and line count, and light/dark Tailwind tokens switch through the same semantic utility names.

## Technical architecture

UI Forge uses React and TypeScript with a reducer-centered theme domain. Pure modules own serialization, storage migration, contrast calculations, share validation, and export generation. Components focus on rendering and interaction, while native CSS holds the product's design tokens and responsive behavior.

No component framework, animation library, remote API, or paid service is required. This keeps the demo deterministic, fast to install, and independent of runtime network calls once it has been served.

## Reliability and accessibility

- Dialog focus moves to the active task and returns to its trigger.
- Background scroll is locked while overlays are open.
- Keyboard navigation and visible focus treatments are preserved.
- Reduced-motion preferences collapse transitions and animations.
- Destructive recovery requires an explicit two-step confirmation.
- A root error boundary protects the page with a branded recovery state.
- Invalid public routes receive a useful, responsive 404 page.
- Automated tests cover persistence, migrations, permissions-like safeguards, history, exports, sharing, and critical interactions.
- Axe audits the workspace and handoff dialogs against automated WCAG A and AA rules on desktop and mobile.
- Lighthouse budgets prevent regressions in performance, accessibility, best practices, SEO, and Core Web Vitals.

The final production audit reached 100 in all four Lighthouse categories. FCP measured 1.4 s, LCP 1.7 s, TBT 0 ms, CLS 0, and Speed Index 1.4 s. A mobile viewport initialization shift discovered during the audit was removed before release.

## Deployment strategy

The application is a static Vite build deployed through GitHub Actions to GitHub Pages. The pipeline installs locked dependencies, runs linting, unit tests, Playwright journeys, Axe audits, and Lighthouse budgets, builds with the repository subpath, uploads only the production artifact, and deploys through the protected `github-pages` environment.

No secrets or runtime environment variables are required.

## Outcome

The result is a cohesive product that demonstrates visual design, frontend architecture, state modeling, accessibility judgment, responsive strategy, safe local persistence, serialization, and production delivery in one interface.

The strongest product decision was to make every token prove itself inside a complete application. That turns UI Forge from a style configurator into a practical system-evaluation tool.

## Future opportunities

- Optional authenticated cloud synchronization.
- Team workspaces with roles and project ownership.
- Versioned theme releases and visual diffs.
- Framework adapters beyond CSS, JSON, and Tailwind.
- Automated accessibility recommendations with user-controlled fixes.

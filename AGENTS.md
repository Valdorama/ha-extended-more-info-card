# Agent Guidelines: Home Assistant Extended More-Info Card

This document provides crucial context, architectural guidelines, and design principles for any AI Agent or Developer working on this codebase. **Read this thoroughly before making changes.**

## 1. Core Design Principle: Native UI Parity
The absolute highest priority for this project is that **the custom card must look and feel exactly like the built-in, native Home Assistant `more-info` dialog**. 

When adding features, modifying the header, or changing layouts:
- **Do not invent new UX patterns.** 
- **Mimic native spacing, typography, and colors** using Home Assistant's standard CSS variables (e.g., `var(--primary-text-color)`, `var(--secondary-text-color)`).
- **Match native icons exactly.** Look at how Home Assistant does it. For example, use `mdiHistory` for history, `mdiCog` for settings, and standard list item icons like `mdiInformationOutline` for "Related".

## 2. Architecture & Tech Stack
- **Framework:** [LitElement (lit)](https://lit.dev/). All DOM manipulation and reactivity should use Lit's declarative `html` templates and reactive `@property`/`@state` decorators.
- **Language:** TypeScript exactly. Strict typing is preferred.
- **Build Tool:** Rollup. The configuration (`rollup.config.js`) bundles everything into a single, dependency-free file `dist/extended-more-info-card.js`.
- **Package Manager:** npm. Use `npm run build` to compile the TypeScript to the `dist/` folder.

## 3. Important Home Assistant Frontend Components
Whenever possible, use Home Assistant's internal custom web components rather than building from scratch. This ensures theme compatibility and native feel.

**Frequently used HA components in this project:**
- `<ha-dialog-header>`: The core header container for the popup.
- `<more-info-content>`: The native element that asks HA to render the correct domain-specific controls (e.g., light brightness slider, fan speed selector).
- `<ha-icon-button>`: For top-level header actions. Use `.path=${mdiIcon}`.
- `<ha-button-menu>` / `<ha-list-item>`: Use these for dropdown menus (like the "More options" vertical dots menu).
- `<ha-svg-icon>`: Used within list items or other non-button areas for rendering `@mdi/js` paths.

**Editor Components (used in `src/extended-more-info-card-editor.ts`):**
- `<ha-entity-picker>`: For entity selection. **Note:** This element is lazy-loaded by HA. Ensure `loadCardHelpers()` is called in `connectedCallback` before attempting to render it.
- `<ha-textfield>`, `<ha-switch>`, `<ha-formfield>`: Standard form controls for the visual editor.

*Reference for HA Frontend Core:* [HA Frontend GitHub Repository](https://github.com/home-assistant/frontend) (Look in `src/components/` and `src/dialogs/more-info/` for inspiration).

## 4. Known Limitations & Quirks
- **Context-Aware Templating Restrictions**: This card is specifically designed to be used inside `browser_mod` popups as an override for the default `more-info` behavior. Because `browser_mod` does not pass the "triggering" entity ID down to the custom card's configuration, **we cannot dynamically infer the entity based on where the UI was clicked.** The target `entity` must be explicitly defined in the YAML configuration.
- **HACS Integration**: This repository is structured for HACS custom repository integration. `hacs.json` points to the `dist/` folder (`"content_in_root": false`). You **must commit the `dist/extended-more-info-card.js` file** to version control so HACS can pull the compiled JavaScript directly without a build step.

## 5. Typical Workflow
1. Modify TypeScript files in `src/`.
2. Run `npm run build`.
3. Test locally in Home Assistant (copy the `dist/` file to `www/` or push to GitHub and update via HACS).
4. Commit `src/` changes AND the updated `dist/extended-more-info-card.js`.

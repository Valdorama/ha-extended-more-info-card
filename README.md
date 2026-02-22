# Extended More-Info Card

A custom Home Assistant Lovelace card that provides a pixel-perfect replica of the native `ha-dialog-header` (close, history, settings, and kebab menu) along with the entity's default more-info controls, followed by any user-defined extra Lovelace cards.

> **Requires:** [browser_mod](https://github.com/thomasloven/hass-browser_mod) v2+  
> This card is designed *exclusively* to be used as the popup content inside a browser_mod more-info dialog override. It relies on the popup dialog context to render correctly and should not be used directly on a Lovelace dashboard.

---

## Installation

### HACS (recommended)

1. In Home Assistant, go to **HACS → Custom repositories**.
2. Add `https://github.com/Valdorama/ha-extended-more-info-card` as a **Lovelace** repository.
3. Install **Extended More-Info Card** from HACS.
4. Refresh the browser — the card will be available automatically.

### Manual

1. Download `dist/extended-more-info-card.js` from this repo.
2. Copy it to `config/www/extended-more-info-card.js`.
3. In HA → **Settings → Dashboards → Resources**, add `/local/extended-more-info-card.js` as a **JavaScript module**.

---

## Configuration

```yaml
type: custom:extended-more-info-card
entity: fan.bedroom_fan          # required — any HA entity
title: Bedroom Fan               # optional — defaults to the entity's friendly_name
show_history: true               # optional — show/hide history button (default: true)
show_settings: true              # optional — show/hide settings button (default: true)
show_related: true               # optional — show/hide kebab / related menu (default: true)
content:                         # optional — any standard Lovelace card configs
  - type: button
    name: "5 min"
    tap_action:
      action: call-service
      service: script.fan_run_timer
      data:
        fan_entity: fan.bedroom_fan
        timer_entity: timer.fan_bedroom_timer
        duration: 300
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `entity` | string | **required** | The entity ID to display controls for |
| `title` | string | entity friendly_name | Override the dialog title |
| `show_history` | bool | `true` | Show the history icon button |
| `show_settings` | bool | `true` | Show the settings icon button |
| `show_related` | bool | `true` | Show the kebab menu with Related, Device info, and Attributes options |
| `content` | list | `[]` | Standard Lovelace card configs to render below the entity controls |

---

## browser_mod setup

### Primary usage — `popup_cards` (recommended)

browser_mod's `popup_cards` feature intercepts the native more-info tap for specified entities and replaces it with your custom card. This is the primary intended use case for this card.

Add this to your `configuration.yaml`:

```yaml
browser_mod:
  popup_cards:
    fan.bedroom_fan:
      type: custom:extended-more-info-card
      entity: fan.bedroom_fan     # must be specified here as well as in popup_cards key
      content:
        - type: button
          name: "5 min"
          tap_action:
            action: call-service
            service: script.fan_run_timer
            data:
              fan_entity: fan.bedroom_fan
              timer_entity: timer.fan_bedroom_timer
              duration: 300
        - type: button
          name: "15 min"
          tap_action:
            action: call-service
            service: script.fan_run_timer
            data:
              fan_entity: fan.bedroom_fan
              timer_entity: timer.fan_bedroom_timer
              duration: 900
```

> **Why is `entity` specified twice?** browser_mod uses the top-level key (`fan.bedroom_fan`) to decide *which* entity tap to intercept, but strips that information before passing the card config to your custom element. The card therefore cannot infer the entity automatically — it must be explicitly provided in the card config as well. This is a known limitation of how browser_mod works, not a bug in this card.

For multiple entities, add a separate entry per entity:

```yaml
browser_mod:
  popup_cards:
    fan.bedroom_fan:
      type: custom:extended-more-info-card
      entity: fan.bedroom_fan
      content:
        - type: button
          name: "30 min"
          tap_action:
            action: call-service
            service: script.fan_run_timer
            data:
              fan_entity: fan.bedroom_fan
              timer_entity: timer.fan_bedroom_timer
              duration: 1800
    fan.lounge_fan:
      type: custom:extended-more-info-card
      entity: fan.lounge_fan
      content:
        - type: button
          name: "30 min"
          tap_action:
            action: call-service
            service: script.fan_run_timer
            data:
              fan_entity: fan.lounge_fan
              timer_entity: timer.fan_lounge_timer
              duration: 1800
```

### Secondary usage — `browser_mod.popup` via tap_action

You can also open the card explicitly via a card's `tap_action`:

```yaml
type: tile
entity: fan.bedroom_fan
tap_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      content:
        type: custom:extended-more-info-card
        entity: fan.bedroom_fan
        content:
          - type: button
            name: "30 min"
            tap_action:
              action: call-service
              service: script.fan_run_timer
              data:
                fan_entity: fan.bedroom_fan
                timer_entity: timer.fan_bedroom_timer
                duration: 1800
```

---

## Building from source

Requires **Node.js ≥ 18**.

```bash
npm install
npm run build        # outputs dist/extended-more-info-card.js
npm run watch        # rebuilds on file changes
```

> **Note on `dist/`:** The compiled `dist/extended-more-info-card.js` is intentionally committed to this repository so that HACS can serve it directly without requiring a CI build pipeline. If you submit a PR, please run `npm run build` and include the updated `dist/` file in your commit.

---

## License

MIT

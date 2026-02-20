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
| `show_related` | bool | `true` | Show the kebab menu with "Related" option |
| `content` | list | `[]` | Standard Lovelace card configs to render below the entity controls |

> **Note on "Related":** In recent versions of Home Assistant, the standard "Related" panel mechanism has changed and triggering it via the kebab menu may silently fail depending on your HA version.

---

## browser_mod setup

Use browser_mod to override the more-info dialog for specific entities. Example for two fans:

```yaml
# In your browser_mod config (configuration.yaml or browser_mod UI)
browser_mod:
  defaults:
    more_info_dashboard: false
  # Use a tap_action on any card to open the popup:
  #   tap_action:
  #     action: fire-dom-event
  #     browser_mod:
  #       service: browser_mod.more_info
  #       data:
  #         entity_id: fan.bedroom_fan
```

Or trigger via a card's `tap_action`:

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
          - type: button
            name: "30 min"
            tap_action:
              action: call-service
              service: script.fan_run_timer
              data:
                fan_entity: fan.bedroom_fan
                timer_entity: timer.fan_bedroom_timer
                duration: 1800
          - type: button
            name: "60 min"
            tap_action:
              action: call-service
              service: script.fan_run_timer
              data:
                fan_entity: fan.bedroom_fan
                timer_entity: timer.fan_bedroom_timer
                duration: 3600
```

---

## Building from source

Requires **Node.js ≥ 18**.

```bash
npm install
npm run build        # outputs dist/extended-more-info-card.js
npm run watch        # rebuilds on file changes
```

> **Note on `dist/`:** The `dist/` directory containing the compiled Javascript is intentionally committed to this repository. This allows users to simply add the repository to HACS and install it without requiring a GitHub Actions build release pipeline. If you make PRs, please ensure you run `npm run build` and include the updated `dist/` files.

---

## License

MIT

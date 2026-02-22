import { LitElement, html, css, type CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface HomeAssistant {
  states: Record<string, unknown>;
}

interface ExtendedMoreInfoCardConfig {
  type: string;
  entity: string;
  title?: string;
  show_history?: boolean;
  show_settings?: boolean;
  show_related?: boolean;
  content?: unknown[];
}

@customElement("extended-more-info-card-editor")
export class ExtendedMoreInfoCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: ExtendedMoreInfoCardConfig;
  @state() private _entityPickerReady = false;
  @state() private _contentJsonError: string | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._loadEntityPicker();
  }

  // -------------------------------------------------------------------------
  // Load ha-entity-picker reliably via loadCardHelpers + whenDefined
  // -------------------------------------------------------------------------

  private async _loadEntityPicker(): Promise<void> {
    if (customElements.get("ha-entity-picker")) {
      this._entityPickerReady = true;
      return;
    }
    // Trigger HA's lazy-loading machinery, then wait for the element
    await window.loadCardHelpers();
    await customElements.whenDefined("ha-entity-picker");
    this._entityPickerReady = true;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  public setConfig(config: ExtendedMoreInfoCardConfig): void {
    this._config = config;
  }

  // -------------------------------------------------------------------------
  // Getters for current config values
  // -------------------------------------------------------------------------

  get _entity(): string {
    return this._config?.entity || "";
  }

  get _title(): string {
    return this._config?.title || "";
  }

  get _show_history(): boolean {
    return this._config?.show_history !== false;
  }

  get _show_settings(): boolean {
    return this._config?.show_settings !== false;
  }

  get _show_related(): boolean {
    return this._config?.show_related !== false;
  }

  get _contentJson(): string {
    if (!this._config?.content || this._config.content.length === 0) {
      return "";
    }
    try {
      return JSON.stringify(this._config.content, null, 2);
    } catch {
      return "";
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  protected render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">

        <!-- Entity picker -->
        <div class="field">
          ${this._entityPickerReady
            ? html`
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${this._entity}
                  .configValue=${"entity"}
                  label="Entity (required)"
                  @value-changed=${this._valueChanged}
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`<p class="loading">Loading entity picker…</p>`}
        </div>

        <!-- Title -->
        <div class="field">
          <ha-textfield
            label="Title (optional — defaults to friendly name)"
            .value=${this._title}
            .configValue=${"title"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <!-- Toggles -->
        <div class="toggles">
          <ha-formfield .label=${"Show History button"}>
            <ha-switch
              .checked=${this._show_history}
              .configValue=${"show_history"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield .label=${"Show Settings button"}>
            <ha-switch
              .checked=${this._show_settings}
              .configValue=${"show_settings"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield .label=${"Show Related / kebab menu"}>
            <ha-switch
              .checked=${this._show_related}
              .configValue=${"show_related"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>

        <!-- Content cards (JSON) -->
        <div class="content-json">
          <p class="field-label"><strong>Additional content cards</strong></p>
          <p class="help-text">
            Enter a JSON array of Lovelace card configurations to render below
            the entity controls. This field uses <strong>JSON format</strong>,
            not YAML — paste YAML here and it will not be saved. Leave blank
            for no extra cards.
          </p>
          <textarea
            .value=${this._contentJson}
            .configValue=${"content"}
            placeholder='[\n  {\n    "type": "button",\n    "name": "Example"\n  }\n]'
            @input=${this._jsonChanged}
            rows="10"
          ></textarea>
          ${this._contentJsonError
            ? html`<p class="json-error">${this._contentJsonError}</p>`
            : ""}
        </div>

      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Event handlers
  // -------------------------------------------------------------------------

  private _valueChanged(ev: Event): void {
    if (!this._config || !this.hass) return;

    const target = ev.target as HTMLElement & {
      configValue?: string;
      value?: string;
      checked?: boolean;
    };

    if (!target.configValue) return;

    let newValue: string | boolean | undefined;

    if (target.configValue === "entity") {
      newValue = (ev as CustomEvent<{ value: string }>).detail.value;
    } else if (target.tagName.toLowerCase() === "ha-switch") {
      newValue = target.checked;
    } else {
      newValue = target.value;
    }

    // If the new value is an empty string, remove the key from config
    if (newValue === "") {
      const updated = { ...this._config };
      delete (updated as Record<string, unknown>)[target.configValue];
      this._config = updated as ExtendedMoreInfoCardConfig;
    } else {
      this._config = {
        ...this._config,
        [target.configValue]: newValue,
      };
    }

    this._fireConfigChanged();
  }

  private _jsonChanged(ev: Event): void {
    if (!this._config || !this.hass) return;

    const target = ev.target as HTMLTextAreaElement;
    const val = target.value.trim();

    if (val === "") {
      // Empty textarea — clear content from config
      this._contentJsonError = null;
      const updated = { ...this._config };
      delete updated.content;
      this._config = updated;
      this._fireConfigChanged();
      return;
    }

    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) {
        this._contentJsonError =
          "Must be a JSON array (starting with [ and ending with ])";
        return;
      }
      this._contentJsonError = null;
      this._config = { ...this._config, content: parsed };
      this._fireConfigChanged();
    } catch (e) {
      this._contentJsonError = `Invalid JSON — changes not saved (${(e as Error).message})`;
    }
  }

  private _fireConfigChanged(): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .field {
        display: block;
      }

      ha-entity-picker,
      ha-textfield {
        width: 100%;
        display: block;
      }

      .toggles {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .field-label {
        margin: 0 0 4px;
      }

      .help-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin: 0 0 8px;
        line-height: 1.5;
      }

      .loading {
        color: var(--secondary-text-color);
        font-size: 14px;
        margin: 0;
      }

      textarea {
        width: 100%;
        box-sizing: border-box;
        font-family: monospace;
        font-size: 12px;
        padding: 8px;
        resize: vertical;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        background: var(--card-background-color, white);
        color: var(--primary-text-color);
      }

      .json-error {
        margin: 4px 0 0;
        font-size: 12px;
        color: var(--error-color, #db4437);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "extended-more-info-card-editor": ExtendedMoreInfoCardEditor;
  }
}

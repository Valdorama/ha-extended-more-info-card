import { LitElement, html, css, type CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface HomeAssistant {
    states: Record<string, any>;
}

interface ExtendedMoreInfoCardConfig {
    type: string;
    entity: string;
    title?: string;
    show_history?: boolean;
    show_settings?: boolean;
    show_related?: boolean;
    content?: any[];
}

@customElement("extended-more-info-card-editor")
export class ExtendedMoreInfoCardEditor extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @state() private _config?: ExtendedMoreInfoCardConfig;

    public setConfig(config: ExtendedMoreInfoCardConfig): void {
        this._config = config;
    }

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

    get _contentYaml(): string {
        if (!this._config?.content || this._config.content.length === 0) {
            return "";
        }
        // Very basic YAML serialization for array of objects.
        // In a real HA environment, you might use a proper YAML library if available,
        // or rely on the user to format it correctly. For simple card configs, JSON.stringify
        // formatted is often an acceptable fallback if true YAML isn't strictly required,
        // but the HA standard is to provide a raw textarea for complex objects.
        try {
            // We use JSON here as a placeholder for a true YAML dumper since we don't have js-yaml bundled.
            // HA's built-in YAML editor is much better, but complex to embed.
            return JSON.stringify(this._config.content, null, 2);
        } catch (e) {
            return "";
        }
    }

    protected render() {
        if (!this.hass || !this._config) {
            return html``;
        }

        return html`
      <div class="card-config">
        <div class="side-by-side">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._entity}
            .configValue=${"entity"}
            @value-changed=${this._valueChanged}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="side-by-side">
          <ha-textfield
            label="Title (Optional)"
            .value=${this._title}
            .configValue=${"title"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="toggles">
          <ha-formfield .label=${"Show History"}>
            <ha-switch
              .checked=${this._show_history}
              .configValue=${"show_history"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield .label=${"Show Settings"}>
            <ha-switch
              .checked=${this._show_settings}
              .configValue=${"show_settings"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield .label=${"Show Related"}>
            <ha-switch
              .checked=${this._show_related}
              .configValue=${"show_related"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
        
        <div class="content-yaml">
            <p><strong>Content Cards (JSON format for now):</strong></p>
            <p class="help-text">Define additional child cards to render below the entity controls. Since full YAML embedding is complex, please provide a valid JSON array of Lovelace card configurations here or use the raw YAML editor.</p>
            <textarea
                .value=${this._contentYaml}
                .configValue=${"content"}
                @input=${this._yamlChanged}
                rows="10"
            ></textarea>
        </div>
      </div>
    `;
    }

    private _valueChanged(ev: any): void {
        if (!this._config || !this.hass) {
            return;
        }
        const target = ev.target;

        // Use type assertion for dynamic property access on 'this'
        const currentValue = (this as any)[`_${target.configValue}`];

        if (currentValue === target.value) {
            return;
        }

        let newValue: any;
        if (target.configValue === 'entity') {
            newValue = ev.detail.value;
        } else if (target.tagName.toLowerCase() === 'ha-switch') {
            newValue = target.checked;
        } else {
            newValue = target.value;
        }

        if (target.configValue) {
            if (newValue === "") {
                const tmpConfig = { ...this._config };
                // Use type assertion for dynamic property deletion
                delete (tmpConfig as any)[target.configValue];
                this._config = tmpConfig;
            } else {
                this._config = {
                    ...this._config,
                    [target.configValue]: newValue,
                };
            }
        }

        this._fireChangedEvent();
    }

    private _yamlChanged(ev: any): void {
        if (!this._config || !this.hass) return;
        const target = ev.target;
        const val = target.value;

        try {
            let newContent = undefined;
            if (val.trim() !== "") {
                newContent = JSON.parse(val);
            }

            this._config = {
                ...this._config,
                content: newContent
            };
            this._fireChangedEvent();
        } catch (e) {
            // Invalid JSON, don't update config yet to prevent breaking the preview.
            // In a real editor we'd show a validation error message.
        }
    }

    private _fireChangedEvent() {
        this.dispatchEvent(
            new CustomEvent("config-changed", {
                detail: { config: this._config },
                bubbles: true,
                composed: true,
            })
        );
    }

    static get styles(): CSSResultGroup {
        return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .side-by-side {
        display: flex;
        flex-direction: column;
      }
      .toggles {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
      }
      .content-yaml p {
          margin: 0 0 4px 0;
      }
      .help-text {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-bottom: 8px !important;
      }
      textarea {
          width: 100%;
          box-sizing: border-box;
          font-family: monospace;
          padding: 8px;
          resize: vertical;
      }
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "extended-more-info-card-editor": ExtendedMoreInfoCardEditor;
    }
}

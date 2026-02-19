import {
    LitElement,
    html,
    css,
    type CSSResultGroup,
    type PropertyValues,
} from "lit";
import { property, state } from "lit/decorators.js";
import { mdiClose, mdiChartTimeline, mdiCog, mdiDotsVertical } from "@mdi/js";

// ---------------------------------------------------------------------------
// Type declarations for HA globals that exist at runtime but have no npm types
// ---------------------------------------------------------------------------

type CustomCardEntry = {
    type: string;
    name: string;
    description: string;
};

declare global {
    interface Window {
        loadCardHelpers(): Promise<{
            createCardElement(config: LovelaceCardConfig): LovelaceCard;
        }>;
        customCards?: CustomCardEntry[];
    }
}

interface HomeAssistant {
    states: Record<string, HassEntity>;
}

interface HassEntity {
    entity_id: string;
    state: string;
    attributes: Record<string, unknown>;
}

interface LovelaceCardConfig {
    type: string;
    [key: string]: unknown;
}

interface LovelaceCard extends HTMLElement {
    hass?: HomeAssistant;
    setConfig(config: LovelaceCardConfig): void;
}

// ---------------------------------------------------------------------------
// Card configuration interface
// ---------------------------------------------------------------------------

interface ExtendedMoreInfoCardConfig {
    entity: string;
    title?: string;
    show_history?: boolean;
    show_settings?: boolean;
    show_related?: boolean;
    content?: LovelaceCardConfig[];
}

// ---------------------------------------------------------------------------
// Main card element
// ---------------------------------------------------------------------------

class ExtendedMoreInfoCard extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;

    @state() private _config?: ExtendedMoreInfoCardConfig;
    @state() private _childCards: LovelaceCard[] = [];
    @state() private _contextError = false;

    // -------------------------------------------------------------------------
    // LitElement lifecycle
    // -------------------------------------------------------------------------

    connectedCallback(): void {
        super.connectedCallback();
        // Defer context check one microtask so the shadow DOM is fully composed.
        Promise.resolve().then(() => {
            this._contextError = !this._isInBrowserModPopup();
        });
    }

    updated(changed: PropertyValues): void {
        if (changed.has("hass") && this.hass) {
            // Keep hass up-to-date on child cards.
            for (const card of this._childCards) {
                card.hass = this.hass;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Public API (required by Lovelace)
    // -------------------------------------------------------------------------

    public setConfig(config: ExtendedMoreInfoCardConfig): void {
        if (!config.entity) {
            throw new Error("extended-more-info-card: 'entity' is required.");
        }
        this._config = {
            show_history: true,
            show_settings: true,
            show_related: true,
            ...config,
        };
        this._initChildCards(config.content ?? []);
    }

    // Allow the editor (and HA) to query card size.
    public getCardSize(): number {
        return 3;
    }

    // -------------------------------------------------------------------------
    // Child card initialisation
    // -------------------------------------------------------------------------

    private async _initChildCards(
        configs: LovelaceCardConfig[]
    ): Promise<void> {
        if (configs.length === 0) {
            this._childCards = [];
            return;
        }
        const helpers = await window.loadCardHelpers();
        this._childCards = configs.map((cfg) => {
            const el = helpers.createCardElement(cfg);
            if (this.hass) el.hass = this.hass;
            return el;
        });
        // Trigger a re-render so the new cards appear.
        this.requestUpdate();
    }

    // -------------------------------------------------------------------------
    // Context detection — must be inside a browser-mod-popup shadow tree
    // -------------------------------------------------------------------------

    private _isInBrowserModPopup(): boolean {
        let node: Node | null = this.getRootNode();
        while (node instanceof ShadowRoot) {
            if (
                node.host?.tagName?.toLowerCase() === "browser-mod-popup"
            ) {
                return true;
            }
            node = node.host.getRootNode();
        }
        return false;
    }

    // -------------------------------------------------------------------------
    // Event handlers
    // -------------------------------------------------------------------------

    private _close(): void {
        // browser_mod v2 fire-dom-event mechanism to close the current popup.
        this.dispatchEvent(
            new CustomEvent("ll-custom", {
                bubbles: true,
                composed: true,
                detail: {
                    browser_mod: {
                        service: "browser_mod.close_popup",
                        data: {},
                    },
                },
            })
        );
    }

    private _showView(view: string): void {
        if (!this._config) return;
        this.dispatchEvent(
            new CustomEvent("hass-more-info", {
                bubbles: true,
                composed: true,
                detail: { entityId: this._config.entity, view },
            })
        );
    }

    // -------------------------------------------------------------------------
    // Rendering
    // -------------------------------------------------------------------------

    protected render() {
        if (this._contextError) {
            return html`
        <ha-card>
          <div class="error">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <p>
              <strong>extended-more-info-card</strong> must be used inside a
              <strong>browser_mod</strong> popup. It cannot be placed directly
              on a dashboard.
            </p>
          </div>
        </ha-card>
      `;
        }

        if (!this._config || !this.hass) return html``;

        const stateObj = this.hass.states[this._config.entity];
        const title =
            this._config.title ??
            (stateObj?.attributes?.friendly_name as string | undefined) ??
            this._config.entity;

        const showHistory = this._config.show_history !== false;
        const showSettings = this._config.show_settings !== false;
        const showRelated = this._config.show_related !== false;

        return html`
      <ha-dialog-header>
        <!-- Close button (left / navigationIcon slot) -->
        <ha-icon-button
          slot="navigationIcon"
          .path=${mdiClose}
          .label=${"Close"}
          @click=${this._close}
        ></ha-icon-button>

        <!-- Title -->
        <span slot="title">${title}</span>

        <!-- Right-side action buttons -->
        ${showHistory
                ? html`
              <ha-icon-button
                slot="actionItems"
                .path=${mdiChartTimeline}
                .label=${"History"}
                @click=${() => this._showView("history")}
              ></ha-icon-button>
            `
                : ""}
        ${showSettings
                ? html`
              <ha-icon-button
                slot="actionItems"
                .path=${mdiCog}
                .label=${"Settings"}
                @click=${() => this._showView("settings")}
              ></ha-icon-button>
            `
                : ""}
        ${showRelated
                ? html`
              <ha-button-menu slot="actionItems" corner="BOTTOM_START">
                <ha-icon-button
                  slot="trigger"
                  .path=${mdiDotsVertical}
                  .label=${"More options"}
                ></ha-icon-button>
                <mwc-list-item @click=${() => this._showView("related")}>
                  Related
                </mwc-list-item>
              </ha-button-menu>
            `
                : ""}
      </ha-dialog-header>

      <!-- Default entity controls (HA routes by domain automatically) -->
      <more-info-content
        .hass=${this.hass}
        .entityId=${this._config.entity}
        .stateObj=${stateObj}
      ></more-info-content>

      <!-- User-defined extra cards -->
      ${this._childCards.length > 0
                ? html`
            <div class="extended-content">
              ${this._childCards}
            </div>
          `
                : ""}
    `;
    }

    // -------------------------------------------------------------------------
    // Styles
    // -------------------------------------------------------------------------

    static get styles(): CSSResultGroup {
        return css`
      :host {
        display: block;
      }

      ha-dialog-header {
        display: block;
      }

      more-info-content {
        display: block;
        padding: 0 24px;
      }

      .extended-content {
        display: block;
        padding: 8px 24px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .error {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        color: var(--error-color, #db4437);
      }

      .error ha-icon {
        flex-shrink: 0;
        --mdc-icon-size: 24px;
      }

      .error p {
        margin: 0;
        line-height: 1.5;
      }
    `;
    }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
customElements.define("extended-more-info-card", ExtendedMoreInfoCard as any);

// Announce the card to the Lovelace card picker (optional but good practice).
window.customCards = window.customCards ?? [];
window.customCards.push({
    type: "extended-more-info-card",
    name: "Extended More-Info Card",
    description:
        "Extends the HA more-info dialog with a configurable ha-dialog-header and additional Lovelace cards below the entity controls. Requires browser_mod.",
});

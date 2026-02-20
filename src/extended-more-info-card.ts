import {
  LitElement,
  html,
  css,
  type CSSResultGroup,
  type PropertyValues,
} from "lit";
import { property, state } from "lit/decorators.js";
import { mdiClose, mdiHistory, mdiCog, mdiDotsVertical, mdiRayVertex, mdiInformationOutline } from "@mdi/js";

// Include the editor
import "./extended-more-info-card-editor";

// Console badge
console.info(
  `%c EXTENDED-MORE-INFO-CARD %c 0.1.0 `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);

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
  entities: Record<string, EntityRegistryEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  areas: Record<string, AreaRegistryEntry>;
}

interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

interface EntityRegistryEntry {
  entity_id: string;
  device_id?: string;
  area_id?: string;
}

interface DeviceRegistryEntry {
  id: string;
  name?: string;
  name_by_user?: string;
  area_id?: string;
}

interface AreaRegistryEntry {
  area_id: string;
  name: string;
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

  // -------------------------------------------------------------------------
  // LitElement lifecycle
  // -------------------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
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

  // Return the custom editor element
  public static getConfigElement(): HTMLElement {
    return document.createElement("extended-more-info-card-editor");
  }

  // Provide default configuration for new cards created in UI
  public static getStubConfig(): Record<string, unknown> {
    return {
      entity: "",
      show_history: true,
      show_settings: true,
      show_related: true,
    };
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

  private _getSubtitle(): string | undefined {
    if (!this.hass || !this._config) return undefined;

    const entityId = this._config.entity;
    const entityRegistry = this.hass.entities?.[entityId];

    let areaId = entityRegistry?.area_id;
    let deviceName: string | undefined;
    let areaName: string | undefined;

    if (entityRegistry?.device_id) {
      const device = this.hass.devices?.[entityRegistry.device_id];
      if (device) {
        deviceName = device.name_by_user || device.name;
        // Fallback to device's area if entity doesn't explicitly have one
        if (!areaId) {
          areaId = device.area_id;
        }
      }
    }

    if (areaId) {
      const area = this.hass.areas?.[areaId];
      if (area) {
        areaName = area.name;
      }
    }

    if (areaName && deviceName) {
      return `${areaName} > ${deviceName}`;
    } else if (deviceName) {
      return deviceName;
    } else if (areaName) {
      return areaName;
    }

    return undefined;
  }

  protected render() {
    if (!this._config || !this.hass) return html``;

    const stateObj = this.hass.states[this._config.entity];
    const title =
      this._config.title ??
      (stateObj?.attributes?.friendly_name as string | undefined) ??
      this._config.entity;

    const subtitle = this._getSubtitle();

    const showHistory = this._config.show_history !== false;
    const showSettings = this._config.show_settings !== false;
    const showRelated = this._config.show_related !== false;
    const hasDevice = !!this.hass.entities?.[this._config.entity]?.device_id;

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
        <div slot="title" class="title-container">
            ${subtitle ? html`<div class="subtitle">${subtitle}</div>` : ""}
            <div class="main-title">${title}</div>
        </div>

        <!-- Right-side action buttons -->
        ${showHistory
        ? html`
              <ha-icon-button
                slot="actionItems"
                .path=${mdiHistory}
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
        ${showRelated || hasDevice
        ? html`
              <ha-button-menu slot="actionItems" corner="BOTTOM_START">
                <ha-icon-button
                  slot="trigger"
                  .path=${mdiDotsVertical}
                  .label=${"More options"}
                ></ha-icon-button>
                ${hasDevice
            ? html`
                      <ha-list-item graphic="icon" @click=${() => this._showView("device_info")}>
                        <ha-svg-icon slot="graphic" .path=${mdiInformationOutline}></ha-svg-icon>
                        Device info
                      </ha-list-item>
                    `
            : ""}
                ${showRelated
            ? html`
                      <ha-list-item graphic="icon" @click=${() => this._showView("related")}>
                        <ha-svg-icon slot="graphic" .path=${mdiRayVertex}></ha-svg-icon>
                        Related
                      </ha-list-item>
                    `
            : ""}
              </ha-button-menu>
            `
        : ""}
      </ha-dialog-header>

      <!-- Default entity controls (HA routes by domain automatically) -->
      <more-info-content
        .hass=${this.hass}
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

      .extended-content {
        display: block;
        padding: 8px 24px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .title-container {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 14px;
        color: var(--secondary-text-color);
        font-weight: 400;
        margin-bottom: 2px;
      }

      .main-title {
        font-size: 20px;
        font-weight: 400;
        color: var(--primary-text-color);
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

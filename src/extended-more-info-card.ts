import {
  LitElement,
  html,
  css,
  type CSSResultGroup,
  type PropertyValues,
} from "lit";
import { property, state } from "lit/decorators.js";
import {
  mdiClose,
  mdiChartBoxOutline,
  mdiCogOutline,
  mdiDotsVertical,
  mdiInformationOutline,
  mdiFormatListBulletedSquare,
  mdiTransitConnectionVariant,
  mdiDevices,
} from "@mdi/js";

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
  entry_type?: "service" | null;
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

  private _computeShownAttributes(stateObj: HassEntity): string[] {
    const STATE_ATTRIBUTES = [
      "entity_id",
      "assumed_state",
      "attribution",
      "custom_ui_more_info",
      "custom_ui_state_card",
      "device_class",
      "editable",
      "emulated_hue_name",
      "emulated_hue",
      "entity_picture",
      "event_types",
      "friendly_name",
      "haaska_hidden",
      "haaska_name",
      "icon",
      "initial_state",
      "last_reset",
      "restored",
      "state_class",
      "supported_features",
      "unit_of_measurement",
      "available_tones",
    ];
    const filtersArray = STATE_ATTRIBUTES;
    return Object.keys(stateObj.attributes).filter(
      (key) => filtersArray.indexOf(key) === -1
    );
  }

  private _hasDisplayableAttributes(): boolean {
    if (!this.hass || !this._config) return false;
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) return false;
    return this._computeShownAttributes(stateObj).length > 0;
  }

  private _handleMenuAction(ev: CustomEvent) {
    const action = (ev.detail as any).item?.value;
    switch (action) {
      case "device":
        this._showView("device_info");
        break;
      case "related":
        this._showView("related");
        break;
      case "attributes":
        this._showView("attributes");
        break;
    }
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
    const entityRegistry = this.hass.entities?.[this._config.entity];
    const deviceId = entityRegistry?.device_id;
    const hasDevice = !!deviceId;
    const deviceType = (deviceId && this.hass.devices?.[deviceId]?.entry_type) || "device";

    return html`
      <ha-dialog-header>
        <!-- Close button (left / navigationIcon slot) -->
        <ha-icon-button
          slot="navigationIcon"
          .path=${mdiClose}
          .label=${"Close"}
          @click=${this._close}
        ></ha-icon-button>

        <!-- Title and Subtitle -->
        <span slot="title">${title}</span>
        ${subtitle ? html`<span slot="subtitle">${subtitle}</span>` : ""}

        <!-- Right-side action buttons -->
        ${showHistory
          ? html`
              <ha-icon-button
                slot="actionItems"
                .path=${mdiChartBoxOutline}
                .label=${"History"}
                @click=${() => this._showView("history")}
              ></ha-icon-button>
            `
          : ""}
        ${showSettings
          ? html`
              <ha-icon-button
                slot="actionItems"
                .path=${mdiCogOutline}
                .label=${"Settings"}
                @click=${() => this._showView("settings")}
              ></ha-icon-button>
            `
          : ""}
        ${showRelated || hasDevice || this._hasDisplayableAttributes()
          ? html`
              <ha-dropdown
                slot="actionItems"
                @wa-select=${this._handleMenuAction}
                placement="bottom-end"
              >
                <ha-icon-button
                  slot="trigger"
                  .path=${mdiDotsVertical}
                  .label=${"More options"}
                ></ha-icon-button>
                ${hasDevice
                  ? html`
                      <ha-dropdown-item value="device">
                        <ha-svg-icon
                          slot="icon"
                          .path=${deviceType === "service" ? mdiTransitConnectionVariant : mdiDevices}
                        ></ha-svg-icon>
                        Device info
                      </ha-dropdown-item>
                    `
                  : ""}
                ${showRelated
                  ? html`
                      <ha-dropdown-item value="related">
                        <ha-svg-icon slot="icon" .path=${mdiInformationOutline}></ha-svg-icon>
                        Related
                      </ha-dropdown-item>
                    `
                  : ""}
                ${this._hasDisplayableAttributes()
                  ? html`
                      <ha-dropdown-item value="attributes">
                        <ha-svg-icon slot="icon" .path=${mdiFormatListBulletedSquare}></ha-svg-icon>
                        Attributes
                      </ha-dropdown-item>
                    `
                  : ""}
              </ha-dropdown>
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

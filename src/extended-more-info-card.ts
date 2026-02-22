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
  mdiArrowLeft,
} from "@mdi/js";

// Include the editor
import "./extended-more-info-card-editor";

// Console badge
console.info(
  `%c EXTENDED-MORE-INFO-CARD %c 0.1.2 `,
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
// View type
// ---------------------------------------------------------------------------

type CardView = "info" | "history" | "settings" | "related" | "attributes";

// ---------------------------------------------------------------------------
// Main card element
// ---------------------------------------------------------------------------

class ExtendedMoreInfoCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ExtendedMoreInfoCardConfig;
  @state() private _childCards: LovelaceCard[] = [];
  @state() private _view: CardView = "info";
  @state() private _settingsReady = false;
  @state() private _attributesReady = false;

  // -------------------------------------------------------------------------
  // LitElement lifecycle
  // -------------------------------------------------------------------------

  updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) {
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

  public getCardSize(): number {
    return 3;
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement("extended-more-info-card-editor");
  }

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
    this.requestUpdate();
  }

  // -------------------------------------------------------------------------
  // Lazy-load HA sub-view components before switching to them
  // -------------------------------------------------------------------------

  private async _ensureSettingsReady(): Promise<void> {
    if (this._settingsReady) return;
    await customElements.whenDefined("ha-more-info-settings");
    this._settingsReady = true;
  }

  private async _ensureAttributesReady(): Promise<void> {
    if (this._attributesReady) return;
    await customElements.whenDefined("ha-more-info-attributes");
    this._attributesReady = true;
  }

  // -------------------------------------------------------------------------
  // Event handlers
  // -------------------------------------------------------------------------

  private _close(): void {
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

  private _goBack(): void {
    this._view = "info";
  }

  private async _showView(view: CardView): Promise<void> {
    // Ensure lazy-loaded components are defined before switching view
    if (view === "settings") await this._ensureSettingsReady();
    if (view === "attributes") await this._ensureAttributesReady();
    this._view = view;
  }

  private _navigateToDevice(deviceId: string): void {
    // Close the browser_mod popup first, then navigate to the device page
    this._close();
    setTimeout(() => {
      history.pushState(null, "", `/config/devices/device/${deviceId}`);
      window.dispatchEvent(new CustomEvent("location-changed"));
    }, 50);
  }

  private _handleMenuAction(ev: CustomEvent): void {
    const action = (ev.detail as { item?: { value?: string } }).item?.value;
    if (!this._config) return;

    const entityRegistry = this.hass?.entities?.[this._config.entity];
    const deviceId = entityRegistry?.device_id;

    switch (action) {
      case "device":
        if (deviceId) this._navigateToDevice(deviceId);
        break;
      case "related":
        this._showView("related");
        break;
      case "attributes":
        this._showView("attributes");
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Rendering helpers
  // -------------------------------------------------------------------------

  private _getSubtitleData() {
    if (!this.hass || !this._config) return undefined;

    const entityId = this._config.entity;
    const entityRegistry = this.hass.entities?.[entityId];

    let areaId = entityRegistry?.area_id;
    const deviceId = entityRegistry?.device_id;
    let deviceName: string | undefined;
    let areaName: string | undefined;

    if (deviceId) {
      const device = this.hass.devices?.[deviceId];
      if (device) {
        deviceName = device.name_by_user || device.name;
        if (!areaId) areaId = device.area_id;
      }
    }

    if (areaId) {
      const area = this.hass.areas?.[areaId];
      if (area) areaName = area.name;
    }

    return { areaName, areaId, deviceName, deviceId };
  }

  private _hasDisplayableAttributes(): boolean {
    if (!this.hass || !this._config) return false;
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) return false;
    // Exclude internal/meta attributes that HA always hides
    const STATE_ATTRIBUTES = [
      "entity_id", "assumed_state", "attribution", "custom_ui_more_info",
      "custom_ui_state_card", "device_class", "editable", "emulated_hue_name",
      "emulated_hue", "entity_picture", "event_types", "friendly_name",
      "haaska_hidden", "haaska_name", "icon", "initial_state", "last_reset",
      "restored", "state_class", "supported_features", "unit_of_measurement",
      "available_tones",
    ];
    return Object.keys(stateObj.attributes).some(
      (key) => !STATE_ATTRIBUTES.includes(key)
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  protected render() {
    if (!this._config || !this.hass) return html``;

    const stateObj = this.hass.states[this._config.entity];
    const title =
      this._config.title ??
      (stateObj?.attributes?.friendly_name as string | undefined) ??
      this._config.entity;

    const subtitleData = this._getSubtitleData();
    const showHistory = this._config.show_history !== false;
    const showSettings = this._config.show_settings !== false;
    const showRelated = this._config.show_related !== false;
    const entityRegistry = this.hass.entities?.[this._config.entity];
    const deviceId = entityRegistry?.device_id;
    const hasDevice = !!deviceId;
    const deviceType =
      (deviceId && this.hass.devices?.[deviceId]?.entry_type) || "device";
    const hasAttributes = this._hasDisplayableAttributes();

    return html`
      <ha-dialog-header>
        <!-- Navigation icon: close on info view, back arrow on sub-views -->
        ${this._view === "info"
        ? html`
              <ha-icon-button
                slot="navigationIcon"
                .path=${mdiClose}
                .label=${"Close"}
                @click=${this._close}
              ></ha-icon-button>
            `
        : html`
              <ha-icon-button
                slot="navigationIcon"
                .path=${mdiArrowLeft}
                .label=${"Back"}
                @click=${this._goBack}
              ></ha-icon-button>
            `}

        <!-- Title and subtitle -->
        <span slot="title">${title}</span>
        ${subtitleData
        ? html`
              <div slot="subtitle" class="subtitle">
                ${subtitleData.areaName
            ? html`<button class="breadcrumb" @click=${() => this._showView("related")}
                      >${subtitleData.areaName}</button
                    >`
            : ""}
                ${subtitleData.areaName && subtitleData.deviceName
            ? " > "
            : ""}
                ${subtitleData.deviceName
            ? html`<button class="breadcrumb" @click=${() => this._showView("related")}
                      >${subtitleData.deviceName}</button
                    >`
            : ""}
              </div>
            `
        : ""}

        <!-- Action buttons — only shown on the main info view -->
        ${this._view === "info"
        ? html`
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
              ${showRelated || hasDevice || hasAttributes
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
                                .path=${deviceType === "service"
                    ? mdiTransitConnectionVariant
                    : mdiDevices}
                              ></ha-svg-icon>
                              Device info
                            </ha-dropdown-item>
                          `
                : ""}
                      ${showRelated
                ? html`
                            <ha-dropdown-item value="related">
                              <ha-svg-icon
                                slot="icon"
                                .path=${mdiInformationOutline}
                              ></ha-svg-icon>
                              Related
                            </ha-dropdown-item>
                          `
                : ""}
                      ${hasAttributes
                ? html`
                            <ha-dropdown-item value="attributes">
                              <ha-svg-icon
                                slot="icon"
                                .path=${mdiFormatListBulletedSquare}
                              ></ha-svg-icon>
                              Attributes
                            </ha-dropdown-item>
                          `
                : ""}
                    </ha-dropdown>
                  `
            : ""}
            `
        : ""}
      </ha-dialog-header>

      <!-- Content switcher -->
      <div class="content">
        ${this._view === "info"
        ? html`
              <more-info-content
                .hass=${this.hass}
                .stateObj=${stateObj}
              ></more-info-content>
              ${this._childCards.length > 0
            ? html`
                    <div class="extended-content">
                      ${this._childCards}
                    </div>
                  `
            : ""}
            `
        : this._view === "history"
          ? html`
              <ha-more-info-history-and-logbook
                .hass=${this.hass}
                .entityId=${this._config.entity}
              ></ha-more-info-history-and-logbook>
            `
          : this._view === "settings"
            ? html`
              <ha-more-info-settings
                .hass=${this.hass}
                .entityId=${this._config.entity}
              ></ha-more-info-settings>
            `
            : this._view === "related"
              ? html`
              <ha-related-items
                .hass=${this.hass}
                .itemId=${this._config.entity}
                .itemType=${"entity"}
              ></ha-related-items>
            `
              : this._view === "attributes"
                ? html`
              <ha-more-info-attributes
                .hass=${this.hass}
                .stateObj=${stateObj}
              ></ha-more-info-attributes>
            `
                : ""}
      </div>
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

      .content {
        display: block;
      }

      more-info-content {
        display: block;
        padding: 0 24px;
      }

      ha-more-info-history-and-logbook,
      ha-more-info-settings,
      ha-more-info-attributes,
      ha-related-items {
        display: block;
        padding: 8px 24px 24px;
      }

      .extended-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 24px 24px;
      }

      .subtitle {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .breadcrumb {
        color: var(--secondary-text-color);
        font-size: var(--ha-font-size-m);
        line-height: 1.2;
        padding: 2px 4px;
        margin: -2px -4px;
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 180ms ease-in-out;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .breadcrumb:hover {
        background-color: rgba(
          var(--rgb-secondary-text-color, 114, 114, 114),
          0.08
        );
      }
    `;
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
customElements.define("extended-more-info-card", ExtendedMoreInfoCard as any);

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "extended-more-info-card",
  name: "Extended More-Info Card",
  description:
    "Extends the HA more-info dialog with a configurable ha-dialog-header and additional Lovelace cards below the entity controls. Requires browser_mod.",
});

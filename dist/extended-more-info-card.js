function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:h,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,_=globalThis,f=_.trustedTypes,g=f?f.emptyScript:"",v=_.reactiveElementPolyfillSupport,$=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},m=(t,e)=>!h(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:m};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??m)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[$("elementProperties")]=new Map,w[$("finalized")]=new Map,v?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,C=t=>t,E=A.trustedTypes,x=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",H=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+H,M=`<${L}>`,k=document,V=()=>k.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,R="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,T=/>/g,D=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,I=/"/g,z=/^(?:script|style|textarea|title)$/i,J=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),Z=new WeakMap,W=k.createTreeWalker(k,129);function F(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<i;e++){const i=t[e];let a,h,l=-1,c=0;for(;c<i.length&&(r.lastIndex=c,h=r.exec(i),null!==h);)c=r.lastIndex,r===N?"!--"===h[1]?r=U:void 0!==h[1]?r=T:void 0!==h[2]?(z.test(h[2])&&(o=RegExp("</"+h[2],"g")),r=D):void 0!==h[3]&&(r=D):r===D?">"===h[0]?(r=o??N,l=-1):void 0===h[1]?l=-2:(l=r.lastIndex-h[2].length,a=h[1],r=void 0===h[3]?D:'"'===h[3]?I:j):r===I||r===j?r=D:r===U||r===T?r=N:(r=D,o=void 0);const d=r===D&&t[e+1].startsWith("/>")?" ":"";n+=r===N?i+M:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+H+d):i+H+(-2===l?e:d)}return[F(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[h,l]=K(t,e);if(this.el=Y.createElement(h,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[n++],i=s.getAttribute(t).split(H),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(H)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(H),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],V()),W.nextNode(),a.push({type:2,index:++o});s.append(t[e],V())}}}else if(8===s.nodeType)if(s.data===L)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(H,t+1));)a.push({type:7,index:o}),t+=H.length-1}o++}}static createElement(t,e){const i=k.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===B)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=P(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=X(t,o._$AS(t,e.values),o,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??k).importNode(e,!0);W.currentNode=s;let o=W.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=W.nextNode(),n++)}return W.currentNode=k,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),P(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(F(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Y(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Q(this.O(V()),this.O(V()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=C(t).nextSibling;C(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=X(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=X(this,s[i+r],e,r),a===B&&(a=this._$AH[r]),n||=!P(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class st extends tt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??q)===B)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const nt=A.litHtmlPolyfillSupport;nt?.(Y,Q),(A.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Q(e.insertBefore(V(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ht=rt.litElementPolyfillSupport;ht?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:m},ct=(t=lt,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dt(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return dt({...t,state:!0,attribute:!1})}let pt=class extends at{constructor(){super(...arguments),this._entityPickerReady=!1,this._contentJsonError=null}connectedCallback(){super.connectedCallback(),this._loadEntityPicker()}async _loadEntityPicker(){customElements.get("ha-entity-picker")||(await window.loadCardHelpers(),await customElements.whenDefined("ha-entity-picker")),this._entityPickerReady=!0}setConfig(t){this._config=t}get _entity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity)||""}get _title(){var t;return(null===(t=this._config)||void 0===t?void 0:t.title)||""}get _show_history(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_history)}get _show_settings(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_settings)}get _show_related(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_related)}get _contentJson(){var t;if(!(null===(t=this._config)||void 0===t?void 0:t.content)||0===this._config.content.length)return"";try{return JSON.stringify(this._config.content,null,2)}catch{return""}}render(){return this.hass&&this._config?J`
      <div class="card-config">

        <!-- Entity picker -->
        <div class="field">
          ${this._entityPickerReady?J`
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${this._entity}
                  .configValue=${"entity"}
                  label="Entity (required)"
                  @value-changed=${this._valueChanged}
                  allow-custom-entity
                ></ha-entity-picker>
              `:J`<p class="loading">Loading entity picker…</p>`}
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
          ${this._contentJsonError?J`<p class="json-error">${this._contentJsonError}</p>`:""}
        </div>

      </div>
    `:J``}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(!e.configValue)return;let i;if(i="entity"===e.configValue?t.detail.value:"ha-switch"===e.tagName.toLowerCase()?e.checked:e.value,""===i){const t={...this._config};delete t[e.configValue],this._config=t}else this._config={...this._config,[e.configValue]:i};this._fireConfigChanged()}_jsonChanged(t){if(!this._config||!this.hass)return;const e=t.target.value.trim();if(""===e){this._contentJsonError=null;const t={...this._config};return delete t.content,this._config=t,void this._fireConfigChanged()}try{const t=JSON.parse(e);if(!Array.isArray(t))return void(this._contentJsonError="Must be a JSON array (starting with [ and ending with ])");this._contentJsonError=null,this._config={...this._config,content:t},this._fireConfigChanged()}catch(t){this._contentJsonError=`Invalid JSON — changes not saved (${t.message})`}}_fireConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}static get styles(){return r`
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
    `}};var _t;t([dt({attribute:!1})],pt.prototype,"hass",void 0),t([ut()],pt.prototype,"_config",void 0),t([ut()],pt.prototype,"_entityPickerReady",void 0),t([ut()],pt.prototype,"_contentJsonError",void 0),pt=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("extended-more-info-card-editor")],pt),console.info("%c EXTENDED-MORE-INFO-CARD %c 0.1.2 ","color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");class ft extends at{constructor(){super(...arguments),this._childCards=[],this._view="info",this._settingsReady=!1,this._attributesReady=!1}updated(t){if(t.has("hass")&&this.hass)for(const t of this._childCards)t.hass=this.hass}setConfig(t){var e;if(!t.entity)throw new Error("extended-more-info-card: 'entity' is required.");this._config={show_history:!0,show_settings:!0,show_related:!0,...t},this._initChildCards(null!==(e=t.content)&&void 0!==e?e:[])}getCardSize(){return 3}static getConfigElement(){return document.createElement("extended-more-info-card-editor")}static getStubConfig(){return{entity:"",show_history:!0,show_settings:!0,show_related:!0}}async _initChildCards(t){if(0===t.length)return void(this._childCards=[]);const e=await window.loadCardHelpers();this._childCards=t.map(t=>{const i=e.createCardElement(t);return this.hass&&(i.hass=this.hass),i}),this.requestUpdate()}async _ensureSettingsReady(){this._settingsReady||(await customElements.whenDefined("ha-more-info-settings"),this._settingsReady=!0)}async _ensureAttributesReady(){this._attributesReady||(await customElements.whenDefined("ha-more-info-attributes"),this._attributesReady=!0)}_close(){this.dispatchEvent(new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:{browser_mod:{service:"browser_mod.close_popup",data:{}}}}))}_goBack(){this._view="info"}async _showView(t){"settings"===t&&await this._ensureSettingsReady(),"attributes"===t&&await this._ensureAttributesReady(),this._view=t}_navigateToDevice(t){this._close(),setTimeout(()=>{history.pushState(null,"",`/config/devices/device/${t}`),window.dispatchEvent(new CustomEvent("location-changed"))},50)}_handleMenuAction(t){var e,i,s;const o=null===(e=t.detail.item)||void 0===e?void 0:e.value;if(!this._config)return;const n=null===(s=null===(i=this.hass)||void 0===i?void 0:i.entities)||void 0===s?void 0:s[this._config.entity],r=null==n?void 0:n.device_id;switch(o){case"device":r&&this._navigateToDevice(r);break;case"related":this._showView("related");break;case"attributes":this._showView("attributes")}}_getSubtitleData(){var t,e,i;if(!this.hass||!this._config)return;const s=this._config.entity,o=null===(t=this.hass.entities)||void 0===t?void 0:t[s];let n=null==o?void 0:o.area_id;const r=null==o?void 0:o.device_id;let a,h;if(r){const t=null===(e=this.hass.devices)||void 0===e?void 0:e[r];t&&(a=t.name_by_user||t.name,n||(n=t.area_id))}if(n){const t=null===(i=this.hass.areas)||void 0===i?void 0:i[n];t&&(h=t.name)}return{areaName:h,areaId:n,deviceName:a,deviceId:r}}_hasDisplayableAttributes(){if(!this.hass||!this._config)return!1;const t=this.hass.states[this._config.entity];if(!t)return!1;const e=["entity_id","assumed_state","attribution","custom_ui_more_info","custom_ui_state_card","device_class","editable","emulated_hue_name","emulated_hue","entity_picture","event_types","friendly_name","haaska_hidden","haaska_name","icon","initial_state","last_reset","restored","state_class","supported_features","unit_of_measurement","available_tones"];return Object.keys(t.attributes).some(t=>!e.includes(t))}render(){var t,e,i,s,o,n;if(!this._config||!this.hass)return J``;const r=this.hass.states[this._config.entity],a=null!==(i=null!==(t=this._config.title)&&void 0!==t?t:null===(e=null==r?void 0:r.attributes)||void 0===e?void 0:e.friendly_name)&&void 0!==i?i:this._config.entity,h=this._getSubtitleData(),l=!1!==this._config.show_history,c=!1!==this._config.show_settings,d=!1!==this._config.show_related,u=null===(s=this.hass.entities)||void 0===s?void 0:s[this._config.entity],p=null==u?void 0:u.device_id,_=!!p,f=p&&(null===(n=null===(o=this.hass.devices)||void 0===o?void 0:o[p])||void 0===n?void 0:n.entry_type)||"device",g=this._hasDisplayableAttributes();return J`
      <ha-dialog-header>
        <!-- Navigation icon: close on info view, back arrow on sub-views -->
        ${"info"===this._view?J`
              <ha-icon-button
                slot="navigationIcon"
                .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                .label=${"Close"}
                @click=${this._close}
              ></ha-icon-button>
            `:J`
              <ha-icon-button
                slot="navigationIcon"
                .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
                .label=${"Back"}
                @click=${this._goBack}
              ></ha-icon-button>
            `}

        <!-- Title and subtitle -->
        <span slot="title">${a}</span>
        ${h?J`
              <div slot="subtitle" class="subtitle">
                ${h.areaName?J`<button class="breadcrumb" @click=${()=>this._showView("related")}
                      >${h.areaName}</button
                    >`:""}
                ${h.areaName&&h.deviceName?" > ":""}
                ${h.deviceName?J`<button class="breadcrumb" @click=${()=>this._showView("related")}
                      >${h.deviceName}</button
                    >`:""}
              </div>
            `:""}

        <!-- Action buttons — only shown on the main info view -->
        ${"info"===this._view?J`
              ${l?J`
                    <ha-icon-button
                      slot="actionItems"
                      .path=${"M9 17H7V10H9V17M13 17H11V7H13V17M17 17H15V13H17V17M19 19H5V5H19V19.1M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"}
                      .label=${"History"}
                      @click=${()=>this._showView("history")}
                    ></ha-icon-button>
                  `:""}
              ${c?J`
                    <ha-icon-button
                      slot="actionItems"
                      .path=${"M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"}
                      .label=${"Settings"}
                      @click=${()=>this._showView("settings")}
                    ></ha-icon-button>
                  `:""}
              ${d||_||g?J`
                    <ha-dropdown
                      slot="actionItems"
                      @wa-select=${this._handleMenuAction}
                      placement="bottom-end"
                    >
                      <ha-icon-button
                        slot="trigger"
                        .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"}
                        .label=${"More options"}
                      ></ha-icon-button>
                      ${_?J`
                            <ha-dropdown-item value="device">
                              <ha-svg-icon
                                slot="icon"
                                .path=${"service"===f?"M18,11H14.82C14.4,9.84 13.3,9 12,9C10.7,9 9.6,9.84 9.18,11H6C5.67,11 4,10.9 4,9V8C4,6.17 5.54,6 6,6H16.18C16.6,7.16 17.7,8 19,8A3,3 0 0,0 22,5A3,3 0 0,0 19,2C17.7,2 16.6,2.84 16.18,4H6C4.39,4 2,5.06 2,8V9C2,11.94 4.39,13 6,13H9.18C9.6,14.16 10.7,15 12,15C13.3,15 14.4,14.16 14.82,13H18C18.33,13 20,13.1 20,15V16C20,17.83 18.46,18 18,18H7.82C7.4,16.84 6.3,16 5,16A3,3 0 0,0 2,19A3,3 0 0,0 5,22C6.3,22 7.4,21.16 7.82,20H18C19.61,20 22,18.93 22,16V15C22,12.07 19.61,11 18,11M19,4A1,1 0 0,1 20,5A1,1 0 0,1 19,6A1,1 0 0,1 18,5A1,1 0 0,1 19,4M5,20A1,1 0 0,1 4,19A1,1 0 0,1 5,18A1,1 0 0,1 6,19A1,1 0 0,1 5,20Z":"M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z"}
                              ></ha-svg-icon>
                              Device info
                            </ha-dropdown-item>
                          `:""}
                      ${d?J`
                            <ha-dropdown-item value="related">
                              <ha-svg-icon
                                slot="icon"
                                .path=${"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"}
                              ></ha-svg-icon>
                              Related
                            </ha-dropdown-item>
                          `:""}
                      ${g?J`
                            <ha-dropdown-item value="attributes">
                              <ha-svg-icon
                                slot="icon"
                                .path=${"M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9"}
                              ></ha-svg-icon>
                              Attributes
                            </ha-dropdown-item>
                          `:""}
                    </ha-dropdown>
                  `:""}
            `:""}
      </ha-dialog-header>

      <!-- Content switcher -->
      <div class="content">
        ${"info"===this._view?J`
              <more-info-content
                .hass=${this.hass}
                .stateObj=${r}
              ></more-info-content>
              ${this._childCards.length>0?J`
                    <div class="extended-content">
                      ${this._childCards}
                    </div>
                  `:""}
            `:"history"===this._view?J`
              <ha-more-info-history-and-logbook
                .hass=${this.hass}
                .entityId=${this._config.entity}
              ></ha-more-info-history-and-logbook>
            `:"settings"===this._view?J`
              <ha-more-info-settings
                .hass=${this.hass}
                .entityId=${this._config.entity}
              ></ha-more-info-settings>
            `:"related"===this._view?J`
              <ha-related-items
                .hass=${this.hass}
                .itemId=${this._config.entity}
                .itemType=${"entity"}
              ></ha-related-items>
            `:"attributes"===this._view?J`
              <ha-more-info-attributes
                .hass=${this.hass}
                .stateObj=${r}
              ></ha-more-info-attributes>
            `:""}
      </div>
    `}static get styles(){return r`
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
    `}}t([dt({attribute:!1})],ft.prototype,"hass",void 0),t([ut()],ft.prototype,"_config",void 0),t([ut()],ft.prototype,"_childCards",void 0),t([ut()],ft.prototype,"_view",void 0),t([ut()],ft.prototype,"_settingsReady",void 0),t([ut()],ft.prototype,"_attributesReady",void 0),customElements.define("extended-more-info-card",ft),window.customCards=null!==(_t=window.customCards)&&void 0!==_t?_t:[],window.customCards.push({type:"extended-more-info-card",name:"Extended More-Info Card",description:"Extends the HA more-info dialog with a configurable ha-dialog-header and additional Lovelace cards below the entity controls. Requires browser_mod."});

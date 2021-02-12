///////////////////
///// IMPORTS /////
///////////////////

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import WebGL from '~/common/components/webgl/WebGL.js';

/// ASSETS CSS ///
import sCSS from './TheVeil.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class TheVeil extends HTMLElement  {

  /// CONSTRUCTOR ///
  constructor() {
    super();

    ///////////////////////////
    ///// CLASS VARIABLES /////
    ///////////////////////////

    this.oDOMElements = Object.create(null);
    this.oComponentInstances = Object.create(null);

    /// PRE-INIT CONTRUCTS ///
    this.constructShadowDOM();
  };

  constructShadowDOM() {
    this.shadow = this.attachShadow({ mode: 'open' });

    const oCSSAssets = { sCSS: sCSS };
    const _css = CSS.createDomStyleElement(oCSSAssets);

    DOM.append(_css, this.shadow);
  };

  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() { this.__init(); };
  disconnectedCallback() { this.__del(); };


  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  // triggered by the web component connectedCallback
  // we're attached to the DOM at this point
  __init() {
    this.createDomElements();
    this.createComponentInstances();
  };

  // triggered by the web component disconnectedCallback
  // we're no longer attached to the DOM at this point
  __del() {
    this.destroyDomElements();
    this.destroyComponentInstances();
  };

  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// CREATE ///
  createDomElements() {
    // TODO: abstract into components ?
    this.oDOMElements['testMessage'] = DOM.create('h1', { className: 'testMessage' }, 'part.one');
    DOM.append(this.oDOMElements['testMessage'], this.shadow);

    this.oDOMElements['testMessage2'] = DOM.create('h1', { className: 'testMessage2' }, 'the veil');
    DOM.append(this.oDOMElements['testMessage2'], this.shadow);
  };

  createComponentInstances() {
    this.oComponentInstances['_webgl'] = new WebGL('the-veil');
    DOM.append(this.oComponentInstances['_webgl'], this.shadow);
  };

  /// DESTROY ///
  destroyDomElements() {
    for (const oDomElement in this.oDOMElements) {
      DOM.remove(this.oDOMElements[oDomElement]);
    };
  };

  destroyComponentInstances() {
    for (const _componentInstance in this.oComponentInstances) {
      this.oComponentInstances[_componentInstance] = null;
    };
  };
};


////////////////////////////////////
///// WEB COMPONENT DEFINITION /////
////////////////////////////////////

customElements.define('theu0001-pages-theveil', TheVeil);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default TheVeil;


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////////////.        /////////////////////////
/////////////////////     .      ..  ...////////////////////
///////////////////    ..  .   ....    .  ./////////////////
//////////////////        . .  . ...  . ... ////////////////
/////////////////     ...................   ////////////////
/////////////////  .(,(/.%,.*%#&&&.//....   ////////////////
/////////////////  .***/..*,*/%,%%#%*/(/(. ,* //////////////
////////////////( ******  #%#((&%%*&///%%*..(.//////////////
/////////////////(/,((//**&.*,%%(*//.**##, .#(//////////////
///////////////( .(,**....* ...,*,,,%&,((*.* .//////////////
///////////////( . **..(*#/ %%%%#,*##,..*%,,.///////////////
////////////////(.,#/%#%%,#(%#(/&&(%,(.//#,..///////////////
//////////////////(,,/*#(.#/ /(&..%/&/(*(.//////////////////
///////////////////( ***#     .,.,/&%%%*.///////////////////
////////////////////(./,/*,,.,&*(((%%(/ ////////////////////
///////////////////////**.*.*//##.*,,,//////////////////////
///////////////////////  ,*%%/@//(*   ./////////////////////
//////////////////////                 /////////////////////
////////////////////                     ///////////////////
//////////////// . ... .. ..    ...    .. .. ///////////////
////....................................................////

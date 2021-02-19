///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import { LOG } from '~/utils/LOG.js';

import WebGLBackground from './webglBackground/WebGLBackground.js';

/// ASSETS CSS ///
import sCSS from './Container.css';


/////////////////
///// CLASS /////
/////////////////

class Container extends HTMLElement  {

  /// CONSTRUCTOR ///
  constructor(fCB) {
    super();

    ///////////////////////////
    ///// CLASS VARIABLES /////
    ///////////////////////////

    this.oDOMElements = Object.create(null);
    this.oComponentInstances = Object.create(null);

    /// PRE-INIT CONTRUCTS ///
    this.constructShadowDOM();


    this.__init(fCB);
  };

  constructShadowDOM() {
    this.shadow = this.attachShadow({ mode: 'open' });

    const oCSSAssets = { sCSS: sCSS };
    const _css = CSS.createDomStyleElement(oCSSAssets);

    // TODO: do this elegantly
    // TODO: handle resizes
    // TODO: handle min-sizes

    // controls the page size
    this.shadow.host['style'].width = window.innerWidth + 'px';
    this.shadow.host['style'].height = window.innerHeight + 'px';

    DOM.append(_css, this.shadow);
  };


  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() { };
  disconnectedCallback() { this.__del(); };


  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  // triggered by the web component connectedCallback
  // we're attached to the DOM at this point
  __init(fCB) {

    async.series([
      function (fCB) { this.createDomElements(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
    ], function (err, results) {

      fCB();
    }.bind(this));

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
  createDomElements(fCB) {
    this.oDOMElements['domPageWrapper'] = DOM.create('div', { className: 'domPageWrapper' });
    DOM.append(this.oDOMElements['domPageWrapper'], this.shadow);

    this.oDOMElements['domBackgroundWrapper'] = DOM.create('div', { className: 'domBackgroundWrapper' });
    DOM.append(this.oDOMElements['domBackgroundWrapper'], this.shadow);

    fCB();
  };

  createComponentInstances(fCB) {

    async.series([
      function (fCB) { this.oComponentInstances['_webglBackground'] = new WebGLBackground(fCB); }.bind(this),
    ], function (err, results) {

      DOM.append(this.oComponentInstances['_webglBackground'], this.oDOMElements['domBackgroundWrapper']);

      fCB();
    }.bind(this));

  };

  /// ANIMATE ///
  intro(fCB) { fCB(); };
  outro(fCB) { fCB();};

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

customElements.define('theu0001-common-container', Container);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Container;


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

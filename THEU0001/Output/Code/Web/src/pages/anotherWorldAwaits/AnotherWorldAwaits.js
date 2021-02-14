///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import Title from '~/common/components/pages/title/Title.js';
import WebGL from '~/common/components/pages/webgl/WebGL.js';

/// ASSETS CSS ///
import sCSS from './AnotherWorldAwaits.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class AnotherWorldAwaits extends HTMLElement  {

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
  createDomElements() {};

  createComponentInstances() {
    this.oComponentInstances['_title'] = new Title({ sChapter: 'part . three', sTitle: 'another\nworld\nawaits' });
    DOM.append(this.oComponentInstances['_title'], this.shadow);

    this.oComponentInstances['_webgl'] = new WebGL('another-world-awaits');
    DOM.append(this.oComponentInstances['_webgl'], this.shadow);
  };

  /// ANIMATE ///
  intro(fCB) {
    async.parallel([
      function (fCB) { this.oComponentInstances['_title'].intro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_webgl'].intro(fCB); }.bind(this),
    ], function (err, results) {
      console.log('AnotherWorldAwaits : ' + 'intro complete');

      fCB();
    }.bind(this));
  };

  outro(fCB) {
    async.parallel([
      function (fCB) { this.oComponentInstances['_title'].outro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_webgl'].outro(fCB); }.bind(this),
    ], function (err, results) {
      console.log('AnotherWorldAwaits : ' + 'outro complete');

      fCB();
    }.bind(this));
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

customElements.define('theu0001-pages-anotherworldawaits', AnotherWorldAwaits);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default AnotherWorldAwaits;


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

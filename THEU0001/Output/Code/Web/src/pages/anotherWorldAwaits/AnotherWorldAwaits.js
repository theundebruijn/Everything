///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
import { FRP } from '~/utils/FRP.js';
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import { LOG } from '~/utils/LOG.js';

import Title from '~/common/components/pages/title/Title.js';
import WebGL from '~/common/components/pages/webgl/WebGL.js';

/// ASSETS CSS ///
import sCSS from './AnotherWorldAwaits.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class AnotherWorldAwaits extends HTMLElement  {

  /// CONSTRUCTOR ///
  constructor(fCB) {
    super();

    async.parallel([
      function (fCB) { this.createDataStructures(fCB); }.bind(this),
      function (fCB) { this.createShadowDOM(fCB); }.bind(this),
    ], function (err, results) {

      this.__init(fCB);

    }.bind(this));
  };

  createDataStructures(fCB) {
    this.oDOMElements = Object.create(null);
    this.oComponentInstances = Object.create(null);

    fCB();
  };

  createShadowDOM(fCB) {
    this.shadow = this.attachShadow({ mode: 'open' });

    const oCSSAssets = { sCSS: sCSS };
    const _css = CSS.createDomStyleElement(oCSSAssets);

    DOM.append(_css, this.shadow);

    fCB();
  };


  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() {};
  disconnectedCallback() { this.__del(); };


  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  // triggered by the web component connectedCallback
  // we're attached to the DOM at this point
  __init(fCB) {
    LOG.info('AnotherWorldAwaits : __init');

    async.series([
      function (fCB) { this.createDomElements(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('AnotherWorldAwaits : __init : complete');

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
  createDomElements(fCB) { fCB(); };

  createComponentInstances(fCB) {

    async.series([
      function (fCB) {  this.oComponentInstances['_title'] = new Title({ sChapter: 'part . three', sTitle: 'another\nworld\nawaits', sColor: '#ffffff' }, fCB); }.bind(this),
      function (fCB) {  this.oComponentInstances['_webgl'] = new WebGL({ sType: 'page', sContent: 'another-world-awaits' }, fCB); }.bind(this),
    ], function (err, results) {

      // order is important! even with z-indexes
      DOM.append(this.oComponentInstances['_webgl'], this.shadow);
      DOM.append(this.oComponentInstances['_title'], this.shadow);

      fCB();
    }.bind(this));

  };

  /// ANIMATE ///
  intro() {
    LOG.info('AnotherWorldAwaits : intro');

    const _stream = FRP.getStream('_webglBackground:onBackgroundChange');
    _stream({ sColor: 0x0E0E14, nDuration: 3.500 });

    async.parallel([
      function (fCB) { this.oComponentInstances['_webgl'].intro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_title'].intro(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('AnotherWorldAwaits : intro : complete');

    }.bind(this));
  };

  outro(fCB) {
    LOG.info('AnotherWorldAwaits : outro');

    async.parallel([
      function (fCB) { this.oComponentInstances['_webgl'].outro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_title'].outro(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('AnotherWorldAwaits : outro : complete');

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

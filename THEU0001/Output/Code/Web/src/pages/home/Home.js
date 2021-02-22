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
import sCSS from './Home.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class Home extends HTMLElement  {

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

    DOM.append(_css, this.shadow);
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
    LOG('Home : __init');

    async.series([
      function (fCB) { this.createDomElements(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
    ], function (err, results) {
      LOG('Home : __init : complete');

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
      function (fCB) {  this.oComponentInstances['_title'] = new Title({ sChapter: 'home', sTitle: 'project\ngiantesque', sColor: '#000000', sPosition: 'bottom' }, fCB); }.bind(this),
      function (fCB) {  this.oComponentInstances['_webgl'] = new WebGL({ sType: 'page', sContent: 'home' }, fCB); }.bind(this),
    ], function (err, results) {

      // order is important! even with z-indexes
      DOM.append(this.oComponentInstances['_webgl'], this.shadow);
      DOM.append(this.oComponentInstances['_title'], this.shadow);

      fCB();
    }.bind(this));

  };

  /// ANIMATE ///
  intro() {
    LOG('Home : intro');

    const _stream = FRP.getStream('_webglBackground:onBackgroundChange');
    _stream({ sColor: 0xfdfbf8, nDuration: 3.500 });

    async.parallel([
      function (fCB) { this.oComponentInstances['_webgl'].intro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_title'].intro(fCB); }.bind(this),
    ], function (err, results) {
      LOG('Home : intro : complete');

    }.bind(this));
  };

  outro(fCB) {
    LOG('Home : outro');

    async.parallel([
      function (fCB) { this.oComponentInstances['_webgl'].outro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_title'].outro(fCB); }.bind(this),
    ], function (err, results) {
      LOG('Home : outro : complete');

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

customElements.define('theu0001-pages-home', Home);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Home;


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

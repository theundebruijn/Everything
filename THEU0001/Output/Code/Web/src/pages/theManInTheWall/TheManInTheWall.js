///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
import { FRP } from '~/_utils/FRP.js';
import { DOM } from '~/_utils/DOM.js';
import { CSS } from '~/_utils/CSS.js';
import { LOG } from '~/_utils/LOG.js';

import Title from '~/pages/_common/components/title/Title.js';
import WebGL from '~/pages/_common/components/webgl/WebGL.js';

/// ASSETS CSS ///
import sCSS from './TheManInTheWall.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class TheManInTheWall extends HTMLElement  {

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
    LOG.info('~/pages/theManInTheWall/TheManInTheWall :: __init');

    async.series([
      function (fCB) { this.createDomElements(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('~/pages/theManInTheWall/TheManInTheWall :: __init (complete)');

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
      function (fCB) {  this.oComponentInstances['_title'] = new Title({ sChapter: 'part . two', sTitle: 'the man\nin the\nwall', sColor: '#ffffff' }, fCB); }.bind(this),
      function (fCB) {  this.oComponentInstances['_webgl'] = new WebGL({ sType: 'page', sContent: 'the-man-in-the-wall' }, fCB); }.bind(this),
    ], function (err, results) {

      // order is important! even with z-indexes
      DOM.append(this.oComponentInstances['_webgl'], this.shadow);
      DOM.append(this.oComponentInstances['_title'], this.shadow);

      fCB();
    }.bind(this));

  };

  /// ANIMATE ///
  intro() {
    LOG.info('~/pages/theManInTheWall/TheManInTheWall :: intro');

    const _stream = FRP.getStream('_webglBackground:onBackgroundChange');
    _stream({ sColor: 0xa08b68, nDuration: 3.500 });

    async.parallel([
      function (fCB) { this.oComponentInstances['_webgl'].intro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_title'].intro(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('~/pages/theManInTheWall/TheManInTheWall :: intro (complete)');

    }.bind(this));
  };

  outro(fCB) {
    LOG.info('~/pages/theManInTheWall/TheManInTheWall :: outro');

    async.parallel([
      function (fCB) { this.oComponentInstances['_webgl'].outro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_title'].outro(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('~/pages/theManInTheWall/TheManInTheWall :: outro (complete)');

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

customElements.define('theu0001-pages-themaninthewall', TheManInTheWall);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default TheManInTheWall;


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

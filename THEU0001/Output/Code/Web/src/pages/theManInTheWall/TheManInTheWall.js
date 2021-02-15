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
import sCSS from './TheManInTheWall.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class TheManInTheWall extends HTMLElement  {

  /// CONSTRUCTOR ///
  constructor(fMainCB) {
    super();

    ///////////////////////////
    ///// CLASS VARIABLES /////
    ///////////////////////////

    this.oDOMElements = Object.create(null);
    this.oComponentInstances = Object.create(null);

    /// PRE-INIT CONTRUCTS ///
    this.constructShadowDOM();

    this.__init(fMainCB);
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
  __init(fMainCB) {
    this.createDomElements();
    this.createComponentInstances();

    fMainCB();
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
    this.oComponentInstances['_title'] = new Title({ sChapter: 'part . two', sTitle: 'the man\nin the\nwall' });
    DOM.append(this.oComponentInstances['_title'], this.shadow);

    this.oComponentInstances['_webgl'] = new WebGL({sType: 'page', sContent: 'the-man-in-the-wall'});
    DOM.append(this.oComponentInstances['_webgl'], this.shadow);
  };

  /// ANIMATE ///
  intro() {
    async.parallel([
      function (fCB) { this.oComponentInstances['_title'].intro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_webgl'].intro(fCB); }.bind(this),
    ], function (err, results) {
      console.log('TheManInTheWall : ' + 'intro complete');

    }.bind(this));
  };

  outro(fMainCB) {
    async.parallel([
      function (fCB) { this.oComponentInstances['_title'].outro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_webgl'].outro(fCB); }.bind(this),
    ], function (err, results) {
      console.log('TheManInTheWall : ' + 'outro complete');

      fMainCB();
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

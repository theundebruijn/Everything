///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';
import { Loader as ResourceLoader, Resource } from 'resource-loader';
import { TweenMax, Sine, Linear } from 'gsap';

/// LOCAL ///
import { FRP } from '~/_utils/FRP.js';
import { DOM } from '~/_utils/DOM.js';
import { CSS } from '~/_utils/CSS.js';
import { LOG } from '~/_utils/LOG.js';

/// ASSETS CSS ///
// TODO: rewrite classnames etc
import sCSS from './Header.css';

// ASSETS LOADER //
import header_bg from './assets/img/THEU0000_header_bg.jpg';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class Header extends HTMLElement {

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
    this.oStreamListeners = Object.create(null);

    this.resources = Object.create(null);

    this.oTweens = Object.create(null);

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
    LOG.info('~/pages/home/components/header/Header :: __init');

    async.series([
      function (fCB) { this.createDomElements(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
      function (fCB) { this.loadResources(fCB); }.bind(this),
      function (fCB) { this.processResources(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('~/pages/home/components/header/Header :: __init (complete)');


      // TODO: refactor this into a method ?

      LOG.info(this.oDOMElements['header_bg']);
      LOG.info(this.resources['header_bg']);




      this.oDOMElements['header_bg'].style.backgroundImage = 'url(' + this.resources['header_bg'].url + ')';



      this.createEventStreams();

      fCB();
    }.bind(this));

  };

  // triggered by the web component disconnectedCallback
  // we're no longer attached to the DOM at this point
  __del() {
    this.destroyDomElements();
    this.destroyComponentInstances();

    // TODO: refact into class method
    for (const tween in this.oTweens) { this.oTweens[tween].kill(); };
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// CREATE ///
  createDomElements(fCB) {

    this.oDOMElements['wrapper'] = DOM.create('div', { className: 'wrapper' });
    this.oDOMElements['header_bg'] = DOM.create('div', { className: 'header_bg' });
    this.oDOMElements['hover'] = DOM.create('div', { className: 'hover' });

    this.oDOMElements['title'] = DOM.create('div', { className: 'title' }, 'Director of Creative Technology');

    /// APPEND ///

    DOM.append(this.oDOMElements['hover'], this.oDOMElements['header_bg']);
    DOM.append(this.oDOMElements['title'], this.oDOMElements['wrapper']);
    DOM.append(this.oDOMElements['header_bg'], this.oDOMElements['wrapper']);


    DOM.append(this.oDOMElements['wrapper'], this.shadow);

    fCB();
  };

  createComponentInstances(fCB) { fCB(); };


  loadResources(fCB) {
    const resourceLoader = new ResourceLoader();

    resourceLoader.add('header_bg', header_bg, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });

    resourceLoader.use(function(resource, next) {

      if (resource.extension === 'jpg') {
        // gltfLoader.parse(resource.data, '', function (gltf) {
        this.resources[resource.name] = resource;

        next();
        // }.bind(this));
      }
    }.bind(this));

    resourceLoader.load(function(resourceLoader, resources) { fCB(); }.bind(this));
  };

  processResources(fCB) { fCB(); };

  /// ANIMATE ///
  intro(fCB) {
    LOG.info('~/pages/home/components/header/Header :: intro');

    async.parallel([
      function (fCB) {

        this.oTweens['introHeaderBG'] = TweenMax.fromTo(this.oDOMElements['header_bg'], 2.000, {
          css : { opacity: 0, scale: 1.25 } }, { css : { opacity: 1, scale: 1 }, ease: Sine.easeInOut, onComplete: function() { fCB(); },
        });


      }.bind(this),
    ], function (err, results) {
      LOG.info('~/pages/home/components/header/Header :: intro (complete)');
      fCB();

    }.bind(this));
  };

  outro(fCB) {
    LOG.info('~/pages/home/components/header/Header :: outro');

    this.removeTweens();


    fCB();
  };


  createEventStreams() {

    /// WINDOW RESIZE ///
    this.oStreamListeners['window:onmousemove'] = FRP.createStreamListener('window:onmousemove', function (e) {
      // this.setElementSizes(window.innerWidth, window.innerHeight);
      // LOG.info(e)

      if (this.oTweens['hoverMove']) this.oTweens['hoverMove'].kill();
      this.oTweens['hoverMove'] = TweenMax.to(this.oDOMElements['hover'], 0.300, {
        css: { x: e.clientX, y: e.clientY }, delay: 0, ease: Sine.easeOut, onComplete: function () {}.bind(this),
      });

    }.bind(this));

  };


  ///////////////////
  ///// CLEANUP /////
  ///////////////////


  removeTweens() {
    for (const tween in this.oTweens) { this.oTweens[tween].kill(); };
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

customElements.define('theu0000-pages-home-components-header', Header);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Header;


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

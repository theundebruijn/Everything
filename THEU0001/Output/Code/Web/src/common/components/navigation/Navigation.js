///////////////////
///// IMPORTS /////
///////////////////

/// LOCAL ///
import { FRP } from '~/utils/FRP.js';
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';

/// ASSETS CSS ///
import sCSS from './Navigation.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class Navigation extends HTMLElement  {

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


    // TODO: abstract into subclass
    this.oDOMElements['navigationWrapper'] = DOM.create('nav', { className: 'navigationWrapper' });

    this.oDOMElements['linkHome'] = DOM.create('a', { className: 'link home', href: '/' }, 'home');

    FRP.createStream('_navigation:linkHome:onclick');
    FRP.addEventListenerToStream('_navigation:linkHome:onclick', this.oDOMElements['linkHome'], 'click');
    FRP.listenToStream('_navigation:linkHome:onclick', function (data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/') return;
      window.history.pushState(null, 'home', '/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(this.oDOMElements['linkHome'], this.oDOMElements['navigationWrapper']);


    this.oDOMElements['linkTheVeil'] = DOM.create('a', { className: 'link about', href: '/the-veil/' }, 'the veil');

    FRP.createStream('_navigation:linkTheVeil:click');
    FRP.addEventListenerToStream('_navigation:linkTheVeil:click', this.oDOMElements['linkTheVeil'], 'click');
    FRP.listenToStream('_navigation:linkTheVeil:click', function (data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/the-veil/') return;
      window.history.pushState(null, 'about', '/the-veil/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(this.oDOMElements['linkTheVeil'], this.oDOMElements['navigationWrapper']);


    this.oDOMElements['linkTheManInTheWall'] = DOM.create('a', { className: 'link about', href: '/the-man-in-the-wall/' }, 'the man in the wall');

    FRP.createStream('_navigation:linkTheManInTheWall:click');
    FRP.addEventListenerToStream('_navigation:linkTheManInTheWall:click', this.oDOMElements['linkTheManInTheWall'], 'click');
    FRP.listenToStream('_navigation:linkTheManInTheWall:click', function (data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/the-man-in-the-wall/') return;
      window.history.pushState(null, 'about', '/the-man-in-the-wall/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(this.oDOMElements['linkTheManInTheWall'], this.oDOMElements['navigationWrapper']);


    this.oDOMElements['linkAnotherWorldAwaits'] = DOM.create('a', { className: 'link about', href: '/another-world-awaits/' }, 'another world awaits');

    FRP.createStream('_navigation:linkAnotherWorldAwaits:click');
    FRP.addEventListenerToStream('_navigation:linkAnotherWorldAwaits:click', this.oDOMElements['linkAnotherWorldAwaits'], 'click');
    FRP.listenToStream('_navigation:linkAnotherWorldAwaits:click', function (data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/another-world-awaits/') return;
      window.history.pushState(null, 'about', '/another-world-awaits/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(this.oDOMElements['linkAnotherWorldAwaits'], this.oDOMElements['navigationWrapper']);

    DOM.append(this.oDOMElements['navigationWrapper'], this.shadow);

    // const linkHome = DOM.create('a', { className: 'link home', href: '/' }, 'let\'s go home!');
    // RxJS.create('home:linkHome:click', 'fromEvent', linkHome, 'click');
    // const linkHomeClickHandler = function(data) {
    //   data.preventDefault();
    // };
    // RxJS.subscribe('home:linkHome:click', linkHomeClickHandler.bind(this));
    // DOM.append(linkHome, this.shadow);

    // const linkAbout = DOM.create('a', { className: 'link about', href: '/about' }, 'see some about');
    // RxJS.create('home:linkAbout:click', 'fromEvent', linkAbout, 'click');
    // const linkAboutClickHandler = function(data) {
    //   data.preventDefault();
    // };
    // RxJS.subscribe('home:linkAbout:click', linkAboutClickHandler.bind(this));
    // DOM.append(linkAbout, this.shadow);
  };

  createComponentInstances() {};

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

customElements.define('theu0001-common-navigation', Navigation);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Navigation;


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

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

/// ASSETS CSS ///
import sCSS from './Navigation.css';
import { FloatType } from 'three';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class Navigation extends HTMLElement  {

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

  connectedCallback() {  };
  disconnectedCallback() { this.__del(); };


  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  // triggered by the web component connectedCallback
  // we're attached to the DOM at this point
  __init(fCB) {
    LOG.info('~/components/Navigation :: __init');

    this.createDomElements();
    this.createComponentInstances();

    LOG.info('~/components/Navigation :: __init (complete)');
    fCB();
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

    this.oDOMElements['linkHome'] = DOM.create('a', { className: 'link', href: '/' }, 'home');
    FRP.createStream('navigation:linkhome:onclick', { target: this.oDOMElements['linkHome'], event : 'click' });
    FRP.createStreamListener('navigation:linkhome:onclick', function(data) {
    // FRP.addStreamListener('_navigation:linkHome:onclick', { target: this.oDOMElements['linkHome'], event : 'click' }, function(data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/') return;
      window.history.pushState(null, 'home', '/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });
    DOM.append(this.oDOMElements['linkHome'], this.oDOMElements['navigationWrapper']);

    this.oDOMElements['linkTheVeil'] = DOM.create('a', { className: 'link', href: '/the-veil/' }, 'the veil');
    FRP.createStream('navigation:linkTheVeil:onclick', { target: this.oDOMElements['linkTheVeil'], event: 'click' });
    FRP.createStreamListener('navigation:linkTheVeil:onclick', function(data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/the-veil/') return;
      window.history.pushState(null, 'about', '/the-veil/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });
    DOM.append(this.oDOMElements['linkTheVeil'], this.oDOMElements['navigationWrapper']);


    this.oDOMElements['linkTheManInTheWall'] = DOM.create('a', { className: 'link', href: '/the-man-in-the-wall/' }, 'the man in the wall');
    FRP.createStream('navigation:linkTheManInTheWall:onclick', { target: this.oDOMElements['linkTheManInTheWall'], event: 'click' });
    FRP.createStreamListener('navigation:linkTheManInTheWall:onclick', function (data) {
    // FRP.addStreamListener('_navigation:linkTheManInTheWall:click', { target: this.oDOMElements['linkTheManInTheWall'], event: 'click' }, function(data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/the-man-in-the-wall/') return;
      window.history.pushState(null, 'about', '/the-man-in-the-wall/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });
    DOM.append(this.oDOMElements['linkTheManInTheWall'], this.oDOMElements['navigationWrapper']);


    this.oDOMElements['linkAnotherWorldAwaits'] = DOM.create('a', { className: 'link', href: '/another-world-awaits/' }, 'another world awaits');
    FRP.createStream('navigation:linkAnotherWorldAwaits:onclick', { target: this.oDOMElements['linkAnotherWorldAwaits'], event: 'click' });
    FRP.createStreamListener('navigation:linkAnotherWorldAwaits:onclick', function (data) {
    // FRP.addStreamListener('_navigation:linkAnotherWorldAwaits:click', { target: this.oDOMElements['linkAnotherWorldAwaits'], event: 'click' }, function(data) {
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
  };

  createComponentInstances() {};

  /// ANIMATE ///
  intro(fCB) { fCB(); };

  outro(fCB) { fCB(); };

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

customElements.define('theu0001-components-navigation', Navigation);


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


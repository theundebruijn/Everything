// import { RxJS } from '~/utils/rxjs.js';
import { Flyd } from '~/utils/flyd.js';
import { DOM } from '~/utils/dom.js';

import css from './Navigation.css';

// console.log(css)

class Navigation extends HTMLElement  {
  constructor() {
    super();

    // web-component specific stylesheet
    // this.styles = new CSSStyleSheet();
    const mycss = css;

    // we use the web component's shadow dom to isolate the styling
    this.shadow = this.attachShadow({ mode: 'open' });
    // this.shadow.adoptedStyleSheets = [this.styles];
    const domStyle = DOM.create('style');
    domStyle.innerHTML = mycss;

    DOM.append(domStyle, this.shadow);

    // console.log('you\'re home!!');
  }

  // web component lifecycle
  connectedCallback() {
    // TODO: abstract into subclass
    const navigationWrapper = DOM.create('nav', { className: 'navigationWrapper' });

    const linkHome = DOM.create('a', { className: 'link home', href: '/' }, 'home');

    Flyd.createStream('_navigation:linkHome:onclick');
    Flyd.addEventListenerToStream('_navigation:linkHome:onclick', linkHome, 'click');
    Flyd.listenToStream('_navigation:linkHome:onclick', function(data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/') return;
      window.history.pushState(null, 'home', '/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(linkHome, navigationWrapper);


    const linkTheVeil = DOM.create('a', { className: 'link about', href: '/the-veil/' }, 'the veil');

    Flyd.createStream('_navigation:linkTheVeil:click');
    Flyd.addEventListenerToStream('_navigation:linkTheVeil:click', linkTheVeil, 'click');
    Flyd.listenToStream('_navigation:linkTheVeil:click', function(data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/the-veil/') return;
      window.history.pushState(null, 'about', '/the-veil/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(linkTheVeil, navigationWrapper);


    const linkTheManInTheWall = DOM.create('a', { className: 'link about', href: '/the-man-in-the-wall/' }, 'the man in the wall');

    Flyd.createStream('_navigation:linkTheManInTheWall:click');
    Flyd.addEventListenerToStream('_navigation:linkTheManInTheWall:click', linkTheManInTheWall, 'click');
    Flyd.listenToStream('_navigation:linkTheManInTheWall:click', function(data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/the-man-in-the-wall/') return;
      window.history.pushState(null, 'about', '/the-man-in-the-wall/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(linkTheManInTheWall, navigationWrapper);


    const linkAnotherWorldAwaits = DOM.create('a', { className: 'link about', href: '/another-world-awaits/' }, 'another world awaits');

    Flyd.createStream('_navigation:linkAnotherWorldAwaits:click');
    Flyd.addEventListenerToStream('_navigation:linkAnotherWorldAwaits:click', linkAnotherWorldAwaits, 'click');
    Flyd.listenToStream('_navigation:linkAnotherWorldAwaits:click', function(data) {
      data.preventDefault();

      // TODO: handle this in the router
      // push a stream instead
      if (window.location.pathname === '/another-world-awaits/') return;
      window.history.pushState(null, 'about', '/another-world-awaits/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    DOM.append(linkAnotherWorldAwaits, navigationWrapper);

    DOM.append(navigationWrapper, this.shadow);

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
  }
};

customElements.define('theu0001-navigation', Navigation);
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

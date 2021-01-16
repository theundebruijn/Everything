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
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)

    // render the css when the web component is added to the DOM
    // TODO: test for FOUC
    // this.styles.replace(css);

    const linkHome = DOM.create('a', { className: 'link home', href: '/' }, 'let\'s go home!');

    Flyd.createStream('_navigation:linkHome:onclick');
    Flyd.addEventListenerToStream('_navigation:linkHome:onclick', linkHome, 'click');
    Flyd.listenToStream('_navigation:linkHome:onclick', function(data) {
      console.log('BOOM3');
      data.preventDefault();
      window.history.pushState(null, 'home', '/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    // RxJS.create('_navigation:linkHome:click', 'fromEvent', linkHome, 'click');
    // RxJS.subscribe('_navigation:linkHome:click', function(data) {
    //   data.preventDefault();

    //   window.history.pushState(null, 'home', '/');
    // });

    DOM.append(linkHome, this.shadow);

    const linkAbout = DOM.create('a', { className: 'link about', href: '/about/' }, 'see some about');

    Flyd.createStream('_navigation:linkAbout:click');
    Flyd.addEventListenerToStream('_navigation:linkAbout:click', linkAbout, 'click');
    Flyd.listenToStream('_navigation:linkAbout:click', function(data) {
      console.log('BOOM3');
      data.preventDefault();
      window.history.pushState(null, 'about', '/about/');
      const popStateEvent = new PopStateEvent('popstate', { state: null });
      window.dispatchEvent(popStateEvent);
    });

    // RxJS.create('_navigation:linkAbout:click', 'fromEvent', linkAbout, 'click');
    // RxJS.subscribe('_navigation:linkAbout:click', function(data) {
    //   data.preventDefault();

    //   window.history.pushState(null, 'about', '/about/');
    // });

    DOM.append(linkAbout, this.shadow);

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

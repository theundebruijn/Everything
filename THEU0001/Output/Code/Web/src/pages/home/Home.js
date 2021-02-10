///////////////////
///// IMPORTS /////
///////////////////

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import WebGL from '~/common/components/webgl/WebGL.js';

/// ASSETS ///
import css from './Home.css';
import jpg from './assets/test.jpg';

// TODO: abstract this into a little 'css loader' method
const mycss = css.replace(/.\/assets\/test.jpg/g, jpg);


/////////////////
///// CLASS /////
/////////////////

class Home extends HTMLElement  {

  /// CONSTRUCTOR ///
  constructor() {
    super();

    // we use the web component's shadow dom to isolate the styling
    this.shadow = this.attachShadow({ mode: 'open' });

    const domStyle = DOM.create('style');
    domStyle.innerHTML = mycss;

    DOM.append(domStyle, this.shadow);
  };


  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() {

    const testMessage = DOM.create('h1', { className: 'testMessage' }, 'home');
    DOM.append(testMessage, this.shadow);

    const testMessage2 = DOM.create('h1', { className: 'testMessage2' }, 'project giantesque');
    DOM.append(testMessage2, this.shadow);

    const _webgl = new WebGL('home');
    DOM.append(_webgl, this.shadow);

  };

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
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

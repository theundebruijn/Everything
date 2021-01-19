// npm
import { DOM } from '~/utils/dom.js';

//
import WebGL from '~/common/components/webgl/WebGL.js';

// assets
import jpg from './assets/test.jpg';

// style sheet
import css from './Home.css';

// TODO: abstract this into a little 'css loader' method
const mycss = css.replace(/.\/assets\/test.jpg/g, jpg);

class Home extends HTMLElement  {
  constructor() {
    super();

    // we use the web component's shadow dom to isolate the styling
    this.shadow = this.attachShadow({ mode: 'open' });

    const domStyle = DOM.create('style');
    domStyle.innerHTML = mycss;

    DOM.append(domStyle, this.shadow);
  };

  // web component lifecycle
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

customElements.define('theu0001-home', Home);
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

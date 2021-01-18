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


    // const testMessage = DOM.create('h1', { className: 'testMessage' }, 'welcome home');
    // DOM.append(testMessage, this.shadow);
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)

    // render the css when the web component is added to the DOM
    // TODO: test for FOUC
    //this.styles.replace(mycss);

    // const testMessage = DOM.create('h1', { className: 'testMessage' }, 'welcome home');
    // DOM.append(testMessage, this.shadow);

    // const testDiv = DOM.create('div', { className: 'testDiv' });
    // DOM.append(testDiv, this.shadow);

    // const renderButton = DOM.create('button', { className: 'renderButton' }, `click to grab current framebuffer`);
    // renderButton.addEventListener("click", function() {
    //   const webGlCanvas = document.querySelector("theu0002-container").shadowRoot.querySelector("theu0002-home").shadowRoot.querySelector("theu0002-home-webgl").shadowRoot.getElementById('domCanvas');

    //   var dataURL = webGlCanvas.toDataURL('image/png');
    //   var newTab = window.open();
    //   newTab.document.body.innerHTML = '<img src="'+ dataURL +'">';
    // });
    // DOM.append(renderButton, this.shadow);

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

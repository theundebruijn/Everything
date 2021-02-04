// npm
import { DOM } from '~/utils/dom.js';
import WebGL from '~/common/components/webgl/WebGL.js';
import css from './TheVeil.css';

class TheVeil extends HTMLElement  {
  constructor() {
    super();

    // we use the web component's shadow dom to isolate the styling
    this.shadow = this.attachShadow({ mode: 'open' });

    const domStyle = DOM.create('style');
    domStyle.innerHTML = css;

    DOM.append(domStyle, this.shadow);
  };

  // web component lifecycle
  connectedCallback() {
    const testMessage = DOM.create('h1', { className: 'testMessage' }, 'part . one');
    DOM.append(testMessage, this.shadow);

    const testMessage2 = DOM.create('h1', { className: 'testMessage2' }, 'the veil');
    DOM.append(testMessage2, this.shadow);

    const _webgl = new WebGL('the-veil');
    DOM.append(_webgl, this.shadow);
  };

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  };
};

customElements.define('theu0001-pages-theveil', TheVeil);
export default TheVeil;

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
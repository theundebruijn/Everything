import { DOM } from '~/utils/dom.js';

import WebGLBackground from '~/common/components/webglBackground/WebGLBackground.js';

import css from './Container.css';

class Container extends HTMLElement  {
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

    this.domPageWrapper = DOM.create('div', { className: 'domPageWrapper' });
    DOM.append(this.domPageWrapper, this.shadow);

    this.domBackgroundWrapper = DOM.create('div', { className: 'domBackgroundWrapper' });
    DOM.append(this.domBackgroundWrapper, this.shadow);

    DOM.append(domStyle, this.shadow);
  };

  connectedCallback() {

    const _webglBackground = new WebGLBackground();
    DOM.append(_webglBackground, this.domBackgroundWrapper);
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)

    // render the css when the web component is added to the DOM
    // TODO: test for FOUC
    // this.styles.replace(css);
  };


};

customElements.define('theu0001-container', Container);
export default Container;

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

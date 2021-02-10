///////////////////
///// IMPORTS /////
///////////////////

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import WebGL from '~/common/components/webgl/WebGL.js';

/// ASSETS ///
import css from './TheManInTheWall.css';


/////////////////
///// CLASS /////
/////////////////

class TheManInTheWall extends HTMLElement  {

  /// CONSTRUCTOR ///
  constructor() {
    super();

    // we use the web component's shadow dom to isolate the styling
    this.shadow = this.attachShadow({ mode: 'open' });

    const domStyle = DOM.create('style');
    domStyle.innerHTML = css;

    DOM.append(domStyle, this.shadow);
  };


  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() {
    const testMessage = DOM.create('h1', { className: 'testMessage' }, 'part . two');
    DOM.append(testMessage, this.shadow);

    const testMessage2 = DOM.create('h1', { className: 'testMessage2' }, 'the man in the wall');
    DOM.append(testMessage2, this.shadow);

    const _webgl = new WebGL('the-man-in-the-wall');
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

customElements.define('theu0001-pages-themaninthewall', TheManInTheWall);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default TheManInTheWall;


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

///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import { TweenMax, Linear } from 'gsap';

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import WebGL from '~/common/components/webgl/WebGL.js';

/// ASSETS CSS ///
import sCSS from './AnotherWorldAwaits.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class AnotherWorldAwaits extends HTMLElement  {

  /// CONSTRUCTOR ///
  constructor() {
    super();

    ///////////////////////////
    ///// CLASS VARIABLES /////
    ///////////////////////////

    this.oDOMElements = Object.create(null);
    this.oComponentInstances = Object.create(null);



    // TEMP
    this.tweens = {};



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

    // TEMP
    this.removeTweens();
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// CREATE ///
  createDomElements() {

    const domChapterWrapper = DOM.create('div', { className: 'testMessage hidden' }, 'part . three');
    DOM.append(domChapterWrapper, this.shadow);

    this.tweens['domChapterWrapper'] = TweenMax.fromTo(domChapterWrapper, 2.000,
      { css: { opacity: 0.0 } }, { css: { opacity: 1.0 }, delay: 2.000, ease: Linear.easeNone }
    );

    const sTitleLine1 = 'another';
    const sTitleLine2 = 'world';
    const sTitleLine3 = 'awaits';

    const domTitleWrapper = DOM.create('div', { className: 'testMessage2' });

    const aTitleLine1Split = sTitleLine1.split('');
    const aTitleLine2Split = sTitleLine2.split('');
    const aTitleLine3Split = sTitleLine3.split('');

    for (let i = 0; i < aTitleLine1Split.length; i++) {
      DOM.append(DOM.create('div', { className: 'hidden line1' }, aTitleLine1Split[i]), domTitleWrapper);
    };
    DOM.append(DOM.create('br', {}), domTitleWrapper);

    for (let i = 0; i < aTitleLine2Split.length; i++) {
      DOM.append(DOM.create('span', { className: 'hidden line2' }, aTitleLine2Split[i]), domTitleWrapper);
    };
    DOM.append(DOM.create('br', {}), domTitleWrapper);

    for (let i = 0; i < aTitleLine3Split.length; i++) {
      DOM.append(DOM.create('span', { className: 'hidden line3' }, aTitleLine3Split[i]), domTitleWrapper);
    };

    DOM.append(domTitleWrapper, this.shadow);

    this.tweens['domTitleWrapperLine1'] = TweenMax.fromTo(domTitleWrapper.querySelectorAll('.line1'), 1.500,
      { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: 0.300, stagger: { each: 0.050, ease: Linear.easeNone } }
    );
    this.tweens['domTitleWrapperLine2'] = TweenMax.fromTo(domTitleWrapper.querySelectorAll('.line2'), 1.500,
      { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: 0.600, stagger: { each: 0.050, ease: Linear.easeNone } }
    );
    this.tweens['domTitleWrapperLine3'] = TweenMax.fromTo(domTitleWrapper.querySelectorAll('.line3'), 1.500,
      { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: 0.900, stagger: { each: 0.050, ease: Linear.easeNone } }
    );

  };

  createComponentInstances() {
    this.oComponentInstances['_webgl'] = new WebGL('another-world-awaits');
    DOM.append(this.oComponentInstances['_webgl'], this.shadow);
  };

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



  // TEMP
  removeTweens() {
    for (const tween in this.tweens) { this.tweens[tween].kill(); };
  };
};


////////////////////////////////////
///// WEB COMPONENT DEFINITION /////
////////////////////////////////////

customElements.define('theu0001-pages-anotherworldawaits', AnotherWorldAwaits);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default AnotherWorldAwaits;


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

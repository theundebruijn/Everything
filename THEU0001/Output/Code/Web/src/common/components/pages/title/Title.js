///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import { TweenMax, Linear } from 'gsap';

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';

/// ASSETS CSS ///
// TODO: rewrite classnames etc
import sCSS from './Title.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class Title extends HTMLElement {

  /// CONSTRUCTOR ///
  constructor(options) {
    super();

    this.options = options;

    ///////////////////////////
    ///// CLASS VARIABLES /////
    ///////////////////////////

    this.oDOMElements = Object.create(null);
    this.oComponentInstances = Object.create(null);

    this.oTweens = Object.create(null);

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

    // TODO: refact into class method
    for (const tween in this.oTweens) { this.oTweens[tween].kill(); };
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// CREATE ///
  createDomElements() {

    this.oDOMElements['domChapterWrapper'] = DOM.create('div', { className: 'testMessage hidden' }, this.options.sChapter);
    DOM.append(this.oDOMElements['domChapterWrapper'], this.shadow);

    this.oTweens['domChapterWrapper'] = TweenMax.fromTo(this.oDOMElements['domChapterWrapper'], 2.000,
      { css: { opacity: 0.0 } }, { css: { opacity: 1.0 }, delay: 2.000, ease: Linear.easeNone },
    );

    const sTitleSplit = this.options.sTitle.split(' ');

    // TODO: make this more dynamic (coutn lines etc)
    const aTitleLine1Split = sTitleSplit[0].split('');
    const aTitleLine2Split = sTitleSplit[1].split('');
    const aTitleLine3Split = sTitleSplit[2].split('');

    this.oDOMElements['domTitleWrapper'] = DOM.create('div', { className: 'testMessage2' });

    for (let i = 0; i < aTitleLine1Split.length; i++) {
      DOM.append(DOM.create('div', { className: 'hidden line1' }, aTitleLine1Split[i]), this.oDOMElements['domTitleWrapper']);
    };
    DOM.append(DOM.create('br', {}), this.oDOMElements['domTitleWrapper']);

    for (let i = 0; i < aTitleLine2Split.length; i++) {
      DOM.append(DOM.create('span', { className: 'hidden line2' }, aTitleLine2Split[i]), this.oDOMElements['domTitleWrapper']);
    };
    DOM.append(DOM.create('br', {}), this.oDOMElements['domTitleWrapper']);

    for (let i = 0; i < aTitleLine3Split.length; i++) {
      DOM.append(DOM.create('span', { className: 'hidden line3' }, aTitleLine3Split[i]), this.oDOMElements['domTitleWrapper']);
    };

    DOM.append(this.oDOMElements['domTitleWrapper'], this.shadow);

    this.oTweens['domTitleWrapperLine1'] = TweenMax.fromTo(this.oDOMElements['domTitleWrapper'].querySelectorAll('.line1'), 1.500,
      { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: 0.300, stagger: { each: 0.050, ease: Linear.easeNone } }
    );
    this.oTweens['domTitleWrapperLine2'] = TweenMax.fromTo(this.oDOMElements['domTitleWrapper'].querySelectorAll('.line2'), 1.500,
      { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: 0.600, stagger: { each: 0.050, ease: Linear.easeNone } }
    );
    this.oTweens['domTitleWrapperLine3'] = TweenMax.fromTo(this.oDOMElements['domTitleWrapper'].querySelectorAll('.line3'), 1.500,
      { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: 0.900, stagger: { each: 0.050, ease: Linear.easeNone } }
    );
  };

  createComponentInstances() {};

  /// ANIMATE ///
  intro(fCB) {
    console.log('Title : ' + 'intro complete');
    fCB();
  };

  outro(fCB) {
    console.log('Title : ' + 'outro complete');
    fCB();
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
};


////////////////////////////////////
///// WEB COMPONENT DEFINITION /////
////////////////////////////////////

customElements.define('theu0001-common-pages-title', Title);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Title;


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

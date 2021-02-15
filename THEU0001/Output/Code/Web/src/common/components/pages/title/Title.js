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
  constructor(oOptions) {
    super();

    this.oOptions = oOptions;

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

    /// CHAPTER ///
    // construct DOM
    this.oDOMElements['domChapter'] = DOM.create('div', { className: 'domChapter' }, this.oOptions.sChapter);
    DOM.append(this.oDOMElements['domChapter'], this.shadow);

    // animate DOM
    this.oTweens['domChapter'] = TweenMax.fromTo(this.oDOMElements['domChapter'], 2.000,
      { css: { opacity: 0.0 } }, { css: { opacity: 1.0 }, delay: 2.000, ease: Linear.easeNone },
    );

    /// TITLE ///
    // construct DOM
    this.oDOMElements['domTitleWrapper'] = DOM.create('div', { className: 'domTitleWrapper' });
    DOM.append(this.oDOMElements['domTitleWrapper'], this.shadow);

    const aTitleSplit = this.oOptions.sTitle.split('\n');

    for (let i = 0; i < aTitleSplit.length; i++) {
      this.oDOMElements['domTitleSplit' + i] = DOM.create('div', { className: 'domTitleSplit' }, aTitleSplit[i]);
      DOM.append(this.oDOMElements['domTitleSplit' + i], this.oDOMElements['domTitleWrapper']);

      const aTitleCharacterSplit = this.oDOMElements['domTitleSplit' + i].innerHTML.split('');
      DOM.empty(this.oDOMElements['domTitleSplit' + i]);

      for (let ii = 0; ii < aTitleCharacterSplit.length; ii++) {
        if (aTitleCharacterSplit[ii] === ' ') { aTitleCharacterSplit[ii] = '\xa0'; };
        this.oDOMElements['domTitleCharacterSplit' + ii] = DOM.create('div', { className: 'domTitleCharacterSplit' }, aTitleCharacterSplit[ii]);
        DOM.append(this.oDOMElements['domTitleCharacterSplit' + ii], this.oDOMElements['domTitleSplit' + i]);
      };
    };

    // animate DOM
    for (let i = 0; i < aTitleSplit.length; i++) {
      this.oTweens['aTitleSplit' + i] = TweenMax.fromTo(this.oDOMElements['domTitleSplit' + i].querySelectorAll('.domTitleCharacterSplit'), 1.500,
        { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: (i * 0.3) + 0.900, stagger: { each: 0.050, ease: Linear.easeNone } },
      );
    };
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

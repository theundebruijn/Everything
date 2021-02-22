///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';
import { TweenMax, Linear } from 'gsap';

/// LOCAL ///
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import { LOG } from '~/utils/LOG.js';

/// ASSETS CSS ///
// TODO: rewrite classnames etc
import sCSS from './Title.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class Title extends HTMLElement {

  /// CONSTRUCTOR ///
  constructor(oOptions, fCB) {
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

    this.__init(fCB);
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

  connectedCallback() {};
  disconnectedCallback() { this.__del(); };


  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  // triggered by the web component connectedCallback
  // we're attached to the DOM at this point
  __init(fCB) {
    LOG('Title : __init');

    async.series([
      function (fCB) { this.createDomElements(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
    ], function (err, results) {
      LOG('Title : __init : complete');

      fCB();
    }.bind(this));

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
  createDomElements(fCB) {

    /// CHAPTER ///
    this.oDOMElements['domChapter'] = DOM.create('div', { className: 'domChapter' }, this.oOptions.sChapter);
    this.oDOMElements['domChapter'].style.color = this.oOptions.sColor;
    DOM.addClass('positionBottom', this.oDOMElements['domChapter']);

    /// TITLE ///
    this.oDOMElements['domTitleWrapper'] = DOM.create('div', { className: 'domTitleWrapper' });
    this.oDOMElements['domTitleWrapper'].style.color = this.oOptions.sColor;
    DOM.addClass('positionBottom', this.oDOMElements['domTitleWrapper']);

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

    /// APPEND ///
    DOM.append(this.oDOMElements['domChapter'], this.shadow);
    DOM.append(this.oDOMElements['domTitleWrapper'], this.shadow);


    fCB();
  };

  createComponentInstances(fCB) { fCB(); };

  /// ANIMATE ///
  intro(fCB) {
    LOG('Title : intro');

    async.parallel([
      function (fCB) {

        /// CHAPTER ///
        this.oTweens['domChapter'] = TweenMax.fromTo(this.oDOMElements['domChapter'], 1.000,
          { css: { opacity: 0.0 } }, { css: { opacity: 1.0 }, delay: 2.000, ease: Linear.easeNone, onComplete() {
            fCB();
          }},
        );

      }.bind(this),

      function (fCB) {

        /// TITLE ///
        const aTitleSplit = this.oOptions.sTitle.split('\n');

        for (let i = 0; i < aTitleSplit.length; i++) {
          this.oTweens['aTitleSplit' + i] = TweenMax.fromTo(this.oDOMElements['domTitleSplit' + i].querySelectorAll('.domTitleCharacterSplit'), 1.500,
            { css: { translateX: -15, opacity: 0.0 } }, { css: { translateX: 0, opacity: 1.0 }, delay: (i * 0.3) + 0.900, stagger: { each: 0.050, ease: Linear.easeNone }, onComplete() {
              if (i === aTitleSplit.length -1) fCB();
            }},
          );
        };

      }.bind(this),
    ], function (err, results) {
      LOG('Title : intro : complete');
      fCB();

    }.bind(this));
  };

  outro(fCB) {
    LOG('Title : outro');

    this.removeTweens();

    // this.oTweens['outro'] = TweenMax.to(this.oDOMElements['domTitleWrapper'], 1.200, {
    //   opacity: 0.0, ease: Linear.easeNone, onComplete: function() { fCB(); }.bind(this),
    // });

    this.oTweens['domChapterOutro'] = TweenMax.to(this.oDOMElements['domChapter'], 0.500,
      { css: { translateX: 0, opacity: 0.0 }, ease: Linear.easeNone, onComplete: function() {}.bind(this) });


    for (let i = 0; i < this.oDOMElements['domTitleWrapper'].children.length; i++) {
      this.oTweens['aTitleSplitOutro' + i] = TweenMax.to(this.oDOMElements['domTitleSplit' + i], 0.600,
        { css: { translateX: 0, opacity: 0.0 }, delay: (i*0.1), ease: Linear.easeNone, onComplete: function() {
          if (i === this.oDOMElements['domTitleWrapper'].children.length -1) {
            LOG('Title : outro : complete');

            fCB();
          };
        }.bind(this) },
      );
    };
  };


  ///////////////////
  ///// CLEANUP /////
  ///////////////////


  removeTweens() {
    for (const tween in this.oTweens) { this.oTweens[tween].kill(); };
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

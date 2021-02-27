///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';
import { TweenMax, Sine, Linear } from 'gsap';

/// LOCAL ///
import { DOM } from '~/_utils/DOM.js';
import { CSS } from '~/_utils/CSS.js';
import { LOG } from '~/_utils/LOG.js';

/// ASSETS CSS ///
// TODO: rewrite classnames etc
import sCSS from './Text.css';


///////////////////////////////
///// WEB COMPONENT CLASS /////
///////////////////////////////

class Text extends HTMLElement {

  /// CONSTRUCTOR ///
  constructor(fCB) {
    super();

    async.parallel([
      function (fCB) { this.createDataStructures(fCB); }.bind(this),
      function (fCB) { this.createShadowDOM(fCB); }.bind(this),
    ], function (err, results) {

      this.__init(fCB);

    }.bind(this));
  };

  createDataStructures(fCB) {
    this.oDOMElements = Object.create(null);
    this.oComponentInstances = Object.create(null);

    this.oTweens = Object.create(null);

    fCB();
  };

  createShadowDOM(fCB) {
    this.shadow = this.attachShadow({ mode: 'open' });

    const oCSSAssets = { sCSS: sCSS };
    const _css = CSS.createDomStyleElement(oCSSAssets);

    DOM.append(_css, this.shadow);

    fCB();
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
    LOG.info('~/pages/home/components/text/Text :: __init');

    async.series([
      function (fCB) { this.createDomElements(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('~/pages/home/components/text/Text :: __init (complete)');

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
    /// PROJECT ///
    this.oDOMElements['domProjectWrapper'] = DOM.create('div', { className: 'domProjectWrapper' }, 'tcejorp');

    /// GIANTESQUE ///
    this.oDOMElements['domTitleWrapper'] = DOM.create('div', { className: 'domTitleWrapper'});

    this.oDOMElements['domTitleLineOneWrapper'] = DOM.create('div', { className: 'domTitleLineOneWrapper' });

    this.oDOMElements['domTitleLineOneCharacterOne'] = DOM.create('div', { className: 'domTitleLineOneCharacter One' }, 'g');
    this.oDOMElements['domTitleLineOneCharacterTwo'] = DOM.create('div', { className: 'domTitleLineOneCharacter Two' }, 'i');
    this.oDOMElements['domTitleLineOneCharacterThree'] = DOM.create('div', { className: 'domTitleLineOneCharacter Three' }, 'a');
    this.oDOMElements['domTitleLineOneCharacterFour'] = DOM.create('div', { className: 'domTitleLineOneCharacter Four' }, 'n');
    this.oDOMElements['domTitleLineOneCharacterFive'] = DOM.create('div', { className: 'domTitleLineOneCharacter Five' }, 't');

    DOM.append(this.oDOMElements['domTitleLineOneCharacterOne'], this.oDOMElements['domTitleLineOneWrapper']);
    DOM.append(this.oDOMElements['domTitleLineOneCharacterTwo'], this.oDOMElements['domTitleLineOneWrapper']);
    DOM.append(this.oDOMElements['domTitleLineOneCharacterThree'], this.oDOMElements['domTitleLineOneWrapper']);
    DOM.append(this.oDOMElements['domTitleLineOneCharacterFour'], this.oDOMElements['domTitleLineOneWrapper']);
    DOM.append(this.oDOMElements['domTitleLineOneCharacterFive'], this.oDOMElements['domTitleLineOneWrapper']);


    this.oDOMElements['domTitleLineTwoWrapper'] = DOM.create('div', { className: 'domTitleLineTwoWrapper' });

    this.oDOMElements['domTitleLineTwoCharacterOne'] = DOM.create('div', { className: 'domTitleLineTwoCharacter One' }, 'e');
    this.oDOMElements['domTitleLineTwoCharacterTwo'] = DOM.create('div', { className: 'domTitleLineTwoCharacter Two' }, 's');
    this.oDOMElements['domTitleLineTwoCharacterThree'] = DOM.create('div', { className: 'domTitleLineTwoCharacter Three' }, 'q');
    this.oDOMElements['domTitleLineTwoCharacterFour'] = DOM.create('div', { className: 'domTitleLineTwoCharacter Four' }, 'u');
    this.oDOMElements['domTitleLineTwoCharacterFive'] = DOM.create('div', { className: 'domTitleLineTwoCharacter Five' }, 'e');

    DOM.append(this.oDOMElements['domTitleLineTwoCharacterOne'], this.oDOMElements['domTitleLineTwoWrapper']);
    DOM.append(this.oDOMElements['domTitleLineTwoCharacterTwo'], this.oDOMElements['domTitleLineTwoWrapper']);
    DOM.append(this.oDOMElements['domTitleLineTwoCharacterThree'], this.oDOMElements['domTitleLineTwoWrapper']);
    DOM.append(this.oDOMElements['domTitleLineTwoCharacterFour'], this.oDOMElements['domTitleLineTwoWrapper']);
    DOM.append(this.oDOMElements['domTitleLineTwoCharacterFive'], this.oDOMElements['domTitleLineTwoWrapper']);

    DOM.append(this.oDOMElements['domTitleLineOneWrapper'], this.oDOMElements['domTitleWrapper']);
    DOM.append(this.oDOMElements['domTitleLineTwoWrapper'], this.oDOMElements['domTitleWrapper']);
    // this.oDOMElements['domChapter'] = DOM.create('div', { className: 'domChapter' }, this.oOptions.sChapter);
    // this.oDOMElements['domChapter'].style.color = this.oOptions.sColor;
    // DOM.addClass('positionBottom', this.oDOMElements['domChapter']);

    // /// TITLE ///
    // this.oDOMElements['domTitleWrapper'] = DOM.create('div', { className: 'domTitleWrapper' });
    // this.oDOMElements['domTitleWrapper'].style.color = this.oOptions.sColor;
    // DOM.addClass('positionBottom', this.oDOMElements['domTitleWrapper']);

    // const aTitleSplit = this.oOptions.sTitle.split('\n');

    // for (let i = 0; i < aTitleSplit.length; i++) {
    //   this.oDOMElements['domTitleSplit' + i] = DOM.create('div', { className: 'domTitleSplit' }, aTitleSplit[i]);
    //   DOM.append(this.oDOMElements['domTitleSplit' + i], this.oDOMElements['domTitleWrapper']);

    //   const aTitleCharacterSplit = this.oDOMElements['domTitleSplit' + i].innerHTML.split('');
    //   DOM.empty(this.oDOMElements['domTitleSplit' + i]);

    //   for (let ii = 0; ii < aTitleCharacterSplit.length; ii++) {
    //     if (aTitleCharacterSplit[ii] === ' ') { aTitleCharacterSplit[ii] = '\xa0'; };
    //     this.oDOMElements['domTitleCharacterSplit' + ii] = DOM.create('div', { className: 'domTitleCharacterSplit' }, aTitleCharacterSplit[ii]);
    //     DOM.append(this.oDOMElements['domTitleCharacterSplit' + ii], this.oDOMElements['domTitleSplit' + i]);
    //   };
    // };

    /// APPEND ///
    DOM.append(this.oDOMElements['domProjectWrapper'], this.shadow);
    DOM.append(this.oDOMElements['domTitleWrapper'], this.shadow);


    fCB();
  };

  createComponentInstances(fCB) { fCB(); };

  /// ANIMATE ///
  intro(fCB) {
    LOG.info('~/pages/home/components/text/Text :: intro');

    async.parallel([
      function (fCB) {

        /// CHAPTER ///
        // this.oTweens['domChapter'] = TweenMax.fromTo(this.oDOMElements['domChapter'], 1.000,
        //   { css: { opacity: 0.0 } }, { css: { opacity: 1.0 }, delay: 2.000, ease: Linear.easeNone, onComplete() {
        //     fCB();
        //   }},
        // );

        fCB();

      }.bind(this),

      function (fCB) {

        /// TITLE ///
        // const aTitleSplit = this.oOptions.sTitle.split('\n');

        // LOG.info(this.oDOMElements['domTitleLineOneWrapper'].children);


        this.oTweens['domProjectWrapper'] = TweenMax.to(this.oDOMElements['domProjectWrapper'], 1.200, {
          opacity: 1.0, delay: 1.800, ease: Linear.easeNone, onComplete: function () {}.bind(this),
        });



        const nDomTitleLineOneWrapperArrayLength = this.oDOMElements['domTitleLineOneWrapper'].children.length;
        let targetX;
        for (let i = 0; i < nDomTitleLineOneWrapperArrayLength; i++) {
          if (i === 0) { targetX = '-30%'; }
          else if (i === 1) { targetX = '-40%'; }
          else if (i === 2) { targetX = '-50%'; }
          else if (i === 3) { targetX = '-60%'; }
          else if (i === 4) { targetX = '-70%'; }
          this.oTweens['domTitleLineOneWrapper' + i] = TweenMax.fromTo(this.oDOMElements['domTitleLineOneWrapper'].children[i], 1.200,
            { css: { translateX: '-250px', opacity: 0.0 } }, {
              css: { translateX: targetX, opacity: 1.0 }, delay: 0.00 + (i * 0.1), ease: Sine.easeOut, onComplete() {
                if (i === nDomTitleLineOneWrapperArrayLength - 1) { LOG.info('BOOOM');  }
              },
            },
          );

        };

        const nDomTitleLineTwoWrapperArrayLength = this.oDOMElements['domTitleLineTwoWrapper'].children.length;
        for (let i = 0; i < nDomTitleLineTwoWrapperArrayLength; i++) {
          if (i === 0) { targetX = '-30%'; }
          else if (i === 1) { targetX = '-40%'; }
          else if (i === 2) { targetX = '-50%'; }
          else if (i === 3) { targetX = '-60%'; }
          else if (i === 4) { targetX = '-70%'; }

          this.oTweens['domTitleLineTwoWrapper' + i] = TweenMax.fromTo(this.oDOMElements['domTitleLineTwoWrapper'].children[i], 1.200,
            { css: { translateX: '-250px', opacity: 0.0 } }, {
              css: { translateX: targetX, opacity: 1.0 }, delay: 0.300 + (i * 0.1), ease: Sine.easeOut, onComplete() {
                if (i === nDomTitleLineTwoWrapperArrayLength - 1) { LOG.info('BOOOM2'); fCB(); }
              },
            },
          );

        };

      }.bind(this),
    ], function (err, results) {
      LOG.info('~/pages/home/components/text/Text :: intro (complete)');
      fCB();

    }.bind(this));
  };

  outro(fCB) {
    LOG.info('~/pages/home/components/text/Text :: outro');

    this.removeTweens();

    // this.oTweens['outro'] = TweenMax.to(this.oDOMElements['domTitleWrapper'], 1.200, {
    //   opacity: 0.0, ease: Linear.easeNone, onComplete: function() { fCB(); }.bind(this),
    // });

    this.oTweens['domChapterOutro'] = TweenMax.to(this.oDOMElements['domChapter'], 0.500,
      { css: { translateX: 0, opacity: 0.0 }, ease: Linear.easeNone, onComplete: function() {
        LOG.info('~/pages/home/components/text/Text :: outro (complete)');
      }.bind(this) });


    // for (let i = 0; i < this.oDOMElements['domTitleWrapper'].children.length; i++) {
    //   this.oTweens['aTitleSplitOutro' + i] = TweenMax.to(this.oDOMElements['domTitleSplit' + i], 0.600,
    //     { css: { translateX: 0, opacity: 0.0 }, delay: (i*0.1), ease: Linear.easeNone, onComplete: function() {
    //       if (i === this.oDOMElements['domTitleWrapper'].children.length -1) {
    //         LOG.info('Title : outro : complete');

    //         fCB();
    //       };
    //     }.bind(this) },
    //   );
    // };

    fCB();
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

customElements.define('theu0001-pages-home-components-text', Text);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Text;


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

// npm dependencies
import { TweenMax, Linear } from 'gsap';

// utilities
import { DOM } from '~/utils/DOM.js';

// components
import WebGL from '~/common/components/webgl/WebGL.js';

// assets
import css from './AnotherWorldAwaits.css';

class AnotherWorldAwaits extends HTMLElement  {
  constructor() {
    super();

    // we use the web component's shadow dom to isolate the styling
    this.shadow = this.attachShadow({ mode: 'open' });

    const domStyle = DOM.create('style');
    domStyle.innerHTML = css;

    this.tweens = {};

    DOM.append(domStyle, this.shadow);
  };

  // web component lifecycle
  connectedCallback() {

    const domChapterWrapper = DOM.create('div', { className: 'testMessage hidden' }, 'part . three');
    DOM.append(domChapterWrapper, this.shadow);

    this.tweens['domChapterWrapper'] = TweenMax.fromTo(domChapterWrapper, 2.000,
      { css: { opacity: 0.0 } }, { css: { opacity: 1.0 }, delay: 2.000, ease: Linear.easeNone }
    );

    const sTitleLine1 = 'another';
    const sTitleLine2 = 'world';
    const sTitleLine3 = 'awaits';

    const domTitleWrapper = DOM.create('div', {className: 'testMessage2'});

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

    const _webgl = new WebGL('another-world-awaits');
    DOM.append(_webgl, this.shadow);
  };

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)

    this.removeTweens();
  };

  removeTweens() {
    for (const tween in this.tweens) { this.tweens[tween].kill(); };
  };
};

customElements.define('theu0001-pages-anotherworldawaits', AnotherWorldAwaits);
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

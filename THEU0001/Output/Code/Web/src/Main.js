///////////////////
///// IMPORTS /////
///////////////////

// import { RxJS } from '~/utils/rxjs.js';
import { Flyd } from '~/utils/flyd.js';
import { DOM } from '~/utils/dom.js';
import Router from '~/utils/Router.js';

import Navigation from '~/common/navigation/Navigation.js';
import Container from '~/common/container/Container.js';

import Home from '~/pages/home/Home.js';
import About from '~/pages/about/About.js';
// import Error from '~/pages/error/Error.js';

// // assets
// import woff2 from './assets/roboto-v20-latin-regular.woff2';

// css
import css from './Main.css';

// TODO: abstract this into a little 'css loader' method
// note we add the '/' to make sure nested static pages refer to the assets folder in the _dist/ root
// const mycss = css.replace(/.\/assets\/roboto-v20-latin-regular.woff2/g, '/' + woff2);

// TODO: see if there's a better way to do this
// TODO: also add load-checking for webfonts
const style = document.createElement('style');
// style.textContent = mycss;
style.textContent = css;
document.head.append(style);

/////////////////
///// CLASS /////
/////////////////

class Main {

  constructor() {


    Flyd.createStream('main:onclick');
    Flyd.addEventListenerToStream('main:onclick', document, 'click');
    Flyd.listenToStream('main:onclick', function(data) {
      console.log('BOOM');
      console.log(data);
    });




    const _navigation = new Navigation();
    document.body.appendChild(_navigation);

    this._container = new Container();
    document.body.appendChild(this._container);

    const _router = new Router();
    this.handleRouterEvents();
  };

  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  handleRouterEvents() {

    Flyd.listenToStream('router:determinePage', function(data) {
      this.setActivePage(data);
    }.bind(this));
  };

  /**
   * Sets a new active page. This destroys the currently active one!
   * @param {String} name page to activate
   */
  setActivePage(pageName) {

    // TODO: do this elegantly
    // TODO: make sure we clean up
    // TODO: make sure we can handle 'outros'
    this._container.shadow.innerHTML = '';

    if (pageName === 'home') {
      const _home = new Home();
      DOM.append(_home, this._container.shadow);

    } else if (pageName === 'about') {
      const _about = new About();
      DOM.append(_about, this._container.shadow);

    } else if (pageName === '404') {
      const _error = new Error('404');
      DOM.append(_error, this._container.shadow);
    };

    DOM.updateMetadata(pageName);
  };
};

const _main = new Main();

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

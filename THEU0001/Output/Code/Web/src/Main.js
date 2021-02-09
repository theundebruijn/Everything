///////////////////
///// IMPORTS /////
///////////////////

import async from 'async';

import { FRP } from '~/utils/FRP.js';
import { DOM } from '~/utils/DOM.js';
import Router from '~/utils/Router.js';

import Navigation from '~/common/components/navigation/Navigation.js';
import Container from '~/common/components/container/Container.js';

import Home from '~/pages/home/Home.js';
import TheVeil from '~/pages/theVeil/TheVeil.js';
import TheManInTheWall from '~/pages/theManInTheWall/TheManInTheWall.js';
import AnotherWorldAwaits from '~/pages/anotherWorldAwaits/AnotherWorldAwaits.js';

// import Error from '~/pages/error/Error.js';

// // assets
import saoldisplay_semibold from './assets/fonts/SaolDisplay-Semibold.woff2';
import lausanne_550 from './assets/fonts/Lausanne-550.woff2';

// css
import css from './Main.css';

// TODO: abstract this into a little 'css loader' method
// note we add the '/' to make sure nested static pages refer to the assets folder in the _dist/ root
let mycss = css.replace(/.\/assets\/fonts\/SaolDisplay-Semibold.woff2/g, '/' + saoldisplay_semibold);
mycss = mycss.replace(/.\/assets\/fonts\/Lausanne-550.woff2/g, '/' + lausanne_550);

// TODO: see if there's a better way to do this
// TODO: also add load-checking for webfonts
const style = document.createElement('style');
// style.textContent = mycss;
style.textContent = mycss;
document.head.append(style);

/////////////////
///// CLASS /////
/////////////////

class Main {

  constructor() {
    const domIcon = document.querySelector('link[rel="icon"]');
    const domAppleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');

    FRP.createStream('window:onfocus');
    FRP.addEventListenerToStream('window:onfocus', window, 'focus');

    FRP.listenToStream('window:onfocus', function (data) {
      domIcon.setAttribute('href', '/static/icons/favicon-giantesque.png');
      domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque.png');
    });

    FRP.createStream('window:onblur');
    FRP.addEventListenerToStream('window:onblur', window, 'blur');

    FRP.listenToStream('window:onblur', function (data) {
      domIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png');
      domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png');
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

    FRP.listenToStream('router:onNewPage', function(data) {

      async.series([
        function (fSeriesCallback) { this.removeActivePage(fSeriesCallback); }.bind(this),
        function (fSeriesCallback) { this.createNewPage(fSeriesCallback, data); }.bind(this),
      ], function (err, results) {}.bind(this));

    }.bind(this));
  };

  removeActivePage(fSeriesCallback) {
    fSeriesCallback();
  };

  createNewPage(fSeriesCallback, sPageName) {

    // TODO: keep track of active page, outro it, render new one on callback

    // TODO: do this elegantly
    // TODO: make sure we clean up
    // TODO: make sure we can handle 'outros'
    DOM.empty(this._container.domPageWrapper);


    if (sPageName === 'home') {
      const _home = new Home();
      DOM.append(_home, this._container.domPageWrapper);

    } else if (sPageName === 'the-veil') {
      const _theVeil = new TheVeil();
      DOM.append(_theVeil, this._container.domPageWrapper);

    } else if (sPageName === 'the-man-in-the-wall') {
      const _theManInTheWall = new TheManInTheWall();
      DOM.append(_theManInTheWall, this._container.domPageWrapper);

    } else if (sPageName === 'another-world-awaits') {
      const _anotherWorldAwairs = new AnotherWorldAwaits();
      DOM.append(_anotherWorldAwairs, this._container.domPageWrapper);

    } else if (sPageName === '404') {
      const _error = new Error('404');
      DOM.append(_error, this._container.domPageWrapper);
    };

    DOM.updateMetadata(sPageName);

    fSeriesCallback();
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

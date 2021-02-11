///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
import { FRP } from '~/utils/FRP.js';
import { DOM } from '~/utils/DOM.js';
import Router from '~/utils/Router.js';

import Navigation from '~/common/components/navigation/Navigation.js';
import Container from '~/common/components/container/Container.js';

import Home from '~/pages/home/Home.js';
import TheVeil from '~/pages/theVeil/TheVeil.js';
import TheManInTheWall from '~/pages/theManInTheWall/TheManInTheWall.js';
import AnotherWorldAwaits from '~/pages/anotherWorldAwaits/AnotherWorldAwaits.js';

/// ASSETS ///
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

  /// CONSTRUCTOR ///
  constructor() {

    ///////////////////////////
    ///// CLASS VARIABLES /////
    ///////////////////////////

    // store the currently active page as a string (s[...])
    this.sCurrActivePage = null;

    // here we store the page that is queued to go 'live' as a string (s[...])
    // this way we can have a page 'outro' take place, keep navigating
    // and only at the very last moment set the page we load next
    this.sQueuedPage = null;

    // here we note if the page is transitioning to a new page at the moment as a boolean (b[...])
    this.bIsTransitioning = false;

    // here we store the class instance of the active page
    // this gets null'ed and repurposed each page transition
    this.cActivePage = null;


    /// CONSTRUCTOR CONTINUED ///
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

    FRP.listenToStream('router:onNewPage', function (sPageName) {

      // happens on first page load
      // if (this.sCurrActivePage === null) {
      //   this.sCurrActivePage = sPageName;
      // };

      // update the queued page every time we get a router event
      this.sQueuedPage = sPageName;

      if (!this.bIsTransitioning) {
        this.bIsTransitioning = true;

        async.series([
          function (fSeriesCallback) { this.removeActivePage(fSeriesCallback); }.bind(this),
          function (fSeriesCallback) { this.createNewPage(fSeriesCallback); }.bind(this),
        ], function (err, results) {

          this.sCurrActivePage = this.sQueuedPage;
          this.bIsTransitioning = false;
        }.bind(this));
      };



    }.bind(this));
  };

  removeActivePage(fSeriesCallback) {

    console.log('removeActivePage: ' + this.sCurrActivePage);

    // happens on first page load
    if (this.sCurrActivePage === null) { fSeriesCallback(); } else {

      // cleanup
      this.cActivePage = null;
      DOM.empty(this._container.domPageWrapper);

      // continue
      fSeriesCallback();
    };

  };

  createNewPage(fSeriesCallback) {

    console.log('createNewPage: ' + this.sQueuedPage);



    if (this.sQueuedPage === 'home') { this.cActivePage = new Home(); }
    else if (this.sQueuedPage === 'the-veil') { this.cActivePage = new TheVeil(); }
    else if (this.sQueuedPage === 'the-man-in-the-wall') { this.cActivePage = new TheManInTheWall(); }
    else if (this.sQueuedPage === 'another-world-awaits') { this.cActivePage = new AnotherWorldAwaits(); }
    else if (this.sQueuedPage === '404') { this.cActivePage = new Error('404'); };

    DOM.append(this.cActivePage, this._container.domPageWrapper);
    DOM.updateMetadata(this.sQueuedPage);

    fSeriesCallback();
  };
};


/////////////////////////
///// INSTANTIATION /////
/////////////////////////

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

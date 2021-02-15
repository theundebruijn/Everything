///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
import { FRP } from '~/utils/FRP.js';
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import Router from '~/utils/Router.js';

import Navigation from '~/common/components/navigation/Navigation.js';
import Container from '~/common/components/container/Container.js';

import Home from '~/pages/home/Home.js';
import TheVeil from '~/pages/theVeil/TheVeil.js';
import TheManInTheWall from '~/pages/theManInTheWall/TheManInTheWall.js';
import AnotherWorldAwaits from '~/pages/anotherWorldAwaits/AnotherWorldAwaits.js';

/// ASSETS CSS ///
import sCSS from './Main.css';
import saoldisplay_semibold from './assets/fonts/SaolDisplay-Semibold.woff2';
import lausanne_550 from './assets/fonts/Lausanne-550.woff2';


////////////////
///// MAIN /////
////////////////

class Main {

  /// CONSTRUCTOR ///
  constructor() {

    console.log(process);

    ///////////////////////////
    ///// CLASS VARIABLES /////
    ///////////////////////////

    this.oComponentInstances = Object.create(null);

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

    /// PRE-INIT CONTRUCTS ///
    this.constructCSS();

    /// INIT (NON WEB COMPONENT) ///
    this.__init();
  };

  constructCSS() {
    const oCSSAssets = {
      sCSS: sCSS,
      fonts: {
        saoldisplay_semibold: { sPath: './assets/fonts/SaolDisplay-Semibold.woff2', sBuildPath: saoldisplay_semibold },
        lausanne_550: { sPath: './assets/fonts/Lausanne-550.woff2', sBuildPath: lausanne_550 },
      },
    };

    const _css = CSS.createDomStyleElement(oCSSAssets);
    DOM.append(_css, document.head);
  };


  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  __init() {
    this.createComponentInstances();
    this.handleRouterEvents();
    this.handleWindowBlurEvents();
    this.intro();
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// CREATE ///
  createComponentInstances() {
    this.oComponentInstances['_navigation'] = new Navigation();
    document.body.appendChild(this.oComponentInstances['_navigation']);

    this.oComponentInstances['_container'] = new Container();
    document.body.appendChild(this.oComponentInstances['_container']);

    this.oComponentInstances['_router'] = new Router();
  };

  /// ANIMATE ///
  intro() {
    async.parallel([
      function (fCB) { this.oComponentInstances['_navigation'].intro(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_container'].intro(fCB); }.bind(this),
    ], function (err, results) {
      console.log('Main : ' + 'intro complete');
    }.bind(this));
  };

  /// EVENT HANDLERS
  handleRouterEvents() {

    FRP.addStreamListener('router:onNewPage', null, function(sPageName) {

      // happens on first page load
      // if (this.sCurrActivePage === null) {
      //   this.sCurrActivePage = sPageName;
      // };

      // update the queued page every time we get a router event
      this.sQueuedPage = sPageName;

      if (!this.bIsTransitioning) {
        this.bIsTransitioning = true;

        async.series([
          function (fCB) { this.removeActivePage(fCB); }.bind(this),
          function (fCB) { this.createNewPage(fCB); }.bind(this),
        ], function (err, results) {

          this.sCurrActivePage = this.sQueuedPage;
          this.bIsTransitioning = false;
        }.bind(this));
      };



    }.bind(this));
  };

  handleWindowBlurEvents() {

    const domIcon = document.querySelector('link[rel="icon"]');
    const domAppleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');

    FRP.addStreamListener('window:onfocus', { target: window, event: 'focus' }, function(data) {

      if (process.env.NODE_ENV === 'production') {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque.png?' + process.env.BUILD_UUID);
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque.png?' + process.env.BUILD_UUID);
      } else {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque.png');
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque.png');
      };
    });

    FRP.addStreamListener('window:onblur', { target: window, event: 'blur' }, function (data) {
      if (process.env.NODE_ENV === 'production') {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png?' + process.env.BUILD_UUID);
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png?' + process.env.BUILD_UUID);
      } else {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png');
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png');
      };
    });

  };

  /// CLASS LOGIC ///
  removeActivePage(fCB) {

    console.log('removeActivePage: ' + this.sCurrActivePage);

    // happens on first page load
    if (this.sCurrActivePage === null) { fCB(); } else {

      async.series([
        function (fCB) { console.log(this.cActivePage); this.cActivePage.outro(fCB); }.bind(this),
      ], function (err, results) {
        // cleanup
        this.cActivePage = null;
        // this 'recursively' triggers the disconnectedCallbacks
        DOM.empty(this.oComponentInstances['_container'].oDOMElements.domPageWrapper);

        // continue
        fCB();
      }.bind(this));
    };
  };

  createNewPage(fCB) {

    console.log('createNewPage: ' + this.sQueuedPage);

    async.series([
      function (fMainCB) {
        if (this.sQueuedPage === 'home') { this.cActivePage = new Home(fMainCB); }
        else if (this.sQueuedPage === 'the-veil') { this.cActivePage = new TheVeil(fMainCB); }
        else if (this.sQueuedPage === 'the-man-in-the-wall') { this.cActivePage = new TheManInTheWall(fMainCB); }
        else if (this.sQueuedPage === 'another-world-awaits') { this.cActivePage = new AnotherWorldAwaits(fMainCB); }
        else if (this.sQueuedPage === '404') { this.cActivePage = new Error('404', fMainCB); };
      }.bind(this),
    ], function (err, results) {
      DOM.append(this.cActivePage, this.oComponentInstances['_container'].oDOMElements.domPageWrapper);
      DOM.updateMetadata(this.sQueuedPage);

      this.cActivePage.intro();

      fCB();
    }.bind(this));
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

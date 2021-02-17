///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
import { ENV } from '~/utils/ENV.js';
import { FRP } from '~/utils/FRP.js';
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import { LOG } from '~/utils/LOG.js';

import Router from '~/utils/Router.js';

import Navigation from '~/common/components/navigation/Navigation.js';
import Container from '~/common/components/container/Container.js';
import Loader from '~/common/components/loader/Loader.js';
// import WebGL from '~/common/components/pages/webgl/WebGL.js';

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
    LOG('Main : __init');

    async.parallel([
      function (fCB) { ENV.detectFeatures(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
      function (fCB) { this.handleRouterEvents(fCB); }.bind(this),
      function (fCB) { this.handleWindowBlurEvents(fCB); }.bind(this),
    ], function (err, results) {
      LOG('Main : __init : complete');

      // trigger inital page
      this.oComponentInstances['_router'].onNewPage();
    }.bind(this));
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// CREATE ///
  createComponentInstances(fCB) {

    async.parallel([
      function (fCB) { this.oComponentInstances['_navigation'] = new Navigation(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_container'] = new Container(fCB); }.bind(this),
      function (fCB) { this.oComponentInstances['_loader'] = new Loader({ sType: 'loader', sContent: 'loader' }, fCB); }.bind(this),
    ], function (err, results) {

      document.body.appendChild(this.oComponentInstances['_navigation']);
      document.body.appendChild(this.oComponentInstances['_container']);
      document.body.appendChild(this.oComponentInstances['_loader']);

      this.oComponentInstances['_router'] = new Router();

      fCB();

    }.bind(this));

  };

  /// EVENT HANDLERS
  handleRouterEvents(cB) {
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

    cB();
  };

  handleWindowBlurEvents(cB) {

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

    cB();

  };

  /// CLASS LOGIC ///
  removeActivePage(fCB) {
    LOG('Main : removeActivePage : ' + this.sCurrActivePage);

    this.oComponentInstances['_loader'].intro(function() {});

    // happens on first page load
    if (this.sCurrActivePage === null) { fCB(); } else {

      async.series([
        function (fCB) { this.cActivePage.outro(fCB); }.bind(this),
      ], function (err, results) {
        LOG('Main : removeActivePage : complete');

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
    LOG('Main : createNewPage : ' + '(queued: ' + this.sQueuedPage + ')');

    async.series([
      function (fCB) {

        if (this.sQueuedPage === 'home') { this.cActivePage = new Home(fCB); }
        else if (this.sQueuedPage === 'the-veil') { this.cActivePage = new TheVeil(fCB); }
        else if (this.sQueuedPage === 'the-man-in-the-wall') { this.cActivePage = new TheManInTheWall(fCB); }
        else if (this.sQueuedPage === 'another-world-awaits') { this.cActivePage = new AnotherWorldAwaits(fCB); }
        else if (this.sQueuedPage === '404') { this.cActivePage = new Error('404', fCB); };
      }.bind(this),

    ], function (err, results) {
      LOG('Main : createNewPage : ' + '(queued: ' + this.sQueuedPage + ') : complete');

      this.oComponentInstances['_loader'].outro(function() {});

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

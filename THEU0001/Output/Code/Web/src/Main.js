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

    // here we store the class instance of the active page
    // this gets null'ed and repurposed each page transition
    this.cActivePage = null;

    // here we store the page that is queued to go 'live' as a string (s[...])
    // this way we can have a page 'outro' take place, keep navigating
    // and only at the very last moment set the page we load next
    this.sQueuedPage = null;


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

    async.series([
      function (fCB) { ENV.detectGPU(fCB); }.bind(this),
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

  // TODO: there is still a rare race condition when _rapidly_ changing pages
  // it looks like the page gets removed in between its __init and intro calls
  // UPD: hmm. can't replicate in the build version of the site

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
  handleRouterEvents(fCB) {
    FRP.addStreamListener('router:onNewPage', null, function(sPageName) {

      // update the queued page every time we get a router event
      this.sQueuedPage = sPageName;
      DOM.updateMetadata(this.sQueuedPage);

      async.series([
        function (fCB) { this.removeActivePage(fCB); }.bind(this),
        function (fCB) { this.createNewPage(fCB); }.bind(this),
      ], function (err, results) {}.bind(this));

    }.bind(this));

    fCB();
  };

  removeActivePage(fCB) {
    this.oComponentInstances['_loader'].intro(function() {});

    // happens on first page load
    if (this.cActivePage === null) { fCB(); } else {

      async.series([
        function (fCB) { this.cActivePage.outro(fCB); }.bind(this),
      ], function (err, results) {
        LOG('Main : removeActivePage : complete');

        // cleanup
        this.cActivePage = null;

        // this 'recursively' triggers the disconnectedCallbacks
        // we need to refer to the object like so as the VS Code intellisense doesn't properly handle bound call scopes (see README.md)
        DOM.empty(this['oComponentInstances']['_container'].oDOMElements.domPageWrapper);

        // continue
        fCB();
      }.bind(this));
    };
  };

  createNewPage(fCB) {
    const newPage = this.sQueuedPage;

    // here we immediately trigger the callback so the transition doesn't block
    // if we don't new pages get queued in the meantime and the wrong page can load in a rare race condition
    fCB();

    async.series([
      function (fCB) {

        if (newPage === 'home') { this.cActivePage = new Home(fCB); }
        else if (newPage === 'the-veil') { this.cActivePage = new TheVeil(fCB); }
        else if (newPage === 'the-man-in-the-wall') { this.cActivePage = new TheManInTheWall(fCB); }
        else if (newPage === 'another-world-awaits') { this.cActivePage = new AnotherWorldAwaits(fCB); }
        // else if (newPage === '404') { this.cActivePage = new Error('404', fCB); };
      }.bind(this),

    ], function (err, results) {
      this.oComponentInstances['_loader'].outro(function() {});

      DOM.append(this.cActivePage, this.oComponentInstances['_container'].oDOMElements.domPageWrapper);
      this.cActivePage.intro();

    }.bind(this));
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

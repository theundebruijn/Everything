///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';

/// LOCAL ///
// NOTE: imports using an alias create a separate(!) instance from relatively imported classes/objects
// to guarantee 'singleton-like' behaviour we need to use the same syntax as our sub components do
import { ENV } from '~/_utils/ENV.js';
import { FRP } from '~/_utils/FRP.js';
import { DOM } from '~/_utils/DOM.js';
import { CSS } from '~/_utils/CSS.js';
import { LOG } from '~/_utils/LOG.js';

import Router from './_utils/Router.js';
import Navigation from './components/navigation/Navigation.js';
import Container from './components/container/Container.js';
import Loader from './components/loader/Loader.js';

import Home from './pages/home/Home.js';
import TheVeil from './pages/theVeil/TheVeil.js';
import TheManInTheWall from './pages/theManInTheWall/TheManInTheWall.js';
import AnotherWorldAwaits from './pages/anotherWorldAwaits/AnotherWorldAwaits.js';

/// ASSETS CSS ///
import sCSS from './Main.css';
import saoldisplay_regular from './_assets/fonts/SaolDisplay-Regular.woff2';
import saoldisplay_regularitalic from './_assets/fonts/SaolDisplay-RegularItalic.woff2';
import saoldisplay_semibold from './_assets/fonts/SaolDisplay-Semibold.woff2';
import lausanne_500 from './_assets/fonts/Lausanne-500.woff2';


////////////////
///// MAIN /////
////////////////

class Main {

  /// CONSTRUCTOR ///
  constructor() {

    async.parallel([
      function (fCB) { this.createDataStructures(fCB); }.bind(this),
      function (fCB) { this.updateDOM(fCB); }.bind(this),
    ], function (err, results) {

      this.__init();

    }.bind(this));
  };

  createDataStructures(fCB) {
    this.oComponentInstances = Object.create(null);

    // here we store the class instance of the active page
    // this gets null'ed and repurposed each page transition
    this.cActivePage = null;

    // here we store the page that is queued to go 'live' as a string (s[...])
    // this way we can have a page 'outro' take place, keep navigating
    // and only at the very last moment set the page we load next
    this.sQueuedPage = null;

    fCB();
  };

  updateDOM(fCB) {
    const oCSSAssets = {
      sCSS: sCSS,
      fonts: {
        saoldisplay_regular: { sPath: './assets/fonts/SaolDisplay-Regular.woff2', sBuildPath: saoldisplay_regular },
        saoldisplay_regularitalic: { sPath: './assets/fonts/SaolDisplay-RegularItalic.woff2', sBuildPath: saoldisplay_regularitalic },
        saoldisplay_semibold: { sPath: './assets/fonts/SaolDisplay-Semibold.woff2', sBuildPath: saoldisplay_semibold },
        lausanne_500: { sPath: './assets/fonts/Lausanne-500.woff2', sBuildPath: lausanne_500 },
      },
    };

    const _css = CSS.createDomStyleElement(oCSSAssets);
    DOM.append(_css, document.head);

    fCB();
  };


  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  __init() {
    LOG.info('~/Main :: __init');

    async.series([
      function (fCB) { ENV.detectGPU(fCB); }.bind(this),
      function (fCB) { this.createEventStreams(fCB); }.bind(this),
      function (fCB) { this.createComponentInstances(fCB); }.bind(this),
      function (fCB) { this.handleRouterEvents(fCB); }.bind(this),
    ], function (err, results) {
      LOG.info('~/Main :: __init (complete)');

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

    async.series([
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
    const _streamListener = FRP.createStreamListener('router:onNewPage', function (sPageName) {
      this.sQueuedPage = sPageName;
      DOM.updateMetadata(this.sQueuedPage);

      async.series([
        function (fCB) { this.removeActivePage(fCB); }.bind(this),
        function (fCB) { this.createNewPage(fCB); }.bind(this),
      ], function (err, results) { }.bind(this));

    }.bind(this));
    // FRP.addStreamListener('router:onNewPage', null, function(sPageName) {

    // update the queued page every time we get a router event


    // }.bind(this));

    fCB();
  };

  removeActivePage(fCB) {
    const stream = FRP.getStream('loader:onchange');
    stream('intro');

    // happens on first page load
    if (this.cActivePage === null) { fCB(); } else {

      async.series([
        function (fCB) { this.cActivePage.outro(fCB); }.bind(this),
      ], function (err, results) {
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
      const stream = FRP.getStream('loader:onchange');
      stream('outro');

      DOM.append(this.cActivePage, this.oComponentInstances['_container'].oDOMElements.domPageWrapper);
      this.cActivePage.intro();

    }.bind(this));
  };

  createEventStreams(fCB) {
    const domIcon = document.querySelector('link[rel="icon"]');
    const domAppleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');

    /// WINDOW RESIZE ///
    FRP.createStream('window:onresize', { target: window, event: 'resize' });

    /// WINDOW FOCUS ///
    FRP.createStream('window:onfocus', { target: window, event: 'focus' });
    const _streamlistener1 = FRP.createStreamListener('window:onfocus', function () {
      if (process.env.NODE_ENV === 'production') {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque.png?' + process.env.BUILD_UUID);
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque.png?' + process.env.BUILD_UUID);
      } else {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque.png');
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque.png');
      };
    });

    /// WINDOW BLUR ///
    FRP.createStream('window:onblur', { target: window, event: 'blur' });
    const _streamlistener2 = FRP.createStreamListener('window:onblur', function () {
      if (process.env.NODE_ENV === 'production') {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png?' + process.env.BUILD_UUID);
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png?' + process.env.BUILD_UUID);
      } else {
        domIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png');
        domAppleTouchIcon.setAttribute('href', '/static/icons/favicon-giantesque_inactive.png');
      };
    });

    fCB();
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

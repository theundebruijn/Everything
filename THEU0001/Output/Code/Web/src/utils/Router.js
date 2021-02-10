///////////////////
///// IMPORTS /////
///////////////////

import { FRP } from '~/utils/FRP.js';

/////////////////
///// CLASS /////
/////////////////

class Router {
  constructor() {
    this.createStreams();
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  createStreams() {
    FRP.createStream('router:onPopState');
    FRP.createStream('router:onNewPage');

    FRP.addEventListenerToStream('router:onPopState', window, 'popstate');
    FRP.listenToStream('router:onPopState', function(data) {
      this.onNewPage();
    }.bind(this));

    // determine initial state
    this.onNewPage();
  };

  /**
   * Determines the pathName based on 'window.location.pathname'.
   */
  getPathName() {
    let pathName = window.location.pathname;
    if (pathName.charAt(0) === '/') { pathName = pathName.substr(1); };

    return pathName;
  };

  /**
   * Determines the page to be loaded based on the determined pathName.
   */
  onNewPage() {
    const pathName = this.getPathName();

    if (pathName === '') {
      const x = FRP.returnStream('router:onNewPage');
      x('home');

    } else if (pathName === 'the-veil/') {
      const x = FRP.returnStream('router:onNewPage');
      x('the-veil');

    } else if (pathName === 'the-man-in-the-wall/') {
      const x = FRP.returnStream('router:onNewPage');
      x('the-man-in-the-wall');

    } else if (pathName === 'another-world-awaits/') {
      const x = FRP.returnStream('router:onNewPage');
      x('another-world-awaits');

    } else {
      const x = FRP.returnStream('router:onNewPage');
      x('404');

    }
  };
};


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Router;


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

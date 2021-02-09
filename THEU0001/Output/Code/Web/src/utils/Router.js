import { Flyd } from '~/utils/flyd.js';

/**
 * Router object (Singleton).
 */
class Router {
  constructor() {
    this.createStreams();
  };

  createStreams() {
    Flyd.createStream('router:onPopState');
    Flyd.createStream('router:onNewPage');

    Flyd.addEventListenerToStream('router:onPopState', window, 'popstate');
    Flyd.listenToStream('router:onPopState', function(data) {
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
      const x = Flyd.returnStream('router:onNewPage');
      x('home');

    } else if (pathName === 'the-veil/') {
      const x = Flyd.returnStream('router:onNewPage');
      x('the-veil');

    } else if (pathName === 'the-man-in-the-wall/') {
      const x = Flyd.returnStream('router:onNewPage');
      x('the-man-in-the-wall');

    } else if (pathName === 'another-world-awaits/') {
      const x = Flyd.returnStream('router:onNewPage');
      x('another-world-awaits');

    } else {
      const x = Flyd.returnStream('router:onNewPage');
      x('404');

    }
  };
};

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

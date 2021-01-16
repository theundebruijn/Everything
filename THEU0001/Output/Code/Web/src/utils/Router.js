import { Flyd } from '~/utils/flyd.js';
import { DOM } from './dom';
// import flyd from 'flyd';

/**
 * Router object (Singleton).
 */
class Router {
  constructor() {
    this.createStreams();
  };

  createStreams() {
    Flyd.createStream('router:onpopstate');
    Flyd.createStream('router:determinePage');

    Flyd.addEventListenerToStream('router:onpopstate', window, 'popstate');
    Flyd.listenToStream('router:onpopstate', function(data) {
      this.determinePage();
    }.bind(this));

    // determine initial state
    this.determinePage();

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
  determinePage() {
    const pathName = this.getPathName();

    if (pathName === '') {
      const x = Flyd.returnStream('router:determinePage');
      x('home');

    } else if (pathName === 'about/') {
      const x = Flyd.returnStream('router:determinePage');
      x('about');

    } else {
      const x = Flyd.returnStream('router:determinePage');
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

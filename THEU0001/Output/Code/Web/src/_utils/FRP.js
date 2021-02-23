///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import flyd from 'flyd';


///////////////
///// OBJ /////
///////////////

const FRP = Object.create(null);


//////////////////////////
///// OBJ PROPERTIES /////
//////////////////////////

FRP.streams = Object.create(null);


///////////////////////
///// OBJ METHODS /////
///////////////////////

// FRP.createStream = function(name, type, target, event) {
//   if (this.streams[name]) throw new Error('stream already defined');
//   this.streams[name] = flyd.stream();
// };

FRP.getStream = function(sName) {
  return this.streams[sName];
};

// FRP.addEventListenerToStream = function(name, target, event) {
//   target.addEventListener(event, this.streams[name]);
// };

// FRP.listenToStream = function(name, callback) {
//   flyd.on(function(data) { callback(data); }, this.streams[name]);
// };

// aggregate method - can be used as an all in one
FRP.addStreamListener = function(sName, oEventListener, callback) {
  // create new stream if it doesn't exist
  if (!this.streams[sName]) this.streams[sName] = flyd.stream();

  // attach the event listener to the stream if present

  // TODO: test if aleady exist to prevent double calls


  if (oEventListener !== null) {
    oEventListener.target.addEventListener(oEventListener.event, this.streams[sName]);
  };

  // subscrive to the stream
  if (callback !== null) {
    flyd.on(function (data) { callback(data); }, this.streams[sName]);
  };
};

//////////////////////
///// ES6 EXPORT /////
//////////////////////

export { FRP };


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

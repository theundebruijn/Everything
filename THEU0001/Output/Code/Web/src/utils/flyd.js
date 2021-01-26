import flyd from 'flyd';

/**
 * Wrapper object. We need to use this syntax to support vscode intellisense.
 * Using Object.create(null) doesn't do this.
 */
const Flyd = {};

Flyd.streams = {};

Flyd.createStream = function(name, type, target, event) {
  this.streams[name] = flyd.stream();
};

Flyd.returnStream = function(name) {
  return this.streams[name];
};

Flyd.addEventListenerToStream = function(name, target, event) {
  target.addEventListener(event, this.streams[name]);
};

Flyd.listenToStream = function(name, callback) {
  flyd.on(function(data) { callback(data); }, this.streams[name]);
};

export { Flyd };

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

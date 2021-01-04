///////////////////
///// IMPORTS /////
///////////////////

// node
import fs from 'fs';

// npm
import async from 'async';
import { v4 as uuidv4 } from 'uuid';

///////////////////
///// METHODS /////
///////////////////

const generateUUID = function(callback) {
  global.UUID = uuidv4();

  if (fs.existsSync('./_tmp')) {
    fs.rmdirSync('./_tmp', { recursive: true });
  };

  fs.mkdir('./_tmp', { recursive: false }, function(err) {
    if (err) throw err;

    fs.writeFile('./_tmp/UUID', global.UUID, function (err) {
      if (err) throw err;

      if (callback) callback();
    });
  });
};


// TODO: see if there's a cleaner way to pass variables between npm scripts.
// process.env won't work as the postbuild script spawns a fresh node instance.

// const updateDracoFilenames = function(callback) {
//   fs.readFile('node_modules/three/examples/jsm/loaders/DRACOLoader.js', 'utf8', function (err, data) {
//     if (err) { return console.log(err); }

//     // TODO?: should we convert this file to a class based scope?
//     // Here we regex match the parth of the draco library to rewrite them based on the UUID.
//     // This way we prevent cache invalidation issues in the future.
//     // NOTE: Special care is taken to make sure we match each and every time we build.
//     // LINK: https://regex101.com/r/lB36Ef/1
//     global.modifiedDraco = data.replace(/_loadLibrary\( 'draco_decoder.*\.js/, '_loadLibrary( \'draco_decoder-'+ global.UUID +'.js');
//     global.modifiedDraco = global.modifiedDraco.replace(/_loadLibrary\( 'draco_wasm_wrapper.*\.js/, '_loadLibrary( \'draco_wasm_wrapper-'+ global.UUID +'.js');
//     global.modifiedDraco = global.modifiedDraco.replace(/_loadLibrary\( 'draco_decoder.*\.wasm/, '_loadLibrary( \'draco_decoder-'+ global.UUID +'.wasm');

//     if (callback) callback();
//   });
// };

// const writeModifiedDraco = function(callback) {
//   fs.writeFile('node_modules/three/examples/jsm/loaders/DRACOLoader.js', global.modifiedDraco, function (err) {
//     if (err) throw err;

//     if (callback) callback();
//   });
// };

// DONE(!): let's file this issue on github (https://github.com/mrdoob/three.js/pull/19737)

// we manually need to rewrite `node_modules/three/build/three.module.js` (src/core/BufferAttribute.js')
// `this.setXY( i, _vector2$1.x, _vector2$1.y, );` -> `this.setXY( i, _vector2$1.x, _vector2$1.y);`
// to prevent it from breaking our build in terser's strict es6 mode
// const fixSyntaxErrorTHREE = function(callback) {
//   fs.readFile('node_modules/three/build/three.module.js', 'utf8', function (err, data) {
//     if (err) { return console.log(err); }

//     // TODO?: should we convert this file to a class based scope?
//     global.modifiedTHREE = data.replace('this.setXY( i, _vector2$1.x, _vector2$1.y, );', 'this.setXY( i, _vector2$1.x, _vector2$1.y );');

//     if (callback) callback();
//   });
// };

// const writeModifiedTHREE = function(callback) {
//   fs.writeFile('node_modules/three/build/three.module.js', global.modifiedTHREE, function (err) {
//     if (err) throw err;

//     if (callback) callback();
//   });
// };

async.series([

  function(callback) { generateUUID(callback); },
  // function(callback) { updateDracoFilenames(callback); },
  // function(callback) { writeModifiedDraco(callback); },
  // function(callback) { fixSyntaxErrorTHREE(callback); },
  // function(callback) { writeModifiedTHREE(callback); },

], function(err, results) {
  if (err) { return console.log(err); }

  console.log('prebuild done.');

});

// const overrideDracoFileNames = function(callback) {
//   fs.readFile('node_modules/three/examples/jsm/loaders/DRACOLoader.js', 'utf8', function (err, data) {
//     if (err) { return console.log(err); }

//     // TODO?: should we convert this file to a class based scope?
//     global.modified = data.replace('this.setXY( i, _vector2$1.x, _vector2$1.y, );', 'this.setXY( i, _vector2$1.x, _vector2$1.y );');

//     if (callback) callback();
//   });
// };



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

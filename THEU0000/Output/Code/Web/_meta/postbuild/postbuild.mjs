// TODO: implement static site rendering(!)

// TODO for the above: generate static index.html files in route-specific folders:
// e.g. ./_dist/about/index.html (make sure paths for the js includes are updated!)

// TODO for the above: see what we can prerender. espc. with the shadow-root contexts
// TODO for the above: make sure we include the proper metadata for these urls
// TODO for the above: see if we need to generete 'standard' files like 200.html. 404.html

///////////////////
///// IMPORTS /////
///////////////////

// node
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// npm
import async from 'async';
import minify from 'html-minifier';
import serve from 'rollup-plugin-serve';
// import gltfPipeline from 'gltf-pipeline';

// TODO: Figure out a way to get the metadata.
// Perhaps we store it somewhere else as a JSON object and use that both here and in the DOM class.
// import * as DOM from '../../src/utils/dom.js';
// console.log(DOM);

///////////////////
///// METHODS /////
///////////////////

const getBuildUUID = function(callback) {
  fs.readFile('./_tmp/UUID', 'utf8', function (err, data) {
    if (err) { return console.log(err); }

    // TODO?: should we convert this file to a class based scope?
    global.UUID = data;

    if (callback) callback();
  });
};

const getIndexFile = function(callback) {
  fs.readFile('./_dist/index.html', 'utf8', function (err, data) {
    if (err) { return console.log(err); }

    global.indexFile = data;

    if (callback) callback();
  });
};

const getMetadataFile = function(callback) {
  fs.readFile('./_meta/assets/metadata/metadata.json', 'utf8', function (err, data) {
    if (err) { return console.log(err); }

    global.metadata = JSON.parse(data);

    if (callback) callback();
  });
};

const generateStaticPage = function(callback, path) {
  fs.mkdir('./_dist'+ path, { recursive: true }, function(err) {
    if (err) throw err;

    // TODO: do this more elegantly
    let relativePath;
    let pageName;

    if (path === '') {
      relativePath = '';
      pageName = 'home';

    };

    // rewrite relative paths for HTML includes
    let localIndexFile = global.indexFile;
    localIndexFile = localIndexFile.replace('/static/main.bundle.mjs', relativePath +'static/main.bundle-'+ global.UUID +'.mjs');
    localIndexFile = localIndexFile.replace('/static/vendor.bundle.mjs', relativePath +'static/vendor.bundle-'+ global.UUID +'.mjs');

    // update the metadata tags
    localIndexFile = localIndexFile.replace('<title></title>', '<title>'+ global.metadata[pageName].document['title'] +'</title>');
    localIndexFile = localIndexFile.replace('"description" content="">', '"description" content="'+ global.metadata[pageName].meta['description'] +'">');
    localIndexFile = localIndexFile.replace('"og:locale" content="">', '"og:locale" content="'+ global.metadata[pageName].meta['og:locale'] +'">');
    localIndexFile = localIndexFile.replace('"og:locale:alternate" content="">', '"og:locale:alternate" content="'+ global.metadata[pageName].meta['og:locale:alternate'] +'">');
    localIndexFile = localIndexFile.replace('"og:site_name" content="">', '"og:site_name" content="'+ global.metadata[pageName].meta['og:site_name'] +'">');
    localIndexFile = localIndexFile.replace('"og:title" content="">', '"og:title" content="'+ global.metadata[pageName].meta['og:title'] +'">');
    localIndexFile = localIndexFile.replace('"og:type" content="">', '"og:type" content="'+ global.metadata[pageName].meta['og:type'] +'">');
    localIndexFile = localIndexFile.replace('"og:url" content="">', '"og:url" content="'+ global.metadata[pageName].meta['og:url'] +'">');
    localIndexFile = localIndexFile.replace('"og:description" content="">', '"og:description" content="'+ global.metadata[pageName].meta['og:description'] +'">');
    localIndexFile = localIndexFile.replace('"og:image" content="">', '"og:image" content="'+ global.metadata[pageName].meta['og:image'] +'">');
    localIndexFile = localIndexFile.replace('"og:image:type" content="">', '"og:image:type" content="'+ global.metadata[pageName].meta['og:image:type'] +'">');
    localIndexFile = localIndexFile.replace('"og:image:width" content="">', '"og:image:width" content="'+ global.metadata[pageName].meta['og:image:width'] +'">');
    localIndexFile = localIndexFile.replace('"og:image:height" content="">', '"og:image:height" content="'+ global.metadata[pageName].meta['og:image:height'] +'">');
    localIndexFile = localIndexFile.replace('"twitter:card" content="">', '"twitter:card" content="'+ global.metadata[pageName].meta['twitter:card'] +'">');
    localIndexFile = localIndexFile.replace('"twitter:site" content="">', '"twitter:site" content="'+ global.metadata[pageName].meta['twitter:site'] +'">');
    localIndexFile = localIndexFile.replace('"twitter:creator" content="">', '"twitter:creator" content="'+ global.metadata[pageName].meta['twitter:creator'] +'">');

    // minify the rewritten HTML
    localIndexFile = minify.minify(localIndexFile, {
      collapseWhitespace: true,
      minifyCSS: true,
      removeComments: true,
    });


    fs.writeFile('./_dist'+ path + '/index.html', localIndexFile, function (err) {
      if (err) throw err;

      if (callback) callback();
    });

  });
};

const revertDracoFilenames = function(callback) {
  fs.readFile('node_modules/three/examples/jsm/loaders/DRACOLoader.js', 'utf8', function (err, data) {
    if (err) { return console.log(err); }

    // TODO?: should we convert this file to a class based scope?
    // Here we revert the rewrites made in the prebuild step.
    // LINK: https://regex101.com/r/lB36Ef/1
    global.modifiedDraco = data.replace(/_loadLibrary\( 'draco_decoder.*\.js/, '_loadLibrary( \'draco_decoder.js');
    global.modifiedDraco = global.modifiedDraco.replace(/_loadLibrary\( 'draco_wasm_wrapper.*\.js/, '_loadLibrary( \'draco_wasm_wrapper.js');
    global.modifiedDraco = global.modifiedDraco.replace(/_loadLibrary\( 'draco_decoder.*\.wasm/, '_loadLibrary( \'draco_decoder.wasm');

    if (callback) callback();
  });
};

const writeModifiedDraco = function(callback) {
  fs.writeFile('node_modules/three/examples/jsm/loaders/DRACOLoader.js', global.modifiedDraco, function (err) {
    if (err) throw err;

    if (callback) callback();
  });
};

const compressGlbFiles = function(callback) {
  // fs.writeFile('node_modules/three/examples/jsm/loaders/DRACOLoader.js', global.modifiedDraco, function (err) {
  //   if (err) throw err;

  //   if (callback) callback();
  // });

  fs.readdir('./_dist/assets', function(err, files) {
    const aGlbFiles = files.filter(function(e){
      return path.extname(e).toLowerCase() === '.glb';
    });

    for (let i = 0; i < aGlbFiles.length; i++) {

      // TODO: build async callback handling for multiuple files
      exec('./node_modules/.bin/gltf-pipeline -i ./_dist/assets/'+ aGlbFiles[i] +' -o ./_dist/assets/'+ aGlbFiles[i] +' -d --draco.compressionLevel 10', function() {

        callback();
      });
    };
  });
};


// TODO: shall we make this work or not?
// const removeAdditionalComments = function(callback) {
//   fs.readFile('./_dist/main.bundle-'+ global.UUID +'.mjs', 'utf8', function (err, data) {
//     if (err) { return console.log(err); }

//     // data = data.replace(/\/\*![^]+\*\//g, '');
//     data = data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g);

//     fs.writeFile('./_dist/main.bundle-'+ global.UUID +'.mjs', data, function (err) {
//       if (err) throw err;

//       if (callback) callback();
//     });
//   });
// };

const cleanTmp = function(callback) {
  fs.rmdirSync('./_tmp', { recursive: true });

  if (callback) callback();
};

//////////////////////////
///// BUILD SEQUENCE /////
//////////////////////////

async.series([

  function(callback) { getBuildUUID(callback); },
  function(callback) { getIndexFile(callback); },
  function(callback) { getMetadataFile(callback); },
  function(callback) { generateStaticPage(callback, ''); },
  // function(callback) { removeAdditionalComments(callback) },
  function(callback) { revertDracoFilenames(callback); },
  function(callback) { writeModifiedDraco(callback); },
  function(callback) { compressGlbFiles(callback); },
  function(callback) { cleanTmp(callback); },

], function(err, results) {
  if (err) { return console.log(err); }

  console.log('postbuild done. serving build preview on: http://studio.giantesque.com:11210');

  serve({
    contentBase: './_dist',
    verbose: true,
    historyApiFallback: false, // important to test static builds
    host: '0.0.0.0',
    public: 'studio.giantesque.com',
    port: 11210,
  });
});

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

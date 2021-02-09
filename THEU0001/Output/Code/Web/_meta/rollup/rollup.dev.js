///////////////////
///// IMPORTS /////
///////////////////

// node
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/Main.js',
  output: {
    format: 'es',
    dir: './_dev/static',
    entryFileNames: 'main.bundle.mjs',
    chunkFileNames: 'vendor.bundle.mjs',
    sourcemap: true,
  },
  manualChunks: {
    vendor: ['gsap', 'three', 'resource-loader'],
  },
  cache: true,
  watch: {
    buildDelay: 0,
    exclude: './node_modules/**',
    clearScreen: false,
  },
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
      sourceMap: false,
    }),
    string({
      include: ['**/*.css', '**/*.glsl'],
    }),
    url({
      include: ['**/*.jpg', '**/*.woff2', '**/*.glb'],
      limit: 0,
      fileName: '../assets/[name][extname]',
    }),
    json(),
    alias({
      entries: { '~': './src' },
    }),
    copy({
      targets: [
        {
          src: './_meta/assets/templates/index.html',
          dest: './_dev',
        },
        {
          src: './_meta/assets/draco/1.4.1/draco_decoder.js',
          dest: './_dev/static/draco',
        },
        {
          src: './_meta/assets/draco/1.4.1/draco_decoder.wasm',
          dest: './_dev/static/draco',
        },
        {
          src: './_meta/assets/draco/1.4.1/draco_wasm_wrapper.js',
          dest: './_dev/static/draco',
        },
      ],
    }),
    serve({
      contentBase: './_dev',
      verbose: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      public: 'local.giantesque.com',
      port: 11110,
    }),
  ],
};

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

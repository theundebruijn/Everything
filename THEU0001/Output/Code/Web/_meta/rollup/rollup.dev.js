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
    vendor: ['gsap', 'three'],
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
      include: ['**/*.css'],
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

///////////////////
///// IMPORTS /////
///////////////////

// node
import fs from 'fs';

// npm
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import { string } from 'rollup-plugin-string';
import copy from 'rollup-plugin-copy';
import cleaner from 'rollup-plugin-cleaner';
import { terser } from 'rollup-plugin-terser';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

// Synchonously read the UUID
global.UUID = fs.readFileSync('./_tmp/UUID', 'utf8');

export default {
  input: './src/Main.js',
  output: {
    format: 'es',
    dir: './_dist/static',
    entryFileNames: 'main.bundle-'+ global.UUID +'.mjs',
    chunkFileNames: 'vendor.bundle-'+ global.UUID +'.mjs',
    sourcemap: false,
  },
  manualChunks: {
    vendor: ['gsap', 'three', 'resource-loader'],
  },
  cache: false,
  watch: {
    buildDelay: 0,
    exclude: './node_modules/**',
    clearScreen: false,
  },
  plugins: [
    cleaner({
      targets: ['./_dist'],
    }),
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
      fileName: '../assets/[hash]-'+ global.UUID +'[extname]',
    }),
    json(),
    alias({
      entries: { '~': './src' },
    }),
    injectProcessEnv({
      NODE_ENV: 'production',
      BUILD_UUID: global.UUID,
    }),
    copy({
      targets: [
        {
          src: './_meta/assets/templates/index.html',
          dest: './_dist',
        },
        {
          src: './_meta/assets/icons/',
          dest: './_dist/static',
        },
        {
          src: './_meta/assets/draco/1.4.1/draco_decoder.js',
          dest: './_dist/static/draco',
          rename: 'draco_decoder-'+ global.UUID + '.js',
        },
        {
          src: './_meta/assets/draco/1.4.1/draco_decoder.wasm',
          dest: './_dist/static/draco',
          rename: 'draco_decoder-'+ global.UUID  +'.wasm',
        },
        {
          src: './_meta/assets/draco/1.4.1/draco_wasm_wrapper.js',
          dest: './_dist/static/draco',
          rename: 'draco_wasm_wrapper-'+ global.UUID +'.js',
        },
      ],
    }),
    terser({
      ecma: 6,
      module: true,
      compress: {
        drop_console: true,
      },
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

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
    vendor: ['gsap', 'three'],
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
      include: ['**/*.css'],
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
    copy({
      targets: [
        {
          src: './_meta/assets/templates/index.html',
          dest: './_dist',
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

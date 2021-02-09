// TODO: add performance tests + optimisations
// TODO: look into renderer exposure (f-stop) values

///////////////////
///// IMPORTS /////
///////////////////

// npm dependencies
import { FRP } from '~/utils/FRP.js';
import async from 'async';
import { DOM } from '~/utils/DOM.js';
import { gsap, TweenMax, Sine, Linear } from 'gsap';
import * as THREE from 'three';

// style sheet
import css from './WebGLBackground.css';

/////////////////////////
///// WEB COMPONENT /////
/////////////////////////

class WebGLBackground extends HTMLElement {
  constructor(page) {
    super();

    this.activePage = page;

    // Create and attach the Shadow DOM wrapper.
    // NOTE: This isolates our Web Component's elements into the Shadow DOM context.
    //       Critical to build component based systems that guarantee isolation.
    this.domShadow = this.attachShadow({ mode: 'open' });
    this.tweens = {};
  };

  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() {
    this.init();
  };

  disconnectedCallback() {
    this.removeAnimationLoop();
    this.removeDomObservers();
    this.removeLoaders();
    this.removeTweens();
    this.removeGui();
    this.removeThree();
  };

  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  init() {

    async.series([
      // Create style tag and attach callback for onload event.
      // This guarantees the Shadow DOM has applied the CSS stylings.
      // Essential for calculating canvas sizes, renderer aspect ratio etc.
      function (callback) {

        // Basic style injection into the shadow root.
        // TODO: replace this with the CSSStyleSheet interface when browser
        //       support for using this in a Shadow DOM context is there.
        // LINK: https://github.com/WICG/construct-stylesheets/blob/gh-pages/explainer.md
        const shadowStyles = css; // Apply transforms on the CSS if needed here.

        const domStyle = DOM.create('style');
        domStyle.innerHTML = shadowStyles;
        domStyle.onload = function () { callback(); };
        DOM.append(domStyle, this.domShadow);

      }.bind(this),

      // As the CSS has been applied to the Shadow DOM we can start creating the WebGL environment.
      // NOTE: no need to wait on async loading of resources.
      function (callback) {
        this.createCanvas();
        this.createScene();
        this.createRenderer();
        this.createControls();
        this.createDomObservers();
        this.createBundledEntities();
        this.createHelpers();
        this.createBundledEntityTweens();
        this.createGui();
        this.createAnimationLoop();

        callback();
      }.bind(this),

      // Async call for loading resources over XHR.
      function (callback) {
        this.loadResources(callback);
      }.bind(this),

      function (callback) {
        this.processResources(callback);
      }.bind(this),

    ], function (err, results) {
      if (err) { return console.log(err); }

      // Now the resources have been loaded we can compute the methods that rely on them.
      this.createLoadedEntities();
      this.createLoadedEntityTweens();

      this.handleRouterEvents();

    }.bind(this));
  };

  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  createCanvas() {

    // We create a wrapper element as the canvas tag doesn't resize based on '%' stylings.
    this.domCanvasWrapper = DOM.create('div', { className: 'domCanvasWrapper' });
    DOM.append(this.domCanvasWrapper, this.domShadow);

    this.domCanvas = DOM.create('canvas', { id: 'domCanvas', className: 'domCanvas' });
    this.domCanvasContext = this.domCanvas.getContext('webgl', { powerPreference: 'high-performance', preserveDrawingBuffer: true });
    DOM.append(this.domCanvas, this.domCanvasWrapper);
  };

  createScene() {
    this.scene = new THREE.Scene();
    // set the background color on the scene - NOT on the renderer
    // much more efficient easing
    this.scene.background = new THREE.Color(0xffffff); // white like the html

    this.camera = new THREE.PerspectiveCamera(45, this.domCanvas.clientWidth / this.domCanvas.clientHeight, 1, 10000);
    this.camera.updateProjectionMatrix();
  };

  createRenderer() {
    // Our main renderer.
    // NOTE: We don't utilise the THREE.EffectComposer as we're not planning on any postprocessing effects.
    //       We'll stick to material shader effects and skip the overhead of the composor chain.
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.domCanvas,
      context: this.domCanvasContext,
      antialias: false,
      alpha: false,
    });

    this.renderer.setSize(this.domCanvas.clientWidth, this.domCanvas.clientHeight);

    // Here we brute force 20% supersampling - rather than grabbing the device native scaling
    // Saves on performance on hidpi devices while applying a little extra anti aliasing
    this.renderer.setPixelRatio(1.2);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 0.18; // exposure / f-stop

    // LINK: https://threejs.org/examples/#webgl_lights_physical
    // LINK: https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_physical.html
    this.renderer.physicallyCorrectLights = true;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    // this.renderer.setClearColor(0xff0000, 1.0);

    // TODO: don't do this here. keep them fully transparent
    // and handle the color transitions in css
    // this way we can swap out webgl renderers without issue
    // or we use a second webgl scene in the bg just for color transition
    // if(this.activePage === 'home') {
    //   this.renderer.setClearColor(0xf5efec, 1.0);
    // } else if (this.activePage === 'another-world-awaits') {
    //   // TODO: ease into this while animating in
    //   this.renderer.setClearColor(0x0e0e14, 1.0);
    // };
  };

  createControls() {};

  createDomObservers() {

    // Handler to set size of the domCanvasWrapper and its domCanvas child
    // NOTE: We call this before creating the scene and camera to guarantee correct sizings.
    //       The ResizeObserver makes sure we handle subsequent resizes of the domCanvasWrapper.
    this.canvasWrapperResizeObserver = new ResizeObserver(function (entries) {
      this.onCanvasWrapperResize(entries[0].contentRect.width, entries[0].contentRect.height);
    }.bind(this));

    this.canvasWrapperResizeObserver.observe(this.domCanvasWrapper);
  };

  createBundledEntities() {};
  createBundledEntityTweens() {};
  loadResources(callback) { if (callback) callback(); };
  processResources(callback) { if (callback) callback(); };
  createLoadedEntities() {};
  createLoadedEntityTweens() {};
  createGui() {};
  createHelpers() {};

  createAnimationLoop() {
    this.renderer.setAnimationLoop(this.tick.bind(this));
  };

  tick() {
    // update renderer
    this.renderer.render(this.scene, this.camera);
  };

  //////////////////////////////
  ///// DOM EVENT HANDLERS /////
  //////////////////////////////

  onCanvasWrapperResize(updatedWidth, updatedHeight) {
    this.domCanvas.style.width = updatedWidth + 'px';
    this.domCanvas.style.height = updatedHeight + 'px';

    this.renderer.setSize(updatedWidth, updatedHeight);

    this.camera.aspect = updatedWidth / updatedHeight;
    this.camera.updateProjectionMatrix();
  };

  handleRouterEvents() {

    FRP.listenToStream('router:onNewPage', function (data) {
      this.updateBackgroundColor(data);
    }.bind(this));
  };

  updateBackgroundColor(sPageName) {
    if (this.tweens['backgroundColor']) this.tweens['backgroundColor'].kill();

    // TODO: fix white bg color flash
    let oTargetColor;
    if (sPageName === 'home') { oTargetColor = new THREE.Color(0xfdfbf8); }
    else if (sPageName === 'the-veil') { oTargetColor = new THREE.Color(0xa08b68); }
    else if (sPageName === 'the-man-in-the-wall') { oTargetColor = new THREE.Color(0xa08b68); }
    else if (sPageName === 'another-world-awaits') { oTargetColor = new THREE.Color(0x000000); }
    else if (sPageName === '404') { oTargetColor = new THREE.Color(0xfdfbf8); };

    this.tweens['backgroundColor'] = TweenMax.to(this.scene.background, 4.00, {
      r: oTargetColor.r, g: oTargetColor.g, b: oTargetColor.b,
      ease: Sine.easeInOut, onComplete: function () { },
    });
  };

  ///////////////////
  ///// CLEANUP /////
  ///////////////////

  removeAnimationLoop() {
    this.renderer.setAnimationLoop(null);
  };

  removeDomObservers() {
    this.canvasWrapperResizeObserver.unobserve(this.domCanvasWrapper);
    this.canvasWrapperResizeObserver.disconnect();
  };

  removeTweens() {
    for (const tween in this.tweens) { this.tweens[tween].kill(); };
  };

  removeGui() {
    this.gui.destroy();
  };


  removeLoaders() {
    this.dracoLoader.dispose();
  };

  removeThree() {
    if (this.scene) {
      for (let i = this.scene.children.length - 1; i >= 0; i--) {
        if (this.scene.children[i] instanceof THREE.Mesh) {
          this.scene.children[i].geometry.dispose();
          this.scene.children[i].material.dispose();
        }
        this.scene.remove(this.scene.children[i]);
      };

      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.scene = null;
      this.camera = null;
      this.renderer = null;
    };
  };
};

customElements.define('theu0001-common-webglbackground', WebGLBackground);
export default WebGLBackground;

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

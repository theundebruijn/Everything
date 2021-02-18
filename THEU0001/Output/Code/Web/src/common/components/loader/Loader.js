///////////////////
///// IMPORTS /////
///////////////////

/// NPM ///
import async from 'async';
import { TweenMax, Linear, Sine } from 'gsap';
import { Loader as ResourceLoader, Resource } from 'resource-loader';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/// LOCAL ///
import { FRP } from '~/utils/FRP.js';
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';

/// ASSETS ///
import sCSS from './Loader.css';
import LoaderAsset from './assets/loader.glb';
import { LOG } from '../../../utils/LOG';


/////////////////
///// CLASS /////
/////////////////

class Loader extends HTMLElement {

  /// CONSTRUCTOR ///
  constructor(oOptions, fCB) {
    super();

    this.oOptions = oOptions;

    this.activePage = this.oOptions.sContent;


    // Create holders for entities we need to keep track of.
    this.resources = {};

    this.entities = {};
    this.entities.meshes = {};
    this.entities.lights = {};
    this.entities.helpers = {};

    this.tweens = {};

    /// PRE-INIT CONTRUCTS ///
    this.constructShadowDOM();


    this.__init(fCB);
  };

  constructShadowDOM() {
    this.shadow = this.attachShadow({ mode: 'open' });

    const oCSSAssets = { sCSS: sCSS };
    const _css = CSS.createDomStyleElement(oCSSAssets);

    DOM.append(_css, this.shadow);
  };


  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() { };
  disconnectedCallback() { this.destroy(); };

  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  __init(fCB) {
    LOG('Loader : __init');

    async.series([
      // As the CSS has been applied to the Shadow DOM we can start creating the WebGL environment.
      // NOTE: no need to wait on async loading of resources.
      function (callback) {
        this.createCanvas();
        this.createScene();
        this.createRenderer();
        this.createControls();
        this.createDomObservers();
        this.createBundledEntities();
        this.createBundledEntityTweens();
        if (process.env.NODE_ENV === 'development') this.createHelpers();
        if (process.env.NODE_ENV === 'development') this.createGui();
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
      // LOG('Loader : __init : complete');
      if (err) { return LOG.error(err); }

      // Now the resources have been loaded we can compute the methods that rely on them.
      this.createLoadedEntities();
      this.createLoadedEntityTweens();

      fCB();

    }.bind(this));
  };

  destroy() {
    // TODO: replace with proper outro
    // this timeout prevents a white flash when we immediately remove the draw calls
    setTimeout(function () {
      this.removeAnimationLoop();
      this.removeDomObservers();
      this.removeLoaders();
      this.removeTweens();
      if (process.env.NODE_ENV === 'development') this.removeGui();
      this.removeThree();
    }.bind(this), 10);
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// ANIMATE ///
  intro() {
    LOG('Loader : intro');

    if (this.tweens['sceneIntro']) this.tweens['sceneIntro'].kill();
    if (this.tweens['sceneOutro']) this.tweens['sceneOutro'].kill();

    // resume render loop
    for (const tween in this.tweens) { this.tweens[tween].resume(); };
    this.renderer.setAnimationLoop(this.tick.bind(this));

    this.tweens['sceneIntro'] = TweenMax.to(this.domCanvas, 0.500, {
      opacity: 1.0, delay: 0.650, ease: Linear.easeNone, onComplete: function() {
        LOG('Loader : intro : complete');
      }.bind(this),
    });
  };

  outro() {
    LOG('Loader : outro');

    if (this.tweens['sceneIntro']) this.tweens['sceneIntro'].kill();
    if (this.tweens['sceneOutro']) this.tweens['sceneOutro'].kill();

    this.tweens['sceneOutro'] = TweenMax.to(this.domCanvas, 0.500, {
      opacity: 0.0, ease: Linear.easeNone, onComplete: function() {
        LOG('Loader : outro : complete');

        // kill render loop
        for (const tween in this.tweens) { this.tweens[tween].pause(); };
        this.renderer.setAnimationLoop(null);
      }.bind(this),
    });
  };

  createCanvas() {
    // TODO: move this to an animation handler
    this.clock = new THREE.Clock();

    // We create a wrapper element as the canvas tag doesn't resize based on '%' stylings.
    this.domCanvasWrapper = DOM.create('div', { className: 'domCanvasWrapper' });
    DOM.append(this.domCanvasWrapper, this.shadow);

    this.domCanvas = DOM.create('canvas', { id: 'domCanvas', className: 'domCanvas' });
    this.domCanvasContext = this.domCanvas.getContext('webgl', { powerPreference: 'high-performance', preserveDrawingBuffer: true });
    DOM.append(this.domCanvas, this.domCanvasWrapper);
  };

  createScene() {
    this.scene = new THREE.Scene();
    // this.scene.position.y = -100;
    this.camera = new THREE.PerspectiveCamera(45, this.domCanvas.clientWidth / this.domCanvas.clientHeight, 1, 10000);

    this.camera.fov = 20;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 150;

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
      alpha: true,
    });

    this.renderer.setSize(this.domCanvas.clientWidth, this.domCanvas.clientHeight);
    this.renderer.setPixelRatio(1.5);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 0.18; // exposure / f-stop

    // LINK: https://threejs.org/examples/#webgl_lights_physical
    // LINK: https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_physical.html
    this.renderer.physicallyCorrectLights = true;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  };

  createControls() {
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true;
    // this.controls.dampingFactor = 0.04;
  };

  createDomObservers() {

    // Handler to set size of the domCanvasWrapper and its domCanvas child
    // NOTE: We call this before creating the scene and camera to guarantee correct sizings.
    //       The ResizeObserver makes sure we handle subsequent resizes of the domCanvasWrapper.
    this.canvasWrapperResizeObserver = new ResizeObserver(function (entries) {
      this.onCanvasWrapperResize(entries[0].contentRect.width, entries[0].contentRect.height);
    }.bind(this));

    this.canvasWrapperResizeObserver.observe(this.domCanvasWrapper);
  };

  createBundledEntities() {
    // LINK: https://en.wikipedia.org/wiki/Lux
    // LINK: https://threejs.org/docs/#api/en/lights/shadows/LightShadow.bias


    this.entities.lights['pointLight'] = new THREE.PointLight(0xc4c4f5, 50000.0, 500, 2.0);
    this.entities.lights['pointLight'].position.set(20, 20, 20);

    // TODO: why does this add a massive GPU load? (shadows?)
    // this.entities.lights['pointLight2'] = new THREE.PointLight(0xa08b68, 5000.0, 500, 2.0);
    // this.entities.lights['pointLight2'].position.set(0, 10, 20);

    this.entities.lights['pointLight'].castShadow = true;
    this.entities.lights['pointLight'].shadow.bias = -0.0005;
    this.entities.lights['pointLight'].shadow.mapSize.width = 2048;
    this.entities.lights['pointLight'].shadow.mapSize.height = 2048;
    this.entities.lights['pointLight'].updateMatrixWorld(true);
    this.scene.add(this.entities.lights['pointLight']);

    // if (this.entities.lights['pointLight2']) {
    //   this.entities.lights['pointLight2'].castShadow = true;
    //   this.entities.lights['pointLight2'].shadow.bias = -0.0005;
    //   this.entities.lights['pointLight2'].shadow.mapSize.width = 8192;
    //   this.entities.lights['pointLight2'].shadow.mapSize.height = 8192;
    //   this.entities.lights['pointLight2'].updateMatrixWorld(true);
    //   this.scene.add(this.entities.lights['pointLight2']);
    // }
  };

  createBundledEntityTweens() {


    this.tweens['pointLightPosition'] = TweenMax.fromTo(this.entities.lights['pointLight'].position, 10, {
      x: this.entities.lights['pointLight'].position.x,
    }, {
      x: -20,
      repeat: -1, yoyo: true, ease: Sine.easeInOut, onComplete: function() {},
    });

  };

  loadResources(callback) {
    const resourceLoader = new ResourceLoader();
    const gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader(); // class scope reference so we can dispose it.
    this.dracoLoader.setDecoderPath('/static/draco/');
    this.dracoLoader.setWorkerLimit(10);
    this.dracoLoader.preload();
    gltfLoader.setDRACOLoader(this.dracoLoader);


    resourceLoader.add('glft_scene', LoaderAsset, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });


    resourceLoader.use(function (resource, next) {

      if (resource.extension === 'glb') {
        gltfLoader.parse(resource.data, '', function (gltf) {
          this.resources[resource.name] = gltf;

          next();
        }.bind(this));
      }
    }.bind(this));

    resourceLoader.load(function (resourceLoader, resources) {
      if (callback) callback();
    }.bind(this));
  };

  processResources(callback) {
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

    for (const resource in this.resources) {

      this.resources[resource].scene.traverse(function (resource) {
        // set mesh interpretation
        if (resource.isMesh) {
          resource.castShadow = true;
          resource.receiveShadow = true;

          // set texture map interpretation
          if (resource.material.map !== null) {
            resource.material.map.anisotropy = maxAnisotropy;
          };
        };
      }.bind(this));
    };

    callback();
  };

  createLoadedEntities() {
    this.scene.add(this.resources['glft_scene'].scene);

  };

  createLoadedEntityTweens() {
    // if (this.activePage === 'another-world-awaits') {
    //   this.tweens['pointLightIntensity'] = TweenMax.fromTo(this.resources['test'].scene.children[1].position, 10, {
    //     y: this.resources['test'].scene.children[1].position.y -50,
    //   }, {
    //     y: this.resources['test'].scene.children[1].position.y,
    //     repeat: -1, yoyo: true, ease: Sine.easeInOut, onComplete: function() {},
    //   });
    // }
  };

  createGui() {
  };

  createHelpers() { };

  createAnimationLoop() {
    this.renderer.setAnimationLoop(this.tick.bind(this));
  };

  tick() {
    // update controls
    // this.controls.update();

    this.scene.rotation.y = this.scene.rotation.y + 0.035;

    // update dat.gui
    // if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_x = this.camera.position.x;
    // if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_y = this.camera.position.y;
    // if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_z = this.camera.position.z;

    // if (this.controlsTargetOptions) this.controlsTargetOptions.x = this.controls.target.x;
    // if (this.controlsTargetOptions) this.controlsTargetOptions.y = this.controls.target.y;
    // if (this.controlsTargetOptions) this.controlsTargetOptions.z = this.controls.target.z;

    // update animations
    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

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


////////////////////////////////////
///// WEB COMPONENT DEFINITION /////
////////////////////////////////////

customElements.define('theu0001-common-loader', Loader);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default Loader;


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

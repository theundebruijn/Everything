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
import { Reflector } from 'three/examples/jsm/objects/Reflector';

/// LOCAL ///
import { FRP } from '~/utils/FRP.js';
import { ENV } from '~/utils/ENV.js';
import { DOM } from '~/utils/DOM.js';
import { CSS } from '~/utils/CSS.js';
import { LOG } from '~/utils/LOG.js';

/// ASSETS ///
import sCSS from './WebGL.css';
import home_LOD0 from './assets/home_LOD0.glb';
import home_LOD1 from './assets/home_LOD1.glb';
import theMainInTheWall_LOD0 from './assets/the-man-in-the-wall_LOD0.glb';
import theMainInTheWall_LOD1 from './assets/the-man-in-the-wall_LOD1.glb';
import theVeil_LOD0 from './assets/the-veil_LOD0.glb';
import theVeil_LOD1 from './assets/the-veil_LOD1.glb';
import anotherWorldAwaits_LOD0 from './assets/another-world-awaits_LOD0.glb';
import anotherWorldAwaits_LOD1 from './assets/another-world-awaits_LOD1.glb';

import sReflectorFragment from './shaders/sReflectorFragment.glsl';

// fragment shader override
Reflector['ReflectorShader'].fragmentShader = sReflectorFragment;


/////////////////
///// CLASS /////
/////////////////

class WebGL extends HTMLElement {

  /// CONSTRUCTOR ///
  constructor(oOptions, fCB) {
    super();

    this.oOptions = oOptions;

    async.parallel([
      function (fCB) { this.createEnvironment(fCB); }.bind(this),
      function (fCB) { this.createDataStructures(fCB); }.bind(this),
      function (fCB) { this.createShadowDOM(fCB); }.bind(this),
    ], function (err, results) {

      this.__init(fCB);

    }.bind(this));
  };

  createEnvironment(fCB) {
    this.env = Object.create(null);
    this.env.bIsMobile = ENV.getGPU().isMobile;
    this.env.nGPUTier = ENV.getGPU().tier;
    this.env.sGPU = ENV.getGPU().gpu;

    let num = null;
    this.env.bIsRecentAppleGPU = false;

    if (this.env.sGPU !== undefined) { // undefined through device emulation in chromium
      if (this.env.sGPU.includes('apple a')) {
        num = this.env.sGPU.replace(/[^0-9]/g,'');
        if (num >= 12) {
          this.env.bIsRecentAppleGPU = true;
        };
      };
    };

    fCB();
  };

  createDataStructures(fCB) {
    this.activePage = this.oOptions.sContent;

    this.resources = {};
    this.entities = {};
    this.entities.meshes = {};
    this.entities.lights = {};
    this.entities.helpers = {};
    this.oTweens = {};
    this.mixer = null;

    this.fAnimateToPositionInterval = null;
    this.nAnimationToPositionCounter = 0;
    this.aPositions = new Array(Object.create(null), Object.create(null), Object.create(null));

    if (this.activePage === 'home') {
      this.aPositions[0] = { camera: { fov: 20, posX: -60, posY: -65, posZ: 95 }, target: { posX: 0, posY: 0, posZ: 0 } };
      this.aPositions[1] = { camera: { fov: 20, posX: 100, posY: -6, posZ: 14 }, target: { posX: -9.5, posY: 2, posZ: 18.5 } };
      this.aPositions[2] = { camera: { fov: 20, posX: 0, posY: -75, posZ: 102 }, target: { posX: 0, posY: 17, posZ: 11 } };
    } else if (this.activePage === 'the-veil') {
      this.aPositions[0] = { camera: { fov: 20, posX: -97, posY: 13, posZ: 30 }, target: { posX: 0, posY: 0, posZ: 0 } };
      this.aPositions[1] = { camera: { fov: 20, posX: -5, posY: 6, posZ: 61 }, target: { posX: -3.5, posY: 5.5, posZ: 0 } };
      this.aPositions[2] = { camera: { fov: 20, posX: 42.5, posY: -40, posZ: 36.5 }, target: { posX: 1, posY: 5, posZ: 1.5 } };
    } else if (this.activePage === 'the-man-in-the-wall') {
      this.aPositions[0] = { camera: { fov: 20, posX: -41, posY: 45, posZ: 58 }, target: { posX: 0, posY: 0, posZ: 0 } };
      this.aPositions[1] = { camera: { fov: 20, posX: 43, posY: 1.5, posZ: -12 }, target: { posX: -0.85, posY: 2.5, posZ: 8 } };
      this.aPositions[2] = { camera: { fov: 20, posX: -15.5, posY: 6.5, posZ: -39.5 }, target: { posX: -0.85, posY: 3.5, posZ: 6.5 } };
    } else if (this.activePage === 'another-world-awaits') {
      this.aPositions[0] = { camera: { fov: 60, posX: -300, posY: 300, posZ: 600 }, target: { posX: 0, posY: 0, posZ: 0 } };
      this.aPositions[1] = { camera: { fov: 60, posX: 0, posY: 0, posZ: 0 }, target: { posX: 0, posY: 0, posZ: 0 } };
      this.aPositions[2] = { camera: { fov: 60, posX: 0, posY: 0, posZ: 0 }, target: { posX: 0, posY: 0, posZ: 0 } };
    };

    fCB();
  };

  createShadowDOM(fCB) {
    this.shadow = this.attachShadow({ mode: 'open' });

    const oCSSAssets = { sCSS: sCSS };
    const _css = CSS.createDomStyleElement(oCSSAssets);

    DOM.append(_css, this.shadow);

    fCB();
  };


  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() {};
  disconnectedCallback() { this.destroy(); };

  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  __init(fCB) {
    LOG.info('WebGL : __init');

    async.series([
      // As the CSS has been applied to` the Shadow DOM we can start creating the WebGL environment.
      // NOTE: no need to wait on async loading of resources.
      function (callback) {
        this.createCanvas();
        this.createScene();
        this.createRenderer();
        this.createControls();
        this.createDomObservers();
        this.createBundledEntities();
        this.createBundledEntityTweens();
        if (process.env.NODE_ENV === 'development' && !this.env.bIsMobile) this.createHelpers();
        if (process.env.NODE_ENV === 'development' && !this.env.bIsMobile) this.createGui();
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
      LOG.info('WebGL : __init : complete');
      if (err) { return LOG['error'](err); }

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
      if (process.env.NODE_ENV === 'development' && !this.env.bIsMobile) this.removeGui();
      this.removeThree();
    }.bind(this), 10);
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /// ANIMATE ///
  intro(fCB) {
    LOG.info('WebGL : intro');

    this.camera.fov = this.aPositions[0].camera.fov;

    // TODO : create a separate intro position (just for another world awaits ?)
    this.oTweens['cameraIntro'] = TweenMax.fromTo(this.camera.position, 2.000, {
      x: this.aPositions[0].camera.posX / 3, y: this.aPositions[0].camera.posY / 3, z: this.aPositions[0].camera.posZ / 3,
    }, {
      x: this.aPositions[0].camera.posX, y: this.aPositions[0].camera.posY, z: this.aPositions[0].camera.posZ,
      ease: Sine.easeOut, onComplete: function() {}.bind(this),
    });

    // TODO: clear and recreate interval on window blur/focus ?
    // or perhaps a boolean check
    this.fAnimateToPositionInterval = setInterval(function() {

      // @ts-ignore // tsc doesn't properly parse bound scopes so we have to ignore
      this.nAnimationToPositionCounter++;
      // @ts-ignore // tsc doesn't properly parse bound inputs so we have to ignore
      if (this.nAnimationToPositionCounter > this.aPositions.length -1) { this.nAnimationToPositionCounter = 0; };
      // @ts-ignore // tsc doesn't properly parse bound inputs so we have to ignore
      this.animateToPosition(this.nAnimationToPositionCounter);

    }.bind(this), 30 * 1000);

    // if (this.activePage === 'the-veil') { this.camera.fov = 20; targetX = -97; targetY = 13; targetZ = 30; }
    // if (this.activePage === 'the-man-in-the-wall') { this.camera.fov = 20; targetX = -41; targetY = 45; targetZ = 58; }
    // if (this.activePage === 'another-world-awaits') { this.camera.fov = 60; targetX = -300; targetY = 300; targetZ = 600; }



    this.oTweens['domCanvasIntro'] = TweenMax.to(this.domCanvas, 2.000, {
      opacity: 1.0, delay: 0.00, ease: Linear.easeNone, onComplete: function() {
        LOG.info('WebGL : intro : complete');

        this.controls.enabled = true;

        fCB();
      }.bind(this),
    });

  };

  outro(fCB) {
    LOG.info('WebGL : outro');

    this.controls.enabled = false;

    // this.removeTweens();

    this.oTweens['cameraOutroX'] = TweenMax.to(this.camera.position, 2.000, {
      x: this.camera.position.x * 3, ease: Sine.easeIn, onComplete: function() {}.bind(this),
    });

    this.oTweens['cameraOutroY'] = TweenMax.to(this.camera.position, 2.000, {
      y: this.camera.position.y * 3, ease: Sine.easeIn, onComplete: function() {}.bind(this),
    });

    this.oTweens['cameraOutroZ'] = TweenMax.to(this.camera.position, 2.000, {
      z: this.camera.position.z * 3, ease: Sine.easeIn, onComplete: function() {}.bind(this),
    });

    this.oTweens['domCanvasOutro'] = TweenMax.to(this.domCanvas, 0.500, {
      opacity: 0.0, delay: 0.500, ease: Linear.easeNone, onComplete: function() {
        LOG.info('WebGL : outro : complete');

        fCB();
      }.bind(this),
    });

  };

  animateToPosition(nPosition) {
    const stream = FRP.getStream('loader:triggerAnimation');
    stream('intro');

    this.controls.enabled = false;

    this.camera.fov = this.aPositions[nPosition].camera.fov;

    this.oTweens['controlsIntro'] = TweenMax.to(this.controls.target, 2.500, {
      x: this.aPositions[nPosition].target.posX, y: this.aPositions[nPosition].target.posY, z: this.aPositions[nPosition].target.posZ,
      ease: Sine.easeInOut, onComplete: function() {}.bind(this),
    });

    this.oTweens['cameraIntro'] = TweenMax.to(this.camera.position, 5.000, {
      x: this.aPositions[nPosition].camera.posX, y: this.aPositions[nPosition].camera.posY, z: this.aPositions[nPosition].camera.posZ,
      ease: Sine.easeInOut, onComplete: function() {

        const stream = FRP.getStream('loader:triggerAnimation');
        stream('outro');

        this.controls.enabled = true;

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
    this.camera = new THREE.PerspectiveCamera(45, this.domCanvas.clientWidth / this.domCanvas.clientHeight, 1, 10000);

    this.camera.fov = 20;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;

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

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 0.18; // exposure / f-stop

    // LINK: https://threejs.org/examples/#webgl_lights_physical
    // LINK: https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_physical.html
    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;

    // TODO : can we detect recent iPads specifically?
    // TODO : what does the M1 report?

    if (this.env.bIsMobile) {

      if (this.env.bIsRecentAppleGPU) {

        this.renderer.setPixelRatio(1.0);
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      } else {

        this.renderer.setPixelRatio(1.0);
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

      }

    } else if (this.env.nGPUTier === 1) { // tier 1 GPUs (intel integrated etc)

      this.renderer.setPixelRatio(0.8);
      this.renderer.shadowMap.type = THREE.BasicShadowMap;

    } else if (this.env.nGPUTier === 2) {

      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.type = THREE.PCFShadowMap;

    } else { // high end || anything outside the spec but hitting decent fps

      this.renderer.setPixelRatio(1.5);
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    };
  };

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.04;

    this.controls.enabled = false;
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

    // TODO: we need simpler mobile meshes
    // can we diff between ram size? ipad high end?

    // LINK: https://en.wikipedia.org/wiki/Lux
    // LINK: https://threejs.org/docs/#api/en/lights/shadows/LightShadow.bias

    if (this.activePage === 'home') {
      this.entities.lights['pointLight'] = new THREE.PointLight(0xb9ace3, 50000.0, 500, 2.0);
      this.entities.lights['pointLight'].position.set(20, 20, 20);

      // TODO: why does this add a massive GPU load? (shadows?)
      // this.entities.lights['pointLight2'] = new THREE.PointLight(0xa08b68, 5000.0, 500, 2.0);
      // this.entities.lights['pointLight2'].position.set(0, 10, 20);

    } else if (this.activePage === 'the-veil') {

      // TODO: this is _very_ heavy on mobile
      // can we make it work by tweaking the shader? or the model?
      if (!this.env.bIsMobile && this.env.nGPUTier > 1) {
        const mirrorGeometry = new THREE.PlaneGeometry(22.1, 29.1, 1, 1);
        const mirror = new Reflector(mirrorGeometry, {
          clipBias: 0.000001,
          textureWidth: 4096,
          textureHeight:4096,
          color:new THREE.Color(0x6e6e9b),
        });
        mirror.position.y = 1.66;
        mirror.position.z = 1.675;
        mirror.rotation.x = -0.006; // compensate for scene inaccuracy
        this.scene.add(mirror);
      };

      this.entities.lights['pointLight'] = new THREE.PointLight(0xb9ace3, 5000.0, 500, 2.0);
      this.entities.lights['pointLight'].position.set(20, 20, 10);

    } else if (this.activePage === 'the-man-in-the-wall') {

      // TODO: this is _very_ heavy on mobile
      // can we make it work by tweaking the shader? or the model?
      if (!this.env.bIsMobile && this.env.nGPUTier > 1) {
        const mirrorGeometry = new THREE.PlaneGeometry(22.1, 29.1, 1, 1);
        const mirror = new Reflector(mirrorGeometry, {
          clipBias: 0.000001,
          textureWidth: 4096,
          textureHeight: 4096,
          color:new THREE.Color(0x6e6e9b),
        });
        mirror.position.y = 0.01;
        mirror.position.z = 0;
        mirror.rotation.x = - Math.PI / 2;
        this.scene.add(mirror);
      };

      this.entities.lights['pointLight'] = new THREE.PointLight(0xb9ace3, 2500.0, 500, 2.0);
      this.entities.lights['pointLight'].position.set(10, 10, 10);

    } else if (this.activePage === 'another-world-awaits') {
      this.entities.lights['pointLight'] = new THREE.PointLight(0xffffff, 2500000.0, 500, 2.0);
      this.entities.lights['pointLight'].position.set(0, 150, 0);
    };

    // TODO: this explodes on mobile (VRAM?)
    // reducing shadow res might work

    this.entities.lights['pointLight'].castShadow = true;
    this.entities.lights['pointLight'].shadow.bias = -0.0005;

    if (!this.env.bIsMobile && this.env.nGPUTier > 1) {

      this.entities.lights['pointLight'].shadow.mapSize.width = 2048;
      this.entities.lights['pointLight'].shadow.mapSize.height = 2048;

    } else {

      this.entities.lights['pointLight'].shadow.mapSize.width = 512;
      this.entities.lights['pointLight'].shadow.mapSize.height = 512;

    };

    this.entities.lights['pointLight'].updateMatrixWorld(true);
    this.scene.add(this.entities.lights['pointLight']);
  };

  createBundledEntityTweens() {

    if (this.activePage === 'home') {

      this.oTweens['pointLightPosition'] = TweenMax.fromTo(this.entities.lights['pointLight'].position, 10, {
        x: this.entities.lights['pointLight'].position.x,
      }, { x: -20, repeat: -1, yoyo: true, ease: Sine.easeInOut, onComplete: function() {},
      });

    } else if (this.activePage === 'the-veil') {

      this.oTweens['pointLightPosition'] = TweenMax.fromTo(this.entities.lights['pointLight'].position, 10, {
        x: this.entities.lights['pointLight'].position.x,
      }, { x: -20, repeat: -1, yoyo: true, ease: Sine.easeInOut, onComplete: function() {},
      });

    } else if (this.activePage === 'the-man-in-the-wall') {

      this.oTweens['pointLightPosition'] = TweenMax.fromTo(this.entities.lights['pointLight'].position, 10, {
        x: this.entities.lights['pointLight'].position.x,
      }, { x: -10, repeat: -1, yoyo: true, ease: Sine.easeInOut, onComplete: function() {},
      });

    } else if (this.activePage === 'another-world-awaits') {}
  };

  loadResources(callback) {
    const resourceLoader = new ResourceLoader();
    const gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader(); // class scope reference so we can dispose it.
    this.dracoLoader.setDecoderPath('/static/draco/');
    this.dracoLoader.setWorkerLimit(10);
    this.dracoLoader.preload();
    gltfLoader.setDRACOLoader(this.dracoLoader);

    if (this.activePage === 'home') {

      if (this.env.bIsMobile || this.env.nGPUTier === 1) {
        resourceLoader.add('glft_scene', home_LOD1, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      } else {
        resourceLoader.add('glft_scene', home_LOD0, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      }

    }  else if (this.activePage === 'the-veil') {

      if (this.env.bIsMobile || this.env.nGPUTier === 1) {
        resourceLoader.add('glft_scene', theVeil_LOD1, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      } else {
        resourceLoader.add('glft_scene', theVeil_LOD0, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      }

    } else if (this.activePage === 'the-man-in-the-wall') {

      if (this.env.bIsMobile || this.env.nGPUTier === 1) {
        resourceLoader.add('glft_scene', theMainInTheWall_LOD1, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      } else {
        resourceLoader.add('glft_scene', theMainInTheWall_LOD0, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      }

    } else if (this.activePage === 'another-world-awaits') {

      if (this.env.bIsMobile || this.env.nGPUTier === 1) {
        resourceLoader.add('glft_scene', anotherWorldAwaits_LOD1, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      } else {
        resourceLoader.add('glft_scene', anotherWorldAwaits_LOD0, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
      }

    };

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
    if (this.activePage === 'another-world-awaits') {
      this.resources['glft_scene'].scene.children[0].position.x = 0;
      this.resources['glft_scene'].scene.children[0].position.y = -1117 -166; // scene value + manual offset to set to set 0,0,0 point

      this.resources['glft_scene'].scene.children[0].material.color = new THREE.Color(0x0d0e0f); // override with a blueish bhue
      this.resources['glft_scene'].scene.children[0].material.metalness = .85; // tweaking the reflective properties
      this.resources['glft_scene'].scene.children[0].material.roughness = .5; // tweaking the reflective properties

      this.resources['glft_scene'].scene.children[1].position.x = 0;
      this.resources['glft_scene'].scene.children[1].position.y = 163.57322692871094 -166; // scene value + manual offset to set 0,0,0 point
    };

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
    this.gui = new dat.GUI({ autoPlace: true });
    this.gui['close'](); // start in closed state

    // TODO: if we want to place this in a shadow dom instance
    // we need to move the css to that instance
    // this.gui.domElement.style.position = 'absolute';
    // this.gui.domElement.style.top = '0px';
    // this.gui.domElement.style.right = '0px';
    // DOM.append(this.gui.domElement, document.body);

    const folder_renderSettings = this.gui['addFolder']('Render Settings');
    folder_renderSettings.open();

    const renderSettingsOptions = {
      pauseRenderer: false,
      pixelRatio: this.renderer.getPixelRatio(),
    };

    folder_renderSettings.add(renderSettingsOptions, 'pauseRenderer').name('Pause Renderer').onChange(function(value) {
      if (value === true) {
        this.controls.enabled = false;
        for (const tween in this.oTweens) { this.oTweens[tween].pause(); };
        this.renderer.setAnimationLoop(null);

      } else {
        this.controls.enabled = true;
        for (const tween in this.oTweens) { this.oTweens[tween].resume(); };
        this.renderer.setAnimationLoop(this.tick.bind(this));
      }
    }.bind(this));


    folder_renderSettings.add(renderSettingsOptions, 'pixelRatio').min(1).max(10).step(.1).onChange(function(value) { this.renderer.setPixelRatio(value); }.bind(this));

    const folder_cameraSettings = this.gui['addFolder']('Camera Settings');
    folder_cameraSettings.open();

    this.cameraSettingsOptions = {
      pos_x: this.camera.position.x,
      pos_y: this.camera.position.y,
      pos_z: this.camera.position.z,
      fov: this.camera.fov,
    };

    // values are updated in the render tick

    folder_cameraSettings.add(this.cameraSettingsOptions, 'fov').name('FOV').min(1).max(180).step(1).listen().onChange(function(value) {
      this.camera.fov = value;
      this.camera.updateProjectionMatrix();
    }.bind(this));

    folder_cameraSettings.add(this.cameraSettingsOptions, 'pos_x').name('pos X').min(-1000).max(1000).step(.01).listen().onChange(function(value) { this.camera.position.x = value; }.bind(this));
    folder_cameraSettings.add(this.cameraSettingsOptions, 'pos_y').name('pos Y').min(-1000).max(1000).step(.01).listen().onChange(function(value) { this.camera.position.y = value; }.bind(this));
    folder_cameraSettings.add(this.cameraSettingsOptions, 'pos_z').name('pos Z').min(-1000).max(1000).step(.01).listen().onChange(function(value) { this.camera.position.z = value; }.bind(this));

    const folder_constrolsTarget = this.gui['addFolder']('Controls Target');
    folder_constrolsTarget.open();

    this.controlsTargetOptions = {
      x: this.controls.target.x,
      y: this.controls.target.y,
      z: this.controls.target.z,
    };

    // values are updated in the render tick

    folder_constrolsTarget.add(this.controlsTargetOptions, 'x').name('X').min(-1000).max(1000).step(.01).listen().onChange(function(value) { this.controls.target.x = value; }.bind(this));
    folder_constrolsTarget.add(this.controlsTargetOptions, 'y').name('Y').min(-1000).max(1000).step(.01).listen().onChange(function(value) { this.controls.target.y = value; }.bind(this));
    folder_constrolsTarget.add(this.controlsTargetOptions, 'z').name('Z').min(-1000).max(1000).step(.01).listen().onChange(function(value) { this.controls.target.z = value; }.bind(this));

    const folder_studioSettings = this.gui['addFolder']('Studio Settings');
    folder_studioSettings.open();

    const studioSettingsOptions = {
      show_helpers: false,
      bgColour: '#00b140', // classic green screen
      bgOpacity: 0,
    };

    folder_studioSettings.add(studioSettingsOptions, 'show_helpers').name('THREE Helpers').onChange(function(value) {
      for (const helper in this.entities.helpers) {
        this.entities.helpers[helper].visible = value;
      }
    }.bind(this));

    const obj = { grab_frameBuffer: function() {
      const dataURL = this.domCanvas.toDataURL('image/png');
      const newTab = window.open();
      newTab.document.body.style.margin = '0px';
      newTab.document.body.innerHTML = '<img src="'+ dataURL +'">';
    }.bind(this)};

    this.gui['add'](obj, 'grab_frameBuffer').name('grab framebuffer');

  };

  createHelpers() {
    this.entities.helpers['axesHelper'] = new THREE.AxesHelper(25);
    this.entities.helpers['axesHelper'].visible = false;
    this.scene.add(this.entities.helpers['axesHelper']);

    this.entities.helpers['gridHelper'] = new THREE.GridHelper(100, 10, 0x808080, 0x808080);
    this.entities.helpers['gridHelper'].position.y = 0;
    this.entities.helpers['gridHelper'].position.x = 0;
    this.entities.helpers['gridHelper'].visible = false;
    this.scene.add(this.entities.helpers['gridHelper']);

    this.entities.helpers['polarGridHelper'] = new THREE.PolarGridHelper(200, 16, 8, 64, 0x808080, 0x808080);
    this.entities.helpers['polarGridHelper'].position.y = 0;
    this.entities.helpers['polarGridHelper'].position.x = 0;
    this.entities.helpers['polarGridHelper'].visible = false;
    this.scene.add(this.entities.helpers['polarGridHelper']);

    this.entities.helpers['pointLightHelper'] = new THREE.PointLightHelper(this.entities.lights['pointLight'], 1.0, 0x808080);
    this.entities.helpers['pointLightHelper'].visible = false;
    this.scene.add(this.entities.helpers['pointLightHelper']);
  };

  createAnimationLoop() {
    this.renderer.setAnimationLoop(this.tick.bind(this));
  };

  tick() {
    // update controls
    this.controls.update();

    // update dat.gui
    if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_x = this.camera.position.x;
    if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_y = this.camera.position.y;
    if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_z = this.camera.position.z;

    if (this.controlsTargetOptions) this.controlsTargetOptions.x = this.controls.target.x;
    if (this.controlsTargetOptions) this.controlsTargetOptions.y = this.controls.target.y;
    if (this.controlsTargetOptions) this.controlsTargetOptions.z = this.controls.target.z;

    // update animations
    const delta = this.clock.getDelta();
    if (this.mixer !== null) this.mixer.update(delta);

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
    for (const tween in this.oTweens) { this.oTweens[tween].kill(); };

    if (this.fAnimateToPositionInterval) clearInterval(this.fAnimateToPositionInterval);
  };

  removeGui() {
    this.gui['destroy']();
  };

  removeLoaders() {
    this.dracoLoader.dispose();
  };

  removeThree() {
    if (this.scene) {
      for (let i = this.scene.children.length - 1; i >= 0; i--) {
        if (this.scene.children[i] instanceof THREE.Mesh) {
          this.scene.children[i]['geometry'].dispose();
          this.scene.children[i]['material'].dispose();
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

customElements.define('theu0001-common-webgl', WebGL);


//////////////////////
///// ES6 EXPORT /////
//////////////////////

export default WebGL;


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

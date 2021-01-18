// TODO: add performance tests + optimisations
// TODO: look into renderer exposure (f-stop) values

///////////////////
///// IMPORTS /////
///////////////////

// npm dependencies
import async from 'async';
import { DOM } from '~/utils/dom.js';
import { gsap, TweenMax, Sine } from 'gsap';
import { Loader, Resource } from 'resource-loader';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// assets
import TheMainInTheWall from './assets/the-man-in-the-wall.glb';
import TheVeil from './assets/the-veil.glb';
import AnotherWorldAwaits from './assets/another-world-awaits.glb';

// style sheet
import css from './WebGL.css';

/////////////////////////
///// WEB COMPONENT /////
/////////////////////////

class WebGL extends HTMLElement {
  constructor(page) {
    super();

    this.activePage = page;

    // Create and attach the Shadow DOM wrapper.
    // NOTE: This isolates our Web Component's elements into the Shadow DOM context.
    //       Critical to build component based systems that guarantee isolation.
    this.domShadow = this.attachShadow({ mode: 'open' });

    // Create holders for entities we need to keep track of.
    this.resources = {};

    this.entities = {};
    this.entities.meshes = {};
    this.entities.lights = {};
    this.entities.helpers = {};

    this.tweens = {};
  };

  ///////////////////////////////////
  ///// WEB COMPONENT LIFECYCLE /////
  ///////////////////////////////////

  connectedCallback() {
    this.init();
  };

  disconnectedCallback() {
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







    }.bind(this));
  };

  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  createCanvas() {

    // TODO: move this to an animation handler
    this.clock = new THREE.Clock();


    // We create a wrapper element as the canvas tag doesn't resize based on '%' stylings.
    this.domCanvasWrapper = DOM.create('div', { className: 'domCanvasWrapper' });
    DOM.append(this.domCanvasWrapper, this.domShadow);

    this.domCanvas = DOM.create('canvas', { id: 'domCanvas', className: 'domCanvas' });
    this.domCanvasContext = this.domCanvas.getContext('webgl', { powerPreference: 'high-performance', preserveDrawingBuffer: true });
    DOM.append(this.domCanvas, this.domCanvasWrapper);
  };

  createScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, this.domCanvas.clientWidth / this.domCanvas.clientHeight, 1, 10000);
    this.camera.position.x = -300;
    this.camera.position.y = 300;
    this.camera.position.z = 600;
    this.camera.lookAt(0, 0, 0); // overridden in the render tick
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

    // Here we brute force 25% supersampling in addition to the device's resolution scaling.
    // The performance hit is typically worth the anti aliasing benefits.
    // this.renderer.setPixelRatio(window.devicePixelRatio * 1.25);

    // this.renderer.setPixelRatio(window.devicePixelRatio);

    // this.renderer.setPixelRatio(300/72); // take our 72dpi base and approximate 300dpi print
    this.renderer.setPixelRatio(window.devicePixelRatio);

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
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
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

    this.entities.lights['pointLight'] = new THREE.PointLight(0xffffff, 1500000.0, 500, 2.0);
    this.entities.lights['pointLight'].position.set(275, 25, 0);
    this.entities.lights['pointLight'].castShadow = true;
    // Slight value tweak to help the depth sorting to prevent artifacts.
    // LINK: https://threejs.org/docs/#api/en/lights/shadows/LightShadow.bias
    this.entities.lights['pointLight'].shadow.bias = -0.0005;
    this.entities.lights['pointLight'].shadow.mapSize.width = 8192;
    this.entities.lights['pointLight'].shadow.mapSize.height = 8192;
    this.entities.lights['pointLight'].updateMatrixWorld(true);
    this.scene.add(this.entities.lights['pointLight']);


    this.entities.lights['pointLight2'] = new THREE.PointLight(0xffffff, 2500000.0, 500, 2.0);
    this.entities.lights['pointLight2'].position.set(0, 250, 0);
    this.entities.lights['pointLight2'].castShadow = true;
    // Slight value tweak to help the depth sorting to prevent artifacts.
    // LINK: https://threejs.org/docs/#api/en/lights/shadows/LightShadow.bias
    this.entities.lights['pointLight2'].shadow.bias = -0.0005;
    this.entities.lights['pointLight2'].shadow.mapSize.width = 8192;
    this.entities.lights['pointLight2'].shadow.mapSize.height = 8192;
    this.entities.lights['pointLight2'].updateMatrixWorld(true);
    this.scene.add(this.entities.lights['pointLight2']);
  };

  createBundledEntityTweens() {
    this.tweens['pointLightPosition'] = TweenMax.fromTo(this.entities.lights['pointLight'].position, 10, {
      x: this.entities.lights['pointLight'].position.x,
    }, {
      x: -275,
      repeat: -1, yoyo: true, ease: Sine.easeInOut, onComplete: function() {},
    });

    // this.tweens['pointLightIntensity'] = TweenMax.fromTo(this.entities.lights['pointLight'], 1.5, {
    //   intensity: this.entities.lights['pointLight'].intensity,
    // }, {
    //   intensity: 120000,
    //   repeat: -1, yoyo: true, ease: Sine.easeInOut, onComplete: function() {},
    // });


  };

  loadResources(callback) {
    const resourceLoader = new Loader();
    const gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader(); // class scope reference so we can dispose it.
    this.dracoLoader.setDecoderPath('/static/draco/');
    this.dracoLoader.preload();

    gltfLoader.setDRACOLoader(this.dracoLoader);

    if (this.activePage === 'the-veil') {
      resourceLoader.add('glft_scene', TheVeil, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
    } else if (this.activePage === 'the-man-in-the-wall') {
      resourceLoader.add('glft_scene', TheMainInTheWall, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
    } else if (this.activePage === 'another-world-awaits') {
      resourceLoader.add('glft_scene', AnotherWorldAwaits, { loadType: Resource.LOAD_TYPE.XHR, xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER });
    }

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

        // TODO: handle this more elegantly
        // should we be 'hot-'swapping' ?
        // do we need an intial camera ?
        if (resource.isCamera) {
          this.camera = resource;
          // this.camera.aspect = updatedWidth / updatedHeight;
          // this.camera.updateProjectionMatrix();

          // TODO: can we get this value from the gltf?
          this.camera.fov = 45;
          this.camera.aspect = this.domCanvas.clientWidth / this.domCanvas.clientHeight;
          this.camera.updateProjectionMatrix();
        };

        // if (resource.isLight) {
        //   resource.castShadow = true;
        //   resource.shadow.bias = -0.0005;
        //   resource.shadow.mapSize.width = 8192;
        //   resource.shadow.mapSize.height = 8192;
        //   resource.updateMatrixWorld(true);
        // };

        if (resource.isMesh) {

          resource.castShadow = true;
          resource.receiveShadow = true;

          // console.log('material shading:');
          // console.log(resource.material.flatShading);

          // force flat shading
          // TODO: Do we need to keep track which materials need flat shading?
          // if (resource.name === 'Plane') {
          //   // resource.material.flatShading = true;

          //   // TODO: can we get this from the 'specular' shader value?
          //   resource.material.reflectivity = 0.1;
          //   // resource.material.roughness = 0.5;
          //   // console.log('HERHEHREHREHR');

          //   // resource.material.transparent = true;
          //   // resource.material.alphaTest = 0.9;
          // }


          if (resource.material.map !== null) {
            resource.material.map.anisotropy = maxAnisotropy;
          }
        };
      }.bind(this));
    };

    callback();
  };

  createLoadedEntities() {
    // this.entities.meshes['CHASSEUR'] = this.resources['chasseur'].scene.children.filter(function(result) { return result.name === 'CHASSEUR'; })[0];
    // this.scene.add(this.entities.meshes['CHASSEUR']);

    // this.entities.meshes['Leg_tool_lowpoly001'] = this.resources['test'].scene.children.filter(function(result) { return result.name === 'Leg_tool_lowpoly001'; })[0];
    // this.scene.add(this.entities.meshes['Leg_tool_lowpoly.001']);

    // console.log(this.entities.meshes['Leg_tool_lowpoly001']);


    if (this.activePage === 'another-world-awaits') {
      this.resources['glft_scene'].scene.children[0].position.x = 0;
      this.resources['glft_scene'].scene.children[0].position.y = -1117 -166; // scene value + manual offset to set to set 0,0,0 point
      this.resources['glft_scene'].scene.children[1].position.x = 0;
      this.resources['glft_scene'].scene.children[1].position.y = 163.57322692871094 -166; // scene value + manual offset to set 0,0,0 point
    }

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
    this.gui = new dat.GUI({name: 'Studio GUI'});

    const folder_printTarget = this.gui.addFolder('Print Target');
    folder_printTarget.open();

    const printTargetOptions = {
      trimWidth_mm: 220,
      trimHeight_mm: 290,
      bleed_mm: 3,
      DPI: 812,
    };

    folder_printTarget.add(printTargetOptions, 'trimWidth_mm').min(1).max(1000).step(1).onChange(function(value) {
      // this.domCanvasWrapper.style.width = value + 'px';
    }.bind(this));

    folder_printTarget.add(printTargetOptions, 'trimHeight_mm').min(1).max(1000).step(1).onChange(function(value) {
      // this.domCanvasWrapper.style.width = value + 'px';
    }.bind(this));

    folder_printTarget.add(printTargetOptions, 'bleed_mm').min(1).max(1000).step(1).onChange(function(value) {
      // this.domCanvasWrapper.style.width = value + 'px';
    }.bind(this));

    folder_printTarget.add(printTargetOptions, 'DPI').min(1).max(5000).step(1).onChange(function(value) {
      // this.domCanvasWrapper.style.height = value + 'px';
    }.bind(this));



    const folder_renderSettings = this.gui.addFolder('Render Settings');
    folder_renderSettings.open();

    const renderSettingsOptions = {
      canvasWidth: 903,
      canvasHeight: 1183,
      pixelRatio: window.devicePixelRatio,
    };

    folder_renderSettings.add(renderSettingsOptions, 'canvasWidth').min(1).max(5120).step(1).onChange(function(value) {
      this.domCanvasWrapper.style.width = value + 'px';
    }.bind(this));

    folder_renderSettings.add(renderSettingsOptions, 'canvasHeight').min(1).max(2160).step(1).onChange(function(value) {
      this.domCanvasWrapper.style.height = value + 'px';
    }.bind(this));

    folder_renderSettings.add(renderSettingsOptions, 'pixelRatio').min(1).max(10).step(1).onChange(function(value) {
      this.renderer.setPixelRatio(value);
    }.bind(this));






    const folder_cameraSettings = this.gui.addFolder('Camera Settings');
    folder_cameraSettings.open();

    // make this global, so we can update it from the render loop
    // to make this work we also need to call .listen() on the property
    this.cameraSettingsOptions = {
      pos_x: -300,
      pos_y: 300,
      pos_z: 600,
      // lookat ?
      fov: 45,
    };

    folder_cameraSettings.add(this.cameraSettingsOptions, 'fov').name('FOV').min(1).max(250).step(1).onChange(function(value) {
      this.camera.fov = value;
      this.camera.updateProjectionMatrix();
    }.bind(this));

    folder_cameraSettings.add(this.cameraSettingsOptions, 'pos_x').name('pos X').min(-1000).max(1000).step(1).listen().onChange(function(value) {
      this.camera.position.x = value;
    }.bind(this));

    folder_cameraSettings.add(this.cameraSettingsOptions, 'pos_y').name('pos Y').min(-1000).max(1000).step(1).listen().onChange(function(value) {
      this.camera.position.y = value;
    }.bind(this));

    folder_cameraSettings.add(this.cameraSettingsOptions, 'pos_z').name('pos Z').min(-1000).max(1000).step(1).listen().onChange(function(value) {
      this.camera.position.z = value;
    }.bind(this));





    const folder_studioSettings = this.gui.addFolder('Studio Settings');
    folder_studioSettings.open();

    const studioSettingsOptions = {
      show_helpers: false,
      bgColour: '#464646',
      bgOpacity: 0,
    };

    folder_studioSettings.add(studioSettingsOptions, 'show_helpers').name('THREE Helpers').onChange(function(value) {
      for (const helper in this.entities.helpers) {
        this.entities.helpers[helper].visible = value;
      }
    }.bind(this));

    folder_studioSettings.addColor(studioSettingsOptions, 'bgColour').onChange(function(value) {
      this.renderer.setClearColor(value, studioSettingsOptions.bgOpacity);
    }.bind(this));

    folder_studioSettings.add(studioSettingsOptions, 'bgOpacity').min(0).max(1).step(0.001).onChange(function(value) {
      this.renderer.setClearColor(studioSettingsOptions.bgColour, value);
    }.bind(this));





    const obj = { grab_frameBuffer: function() {
      const dataURL = this.domCanvas.toDataURL('image/png');
      const newTab = window.open();
      newTab.document.body.style.margin = 0;
      newTab.document.body.innerHTML = '<img src="'+ dataURL +'">';
    }.bind(this)};

    this.gui.add(obj, 'grab_frameBuffer').name('grab framebuffer');

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

    this.entities.helpers['pointLightHelper2'] = new THREE.PointLightHelper(this.entities.lights['pointLight2'], 1.0, 0x808080);
    this.entities.helpers['pointLightHelper2'].visible = false;
    this.scene.add(this.entities.helpers['pointLightHelper2']);
  };

  createAnimationLoop() {
    this.renderer.setAnimationLoop(this.tick.bind(this));
  };

  tick() {
    this.controls.update();

    // update dat.gui
    if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_x = this.camera.position.x;
    if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_y = this.camera.position.y;
    if (this.cameraSettingsOptions) this.cameraSettingsOptions.pos_z = this.camera.position.z;

    if (this.activePage === 'another-world-awaits') {
      this.camera.lookAt(0, -150, 0); // pulls the planet up a little
    } else {
      this.camera.lookAt(0, 0, 0); // pulls the planet up a little
    }

    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

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

  removeDomObservers() {
    this.canvasWrapperResizeObserver.unobserve(this.domCanvasWrapper);
    this.canvasWrapperResizeObserver.disconnect();
  };

  removeTweens() {
    for (const tween in this.tweens) {
      this.tweens[tween].kill();
    };
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

customElements.define('theu0002-home-webgl', WebGL);
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

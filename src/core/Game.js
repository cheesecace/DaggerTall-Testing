import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { CellManager } from '../world/CellManager.js';
import { FirstPersonController } from '../player/FirstPersonController.js';
import { Hud } from '../ui/Hud.js';

export class Game {
  constructor(character) {
    this.character = character;
    this.canvas = document.querySelector('#game-canvas');
    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.raycaster = new THREE.Raycaster();
    this.center = new THREE.Vector2(0, 0);
  }

  async start() {
    await RAPIER.init();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.08, 140);
    this.scene.add(new THREE.HemisphereLight('#ffd79b', '#63291f', 2.2));
    const sun = new THREE.DirectionalLight('#fff0c4', 3.3);
    sun.position.set(-25, 42, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -45;
    sun.shadow.camera.right = 45;
    sun.shadow.camera.top = 45;
    sun.shadow.camera.bottom = -45;
    this.scene.add(sun);

    this.cellManager = new CellManager({ scene: this.scene, rapier: RAPIER });
    this.player = new FirstPersonController({ camera: this.camera, canvas: this.canvas, rapier: RAPIER });
    this.hud = new Hud(this.character);
    this.loadCell('capital-gate', 'arrival');

    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyE' && !event.repeat && this.activePortal) this.usePortal(this.activePortal);
    });
    window.addEventListener('resize', () => this.resize());
    this.renderer.setAnimationLoop(() => this.update());
  }

  loadCell(cellId, anchorId) {
    const result = this.cellManager.load(cellId, anchorId);
    this.player.attachWorld(result.physicsWorld, result.anchor);
    this.interactive = result.interactive;
    this.activePortal = null;
    this.hud.setInteraction('');
    this.hud.setCell(result.definition);
  }

  usePortal(portalId) {
    const link = this.cellManager.resolvePortal(portalId);
    this.loadCell(link.destination, link.anchor);
  }

  updateInteraction() {
    this.raycaster.setFromCamera(this.center, this.camera);
    this.raycaster.far = 3.2;
    const hits = this.raycaster.intersectObjects(this.interactive, false);
    const target = hits[0]?.object;
    this.activePortal = target?.userData.portal ?? null;
    this.hud.setInteraction(target?.userData.interaction ?? '');
  }

  update() {
    const deltaTime = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += deltaTime;
    this.player.update(deltaTime);
    this.updateInteraction();
    this.hud.updateTime(this.elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  }
}
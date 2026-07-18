import * as THREE from 'three';
import { CELL_BUILDERS } from './cellBuilders.js';
import { CELL_DEFINITIONS } from './cellDefinitions.js';

export class CellManager {
  constructor({ scene, rapier, context = {} }) {
    this.scene = scene;
    this.rapier = rapier;
    this.context = context;
    this.current = null;
  }

  load(cellId, anchorId) {
    const definition = CELL_DEFINITIONS[cellId];
    const builder = CELL_BUILDERS[cellId];
    if (!definition || !builder) throw new Error(`Unknown cell: ${cellId}`);

    if (this.current?.group) {
      this.scene.remove(this.current.group);
      this.current.group.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose();
      });
    }

    const physicsWorld = new this.rapier.World({ x: 0, y: -28, z: 0 });
    const built = builder(this.rapier, physicsWorld, this.context);
    this.scene.add(built.group);
    this.scene.background = new THREE.Color(built.ambient);
    this.scene.fog = new THREE.Fog(...built.fog);
    this.current = { ...built, definition, physicsWorld };

    const anchor = definition.anchors[anchorId];
    if (!anchor) throw new Error(`Unknown anchor: ${cellId}.${anchorId}`);
    return { definition, anchor: [...anchor], physicsWorld, interactive: built.interactive };
  }

  resolvePortal(portalId) {
    const portal = this.current?.definition.portals[portalId];
    if (!portal) throw new Error(`Unknown portal: ${this.current?.definition.id}.${portalId}`);
    return portal;
  }
}
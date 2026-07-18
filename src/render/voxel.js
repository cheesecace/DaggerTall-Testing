import * as THREE from 'three';
import { createPaperdollMaterials } from './pixelTextures.js';

export const HUMANOID_PARTS = [
  { id: 'head', part: 'head', size: [0.9, 0.9, 0.9], position: [0, 2.75, 0] },
  { id: 'torso', part: 'torso', size: [1.15, 1.35, 0.6], position: [0, 1.65, 0] },
  { id: 'leftArm', part: 'arm', size: [0.35, 1.3, 0.45], position: [-0.78, 1.65, 0] },
  { id: 'rightArm', part: 'arm', size: [0.35, 1.3, 0.45], position: [0.78, 1.65, 0] },
  { id: 'leftLeg', part: 'leg', size: [0.45, 1.3, 0.5], position: [-0.32, 0.35, 0] },
  { id: 'rightLeg', part: 'leg', size: [0.45, 1.3, 0.5], position: [0.32, 0.35, 0] },
];

export const WORLD_HUMANOID_SCALE = 0.72;
export const WORLD_HUMANOID_EYE_HEIGHT = 2.75 * WORLD_HUMANOID_SCALE;

function scaledMaterials(material, size) {
  if (Array.isArray(material) || !material?.map) return material;
  const faceSizes = [[size[2], size[1]], [size[2], size[1]], [size[0], size[2]], [size[0], size[2]], [size[0], size[1]], [size[0], size[1]]];
  return faceSizes.map(([width, height]) => {
    const faceMaterial = material.clone();
    faceMaterial.map = material.map.clone();
    faceMaterial.map.repeat.set(Math.max(1, width / 2), Math.max(1, height / 2));
    faceMaterial.map.needsUpdate = true;
    return faceMaterial;
  });
}

export function createCuboid({ size, position, material, name = '', userData = {} }) {
  const geometry = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, scaledMaterials(material, size));
  mesh.position.set(...position);
  mesh.name = name;
  mesh.userData = userData;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createVoxelHumanoid(character, scale = 1) {
  const group = new THREE.Group();
  group.name = `${character.race}-paperdoll`;
  for (const part of HUMANOID_PARTS) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...part.size), createPaperdollMaterials(character, part.part));
    mesh.position.set(...part.position);
    group.add(mesh);
  }

  if (character.race === 'elf') {
    const earMaterial = createPaperdollMaterials(character, 'head')[0];
    group.add(createCuboid({ size: [0.35, 0.18, 0.35], position: [-0.58, 2.78, 0], material: earMaterial }));
    group.add(createCuboid({ size: [0.35, 0.18, 0.35], position: [0.58, 2.78, 0], material: earMaterial }));
  }
  if (character.race === 'orc') {
    const tuskMaterial = new THREE.MeshLambertMaterial({ color: '#efe0bc' });
    group.add(createCuboid({ size: [0.12, 0.2, 0.12], position: [-0.22, 2.5, 0.48], material: tuskMaterial }));
    group.add(createCuboid({ size: [0.12, 0.2, 0.12], position: [0.22, 2.5, 0.48], material: tuskMaterial }));
  }

  group.scale.setScalar(scale);
  return group;
}
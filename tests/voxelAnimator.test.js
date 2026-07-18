import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { HUMANOID_PARTS } from '../src/render/voxel.js';
import { poseVoxelHumanoid } from '../src/render/voxelAnimator.js';

describe('voxel humanoid animation', () => {
  it('names every canonical part and alternates limbs while walking', () => {
    const figure = new THREE.Group();
    for (const definition of HUMANOID_PARTS) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...definition.size));
      mesh.name = definition.id;
      mesh.position.set(...definition.position);
      figure.add(mesh);
    }
    for (const definition of HUMANOID_PARTS) expect(figure.getObjectByName(definition.id)).toBeDefined();
    poseVoxelHumanoid(figure, 'walk', 0.3);
    expect(figure.getObjectByName('leftArm').rotation.x).toBeCloseTo(-figure.getObjectByName('rightArm').rotation.x);
    expect(figure.getObjectByName('leftLeg').rotation.x).toBeCloseTo(-figure.getObjectByName('rightLeg').rotation.x);
    poseVoxelHumanoid(figure, 'idle', 0.4);
    expect(figure.getObjectByName('leftArm').rotation.x).toBe(0);
  });
});
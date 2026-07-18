import { describe, expect, it } from 'vitest';
import { getPaperdollDesign } from '../src/render/pixelTextures.js';
import { HUMANOID_PARTS, WORLD_HUMANOID_EYE_HEIGHT, WORLD_HUMANOID_SCALE } from '../src/render/voxel.js';

describe('voxel paperdoll design', () => {
  it('assigns distinct semantic surfaces to each body region', () => {
    const design = getPaperdollDesign({ race: 'human', appearance: 1, classId: 'warrior' });
    expect(design.face).not.toEqual(design.torso);
    expect(design.hands).not.toEqual(design.boots);
    expect(design.hair).not.toEqual(design.skin);
  });

  it('changes appearance deterministically without changing humanoid geometry', () => {
    const first = getPaperdollDesign({ race: 'elf', appearance: 0, classId: 'mage' });
    const second = getPaperdollDesign({ race: 'elf', appearance: 2, classId: 'mage' });
    expect(first).not.toEqual(second);
    expect(HUMANOID_PARTS).toHaveLength(6);
    expect(HUMANOID_PARTS.map((part) => part.id)).toEqual(['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg']);
  });

  it('defines one shared world scale and eye height for player and NPC alignment', () => {
    expect(WORLD_HUMANOID_SCALE).toBe(0.72);
    expect(WORLD_HUMANOID_EYE_HEIGHT).toBeCloseTo(1.98);
  });
});
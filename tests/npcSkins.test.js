import { describe, expect, it } from 'vitest';
import { createNpcSkin, createNpcSkinCatalog, NPC_SKIN_COUNT } from '../src/data/npcSkins.js';

describe('NPC paperdoll catalog', () => {
  it('provides 20 stable skins for every race and gender', () => {
    const catalog = createNpcSkinCatalog();
    expect(catalog).toHaveLength(NPC_SKIN_COUNT);
    expect(new Set(catalog.map((skin) => skin.id)).size).toBe(120);
    for (const race of ['human', 'orc', 'elf']) {
      for (const gender of ['female', 'male']) {
        const group = catalog.filter((skin) => skin.race === race && skin.gender === gender);
        expect(group).toHaveLength(20);
        expect(new Set(group.map((skin) => JSON.stringify(skin.visual))).size).toBe(20);
      }
    }
  });

  it('recreates an identical skin from the same generation inputs', () => {
    expect(createNpcSkin('elf', 'female', 17)).toEqual(createNpcSkin('elf', 'female', 17));
  });

  it('gives female profiles distinct faces, hair, and clothing identities', () => {
    const femaleFeatures = [];
    const maleFeatures = [];
    for (let index = 0; index < 20; index += 1) {
      const female = createNpcSkin('human', 'female', index).visual;
      const male = createNpcSkin('human', 'male', index).visual;
      expect(female.title).not.toBe(male.title);
      expect([female.hairStyle, female.marking, female.clothingCut]).not.toEqual([male.hairStyle, male.marking, male.clothingCut]);
      femaleFeatures.push([female.hairStyle, female.marking, female.clothingCut]);
      maleFeatures.push([male.hairStyle, male.marking, male.clothingCut]);
    }
    expect(femaleFeatures.map((features) => features[0])).not.toEqual(maleFeatures.map((features) => features[0]));
    expect(femaleFeatures.map((features) => features[1])).not.toEqual(maleFeatures.map((features) => features[1]));
    expect(femaleFeatures.map((features) => features[2])).not.toEqual(maleFeatures.map((features) => features[2]));
  });
});
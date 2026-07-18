import { describe, expect, it } from 'vitest';
import { ARMOR_SKIN_COUNT, ARMOR_SKINS, getArmorSkins, resolveArmorSkin } from '../src/data/armorSkins.js';

describe('paperdoll armor catalog', () => {
  it('provides twelve unique sets for every race and gender', () => {
    expect(ARMOR_SKIN_COUNT).toBe(72);
    expect(new Set(ARMOR_SKINS.map((armor) => armor.id)).size).toBe(72);
    for (const race of ['human', 'orc', 'elf']) {
      for (const gender of ['female', 'male']) {
        const catalog = getArmorSkins(race, gender);
        expect(catalog).toHaveLength(12);
        expect(new Set(catalog.map((armor) => armor.name)).size).toBe(12);
        expect(new Set(catalog.map((armor) => armor.legPattern)).size).toBe(12);
      }
    }
  });

  it('balances helmet coverage and includes every armor family', () => {
    for (const race of ['human', 'orc', 'elf']) {
      for (const gender of ['female', 'male']) {
        const catalog = getArmorSkins(race, gender);
        for (const coverage of ['open', 'full', 'eye-slit']) {
          expect(catalog.filter((armor) => armor.helmetCoverage === coverage)).toHaveLength(4);
        }
        expect(new Set(catalog.map((armor) => armor.family))).toEqual(new Set(['desert', 'western', 'barbarian', 'heritage']));
      }
    }
  });

  it('resolves only armor owned by the selected race and gender', () => {
    const armor = getArmorSkins('elf', 'female')[5];
    expect(resolveArmorSkin(armor.id, 'elf', 'female')).toEqual(armor);
    expect(resolveArmorSkin(armor.id, 'elf', 'male')).toBeNull();
    expect(resolveArmorSkin('missing', 'elf', 'female')).toBeNull();
    expect(resolveArmorSkin('none', 'elf', 'female')).toBeNull();
  });
});
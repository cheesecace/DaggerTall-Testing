import { describe, expect, it } from 'vitest';
import { CAPE_SKINS, getCapeSkins, resolveCapeSkin } from '../src/data/capeSkins.js';
import { getGarmentOptions } from '../src/data/npcSkins.js';

const ORIGINAL_GARMENTS = [
  ['#b43f2d', '#67251f', '#e0b252', '#35251f'], ['#287f84', '#155157', '#d5a449', '#352f2b'],
  ['#5c7540', '#34472d', '#c79845', '#332a25'], ['#725074', '#3e3048', '#d6b461', '#28232c'],
  ['#c0772f', '#70401f', '#e3c171', '#412a22'], ['#455d89', '#293953', '#d2ae55', '#292534'],
  ['#9d3150', '#5a2038', '#e1bd63', '#352329'], ['#d1b16a', '#8b6a39', '#2d777a', '#392b24'],
  ['#4d6d68', '#294844', '#c27e4a', '#242c2b'], ['#7e3f2d', '#48271e', '#b5a15b', '#302520'],
];

describe('cape and cloth customization data', () => {
  it('provides four unique capes for each race and gender', () => {
    expect(CAPE_SKINS).toHaveLength(24);
    expect(new Set(CAPE_SKINS.map((cape) => cape.id)).size).toBe(24);
    for (const race of ['human', 'orc', 'elf']) for (const gender of ['female', 'male']) {
      const catalog = getCapeSkins(race, gender);
      expect(catalog).toHaveLength(4);
      expect(new Set(catalog.map((cape) => cape.name)).size).toBe(4);
      expect(new Set(catalog.map((cape) => JSON.stringify(cape))).size).toBe(4);
    }
  });

  it('resolves only capes owned by the selected race and gender', () => {
    const cape = getCapeSkins('elf', 'female')[2];
    expect(resolveCapeSkin(cape.id, 'elf', 'female')).toEqual(cape);
    expect(resolveCapeSkin(cape.id, 'elf', 'male')).toBeNull();
    expect(resolveCapeSkin('none', 'elf', 'female')).toBeNull();
  });

  it('provides twenty named palettes while preserving the original ten colors', () => {
    const palettes = getGarmentOptions();
    expect(palettes).toHaveLength(20);
    expect(new Set(palettes.map((palette) => palette.name)).size).toBe(20);
    expect(new Set(palettes.map((palette) => JSON.stringify(palette.colors))).size).toBe(20);
    expect(palettes.slice(0, 10).map((palette) => palette.colors)).toEqual(ORIGINAL_GARMENTS);
  });
});
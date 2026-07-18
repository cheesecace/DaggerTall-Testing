import * as THREE from 'three';
import { RACES } from '../data/characters.js';
import { resolveArmorSkin } from '../data/armorSkins.js';
import { resolveCapeSkin } from '../data/capeSkins.js';

const textureCache = new Map();

function canvasTexture(key, draw) {
  if (textureCache.has(key)) return textureCache.get(key);
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  draw(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  textureCache.set(key, texture);
  return texture;
}

function drawStone(context, colors) {
  context.fillStyle = colors[0];
  context.fillRect(0, 0, 16, 16);
  context.fillStyle = colors[2];
  [0, 5, 10, 15].forEach((y) => context.fillRect(0, y, 16, 1));
  [0, 1, 2].forEach((row) => {
    const joints = row % 2 ? [3, 11] : [7, 15];
    joints.forEach((x) => context.fillRect(x, row * 5 + 1, 1, 4));
  });
  context.fillStyle = colors[1];
  [[1, 2], [9, 3], [5, 7], [13, 8], [2, 12], [10, 13]].forEach(([x, y]) => context.fillRect(x, y, 3, 1));
}

export function createTileTexture(pattern, colors) {
  return canvasTexture(`tile:${pattern}:${colors.join(':')}`, (context) => {
    context.fillStyle = colors[0];
    context.fillRect(0, 0, 16, 16);
    if (pattern === 'stone' || pattern === 'darkStone' || pattern === 'road') {
      drawStone(context, colors);
      if (pattern === 'road') { context.fillStyle = colors[3]; context.fillRect(7, 0, 2, 16); }
    } else if (pattern === 'sand') {
      context.fillStyle = colors[1];
      [[1, 3], [6, 1], [12, 4], [3, 10], [9, 8], [14, 13], [7, 15]].forEach(([x, y]) => context.fillRect(x, y, 2, 1));
      context.fillStyle = colors[2];
      [[4, 5], [11, 11], [1, 14]].forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    } else if (pattern === 'plaster') {
      context.fillStyle = colors[1]; context.fillRect(0, 0, 1, 16); context.fillRect(15, 0, 1, 16);
      [[4, 3], [11, 6], [7, 12]].forEach(([x, y]) => context.fillRect(x, y, 2, 1));
      context.fillStyle = colors[2]; context.fillRect(0, 14, 16, 2);
    } else if (pattern === 'wood') {
      context.fillStyle = colors[2]; [0, 5, 10, 15].forEach((x) => context.fillRect(x, 0, 1, 16));
      context.fillStyle = colors[1];
      [[2, 3], [7, 11], [12, 5]].forEach(([x, y]) => { context.fillRect(x, y, 2, 1); context.fillRect(x + 1, y + 1, 1, 1); });
    } else if (pattern === 'cloth') {
      context.fillStyle = colors[1]; for (let index = 0; index < 16; index += 4) context.fillRect(index, 0, 2, 16);
      context.fillStyle = colors[2]; context.fillRect(0, 0, 16, 1); context.fillRect(0, 15, 16, 1);
    } else if (pattern === 'foliage') {
      context.fillStyle = colors[1];
      [[0, 2], [4, 0], [8, 4], [12, 1], [2, 9], [7, 12], [13, 10]].forEach(([x, y]) => context.fillRect(x, y, 4, 3));
      context.fillStyle = colors[2]; [[3, 4], [10, 2], [5, 14], [14, 7]].forEach(([x, y]) => context.fillRect(x, y, 2, 2));
    } else if (pattern === 'water') {
      context.fillStyle = colors[1]; [2, 8, 14].forEach((y, row) => context.fillRect(row % 2 ? 4 : 0, y, 10, 1));
      context.fillStyle = colors[2]; context.fillRect(7, 5, 7, 1); context.fillRect(1, 11, 6, 1);
    }
  });
}

function makeFaceTexture(key, base, draw) {
  return canvasTexture(key, (context) => {
    context.fillStyle = base;
    context.fillRect(0, 0, 16, 16);
    draw(context);
  });
}

function skinTexture(key, base, shadow = base) {
  return makeFaceTexture(`${key}:skin`, base, (context) => { context.fillStyle = shadow; context.fillRect(0, 13, 16, 3); });
}

function garmentTexture(key, colors, decorated) {
  return makeFaceTexture(key, colors[0], (context) => {
    context.fillStyle = colors[1]; context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16);
    context.fillStyle = colors[2]; context.fillRect(0, 11, 16, 2);
    context.fillStyle = colors[3]; context.fillRect(0, 13, 16, 3);
    if (decorated) {
      context.fillStyle = colors[2]; context.fillRect(7, 1, 2, 10); context.fillRect(5, 4, 6, 2);
      context.fillStyle = '#efe0a6'; context.fillRect(7, 5, 2, 2);
    }
  });
}

function identityGarmentTexture(key, design, face = 'front') {
  const colors = design.torso;
  return makeFaceTexture(key, colors[0], (context) => {
    context.fillStyle = colors[1]; context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16);
    context.fillStyle = colors[2]; context.fillRect(0, 11, 16, 2);
    context.fillStyle = colors[3]; context.fillRect(0, 13, 16, 3);
    applyClothingCut(context, design, face);
    if (face === 'front') drawMotif(context, design.motif, colors[2]);
  });
}

function drawMotif(context, motif, color) {
  context.fillStyle = color;
  const pixels = {
    sun: [[7, 2, 2, 8], [4, 5, 8, 2]], beetle: [[6, 3, 4, 7], [4, 5, 2, 1], [10, 5, 2, 1]],
    sash: [[4, 1, 2, 10], [6, 9, 5, 2]], bones: [[5, 3, 6, 2], [7, 1, 2, 10]],
    flame: [[7, 2, 2, 9], [5, 6, 2, 4], [9, 4, 2, 6]], stars: [[3, 3, 2, 2], [9, 2, 2, 2], [6, 7, 2, 2]],
    diamond: [[7, 2, 2, 2], [5, 4, 6, 4], [7, 8, 2, 2]], chevron: [[3, 3, 2, 2], [5, 5, 2, 2], [7, 7, 2, 2], [9, 5, 2, 2], [11, 3, 2, 2]],
    crown: [[4, 5, 8, 3], [4, 2, 2, 3], [7, 1, 2, 4], [10, 2, 2, 3]], scorpion: [[7, 3, 2, 7], [4, 5, 3, 2], [9, 5, 3, 2]],
    key: [[4, 3, 5, 5], [8, 6, 2, 5], [10, 9, 3, 2]], waves: [[3, 4, 3, 2], [6, 6, 3, 2], [9, 4, 3, 2]],
    eye: [[3, 5, 3, 2], [6, 3, 4, 6], [10, 5, 3, 2]], fangs: [[4, 3, 2, 7], [10, 3, 2, 7]],
    tower: [[5, 3, 6, 8], [4, 2, 2, 3], [7, 2, 2, 3], [10, 2, 2, 3]], lantern: [[5, 3, 6, 7], [7, 1, 2, 2]],
    dice: [[5, 2, 7, 8], [6, 3, 2, 2], [9, 6, 2, 2]], leaf: [[5, 3, 6, 7], [7, 6, 2, 5]],
    horns: [[3, 2, 2, 6], [11, 2, 2, 6], [5, 6, 6, 3]], moon: [[5, 2, 6, 8], [7, 2, 5, 6]],
  };
  (pixels[motif] ?? [[7, 2, 2, 9]]).forEach((rect) => context.fillRect(...rect));
}

export function getPaperdollDesign(character) {
  const race = RACES[character.race];
  const fallback = race.palettes[character.appearance % race.palettes.length];
  const classColors = {
    warrior: ['#9e3f2d', '#602821', '#d5aa54', '#3d2d28'], ranger: ['#557344', '#30482f', '#b98c49', '#392f26'],
    mage: ['#228b96', '#15535d', '#d7b85c', '#34294b'], rogue: ['#644c68', '#352d43', '#bc8b4e', '#292326'],
  };
  const clothingCut = character.visual?.clothingCut ?? 'simple-tunic';
  const armor = resolveArmorSkin(character.armorId, character.race, character.gender);
  const cape = resolveCapeSkin(character.capeId, character.race, character.gender);
  return {
    skin: character.visual?.skin ?? fallback.skin,
    shadow: character.visual?.shadow ?? fallback.shadow,
    hair: character.visual?.hair ?? fallback.hair,
    eyes: character.visual?.eyes ?? fallback.eyes,
    torso: [...(armor?.palette ?? character.visual?.garment ?? classColors[character.classId] ?? classColors.warrior)],
    face: `${character.race}:${character.visual?.marking ?? 'plain'}:${character.gender ?? 'unspecified'}`,
    hands: character.visual?.skin ?? fallback.skin,
    boots: '#241d1b',
    motif: character.visual?.motif ?? 'sun',
    hairStyle: character.visual?.hairStyle ?? 'cropped',
    marking: character.visual?.marking ?? 'plain',
    clothingCut,
    legwear: character.visual?.legwear ?? `${clothingCut}-legwear`,
    gender: character.gender ?? 'unspecified',
    armor,
    cape,
  };
}

export function getEarDesign(character) {
  const design = getPaperdollDesign(character);
  return { skin: design.skin, shadow: design.shadow };
}

function stringSignature(value) {
  return [...value].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
}

function drawArmorSurface(context, design, region) {
  const armor = design.armor;
  const [base, dark, accent, under] = armor.palette;
  const signature = stringSignature(armor.id);
  context.fillStyle = base; context.fillRect(0, 0, 16, 16);
  context.fillStyle = under; context.fillRect(0, 13, 16, 3);
  context.fillStyle = dark;
  if (armor.family === 'desert') {
    for (let y = 1; y < 13; y += 3) context.fillRect(y % 2 ? 1 : 3, y, 12, 1);
    context.fillStyle = accent; context.fillRect(7, 0, 2, 13);
  } else if (armor.family === 'western') {
    context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16); context.fillRect(0, 6, 16, 2);
    context.fillStyle = accent; context.fillRect(4, 2, 8, 1); context.fillRect(5, 10, 6, 1);
  } else if (armor.family === 'barbarian') {
    context.fillRect(0, 0, 16, 4); context.fillRect(1, 8, 5, 5); context.fillRect(10, 6, 5, 6);
    context.fillStyle = accent; context.fillRect(2, 4, 2, 8); context.fillRect(12, 3, 2, 10);
  } else {
    context.fillRect(1, 1, 14, 2); context.fillRect(2, 11, 12, 2);
    context.fillStyle = accent; context.fillRect(7, 2, 2, 10); context.fillRect(4, 5, 8, 2);
  }
  if (region === 'arm') { context.fillStyle = accent; context.fillRect(0, 4, 16, 2); context.fillRect(0, 10, 16, 2); }
  context.fillStyle = accent;
  if (armor.race === 'human') {
    context.fillRect(7, 3, 2, 7); context.fillRect(5, 5, 6, 2);
  } else if (armor.race === 'orc') {
    context.fillRect(3, 3, 2, 7); context.fillRect(11, 3, 2, 7); context.fillRect(5, 8, 6, 2);
  } else {
    [[4, 4], [10, 3], [7, 8]].forEach(([x, y]) => context.fillRect(x, y, 2, 2));
  }
  const detailY = 2 + (signature % 9);
  context.fillStyle = (signature & 1) === 0 ? dark : accent;
  context.fillRect(1, detailY, 3, 1); context.fillRect(12, 12 - (detailY % 7), 3, 1);
  if (armor.gender === 'female') {
    context.fillStyle = accent; context.fillRect(2, 1, 2, 2); context.fillRect(12, 1, 2, 2); context.fillRect(7, 11, 2, 2);
  } else {
    context.fillStyle = dark; context.fillRect(1, 1, 4, 2); context.fillRect(11, 1, 4, 2);
  }
}

function armorTexture(key, design, region) {
  return canvasTexture(key, (context) => drawArmorSurface(context, design, region));
}

function helmetTexture(key, design, face) {
  const armor = design.armor;
  return canvasTexture(key, (context) => {
    drawArmorSurface(context, design, 'head');
    const [, dark, accent] = armor.palette;
    if (face === 'front') {
      context.fillStyle = dark;
      if (armor.helmetCoverage === 'eye-slit') {
        context.fillRect(2, 7, 12, 3);
        context.fillStyle = design.eyes; context.fillRect(4, 8, 2, 1); context.fillRect(10, 8, 2, 1);
      } else {
        context.fillRect(3, 6, 10, 2); context.fillRect(7, 8, 2, 6);
        context.fillStyle = accent; context.fillRect(2, 2, 12, 2);
      }
    } else if (face === 'side') {
      context.fillStyle = dark; context.fillRect(11, 6, 5, 8);
    } else if (face === 'top') {
      context.fillStyle = accent; context.fillRect(6, 0, 4, 16);
    } else if (face === 'back') {
      context.fillStyle = dark; context.fillRect(0, 11, 16, 5);
    }
    if (face === 'front' || face === 'top') {
      context.fillStyle = accent;
      if (armor.gender === 'female') { context.fillRect(7, 1, 2, 2); context.fillRect(5, 2, 6, 1); }
      else context.fillRect(6, 0, 4, 4);
    }
  });
}

function legwearTexture(key, design) {
  if (design.armor) return armorTexture(key, design, 'leg');
  const colors = design.torso;
  const signature = stringSignature(design.legwear);
  return makeFaceTexture(key, colors[3], (context) => {
    const construction = signature % 5;
    context.fillStyle = colors[0];
    if (construction === 0) { context.fillRect(1, 0, 14, 7); context.fillRect(3, 7, 10, 3); }
    else if (construction === 1) { context.fillRect(0, 0, 5, 12); context.fillRect(11, 0, 5, 12); }
    else if (construction === 2) { context.fillRect(0, 0, 16, 4); context.fillRect(2, 6, 12, 3); }
    else if (construction === 3) { context.fillRect(0, 0, 16, 9); context.fillStyle = colors[1]; context.fillRect(5, 0, 6, 9); }
    else { context.fillRect(2, 0, 12, 12); context.fillStyle = colors[1]; context.fillRect(0, 4, 16, 2); }
    context.fillStyle = colors[2];
    const trimY = 3 + (signature % 7); context.fillRect(0, trimY, 16, 1);
    const trimX = 2 + ((signature >>> 3) % 10); context.fillRect(trimX, 1, 2, 10);
    context.fillStyle = '#241d1b'; context.fillRect(0, 11, 16, 5);
    context.fillStyle = colors[2]; context.fillRect(0, 10, 16, 1);
    if ((signature & 1) === 1) { context.fillStyle = colors[1]; context.fillRect(2, 12, 12, 2); }
  });
}

function capeTexture(key, cape, face) {
  return canvasTexture(key, (context) => {
    const [base, dark, accent, lining] = cape.palette;
    context.fillStyle = face === 'front' ? lining : base;
    context.fillRect(0, 0, 16, 16);
    context.fillStyle = dark;
    context.fillRect(0, 0, 2, 16); context.fillRect(14, 0, 2, 16);
    if (cape.pattern === 'heraldic') {
      context.fillStyle = accent; context.fillRect(7, 2, 2, 11); context.fillRect(4, 5, 8, 2);
    } else if (cape.pattern === 'quartered') {
      context.fillStyle = dark; context.fillRect(0, 0, 8, 8); context.fillRect(8, 8, 8, 8);
      context.fillStyle = accent; context.fillRect(7, 0, 2, 16); context.fillRect(0, 7, 16, 2);
    } else if (cape.pattern === 'bordered') {
      context.fillStyle = accent; context.fillRect(2, 2, 12, 2); context.fillRect(2, 12, 12, 2);
    } else {
      context.fillStyle = accent;
      [[3, 3], [10, 2], [7, 7], [4, 11], [11, 12]].forEach(([x, y]) => context.fillRect(x, y, 2, 2));
    }
    context.fillStyle = accent;
    if (cape.race === 'orc') { context.fillRect(3, 5, 2, 6); context.fillRect(11, 5, 2, 6); }
    else if (cape.race === 'elf') { context.fillRect(6, 4, 4, 7); context.fillStyle = base; context.fillRect(8, 4, 3, 5); }
    if (cape.gender === 'female') { context.fillStyle = accent; context.fillRect(3, 14, 3, 2); context.fillRect(10, 14, 3, 2); }
    else { context.fillStyle = dark; context.fillRect(6, 13, 4, 3); }
  });
}

export function createCapeMaterials(character) {
  const cape = getPaperdollDesign(character).cape;
  if (!cape) return null;
  const material = (face) => new THREE.MeshLambertMaterial({ map: capeTexture(`cape:${cape.id}:${face}`, cape, face) });
  return [material('side'), material('side'), material('top'), material('bottom'), material('front'), material('back')];
}

function drawHair(context, face, design) {
  const hair = design.hair;
  const cloth = design.torso;
  const feminineStyles = {
    'flower-crown': 'flower-wrap', 'rose-helm': 'beetle-helm', 'ribbon-braids': 'veil-braids', 'pearl-hood': 'bone-hood',
    'dragon-braid': 'side-braid', 'jewel-turban': 'tower-turban', 'silk-plume': 'feather-plume', 'royal-ringlets': 'royal-curls',
    'high-ponytail': 'scorpion-tail', 'key-bob': 'coin-curls', 'veil-cascade': 'veil-braids', 'crystal-cone': 'salt-cone',
    'mane-braids': 'wild-mane', 'braided-crest': 'horsehair-crest', 'lantern-bob': 'coin-curls', 'coin-pigtails': 'star-buns',
    'herb-crown': 'flower-wrap', 'horn-braids': 'trophy-horns', 'crescent-braid': 'crescent-cowl', 'star-buns': 'star-buns',
  };
  const originalStyle = design.hairStyle;
  const style = feminineStyles[originalStyle] ?? originalStyle;
  context.fillStyle = hair;

  if (style === 'cropped') {
    context.fillRect(0, 0, 16, face === 'back' ? 6 : 3);
  } else if (style === 'long') {
    context.fillRect(0, 0, 16, 4);
    if (face === 'front') { context.fillRect(0, 3, 3, 10); context.fillRect(13, 3, 3, 10); }
    if (face === 'side') context.fillRect(0, 3, 8, 13);
    if (face === 'back') context.fillRect(0, 3, 16, 13);
  } else if (style === 'braids') {
    context.fillRect(0, 0, 16, 3);
    if (face === 'front') { context.fillRect(0, 3, 2, 7); context.fillRect(14, 3, 2, 7); }
    if (face === 'side') { context.fillRect(2, 3, 4, 13); context.fillRect(10, 3, 3, 7); }
    if (face === 'back') { context.fillRect(2, 3, 4, 13); context.fillRect(10, 3, 4, 13); }
  } else if (style === 'wrapped') {
    context.fillStyle = cloth[0];
    context.fillRect(0, 0, 16, face === 'back' ? 9 : 6);
    context.fillStyle = cloth[2];
    context.fillRect(0, 2, 16, 2);
    if (face === 'side') context.fillRect(2, 6, 3, 8);
  } else if (style === 'hood') {
    context.fillStyle = cloth[1];
    if (face === 'front') { context.fillRect(0, 0, 16, 3); context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16); }
    else context.fillRect(0, 0, 16, 16);
    context.fillStyle = cloth[2];
    if (face !== 'front') context.fillRect(0, 13, 16, 2);
  } else if (style === 'crest') {
    context.fillRect(0, 0, 16, 2);
    if (face === 'front' || face === 'back') context.fillRect(6, 0, 4, 7);
    if (face === 'side') context.fillRect(2, 0, 12, 5);
  } else if (style === 'mohawk') {
    if (face === 'front' || face === 'back') context.fillRect(6, 0, 4, 8);
    if (face === 'side') { context.fillRect(0, 0, 16, 3); context.fillRect(3, 3, 10, 3); }
  } else if (style === 'plume') {
    context.fillStyle = cloth[0];
    if (face === 'front' || face === 'back') context.fillRect(6, 0, 4, 8);
    if (face === 'side') context.fillRect(1, 0, 14, 5);
    context.fillStyle = cloth[2];
    context.fillRect(7, 0, 2, 6);
  } else if (style === 'wild') {
    context.fillRect(0, 0, 16, 5);
    [[0, 5, 3, 7], [4, 5, 2, 3], [8, 5, 3, 5], [13, 5, 3, 9]].forEach((rect) => context.fillRect(...rect));
    if (face === 'back') context.fillRect(0, 5, 16, 11);
  } else if (style === 'slicked') {
    context.fillRect(0, 0, 16, 4);
    if (face === 'side') context.fillRect(0, 3, 6, 4);
    if (face === 'back') context.fillRect(0, 3, 16, 7);
  } else if (style === 'crown') {
    context.fillRect(0, 0, 16, 4);
    context.fillStyle = cloth[2];
    context.fillRect(0, 1, 16, 2);
    if (face === 'front' || face === 'back') { context.fillRect(2, 0, 3, 3); context.fillRect(7, 0, 3, 3); context.fillRect(12, 0, 3, 3); }
  } else if (style === 'sun-disc') {
    context.fillRect(0, 0, 16, 4); context.fillStyle = cloth[2]; context.fillRect(3, 0, 10, 2); context.fillRect(6, 2, 4, 5);
  } else if (style === 'beetle-helm') {
    context.fillStyle = cloth[1]; context.fillRect(0, 0, 16, 7); context.fillRect(0, 7, 3, 5); context.fillRect(13, 7, 3, 5);
    context.fillStyle = cloth[2]; context.fillRect(7, 0, 2, 10);
  } else if (style === 'side-braid') {
    context.fillRect(0, 0, 16, 4); if (face === 'front') context.fillRect(12, 3, 3, 13); if (face === 'side') context.fillRect(9, 3, 4, 13); if (face === 'back') context.fillRect(11, 3, 4, 13);
  } else if (style === 'bone-hood') {
    context.fillStyle = cloth[1]; context.fillRect(0, 0, 16, face === 'front' ? 4 : 16); if (face === 'front') { context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16); }
    context.fillStyle = '#e7d9b2'; context.fillRect(2, 1, 3, 2); context.fillRect(11, 1, 3, 2);
  } else if (style === 'horn-wrap') {
    context.fillStyle = cloth[0]; context.fillRect(0, 0, 16, 5); context.fillStyle = '#ead8aa'; context.fillRect(1, 0, 3, 4); context.fillRect(12, 0, 3, 4);
  } else if (style === 'star-buns') {
    context.fillRect(0, 0, 16, 4); if (face !== 'top') { context.fillRect(0, 3, 4, 5); context.fillRect(12, 3, 4, 5); }
    context.fillStyle = cloth[2]; context.fillRect(1, 4, 2, 2); context.fillRect(13, 4, 2, 2);
  } else if (style === 'tower-turban') {
    context.fillStyle = cloth[0]; context.fillRect(0, 0, 16, 8); context.fillStyle = cloth[2]; context.fillRect(0, 2, 16, 2); context.fillRect(0, 6, 16, 1);
  } else if (style === 'feather-plume') {
    context.fillRect(0, 0, 16, 3); context.fillStyle = cloth[0]; context.fillRect(6, 0, 4, 9); context.fillRect(9, 1, 5, 3); context.fillStyle = cloth[2]; context.fillRect(7, 0, 2, 8);
  } else if (style === 'royal-curls') {
    context.fillRect(0, 0, 16, 5); [[0, 4], [4, 5], [9, 4], [13, 5]].forEach(([x, y]) => context.fillRect(x, y, 3, 5));
    context.fillStyle = cloth[2]; context.fillRect(1, 1, 14, 1);
  } else if (style === 'scorpion-tail') {
    context.fillRect(0, 0, 16, 3); if (face === 'back' || face === 'side') { context.fillRect(6, 3, 5, 8); context.fillRect(3, 9, 5, 4); }
  } else if (style === 'key-pins') {
    context.fillRect(0, 0, 16, 4); context.fillStyle = cloth[2]; context.fillRect(3, 2, 2, 7); context.fillRect(11, 1, 2, 6); context.fillRect(2, 7, 4, 2);
  } else if (style === 'veil-braids') {
    context.fillRect(0, 0, 16, 3); context.fillRect(1, 3, 3, 13); context.fillRect(12, 3, 3, 13); context.fillStyle = cloth[0]; context.globalAlpha = 0.8; context.fillRect(2, 7, 12, 6); context.globalAlpha = 1;
  } else if (style === 'salt-cone') {
    context.fillStyle = '#eee2c7'; context.fillRect(2, 0, 12, 3); context.fillRect(4, 3, 8, 3); context.fillRect(6, 6, 4, 3);
  } else if (style === 'wild-mane') {
    context.fillRect(0, 0, 16, 6); [[0, 5, 4, 11], [5, 5, 3, 7], [9, 5, 3, 10], [13, 5, 3, 8]].forEach((rect) => context.fillRect(...rect));
  } else if (style === 'horsehair-crest') {
    context.fillStyle = cloth[1]; context.fillRect(0, 0, 16, 4); context.fillStyle = hair; if (face === 'side') context.fillRect(0, 0, 16, 6); else context.fillRect(6, 0, 4, 10);
  } else if (style === 'candle-hood') {
    context.fillStyle = cloth[1]; context.fillRect(0, 0, 16, face === 'front' ? 4 : 16); if (face === 'front') { context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16); }
    context.fillStyle = '#f1c65b'; context.fillRect(7, 0, 2, 5); context.fillStyle = '#e35f30'; context.fillRect(7, 0, 2, 2);
  } else if (style === 'coin-curls') {
    context.fillRect(0, 0, 16, 5); [[1, 4], [6, 4], [11, 4]].forEach(([x, y]) => context.fillRect(x, y, 4, 4)); context.fillStyle = cloth[2]; context.fillRect(2, 5, 2, 2); context.fillRect(12, 5, 2, 2);
  } else if (style === 'flower-wrap') {
    context.fillStyle = cloth[0]; context.fillRect(0, 0, 16, 6); context.fillStyle = cloth[2]; [[2, 1], [7, 3], [12, 1]].forEach(([x, y]) => { context.fillRect(x, y, 2, 2); context.fillRect(x - 1, y + 1, 4, 1); });
  } else if (style === 'trophy-horns') {
    context.fillRect(0, 0, 16, 3); context.fillStyle = '#e4d4aa'; context.fillRect(0, 0, 4, 6); context.fillRect(12, 0, 4, 6); context.fillStyle = cloth[0]; context.fillRect(3, 1, 10, 2);
  } else if (style === 'crescent-cowl') {
    context.fillStyle = cloth[1]; context.fillRect(0, 0, 16, face === 'front' ? 4 : 16); if (face === 'front') { context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16); }
    context.fillStyle = cloth[2]; context.fillRect(2, 0, 12, 2); context.fillRect(2, 2, 3, 3);
  }

  if (originalStyle === 'ribbon-braids' || originalStyle === 'high-ponytail' || originalStyle === 'dragon-braid') {
    context.fillStyle = cloth[2]; context.fillRect(face === 'front' ? 12 : 10, 6, 2, 5);
  } else if (originalStyle === 'flower-crown' || originalStyle === 'herb-crown') {
    context.fillStyle = originalStyle === 'flower-crown' ? '#f5a1a8' : '#9bcf78';
    [[2, 2], [7, 1], [12, 2]].forEach(([x, y]) => context.fillRect(x, y, 2, 2));
  } else if (originalStyle === 'pearl-hood' || originalStyle === 'crystal-cone') {
    context.fillStyle = '#f7e8cf'; [[3, 2], [8, 1], [12, 3]].forEach(([x, y]) => context.fillRect(x, y, 1, 1));
  } else if (originalStyle === 'lantern-bob') {
    context.fillStyle = '#f0b84f'; context.fillRect(2, 5, 2, 2); context.fillRect(12, 5, 2, 2);
  }
}

function applyClothingCut(context, design, face) {
  const [base, dark, accent] = design.torso;
  const feminineCuts = {
    'petal-robe': 'ceremonial-robe', 'rose-lamellar': 'lamellar', 'ribbon-sash': 'cross-sash', 'pearl-mantle': 'bone-mantle',
    'scale-dress': 'scale-tabard', 'star-coat': 'constellation-coat', 'jewel-vest': 'merchant-vest', 'silk-doublet': 'split-doublet',
    'moon-regalia': 'torn-regalia', 'sun-harness': 'desert-harness', 'tool-pinafore': 'pocket-apron', 'dancer-silks': 'layered-silks',
    'crystal-shawl': 'oracle-shawl', 'fur-dress': 'fur-shoulders', 'captain-corset': 'officer-plate', 'firefly-cloak': 'lantern-cloak',
    'charm-coat': 'patched-coat', 'garden-apron': 'herb-pouches', 'ivory-hide': 'monster-hide', 'moon-gown': 'celestial-gown',
  };
  const originalCut = design.clothingCut;
  const cut = feminineCuts[originalCut] ?? originalCut;
  context.fillStyle = dark;
  if (cut === 'lamellar' || cut === 'officer-plate') { [2, 6, 10].forEach((y) => context.fillRect(2, y, 12, 2)); }
  else if (cut === 'cross-sash') { context.fillRect(2, 0, 3, 12); context.fillStyle = accent; context.fillRect(4, 8, 10, 2); }
  else if (cut === 'bone-mantle' || cut === 'fur-shoulders') { context.fillRect(0, 0, 16, 5); context.fillStyle = accent; context.fillRect(1, 4, 3, 3); context.fillRect(12, 4, 3, 3); }
  else if (cut === 'scale-tabard' || cut === 'monster-hide') { for (let y = 2; y < 12; y += 3) for (let x = (y % 2) + 2; x < 14; x += 4) context.fillRect(x, y, 3, 2); }
  else if (cut === 'constellation-coat' || cut === 'celestial-gown') { context.fillStyle = accent; [[3, 2], [11, 3], [7, 7], [4, 10]].forEach(([x, y]) => context.fillRect(x, y, 2, 2)); }
  else if (cut === 'merchant-vest' || cut === 'split-doublet') { context.fillRect(0, 0, 4, 13); context.fillRect(12, 0, 4, 13); context.fillStyle = accent; context.fillRect(7, 0, 2, 13); }
  else if (cut === 'torn-regalia' || cut === 'patched-coat') { context.fillStyle = accent; context.fillRect(2, 2, 5, 4); context.fillRect(10, 7, 4, 5); context.fillStyle = base; context.fillRect(3, 3, 3, 2); }
  else if (cut === 'desert-harness') { context.fillRect(2, 0, 3, 13); context.fillRect(11, 0, 3, 13); context.fillStyle = accent; context.fillRect(0, 9, 16, 3); }
  else if (cut === 'pocket-apron' || cut === 'herb-pouches') { context.fillStyle = accent; context.fillRect(2, 7, 12, 5); context.fillStyle = dark; context.fillRect(3, 8, 4, 3); context.fillRect(9, 8, 4, 3); }
  else if (cut === 'layered-silks' || cut === 'oracle-shawl') { context.fillStyle = accent; context.fillRect(0, 2, 16, 2); context.fillRect(0, 7, 16, 2); context.fillRect(0, 12, 16, 2); }
  else if (cut === 'lantern-cloak') { context.fillRect(0, 0, 4, 16); context.fillRect(12, 0, 4, 16); context.fillStyle = '#e8a743'; context.fillRect(6, 4, 4, 6); }
  else if (cut === 'ceremonial-robe') { context.fillStyle = accent; context.fillRect(1, 1, 14, 2); context.fillRect(1, 10, 14, 2); }
  if (originalCut === 'petal-robe' || originalCut === 'scale-dress' || originalCut === 'moon-gown') {
    context.fillStyle = accent; context.fillRect(3, 10, 3, 3); context.fillRect(7, 9, 2, 4); context.fillRect(10, 10, 3, 3);
  } else if (originalCut === 'captain-corset') {
    context.fillStyle = accent; context.fillRect(4, 3, 2, 7); context.fillRect(10, 3, 2, 7); context.fillRect(6, 8, 4, 2);
  } else if (originalCut === 'tool-pinafore' || originalCut === 'garden-apron') {
    context.fillStyle = base; context.fillRect(4, 8, 8, 4);
  }
  if (face === 'back') { context.fillStyle = dark; context.fillRect(6, 1, 4, 12); }
}

function drawFaceMarking(context, design) {
  const marking = design.marking;
  if (marking === 'scar') {
    context.fillStyle = '#b3262e';
    context.fillRect(3, 6, 1, 2);
    context.fillRect(4, 8, 1, 2);
    context.fillRect(5, 10, 1, 2);
  } else if (marking === 'tattoo') {
    context.fillStyle = '#364b4d';
    context.fillRect(2, 5, 1, 4);
    context.fillRect(3, 8, 2, 1);
    context.fillRect(2, 11, 2, 1);
  } else if (marking === 'runes') {
    context.fillStyle = design.torso[2];
    context.fillRect(2, 5, 1, 2);
    context.fillRect(2, 8, 2, 1);
    context.fillRect(3, 10, 1, 2);
  } else if (marking === 'paint') {
    context.fillStyle = design.torso[1];
    context.fillRect(2, 6, 3, 1);
    context.fillRect(11, 6, 3, 1);
    context.fillRect(7, 11, 2, 1);
  } else if (marking === 'soot') {
    context.fillStyle = '#3c302c';
    context.globalAlpha = 0.65;
    context.fillRect(2, 11, 3, 2);
    context.fillRect(11, 10, 2, 2);
    context.globalAlpha = 1;
  } else if (marking === 'salt') {
    context.fillStyle = '#eee0bd';
    context.fillRect(2, 5, 1, 1);
    context.fillRect(3, 11, 1, 1);
    context.fillRect(12, 6, 1, 1);
    context.fillRect(11, 12, 1, 1);
  } else if (marking === 'ash') {
    context.fillStyle = '#756b6b';
    context.fillRect(3, 11, 3, 1);
    context.fillRect(10, 11, 3, 1);
  } else if (marking === 'mask') {
    context.fillStyle = design.torso[1];
    context.fillRect(2, 7, 12, 3);
    context.fillStyle = design.eyes;
    context.fillRect(4, 8, 2, 1);
    context.fillRect(10, 8, 2, 1);
  } else if (marking === 'eyeliner') {
    context.fillStyle = '#241b20';
    context.fillRect(3, 7, 4, 1);
    context.fillRect(9, 7, 4, 1);
  } else if (marking === 'freckles') {
    context.fillStyle = design.shadow;
    [[3, 10], [5, 11], [11, 10], [13, 11]].forEach(([x, y]) => context.fillRect(x, y, 1, 1));
  } else if (['gold', 'jewels', 'stars'].includes(marking)) {
    context.fillStyle = design.torso[2];
    context.fillRect(2, 5, 1, 1);
    context.fillRect(13, 5, 1, 1);
    if (marking !== 'gold') context.fillRect(7, 3, 2, 1);
  } else if (marking === 'blush') {
    context.fillStyle = '#d97f79'; context.fillRect(2, 11, 3, 1); context.fillRect(11, 11, 3, 1);
  } else if (marking === 'beauty-mark') {
    context.fillStyle = '#332226'; context.fillRect(12, 11, 1, 1);
  } else if (marking === 'pearl-dots' || marking === 'moon-dots' || marking === 'star-kiss') {
    context.fillStyle = marking === 'pearl-dots' ? '#f5e9d0' : design.torso[2];
    context.fillRect(3, 11, 1, 1); context.fillRect(12, 11, 1, 1); if (marking === 'star-kiss') context.fillRect(8, 4, 1, 1);
  } else if (marking === 'henna') {
    context.fillStyle = '#7d3b31'; context.fillRect(2, 9, 1, 3); context.fillRect(3, 11, 2, 1);
  } else if (marking === 'lace-mask') {
    context.fillStyle = design.torso[1]; context.fillRect(3, 7, 4, 1); context.fillRect(9, 7, 4, 1); context.fillRect(2, 9, 2, 1); context.fillRect(12, 9, 2, 1);
  }
}

export function createPaperdollMaterials(character, part) {
  const design = getPaperdollDesign(character);
  const skin = { skin: design.skin, shadow: design.shadow, hair: design.hair, eyes: design.eyes };
  const cloth = design.torso;
  const identityKey = character.id ?? `${character.race}:${character.appearance}:${character.classId}:${character.gender ?? 'player'}`;
  const key = `${identityKey}:${part}`;
  const material = (texture) => new THREE.MeshLambertMaterial({ map: texture });

  if (part === 'ear') {
    const ear = getEarDesign(character);
    const texture = skinTexture(`${key}:ear`, ear.skin, ear.shadow);
    return Array.from({ length: 6 }, () => material(texture));
  }

  if (part === 'head') {
    if (design.armor && design.armor.helmetCoverage !== 'open') {
      const side = helmetTexture(`${key}:helmet-side`, design, 'side');
      return [side, side, helmetTexture(`${key}:helmet-top`, design, 'top'), helmetTexture(`${key}:helmet-bottom`, design, 'bottom'), helmetTexture(`${key}:helmet-front`, design, 'front'), helmetTexture(`${key}:helmet-back`, design, 'back')].map(material);
    }
    const side = makeFaceTexture(`${key}:side`, skin.skin, (context) => {
      drawHair(context, 'side', design);
      context.fillStyle = skin.shadow; context.fillRect(12, 11, 4, 5); context.fillRect(4, 14, 8, 2);
    });
    const front = makeFaceTexture(`${key}:front`, skin.skin, (context) => {
      drawHair(context, 'front', design);
      context.fillStyle = skin.shadow; context.fillRect(3, 7, 4, 1); context.fillRect(10, 7, 4, 1);
      context.fillStyle = skin.eyes; context.fillRect(4, 8, 2, 2); context.fillRect(10, 8, 2, 2);
      context.fillStyle = '#171315'; context.fillRect(5, 8, 1, 2); context.fillRect(10, 8, 1, 2);
      context.fillStyle = skin.shadow; context.fillRect(7, 10, 2, 2); context.fillRect(5, 13, 6, 1);
      if (character.race === 'orc') { context.fillStyle = '#e9d9aa'; context.fillRect(3, 12, 2, 2); context.fillRect(11, 12, 2, 2); }
      drawFaceMarking(context, design);
      if (design.gender === 'female') {
        context.fillStyle = skin.hair;
        context.fillRect(3, 7, 4, 1);
        context.fillRect(9, 7, 4, 1);
      }
    });
    const back = makeFaceTexture(`${key}:back`, skin.skin, (context) => { drawHair(context, 'back', design); });
    const top = makeFaceTexture(`${key}:top`, skin.skin, (context) => { drawHair(context, 'top', design); });
    return [side, side, top, skinTexture(`${key}:bottom`, skin.shadow), front, back].map(material);
  }
  if (part === 'torso') {
    if (design.armor) {
      const armor = armorTexture(`${key}:armor-torso`, design, 'torso');
      return Array.from({ length: 6 }, () => material(armor));
    }
    const side = garmentTexture(`${key}:side`, cloth, false);
    return [side, side, garmentTexture(`${key}:top`, cloth, false), garmentTexture(`${key}:bottom`, cloth, false), identityGarmentTexture(`${key}:front`, design), identityGarmentTexture(`${key}:back`, design, 'back')].map(material);
  }
  if (part === 'arm') {
    if (design.armor) {
      const armor = armorTexture(`${key}:armor-arm`, design, 'arm');
      return Array.from({ length: 6 }, () => material(armor));
    }
    const armoredSleeve = ['lamellar', 'officer-plate', 'scale-tabard'].includes(design.clothingCut);
    const sleeve = makeFaceTexture(`${key}:sleeve`, cloth[0], (context) => {
      context.fillStyle = cloth[1]; context.fillRect(0, 0, 3, 16); context.fillRect(13, 0, 3, 16);
      context.fillStyle = cloth[3]; context.fillRect(0, 13, 16, 3);
      if (armoredSleeve) { context.fillStyle = cloth[2]; context.fillRect(0, 3, 16, 2); context.fillRect(0, 8, 16, 2); }
    });
    const hand = skinTexture(`${key}:hand`, skin.skin, skin.shadow);
    return [sleeve, sleeve, sleeve, hand, sleeve, sleeve].map(material);
  }
  const legwear = legwearTexture(`${key}:legwear:${design.legwear}:${design.armor?.id ?? 'clothing'}`, design);
  return Array.from({ length: 6 }, () => material(legwear));
}
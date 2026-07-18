const MASCULINE_IDENTITIES = [
  ['Sun-Priest', 'mage', 'sun', 'sun-disc', 'gold', 'ceremonial-robe'],
  ['Beetle Knight', 'warrior', 'beetle', 'beetle-helm', 'scar', 'lamellar'],
  ['Oasis Courier', 'ranger', 'sash', 'side-braid', 'freckles', 'cross-sash'],
  ['Bone Diviner', 'mage', 'bones', 'bone-hood', 'ash', 'bone-mantle'],
  ['Dragon Cultist', 'warrior', 'flame', 'horn-wrap', 'tattoo', 'scale-tabard'],
  ['Star Cartographer', 'mage', 'stars', 'star-buns', 'runes', 'constellation-coat'],
  ['Spice Magnate', 'rogue', 'diamond', 'tower-turban', 'gold', 'merchant-vest'],
  ['Masked Duelist', 'rogue', 'chevron', 'feather-plume', 'mask', 'split-doublet'],
  ['Escaped Royal', 'ranger', 'crown', 'royal-curls', 'eyeliner', 'torn-regalia'],
  ['Scorpion Wrangler', 'ranger', 'scorpion', 'scorpion-tail', 'scar', 'desert-harness'],
  ['Crypt Locksmith', 'rogue', 'key', 'key-pins', 'soot', 'pocket-apron'],
  ['Mirage Dancer', 'rogue', 'waves', 'veil-braids', 'jewels', 'layered-silks'],
  ['Salt Oracle', 'mage', 'eye', 'salt-cone', 'salt', 'oracle-shawl'],
  ['Hyena Tamer', 'ranger', 'fangs', 'wild-mane', 'paint', 'fur-shoulders'],
  ['Wall Captain', 'warrior', 'tower', 'horsehair-crest', 'scar', 'officer-plate'],
  ['Lantern Witch', 'mage', 'lantern', 'candle-hood', 'runes', 'lantern-cloak'],
  ['Caravan Gambler', 'rogue', 'dice', 'coin-curls', 'eyeliner', 'patched-coat'],
  ['Dune Herbalist', 'ranger', 'leaf', 'flower-wrap', 'freckles', 'herb-pouches'],
  ['Minotaur Slayer', 'warrior', 'horns', 'trophy-horns', 'paint', 'monster-hide'],
  ['Royal Astronomer', 'mage', 'moon', 'crescent-cowl', 'stars', 'celestial-gown'],
];

const FEMININE_IDENTITIES = [
  ['Dawnflower Envoy', 'mage', 'sun', 'flower-crown', 'blush', 'petal-robe'],
  ['Rose Beetle Dame', 'warrior', 'beetle', 'rose-helm', 'beauty-mark', 'rose-lamellar'],
  ['Oasis Ribbonrunner', 'ranger', 'sash', 'ribbon-braids', 'freckles', 'ribbon-sash'],
  ['Pearl Bone-Seer', 'mage', 'bones', 'pearl-hood', 'pearl-dots', 'pearl-mantle'],
  ['Ember Dragonheart', 'warrior', 'flame', 'dragon-braid', 'henna', 'scale-dress'],
  ['Starlight Surveyor', 'mage', 'stars', 'star-buns', 'star-kiss', 'star-coat'],
  ['Saffron Merchant-Princess', 'rogue', 'diamond', 'jewel-turban', 'gold', 'jewel-vest'],
  ['Silk-Masked Duelist', 'rogue', 'chevron', 'silk-plume', 'lace-mask', 'silk-doublet'],
  ['Runaway Moon-Princess', 'ranger', 'crown', 'royal-ringlets', 'eyeliner', 'moon-regalia'],
  ['Scorpion Ponytailer', 'ranger', 'scorpion', 'high-ponytail', 'scar', 'sun-harness'],
  ['Keykeeper Tinkerer', 'rogue', 'key', 'key-bob', 'soot', 'tool-pinafore'],
  ['Mirage Ribbon Dancer', 'rogue', 'waves', 'veil-cascade', 'jewels', 'dancer-silks'],
  ['Crystal Salt Oracle', 'mage', 'eye', 'crystal-cone', 'salt', 'crystal-shawl'],
  ['Hyena-Mane Huntress', 'ranger', 'fangs', 'mane-braids', 'paint', 'fur-dress'],
  ['Liongate Captain', 'warrior', 'tower', 'braided-crest', 'scar', 'captain-corset'],
  ['Firefly Lantern Witch', 'mage', 'lantern', 'lantern-bob', 'runes', 'firefly-cloak'],
  ['Lucky Coin Charmer', 'rogue', 'dice', 'coin-pigtails', 'eyeliner', 'charm-coat'],
  ['Wildflower Herbalist', 'ranger', 'leaf', 'herb-crown', 'freckles', 'garden-apron'],
  ['Ivory Horn Champion', 'warrior', 'horns', 'horn-braids', 'paint', 'ivory-hide'],
  ['Moon-Court Astronomer', 'mage', 'moon', 'crescent-braid', 'moon-dots', 'moon-gown'],
];

export const NPC_IDENTITIES = {
  male: MASCULINE_IDENTITIES,
  female: FEMININE_IDENTITIES,
};

export const NPC_HAIR_STYLES = {
  male: MASCULINE_IDENTITIES.map((identity) => identity[3]),
  female: FEMININE_IDENTITIES.map((identity) => identity[3]),
};

export const NPC_FACE_MARKINGS = [...new Set([...MASCULINE_IDENTITIES, ...FEMININE_IDENTITIES].map((identity) => identity[4]))];
export const NPC_CLOTHING_CUTS = [...new Set([...MASCULINE_IDENTITIES, ...FEMININE_IDENTITIES].map((identity) => identity[5]))];

export const RACE_SKIN = {
  human: ['#6f3928', '#82452f', '#95553a', '#a9633f', '#b97049', '#c98052', '#d58e60', '#e0a16f', '#ba7657', '#8f5041'],
  orc: ['#344836', '#40583d', '#4d6846', '#5c744b', '#6f8251', '#7f8d59', '#8b7548', '#576a52', '#3c5d55', '#75633f'],
  elf: ['#554c61', '#665a70', '#796a80', '#8b8192', '#9b5f55', '#a97669', '#8c6e72', '#a89a90', '#635f78', '#987f91'],
};

const HAIR = ['#171416', '#2b1c18', '#4a2b1e', '#6b3d24', '#9a6638', '#d0aa68', '#e8dac0', '#5b4a58', '#253b3c', '#7b3030'];

export const GARMENTS = [
  ['Desert Crimson', '#b43f2d', '#67251f', '#e0b252', '#35251f'],
  ['Oasis Turquoise', '#287f84', '#155157', '#d5a449', '#352f2b'],
  ['Ranger Moss', '#5c7540', '#34472d', '#c79845', '#332a25'],
  ['Oracle Violet', '#725074', '#3e3048', '#d6b461', '#28232c'],
  ['Saffron Ember', '#c0772f', '#70401f', '#e3c171', '#412a22'],
  ['Royal Blue', '#455d89', '#293953', '#d2ae55', '#292534'],
  ['Rose Garnet', '#9d3150', '#5a2038', '#e1bd63', '#352329'],
  ['Sand And Teal', '#d1b16a', '#8b6a39', '#2d777a', '#392b24'],
  ['Weathered Jade', '#4d6d68', '#294844', '#c27e4a', '#242c2b'],
  ['Canyon Rust', '#7e3f2d', '#48271e', '#b5a15b', '#302520'],
  ['Moon Silver', '#aeb8c2', '#59636f', '#dfe1cf', '#30323a'],
  ['Black And Gold', '#252329', '#111115', '#d1a74d', '#3a2b21'],
  ['Desert Pastel', '#d89587', '#875a59', '#f0c983', '#51413d'],
  ['Crimson Steel', '#8f3037', '#462830', '#a9afb0', '#29272b'],
  ['Forest Teal', '#26716b', '#194844', '#95bd77', '#272e2b'],
  ['Salt White', '#ded8c7', '#8d887f', '#b89b57', '#423d3a'],
  ['Deep Royal Blue', '#304d91', '#1e2e57', '#d6b85f', '#242538'],
  ['Orchid And Brass', '#925b91', '#513752', '#c79c4f', '#302632'],
  ['Jade And Ivory', '#4f8069', '#2d4c41', '#e2d6ae', '#27312e'],
  ['Sunset Jewel', '#b54f5c', '#672f48', '#54a6a0', '#312633'],
];

function rotateColorList(list, offset) {
  return list[(offset % list.length + list.length) % list.length];
}

export function createNpcSkin(race, gender, variantIndex) {
  if (!RACE_SKIN[race]) throw new Error(`Unknown NPC race: ${race}`);
  if (!['female', 'male'].includes(gender)) throw new Error(`Unknown NPC gender: ${gender}`);
  const identities = NPC_IDENTITIES[gender];
  const index = ((variantIndex % identities.length) + identities.length) % identities.length;
  const [title, classId, motif, hairStyle, marking, clothingCut] = identities[index];
  const genderOffset = gender === 'female' ? 3 : 0;
  const raceOffset = race === 'orc' ? 2 : race === 'elf' ? 5 : 0;
  const skin = rotateColorList(RACE_SKIN[race], index + genderOffset);
  const garment = rotateColorList(GARMENTS, index + genderOffset + raceOffset).slice(1);
  return {
    id: `${race}-${gender}-${String(index + 1).padStart(2, '0')}`,
    name: `${title} ${index + 1}`,
    race,
    gender,
    appearance: index % 3,
    classId,
    variantIndex: index,
    visual: {
      skin,
      shadow: rotateColorList(RACE_SKIN[race], index + genderOffset - 2),
      hair: rotateColorList(HAIR, index + genderOffset + raceOffset),
      eyes: race === 'orc' ? rotateColorList(['#efb742', '#dc7746', '#d4db74', '#8ad2a5'], index) : race === 'elf' ? rotateColorList(['#70e0ce', '#f0c75e', '#86a8f2', '#d77bcc'], index) : rotateColorList(['#58c7c8', '#243c55', '#55763c', '#8c4e36'], index),
      garment: [...garment],
      motif,
      hairStyle,
      marking,
      clothingCut,
      legwear: `${race}-${gender}-${clothingCut}-legwear`,
      title,
    },
  };
}

export function createNpcSkinCatalog() {
  const catalog = [];
  for (const race of ['human', 'orc', 'elf']) {
    for (const gender of ['female', 'male']) {
      for (let index = 0; index < 20; index += 1) catalog.push(createNpcSkin(race, gender, index));
    }
  }
  return catalog;
}

export const NPC_SKIN_COUNT = 3 * 2 * 20;

export function getComplexionOptions(race) {
  return RACE_SKIN[race].map((color, index) => ({ color, shadow: RACE_SKIN[race][(index + 8) % RACE_SKIN[race].length] }));
}

export function getGarmentOptions() {
  return GARMENTS.map(([name, ...colors]) => ({ name, colors: [...colors] }));
}
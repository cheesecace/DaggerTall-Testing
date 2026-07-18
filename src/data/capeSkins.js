const CAPE_NAMES = {
  human: {
    female: ['Saffron Rose Mantle', 'Lioness Tournament Cape', 'Caravan Jewel-Cloak', 'Dawn-Court Sunveil'],
    male: ['Red Lion Heraldry', 'Black Tournament Mantle', 'Caravan Captain Cloak', 'Dawn-Court War Cape'],
  },
  orc: {
    female: ['Saltflower Hide', 'Beetle-Dame Carapace', 'Bone-Ribbon Huntcloak', 'Jade Matron Trophy Cape'],
    male: ['Salt-Wolf Hide', 'Beetle-Khan Carapace', 'Bone-Clasp Huntcloak', 'Jade Warchief Trophy Cape'],
  },
  elf: {
    female: ['Moonpetal Silk', 'Opal Starweave', 'Glass-Thread Ribbon Cape', 'Crescent Leaf Mantle'],
    male: ['Moon-Banner Silk', 'Obsidian Starweave', 'Glass-Thread War Cape', 'Crescent Leaf Mantle'],
  },
};

const CAPE_PALETTES = {
  human: [['#a83d36', '#4a2525', '#e5b85b', '#241d20'], ['#d4bb86', '#655a52', '#9b3333', '#302a29'], ['#267e83', '#174b52', '#d3a74c', '#25202a'], ['#c97832', '#713b25', '#f1d27d', '#34221d']],
  orc: [['#655044', '#2e2926', '#c4a15c', '#1c1b1a'], ['#455b4d', '#202b27', '#93a66a', '#151817'], ['#7b443a', '#332626', '#d6bd89', '#1c1919'], ['#667a44', '#303b2a', '#d2b55f', '#1b2019']],
  elf: [['#587e88', '#293d52', '#d9cf9a', '#242436'], ['#7b789e', '#393951', '#d5d2bf', '#252431'], ['#48958f', '#26515d', '#e4cf7c', '#252638'], ['#746080', '#352e49', '#b8d9cd', '#211f2e']],
};

const PATTERNS = ['heraldic', 'quartered', 'bordered', 'constellation'];
const FEMALE_HEMS = ['petal', 'ribbon', 'scalloped', 'jewel-point'];
const MALE_HEMS = ['square', 'split', 'notched', 'war-point'];

function createCape(race, gender, index) {
  return Object.freeze({
    id: `${race}-${gender}-cape-${String(index + 1).padStart(2, '0')}`,
    name: CAPE_NAMES[race][gender][index],
    race,
    gender,
    palette: Object.freeze([...CAPE_PALETTES[race][index]]),
    pattern: PATTERNS[index],
    clasp: `${race}-${gender === 'female' ? 'jewel' : 'crest'}-${index}`,
    hem: (gender === 'female' ? FEMALE_HEMS : MALE_HEMS)[index],
  });
}

export const CAPE_SKINS = Object.freeze(Object.keys(CAPE_NAMES).flatMap((race) => (
  ['female', 'male'].flatMap((gender) => Array.from({ length: 4 }, (_, index) => createCape(race, gender, index)))
)));

export function getCapeSkins(race, gender) {
  return CAPE_SKINS.filter((cape) => cape.race === race && cape.gender === gender);
}

export function resolveCapeSkin(capeId, race, gender) {
  if (!capeId || capeId === 'none') return null;
  return CAPE_SKINS.find((cape) => cape.id === capeId && cape.race === race && cape.gender === gender) ?? null;
}
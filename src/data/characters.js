export const RACES = {
  human: {
    name: 'Human',
    description: 'Adaptable citizens of the caravan kingdoms.',
    palettes: [
      { name: 'Sunward', skin: '#a9633f', shadow: '#6d3528', hair: '#261914', eyes: '#58c7c8' },
      { name: 'Copper', skin: '#c98052', shadow: '#7d4631', hair: '#5a2d1c', eyes: '#243c55' },
      { name: 'Dune', skin: '#e0a16f', shadow: '#945b45', hair: '#37261f', eyes: '#55763c' },
    ],
  },
  orc: {
    name: 'Orc',
    description: 'Hardy clansfolk shaped by salt flats and war.',
    palettes: [
      { name: 'Sagehide', skin: '#718452', shadow: '#3e4d35', hair: '#241f19', eyes: '#efb742' },
      { name: 'Ironbark', skin: '#526b50', shadow: '#2f4034', hair: '#161b18', eyes: '#dc7746' },
      { name: 'Ochrekin', skin: '#8b7548', shadow: '#51452f', hair: '#30251a', eyes: '#d4db74' },
    ],
  },
  elf: {
    name: 'Elf',
    description: 'Long-lived wayfinders of the mirage roads.',
    palettes: [
      { name: 'Ash', skin: '#8b8192', shadow: '#514a5c', hair: '#eee0c3', eyes: '#70e0ce' },
      { name: 'Ember', skin: '#9b5f55', shadow: '#5e3637', hair: '#20202b', eyes: '#f0c75e' },
      { name: 'Moonstone', skin: '#a89a90', shadow: '#635c60', hair: '#433b45', eyes: '#72bfc9' },
    ],
  },
};

export const CLASSES = {
  warrior: { name: 'Warrior', icon: 'II', description: 'Blade, shield, and staying power.', color: '#ad3f2c' },
  ranger: { name: 'Ranger', icon: '>>', description: 'Bowcraft, tracking, and field lore.', color: '#477243' },
  mage: { name: 'Mage', icon: '*', description: 'Destruction, wards, and deep magicka.', color: '#307e8b' },
  rogue: { name: 'Rogue', icon: '/\\', description: 'Speed, guile, locks, and light blades.', color: '#7a536f' },
};

export const DEFAULT_CHARACTER = {
  name: 'Sahir',
  race: 'human',
  gender: 'male',
  preset: 0,
  appearance: 0,
  garmentPalette: 0,
  hairStyle: null,
  marking: null,
  clothingCut: null,
  armorId: 'none',
  classId: 'warrior',
};
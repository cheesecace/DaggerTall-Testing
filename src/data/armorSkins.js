const RACES = ['human', 'orc', 'elf'];
const GENDERS = ['female', 'male'];
const COVERAGES = ['open', 'full', 'eye-slit'];
const FAMILIES = ['desert', 'western', 'barbarian', 'heritage'];

const SET_NAMES = {
  human: {
    female: ['Saffron Rose Lancer', 'Lioness Brigandine', 'Red Dune Huntress', 'Sun-Court Gardebras', 'Jeweled Caravan Aegis', 'Ivory Rose Harness', 'Wolf-Ribbon Warlady', 'Dawn Palace Bulwark', 'Gilded Veil Cataphract', 'Sallet of the White Lily', 'Crimson Steppe Champion', 'Liongate Sun-Warden'],
    male: ["Emir's Brass Lancer", 'Black Lion Brigandine', 'Red Dune Reaver', 'Sun-Court Man-at-Arms', 'Caravan Mirror Aegis', 'Iron Tournament Harness', 'Wolf-Pelt Warlord', 'Dawn Palace Bulwark', 'Gilded Sand Cataphract', 'Liongate Visored Sallet', 'Crimson Steppe Champion', "Solar King's Warden"],
  },
  orc: {
    female: ['Copper Tusk Dancer', 'Beetle-Dame Plate', 'Saltmane Huntress', 'Jade Clan Shell', 'Veiled Bone Aegis', 'Rose-Iron Juggernaut', 'Hyena-Fur Champion', 'Emerald Matron Carapace', 'Scarab Mail Princess', 'Black Tusk Bascinet', 'Ash-Wolf Boneguard', "Salt Queen's War Mask"],
    male: ['Copper Tusk Raider', 'Beetle-Knight Plate', 'Saltmane Berserker', 'Jade Clan Shell', 'Veiled Bone Aegis', 'Black-Iron Juggernaut', 'Hyena-Fur Champion', 'Emerald Warchief Carapace', 'Scarab Mail Khan', 'Black Tusk Bascinet', 'Ash-Wolf Boneguard', "Salt King's War Mask"],
  },
  elf: {
    female: ['Jasmine Moon Lancer', 'Silver Star Brigandine', 'Glasswood Huntress', 'Crescent Court Raiment', 'Moon-Veil Aegis', 'Lilyglass Plate Harness', 'Stag-Fur Starcaller', 'Opal Palace Carapace', 'Turquoise Astrolabe Guard', 'Starlight Visored Sallet', 'Frost-Mane Champion', "Moon Queen's Glass Mask"],
    male: ['Crescent Moon Lancer', 'Silver Star Brigandine', 'Glasswood Ranger', 'Crescent Court Panoply', 'Moon-Veil Aegis', 'Nightglass Plate Harness', 'Stag-Fur Starcaller', 'Obsidian Palace Carapace', 'Turquoise Astrolabe Guard', 'Starlight Visored Sallet', 'Frost-Mane Champion', "Moon King's Glass Mask"],
  },
};

const RACE_PALETTES = {
  human: [
    ['#c79a45', '#6e4127', '#f0cf79', '#37251f'], ['#9a3d35', '#45282a', '#d8b66d', '#242127'],
    ['#80533b', '#3e3028', '#d7a853', '#241d1a'], ['#d3bc86', '#6c6259', '#f2db9b', '#36302c'],
  ],
  orc: [
    ['#7a5631', '#302923', '#d4aa57', '#181918'], ['#405348', '#202a27', '#a5b181', '#151817'],
    ['#65413a', '#2c2424', '#c28a51', '#171719'], ['#71804d', '#313b2b', '#d0bc65', '#1e211c'],
  ],
  elf: [
    ['#63a5a0', '#294b54', '#d9cf9a', '#242635'], ['#8796b2', '#40475e', '#e2d9bd', '#252735'],
    ['#685872', '#332e44', '#b7d3c0', '#211e2b'], ['#8bbdb2', '#3f6670', '#e6d989', '#282738'],
  ],
};

const FEMALE_TRIM = ['petal', 'ribbon', 'jewel', 'filigree'];
const MALE_TRIM = ['crest', 'chevron', 'rivet', 'heraldry'];

function createArmorRecord(race, gender, index) {
  const family = FAMILIES[index % FAMILIES.length];
  const helmetCoverage = COVERAGES[Math.floor(index / 4)];
  const palette = RACE_PALETTES[race][index % RACE_PALETTES[race].length];
  const trim = (gender === 'female' ? FEMALE_TRIM : MALE_TRIM)[index % 4];
  return Object.freeze({
    id: `${race}-${gender}-armor-${String(index + 1).padStart(2, '0')}`,
    name: SET_NAMES[race][gender][index],
    race,
    gender,
    family,
    helmetCoverage,
    palette: Object.freeze([...palette]),
    material: `${race}-${family}`,
    motif: `${race}-${trim}`,
    helmetStyle: `${family}-${helmetCoverage}-${trim}`,
    torsoPattern: `${family}-${trim}-cuirass-${index % 3}`,
    armPattern: `${family}-${trim}-arms-${index % 4}`,
    legPattern: `${family}-${trim}-legs-${index}`,
  });
}

export const ARMOR_SKINS = Object.freeze(RACES.flatMap((race) => GENDERS.flatMap((gender) => (
  Array.from({ length: 12 }, (_, index) => createArmorRecord(race, gender, index))
))));

export const ARMOR_SKIN_COUNT = ARMOR_SKINS.length;

export function getArmorSkins(race, gender) {
  return ARMOR_SKINS.filter((armor) => armor.race === race && armor.gender === gender);
}

export function resolveArmorSkin(armorId, race, gender) {
  if (!armorId || armorId === 'none') return null;
  return ARMOR_SKINS.find((armor) => armor.id === armorId && armor.race === race && armor.gender === gender) ?? null;
}
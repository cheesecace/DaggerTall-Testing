export const MINUTES_PER_DAY = 24 * 60;
export const DAYS_PER_RENT_CYCLE = 7;

const DISTRICTS = ['gate', 'market', 'artisans', 'canal', 'temple', 'citadel'];
const JOBS = [
  ['date-gardener', 'outer-groves', 9],
  ['canal-tender', 'canal', 10],
  ['brickmaker', 'artisans', 12],
  ['weaver', 'artisans', 11],
  ['baker', 'market', 10],
  ['merchant', 'market', 15],
  ['scribe', 'temple', 16],
  ['guard', 'gate', 13],
  ['caravaner', 'gate', 14],
  ['palace-servant', 'citadel', 13],
];

const FAMILY_NAMES = ['Aru', 'Belit', 'Damqi', 'Enlil', 'Iltani', 'Kudur', 'Nabu', 'Ninlil', 'Samas', 'Tashmet'];

function resident(id, householdId, age, role, district, variant) {
  const job = age >= 16 ? JOBS[variant % JOBS.length] : null;
  return {
    id,
    name: `${FAMILY_NAMES[variant % FAMILY_NAMES.length]}-${String(variant + 1).padStart(2, '0')}`,
    householdId,
    age,
    role,
    race: ['human', 'elf', 'orc'][variant % 3],
    gender: variant % 2 ? 'male' : 'female',
    appearance: variant % 20,
    job: job?.[0] ?? 'child',
    workplaceId: job ? `work-${job[1]}` : null,
    workplaceDistrict: job?.[1] ?? null,
    dailyWage: job?.[2] ?? 0,
  };
}

export function createLivingCity() {
  const households = [];
  const citizens = [];
  for (let index = 0; index < 12; index += 1) {
    const district = DISTRICTS[index % DISTRICTS.length];
    const householdId = `household-${String(index + 1).padStart(2, '0')}`;
    const residentIds = [];
    const ages = index % 3 === 0 ? [38, 35, 12] : index % 3 === 1 ? [29, 8] : [51, 47, 22, 17];
    ages.forEach((age, memberIndex) => {
      const citizen = resident(`citizen-${String(citizens.length + 1).padStart(3, '0')}`, householdId, age, memberIndex === 0 ? 'head' : age < 16 ? 'child' : 'family', district, citizens.length);
      citizens.push(citizen);
      residentIds.push(citizen.id);
    });
    households.push({
      id: householdId,
      familyName: FAMILY_NAMES[index % FAMILY_NAMES.length],
      homeId: `home-${district}-${String(index + 1).padStart(2, '0')}`,
      district,
      residentIds,
      money: 54 + index * 3,
      weeklyRent: 26 + (index % 4) * 4,
      rentDueDay: DAYS_PER_RENT_CYCLE,
      homeless: false,
    });
  }
  return { day: 0, minute: 8 * 60, households, citizens };
}

export function getCitizenActivity(citizen, city) {
  const household = city.households.find((item) => item.id === citizen.householdId);
  const hour = city.minute / 60;
  if (hour < 6 || hour >= 22) return { type: 'sleep', locationId: household.homeless ? 'shelter-gate' : household.homeId, district: household.homeless ? 'gate' : household.district };
  if (citizen.age < 16) return hour < 15 ? { type: 'learn', locationId: 'temple-school', district: 'temple' } : { type: 'home', locationId: household.homeId, district: household.district };
  if (hour < 8) return { type: 'home', locationId: household.homeId, district: household.district };
  if (hour < 17) return { type: 'work', locationId: citizen.workplaceId, district: citizen.workplaceDistrict };
  if (hour < 20) return { type: 'market', locationId: 'market-plaza', district: 'market' };
  return { type: 'home', locationId: household.homeId, district: household.district };
}

export function advanceLivingCity(city, elapsedMinutes) {
  const previousDay = city.day;
  const absoluteMinutes = city.day * MINUTES_PER_DAY + city.minute + elapsedMinutes;
  city.day = Math.floor(absoluteMinutes / MINUTES_PER_DAY);
  city.minute = absoluteMinutes % MINUTES_PER_DAY;

  for (let day = previousDay + 1; day <= city.day; day += 1) {
    for (const citizen of city.citizens) {
      if (citizen.age >= 16) {
        const household = city.households.find((item) => item.id === citizen.householdId);
        household.money += citizen.dailyWage;
      }
    }
    if (day % DAYS_PER_RENT_CYCLE === 0) {
      for (const household of city.households) {
        if (household.money >= household.weeklyRent) {
          household.money -= household.weeklyRent;
          household.homeless = false;
        } else {
          household.homeless = true;
        }
      }
    }
  }
  return city;
}

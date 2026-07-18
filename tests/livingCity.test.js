import { describe, expect, it } from 'vitest';
import { advanceLivingCity, createLivingCity, DAYS_PER_RENT_CYCLE, getCitizenActivity, MINUTES_PER_DAY } from '../src/simulation/livingCity.js';

describe('living city simulation', () => {
  it('gives every citizen a family, home, and adult employment', () => {
    const city = createLivingCity();
    expect(city.citizens.length).toBeGreaterThanOrEqual(30);
    for (const citizen of city.citizens) {
      const household = city.households.find((item) => item.id === citizen.householdId);
      expect(household).toBeDefined();
      expect(household.homeId).toMatch(/^home-/);
      expect(household.residentIds).toContain(citizen.id);
      if (citizen.age >= 16) expect(citizen.workplaceId).toMatch(/^work-/);
    }
  });

  it('sends housed citizens to their home cell and bed period overnight', () => {
    const city = createLivingCity();
    city.minute = 23 * 60;
    for (const citizen of city.citizens) {
      const activity = getCitizenActivity(citizen, city);
      expect(activity.type).toBe('sleep');
      expect(activity.locationId).toBe(city.households.find((item) => item.id === citizen.householdId).homeId);
    }
  });

  it('pays wages and evicts a household that cannot make weekly rent', () => {
    const city = createLivingCity();
    const household = city.households[0];
    household.money = 0;
    city.citizens.filter((citizen) => citizen.householdId === household.id).forEach((citizen) => { citizen.dailyWage = 0; });
    advanceLivingCity(city, DAYS_PER_RENT_CYCLE * MINUTES_PER_DAY);
    expect(household.homeless).toBe(true);
    city.minute = 23 * 60;
    expect(getCitizenActivity(city.citizens[0], city)).toMatchObject({ type: 'sleep', locationId: 'shelter-gate' });
  });
});
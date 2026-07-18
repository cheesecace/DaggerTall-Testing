import { describe, expect, it } from 'vitest';
import { CAPITAL_BUILDINGS, CAPITAL_DISTRICTS, CAPITAL_LANDMARKS, validateCapitalPlan } from '../src/world/capitalPlan.js';
import { createLivingCity } from '../src/simulation/livingCity.js';

describe('capital plan', () => {
  it('contains six functional districts and monumental civic landmarks', () => {
    expect(CAPITAL_DISTRICTS).toHaveLength(6);
    expect(CAPITAL_BUILDINGS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(CAPITAL_LANDMARKS.map((item) => item.type))).toEqual(new Set(['ziggurat', 'palace', 'gate', 'market', 'harbor']));
    expect(validateCapitalPlan()).toEqual([]);
    expect(CAPITAL_BUILDINGS.every((building) => Math.abs(building.position[0]) - building.size[0] / 2 >= 5 || Math.abs(building.position[1]) >= 125)).toBe(true);
  });

  it('provides a registered home for every simulated household', () => {
    const buildingIds = new Set(CAPITAL_BUILDINGS.map((building) => building.id));
    for (const household of createLivingCity().households) expect(buildingIds.has(household.homeId)).toBe(true);
  });
});

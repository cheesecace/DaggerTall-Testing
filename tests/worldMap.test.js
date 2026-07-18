import { describe, expect, it } from 'vitest';
import { generateWorldMap, getWorldCell } from '../src/world/worldMap.js';

describe('regional world map', () => {
  it('is deterministic and reserves the capital at the origin', () => {
    expect(generateWorldMap(42)).toEqual(generateWorldMap(42));
    expect(getWorldCell(42, 0, 0)).toMatchObject({ kind: 'capital', name: 'Qadira', discovered: true });
  });

  it('creates connected cardinal roads and varied desert resources', () => {
    const map = generateWorldMap(42);
    expect(map.cells.filter((cell) => cell.road).length).toBeGreaterThan(20);
    expect(new Set(map.cells.map((cell) => cell.resource)).size).toBeGreaterThan(4);
    expect(map.cells).toHaveLength(81);
  });
});
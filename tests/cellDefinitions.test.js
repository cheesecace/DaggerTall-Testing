import { describe, expect, it } from 'vitest';
import { CELL_DEFINITIONS, validateCellLinks } from '../src/world/cellDefinitions.js';

describe('cell portal topology', () => {
  it('links every portal to an existing destination anchor', () => {
    expect(validateCellLinks()).toEqual([]);
  });

  it('keeps the inn as a separate interior cell with a return portal', () => {
    expect(CELL_DEFINITIONS['brass-camel-inn'].type).toBe('interior');
    expect(CELL_DEFINITIONS['capital-gate'].portals.inn).toEqual({
      destination: 'brass-camel-inn',
      anchor: 'entrance',
    });
    expect(CELL_DEFINITIONS['brass-camel-inn'].portals.exit).toEqual({
      destination: 'capital-gate',
      anchor: 'innDoor',
    });
  });
});
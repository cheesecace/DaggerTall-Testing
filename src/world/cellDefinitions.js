export const CELL_DEFINITIONS = {
  'capital-gate': {
    id: 'capital-gate',
    name: 'Qadira, Gate of the Red Sun',
    type: 'exterior',
    anchors: {
      arrival: [0, 1.05, 116],
      innDoor: [27, 1.05, 22.2],
    },
    portals: {
      inn: { destination: 'brass-camel-inn', anchor: 'entrance' },
    },
  },
  'brass-camel-inn': {
    id: 'brass-camel-inn',
    name: 'The Brass Camel',
    type: 'interior',
    anchors: {
      entrance: [0, 1.05, 6.8],
    },
    portals: {
      exit: { destination: 'capital-gate', anchor: 'innDoor' },
    },
  },
};

export function validateCellLinks(definitions = CELL_DEFINITIONS) {
  const errors = [];
  for (const cell of Object.values(definitions)) {
    for (const [portalId, portal] of Object.entries(cell.portals)) {
      const destination = definitions[portal.destination];
      if (!destination) {
        errors.push(`${cell.id}.${portalId} points to missing cell ${portal.destination}`);
      } else if (!destination.anchors[portal.anchor]) {
        errors.push(`${cell.id}.${portalId} points to missing anchor ${portal.anchor}`);
      }
    }
  }
  return errors;
}
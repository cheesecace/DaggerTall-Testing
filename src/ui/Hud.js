import { CAPITAL_DISTRICTS, CAPITAL_ROADS } from '../world/capitalPlan.js';
import { generateWorldMap } from '../world/worldMap.js';

export class Hud {
  constructor(character, city = null) {
    this.city = city;
    this.worldMap = generateWorldMap(73191);
    this.root = document.createElement('div');
    this.root.className = 'game-ui';
    this.root.innerHTML = `
      <header class="top-bar">
        <div class="cell-readout"><span>Current cell</span><strong data-cell>Unknown</strong></div>
        <div class="clock"><span class="sun-icon">◆</span><strong data-time>08:10</strong><small>Scorchday</small></div>
      </header>
      <div class="vitals">
        <div class="portrait-mark">${character.name.slice(0, 1).toUpperCase()}</div>
        <div><strong>${character.name}</strong><span>${character.race} · ${character.classId}</span></div>
        <div class="meters"><i class="health"></i><i class="stamina"></i><i class="magicka"></i></div>
      </div>
      <div class="crosshair" aria-hidden="true"><i></i><i></i></div>
      <div class="interaction" data-interaction></div>
      <div class="controls"><span><kbd>WASD</kbd> Move</span><span><kbd>Shift</kbd> Sprint</span><span><kbd>E</kbd> Interact</span><span><kbd>M</kbd> Map</span><span><kbd>Esc</kbd> Release mouse</span></div>
      <div class="cell-card" data-cell-card><span data-cell-type>Exterior cell</span><strong data-cell-title></strong></div>
      <section class="world-map" data-world-map aria-hidden="true">
        <header><div><span>Royal survey tablet</span><h2>Qadira and the Scorchlands</h2></div><strong>Seed 73191</strong></header>
        <div class="map-layout">
          <div class="map-panel"><canvas width="360" height="360" data-region-map></canvas><h3>Regional cells</h3><p>Known roads, resources, ruins, and oasis routes.</p></div>
          <div class="map-panel"><canvas width="360" height="360" data-city-map></canvas><h3>The six wards of Qadira</h3><p data-city-summary>Simulation initializing</p></div>
        </div>
        <footer><span>■ Capital</span><span>◆ Oasis</span><span>▲ Ruin</span><span>Gold lines: caravan roads</span></footer>
      </section>`;
    document.body.append(this.root);
    this.drawRegionMap();
    this.drawCityMap();
    this.updateCity(city);
    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyM' && !event.repeat) this.toggleMap();
    });
  }

  toggleMap() {
    const map = this.root.querySelector('[data-world-map]');
    const visible = !map.classList.contains('visible');
    map.classList.toggle('visible', visible);
    map.setAttribute('aria-hidden', String(!visible));
  }

  drawRegionMap() {
    const canvas = this.root.querySelector('[data-region-map]');
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.fillStyle = '#25150f';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const size = canvas.width / (this.worldMap.radius * 2 + 1);
    const colors = { 'red-dunes': '#9d3f2b', 'salt-flat': '#d2b77b', 'rocky-hamada': '#6e4a38', 'dry-wadi': '#845030', 'date-steppe': '#65733c', 'river-oasis': '#287f83' };
    for (const cell of this.worldMap.cells) {
      const x = (cell.x + this.worldMap.radius) * size;
      const y = (cell.z + this.worldMap.radius) * size;
      context.fillStyle = cell.discovered ? colors[cell.biome] : '#38251d';
      context.fillRect(x + 2, y + 2, size - 4, size - 4);
      if (cell.road) {
        context.fillStyle = '#d5a34f';
        context.fillRect(x + size * 0.43, y, size * 0.14, size);
      }
      context.fillStyle = '#f1d38c';
      context.font = '16px monospace';
      context.textAlign = 'center';
      if (cell.kind === 'capital') context.fillText('■', x + size / 2, y + size * 0.64);
      else if (cell.discovered && cell.kind === 'oasis') context.fillText('◆', x + size / 2, y + size * 0.64);
      else if (cell.discovered && cell.kind === 'ruin') context.fillText('▲', x + size / 2, y + size * 0.64);
    }
  }

  drawCityMap() {
    const canvas = this.root.querySelector('[data-city-map]');
    const context = canvas.getContext('2d');
    const project = (value) => (value + 150) / 300 * canvas.width;
    context.fillStyle = '#c78b4e';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#5d2c22';
    context.lineWidth = 7;
    context.strokeRect(project(-126), project(-126), project(252), project(252));
    context.lineWidth = 4;
    context.strokeRect(project(-78), project(-78), project(156), project(156));
    context.fillStyle = '#247f87';
    context.fillRect(project(-101), 0, project(-87) - project(-101), canvas.height);
    context.strokeStyle = '#e3bd6c';
    for (const road of CAPITAL_ROADS) {
      context.lineWidth = Math.max(2, road.width / 2);
      context.beginPath();
      if (road.axis === 'x') { context.moveTo(project(road.from), project(road.center)); context.lineTo(project(road.to), project(road.center)); }
      else { context.moveTo(project(road.center), project(road.from)); context.lineTo(project(road.center), project(road.to)); }
      context.stroke();
    }
    context.font = 'bold 11px monospace';
    context.textAlign = 'center';
    for (const district of CAPITAL_DISTRICTS) {
      const x = project(district.center[0]);
      const y = project(district.center[1]);
      context.fillStyle = district.color;
      context.fillRect(x - 25, y - 15, 50, 30);
      context.fillStyle = '#fff0c4';
      context.fillText(district.name.split(' ')[0], x, y + 4);
    }
  }

  updateCity(city) {
    if (!city) return;
    const homeless = city.households.filter((household) => household.homeless).length;
    const money = city.households.reduce((sum, household) => sum + household.money, 0);
    this.root.querySelector('[data-city-summary]').textContent = `${city.citizens.length} citizens · ${city.households.length} households · ${money} silver · ${homeless} homeless families`;
  }

  setCell(definition) {
    this.root.querySelector('[data-cell]').textContent = definition.name;
    this.root.querySelector('[data-cell-type]').textContent = `${definition.type} cell`;
    this.root.querySelector('[data-cell-title]').textContent = definition.name;
    const card = this.root.querySelector('[data-cell-card]');
    card.classList.remove('visible');
    requestAnimationFrame(() => card.classList.add('visible'));
    clearTimeout(this.cardTimer);
    this.cardTimer = setTimeout(() => card.classList.remove('visible'), 3300);
  }

  setInteraction(label) {
    const element = this.root.querySelector('[data-interaction]');
    element.innerHTML = label ? `<kbd>E</kbd><span>${label}</span>` : '';
    element.classList.toggle('visible', Boolean(label));
  }

  updateTime(totalSeconds) {
    const minutes = (8 * 60 + Math.floor(totalSeconds / 2)) % (24 * 60);
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const remainder = String(minutes % 60).padStart(2, '0');
    this.root.querySelector('[data-time]').textContent = `${hours}:${remainder}`;
    if (Math.floor(totalSeconds) !== this.lastSummarySecond) {
      this.lastSummarySecond = Math.floor(totalSeconds);
      this.updateCity(this.city);
    }
  }
}
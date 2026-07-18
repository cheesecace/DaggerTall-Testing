export class Hud {
  constructor(character) {
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
      <div class="controls"><span><kbd>WASD</kbd> Move</span><span><kbd>Shift</kbd> Sprint</span><span><kbd>E</kbd> Interact</span><span><kbd>Esc</kbd> Release mouse</span></div>
      <div class="cell-card" data-cell-card><span data-cell-type>Exterior cell</span><strong data-cell-title></strong></div>`;
    document.body.append(this.root);
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
  }
}
import * as THREE from 'three';
import { CLASSES, DEFAULT_CHARACTER, RACES } from '../data/characters.js';
import { createNpcSkin, getComplexionOptions, getGarmentOptions, NPC_FACE_MARKINGS, NPC_HAIR_STYLES, NPC_IDENTITIES } from '../data/npcSkins.js';
import { getArmorSkins } from '../data/armorSkins.js';
import { createVoxelHumanoid } from '../render/voxel.js';

function displayName(value) {
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function optionList(options, currentValue) {
  return options.map((option) => `<option value="${option.value}" ${option.value === currentValue ? 'selected' : ''}>${option.label}</option>`).join('');
}

export class CharacterCreator {
  constructor(onStart) {
    this.character = { ...DEFAULT_CHARACTER };
    this.onStart = onStart;
    this.root = document.createElement('section');
    this.root.className = 'creator-screen';
    document.body.append(this.root);
    this.render();
  }

  render() {
    this.disposePreview();
    const race = RACES[this.character.race];
    const gender = this.character.gender;
    const preset = createNpcSkin(this.character.race, gender, this.character.preset);
    const hairStyle = this.character.hairStyle ?? preset.visual.hairStyle;
    const marking = this.character.marking ?? preset.visual.marking;
    const clothingCut = this.character.clothingCut ?? preset.visual.clothingCut;
    const armorOptions = getArmorSkins(this.character.race, gender);
    this.root.innerHTML = `
      <div class="creator-brand">
        <p class="eyebrow">A life begins beneath the red sun</p>
        <h1>DaggerTall</h1>
        <p class="subtitle">The Scorchlands</p>
      </div>
      <div class="creator-preview"><canvas aria-label="Character preview"></canvas><div class="preview-plinth"></div></div>
      <form class="creator-panel">
        <div class="step-heading"><span>01</span><div><p>Identity</p><h2>Choose your origin</h2></div></div>
        <label class="name-field">Name<input name="name" maxlength="18" value="${this.character.name}" autocomplete="off" /></label>
        <fieldset><legend>Gender</legend><div class="choice-grid gender-grid">
          <button type="button" class="choice ${gender === 'female' ? 'selected' : ''}" data-gender="female"><strong>Female</strong><span>Cute faces, ornate hair, and bright desert fashion.</span></button>
          <button type="button" class="choice ${gender === 'male' ? 'selected' : ''}" data-gender="male"><strong>Male</strong><span>Bold faces, rugged hair, and storied desert dress.</span></button>
        </div></fieldset>
        <fieldset><legend>Race</legend><div class="choice-grid race-grid">
          ${Object.entries(RACES).map(([id, item]) => `<button type="button" class="choice ${id === this.character.race ? 'selected' : ''}" data-race="${id}"><strong>${item.name}</strong><span>${item.description}</span></button>`).join('')}
        </div></fieldset>
        <fieldset class="appearance-fieldset"><legend>Appearance</legend><div class="appearance-scroll"><div class="appearance-grid">
          <label>Coordinated look<select data-custom="preset">${optionList(NPC_IDENTITIES[gender].map((identity, index) => ({ value: String(index), label: identity[0] })), String(this.character.preset))}</select></label>
          <label>Complexion<select data-custom="appearance">${optionList(getComplexionOptions(this.character.race).map((option, index) => ({ value: String(index), label: `${displayName(this.character.race)} Tone ${index + 1}` })), String(this.character.appearance))}</select></label>
          <label>Hair & headwear<select data-custom="hairStyle">${optionList(NPC_HAIR_STYLES[gender].map((value) => ({ value, label: displayName(value) })), hairStyle)}</select></label>
          <label>Facial detail<select data-custom="marking">${optionList(NPC_FACE_MARKINGS.map((value) => ({ value, label: displayName(value) })), marking)}</select></label>
          <label>Outfit cut<select data-custom="clothingCut">${optionList(NPC_IDENTITIES[gender].map((identity) => ({ value: identity[5], label: displayName(identity[5]) })), clothingCut)}</select></label>
          <label>Cloth palette<select data-custom="garmentPalette">${optionList(getGarmentOptions().map((colors, index) => ({ value: String(index), label: `Desert Palette ${index + 1}` })), String(this.character.garmentPalette))}</select></label>
          <label class="armor-field">Armor<select data-custom="armorId">${optionList([{ value: 'none', label: 'No Armor' }, ...armorOptions.map((armor) => ({ value: armor.id, label: `${armor.name} · ${displayName(armor.family)} · ${displayName(armor.helmetCoverage)}` }))], this.character.armorId)}</select></label>
        </div></div></fieldset>
        <fieldset><legend>Class</legend><div class="choice-grid class-grid">
          ${Object.entries(CLASSES).map(([id, item]) => `<button type="button" class="choice class-choice ${id === this.character.classId ? 'selected' : ''}" data-class="${id}" style="--class-color:${item.color}"><b>${item.icon}</b><strong>${item.name}</strong><span>${item.description}</span></button>`).join('')}
        </div></fieldset>
        <button class="begin-button" type="submit"><span>Enter the capital</span><b>→</b></button>
      </form>`;

    this.bindEvents();
    this.buildPreview();
  }

  bindEvents() {
    this.root.querySelector('[name="name"]').addEventListener('input', (event) => {
      this.character.name = event.target.value;
    });
    this.root.querySelectorAll('[data-race]').forEach((button) => button.addEventListener('click', () => {
      this.character.race = button.dataset.race;
      this.character.appearance = 0;
      this.character.armorId = 'none';
      this.render();
    }));
    this.root.querySelectorAll('[data-gender]').forEach((button) => button.addEventListener('click', () => {
      this.character.gender = button.dataset.gender;
      this.character.preset = 0;
      this.character.hairStyle = null;
      this.character.marking = null;
      this.character.clothingCut = null;
      this.character.armorId = 'none';
      this.render();
    }));
    this.root.querySelectorAll('[data-custom]').forEach((select) => select.addEventListener('change', () => {
      const field = select.dataset.custom;
      this.character[field] = ['preset', 'appearance', 'garmentPalette'].includes(field) ? Number(select.value) : select.value;
      if (field === 'preset') {
        this.character.hairStyle = null;
        this.character.marking = null;
        this.character.clothingCut = null;
      }
      this.render();
    }));
    this.root.querySelectorAll('[data-class]').forEach((button) => button.addEventListener('click', () => {
      this.character.classId = button.dataset.class;
      this.render();
    }));
    this.root.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.character.name = this.character.name.trim() || DEFAULT_CHARACTER.name;
      this.disposePreview();
      this.root.remove();
      this.onStart(this.getCustomizedCharacter());
    });
  }

  getCustomizedCharacter() {
    const character = { ...this.character };
    const preset = createNpcSkin(character.race, character.gender, character.preset);
    const complexion = getComplexionOptions(character.race)[character.appearance];
    const garment = getGarmentOptions()[character.garmentPalette];
    character.visual = {
      ...preset.visual,
      skin: complexion.color,
      shadow: complexion.shadow,
      garment,
      hairStyle: character.hairStyle ?? preset.visual.hairStyle,
      marking: character.marking ?? preset.visual.marking,
      clothingCut: character.clothingCut ?? preset.visual.clothingCut,
    };
    character.visual.legwear = `${character.race}-${character.gender}-${character.visual.clothingCut}-legwear`;
    character.id = ['player', character.race, character.gender, character.preset, character.appearance, character.garmentPalette, character.visual.hairStyle, character.visual.marking, character.visual.clothingCut, character.armorId, character.classId].join(':');
    return character;
  }

  buildPreview() {
    const canvas = this.root.querySelector('canvas');
    this.previewRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    this.previewRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.previewRenderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.previewScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, canvas.clientWidth / canvas.clientHeight, 0.1, 30);
    camera.position.set(4.5, 3.2, 7.5);
    camera.lookAt(0, 1.4, 0);
    this.previewScene.add(new THREE.HemisphereLight('#ffe7b5', '#682f24', 3));
    const figure = createVoxelHumanoid(this.getCustomizedCharacter(), 1.25);
    figure.rotation.y = -0.35;
    this.previewScene.add(figure);
    const animate = () => {
      figure.rotation.y += 0.003;
      this.previewRenderer.render(this.previewScene, camera);
      this.previewFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  disposePreview() {
    if (this.previewFrame) cancelAnimationFrame(this.previewFrame);
    this.previewRenderer?.dispose();
    this.previewRenderer?.forceContextLoss();
    this.previewFrame = null;
    this.previewRenderer = null;
  }
}
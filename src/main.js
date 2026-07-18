import './style.css';
import { CharacterCreator } from './ui/CharacterCreator.js';

new CharacterCreator(async (character) => {
  const { Game } = await import('./core/Game.js');
  const game = new Game(character);
  await game.start();
});
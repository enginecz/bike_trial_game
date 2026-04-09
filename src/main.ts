import './style.css';
import { createGameApp } from './game/app';

const canvas = document.querySelector<HTMLCanvasElement>('#game');

if (!canvas) {
  throw new Error('Game canvas was not found.');
}

const app = createGameApp(canvas);
app.start();

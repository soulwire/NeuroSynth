// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { Texture } from 'pixi.js';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const TAU = Math.PI * 2;
const SIZE = 512;

// ——————————————————————————————————————————————————
// Texture Utils
// ——————————————————————————————————————————————————

export const createCircle = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const radius = SIZE / 2;
  canvas.width = canvas.height = SIZE;
  context.beginPath();
  context.arc(radius, radius, radius, 0, TAU);
  context.fillStyle = '#FFFFFF';
  context.fill();
  return Texture.fromCanvas(canvas);
};

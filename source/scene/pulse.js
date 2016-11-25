// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { createCircle } from '../utils/texture';
import { Sprite } from 'pixi.js';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const TEXTURE = createCircle();
const pool = [];

// ——————————————————————————————————————————————————
// Pulse
// ——————————————————————————————————————————————————

class Pulse extends Sprite {
  static next() {
    return pool.length ? pool.pop() : new Pulse();
  }
  static stash(pulse) {
    pool.push(pulse);
  }
  constructor() {
    super(TEXTURE)
    this.anchor.set(0.5, 0.5);
  }
  get radius() {
    return this.width / 2;
  }
  set radius(radius) {
    this.width = this.height = radius * 2;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Pulse;
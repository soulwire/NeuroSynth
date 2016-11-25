// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { createCircle } from '../utils/texture';
import { Container } from 'pixi.js';
import Signal from '../utils/signal';
import Random from '../utils/random';
import Tween from '../utils/tween';
import Config from '../config';
import Pulse from './pulse';
import Node from './node';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const TEXTURE = createCircle();

// ——————————————————————————————————————————————————
// Receptor
// ——————————————————————————————————————————————————

class Receptor extends Container {
  constructor(pitch, color) {
    super();
    this.activated = new Signal();
    this.pitch = pitch;
    this.color = color;
    this.radius = Config.small ? 12 : 15;
    this.setup();
  }
  setup() {
    this.node = new Node(this, TEXTURE);
    this.node.tint = this.color;
    this.node.radius = this.radius;
    this.addChild(this.node);
  }
  update() {

  }
  activate(octave) {
    const note = this.pitch + octave;
    // Visualise activation.
    this.activated.dispatch(note, this.x, this.y);
    if (this.tween) { this.tween.kill(); }
    const stateA = { radius: this.radius * 1.1 };
    const stateB = { radius: this.radius };
    this.tween = Tween
      .to(this.node, 0.08, stateA)
      .ease(Tween.Quint.out)
      .done(() => {
        this.tween = Tween
          .to(this.node, 0.33, stateB)
          .ease(Tween.Back.out);
      });
    // Visualise output.
    const target = this.radius * 2.5;
    const pulse = Pulse.next();
    pulse.radius = this.radius;
    pulse.alpha = 0.66;
    pulse.tint = this.color;
    Tween.to(pulse, 0.5, { radius: target, alpha: 0 })
      .ease(Tween.Quad.out)
      .done(() => {
        this.removeChild(pulse);
        Pulse.stash(pulse);
      });
    this.addChild(pulse);
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Receptor;

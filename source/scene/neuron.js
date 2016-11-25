// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { createCircle } from '../utils/texture';
import { Container } from 'pixi.js';
import Signal from '../utils/signal';
import Random from '../utils/random';
import Config from '../config';
import Tween from '../utils/tween';
import Pulse from './pulse';
import Node from './node';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const TEXTURE = createCircle();

// ——————————————————————————————————————————————————
// Neuron
// ——————————————————————————————————————————————————

class Neuron extends Container {
  constructor(octave, color) {
    super();
    this.connections = 0;
    this.pulsed = new Signal();
    this.octave = octave;
    this.color = color;
    this.radius = Config.small ? 25 : 30;
    this.pulseInterval = this.countdown = Random.float(
      Config.pulseInterval.min,
      Config.pulseInterval.max
    );
    this.setup();
  }
  setup() {
    this.node = new Node(this, TEXTURE);
    this.node.tint = this.color;
    this.node.radius = this.radius;
    this.addChild(this.node);
  }
  update(dt) {
    this.countdown -= dt;
    if (this.countdown <= 0) {
      this.countdown = this.pulseInterval;
      this.pulse();
    }
  }
  pulse() {
    this.pulsed.dispatch(this);
    // Visualise transmission.
    const stateA = { radius: this.radius * 1.05 };
    const stateB = { radius: this.radius };
    if (this.tween) { this.tween.kill(); }
    this.tween = Tween
      .to(this.node, 0.08, stateA)
      .ease(Tween.Quint.out)
      .done(() => {
        this.tween = Tween
          .to(this.node, 0.33, stateB)
          .ease(Tween.Back.out);
      });
    // Visualise propagation.
    if (this.connections > 0) {
      const pulse = Pulse.next();
      const offset = Config.transmissionRange.value;
      const duration = offset / Config.transmissionSpeed.value / 1000;
      pulse.radius = 0;
      pulse.alpha = 0.33;
      pulse.tint = this.color;
      Tween.to(pulse, duration, { radius: offset, alpha: 0 })
        .ease(Tween.Linear)
        .done(() => {
          this.removeChild(pulse);
          Pulse.stash(pulse);
        });
      this.addChild(pulse);
    }
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Neuron;
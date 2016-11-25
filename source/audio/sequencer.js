// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Config from '../config';
import Synth from './synth';
import Voice from './voice';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const SECOND = 1000;
const MINUTE = 60 * SECOND;

// ——————————————————————————————————————————————————
// Sequencer
// ——————————————————————————————————————————————————

class Sequencer {
  constructor() {
    this.synth = new Synth();
    this.subdivision = 4;
    this.countdown = this.interval;
    this.queue = [];
  }
  update(dt) {
    this.countdown -= dt;
    if (this.countdown <= 0) {
      this.countdown = this.interval;
      while (this.queue.length) {
        const { note, x, y } = this.queue.pop();
        const voice = new Voice(note);
        this.synth.play(voice, x, y);
      }
    }
  }
  schedule(note, x, y) {
    this.queue.push({ note, x, y });
  }
  get interval() {
    return MINUTE / Config.tempo.value / this.subdivision;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sequencer;

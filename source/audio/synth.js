// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Reverb from './effects/reverb';
import Delay from './effects/delay';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

window.AudioContext = window.AudioContext || window.webkitAudioContext;

// ——————————————————————————————————————————————————
// Synth
// ——————————————————————————————————————————————————

class Synth {
  constructor() {
    // Create context
    this.context = new window.AudioContext();
    // Create nodes
    this.compressor = this.context.createDynamicsCompressor();
    this.master = this.context.createGain();
    // this.reverb = new Reverb(this.context);
    this.delay = new Delay(this.context);
    // Configure nodes
    this.compressor.threshold.value = -50;
    this.compressor.knee.value = 40;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.02;
    this.compressor.release.value = 0.3;
    // Create graph
    this.volume = 2.0;
    this.chain(
      this.master,
      this.delay.output,
      this.compressor,
      this.context.destination
    );
  }
  chain(...nodes) {
    nodes.reduce((previous, node) => {
      previous && previous.connect(node);
      return node;
    });
  }
  play(voice, x = 0, y = 0) {
    const { attack, decay, sustain, release } = voice;
    // Compute time
    const start = this.context.currentTime;
    const end = start + attack + decay + release;
    // Create oscillator
    const osc = this.context.createOscillator();
    osc.frequency.value = voice.frequency;
    osc.type = voice.type;
    // Create ADSR envelope
    const adsr = this.context.createGain();
    const gain = adsr.gain;
    /*
          Gain
            ^
            |             /\
            |           /   \ 
            |         /      \
  Sustain - |       /         \_________
            |     /                     \
            |   /                        \
            |  /                          \
            |/—————————————————————————————\————> Time
            |_____________||___|      |_____|
                   |         |           | 
                 Attack    Decay      Release
    */
    gain.setValueAtTime(0, start);
    gain.linearRampToValueAtTime(1, start + attack);
    gain.linearRampToValueAtTime(sustain, start + attack + decay);
    gain.linearRampToValueAtTime(0, end);
    // Connect nodes
    osc.connect(adsr);
    // Spatialisation
    if (x !== 0 || y !== 0) {
      const pan = this.context.createPanner();
      pan.panningModel = 'equalpower';
      pan.setPosition(x, y, 1);
      adsr.connect(pan);
      pan.connect(this.master);
    } else {
      adsr.connect(this.master);      
    }
    // Fire oscillator
    osc.start();
    osc.stop(end);
  }
  get volume() {
    return this.master.gain.value;
  }
  set volume(value) {
    this.master.gain.value = value;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Synth;
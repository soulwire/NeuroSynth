// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Config from '../config';

// ——————————————————————————————————————————————————
// Synapse
// ——————————————————————————————————————————————————

class Synapse {
  constructor(neuron, receptor) {
    this.neuron = neuron;
    this.receptor = receptor;
    this.strength = 0;
    this.connected = false;
    this.onNeuronPulsed = this.onNeuronPulsed.bind(this);
    this.neuron.pulsed.add(this.onNeuronPulsed);
    this.pulses = [];
  }
  update(dt) {
    const dx = this.receptor.x - this.neuron.x;
    const dy = this.receptor.y - this.neuron.y;
    const distSq = dx * dx + dy * dy;
    const radii = this.neuron.radius + this.receptor.radius;
    const range = Config.transmissionRange.value + radii;
    if (distSq <= range * range) {
      if (!this.connected) {
        this.neuron.connections++;
        this.connected = true;
      }
      this.length = Math.sqrt(distSq);
      this.strength = Math.pow(1 - this.length / range, 0.66);
      for (let i = this.pulses.length - 1; i >= 0; i--) {
        this.pulses[i].countdown -= dt;
        if (this.pulses[i].countdown <= 0) {
          this.pulses.splice(i, 1);
          this.receptor.activate(this.neuron.octave);
        }
      }
    } else if (this.connected) {
      this.neuron.connections--;
      this.connected = false;
      if (this.pulses.length) {
        this.pulses.length = 0;
      }
    }
  }
  onNeuronPulsed(neuron) {
    if (this.connected) {
      const delay = this.length / Config.transmissionSpeed.value;
      this.pulses.push({
        countdown: delay,
        delay
      });
    }
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Synapse;

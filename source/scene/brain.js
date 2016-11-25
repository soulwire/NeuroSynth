// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { Container, Graphics } from 'pixi.js';
import { HSLtoDEC } from '../utils/color';
import Sequencer from '../audio/sequencer';
import Receptor from './receptor';
import Synapse from './synapse';
import Random from '../utils/random';
import Neuron from './neuron';
import Config from '../config';

// ——————————————————————————————————————————————————
// Brain
// ——————————————————————————————————————————————————

class Brain extends Container {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
    this.sequencer = new Sequencer();
    this.connections = new Graphics();
    this.onReceptorActivated = this.onReceptorActivated.bind(this);
    this.addChild(this.connections);
    this.createNeurons();
    this.createReceptors();
    this.createSynapses();
    this.createLayout();
  }
  createLayout() {
    const bounds = [
      Config.small ? 10 : 80,
      Config.small ? 10 : 80,
      this.width - (Config.small ? 10 : 220),
      this.height - (Config.small ? 10 : 80)
    ];
    const width = bounds[2] - bounds[0];
    const height = bounds[3] - bounds[1];
    const diagonal = Math.sqrt(width * height);
    const total = Config.neuronCount.value + Config.receptorCount.value;
    const side = Math.ceil(Math.sqrt(total));
    const cells = Math.pow(side, 2);
    const xStep = width / side;
    const yStep = height / side;
    const grid = [];
    for (let i = 0; i < cells; i++) {
      const x = bounds[0] + Math.floor(i % side) * xStep;
      const y = bounds[1] + Math.floor(i / side) * yStep;
      grid.push({ x, y });
    }
    const items = [...this.neurons, ...this.receptors];
    items.forEach(item => {
      const index = Random.int(grid.length - 1);
      const cell = grid.splice(index, 1)[0];
      item.x = cell.x + xStep * Random.float(0.2, 0.8);
      item.y = cell.y + yStep * Random.float(0.2, 0.8);
    });
  }
  createNeurons() {
    this.neurons = [];
    const count = Config.neuronCount.value;
    const octaves = Config.octaves;
    const hueStep = 1 / octaves.length;
    for (let i = 0; i < count; i++) {
      const octave = octaves[i % octaves.length];
      const hue = (i % octaves.length) * hueStep;
      const color = HSLtoDEC(hue, 0.45, 0.55);
      const neuron = new Neuron(octave, color);
      neuron.x = this.width * Random.float(0.1, 0.85);
      neuron.y = this.height * Random.float(0.1, 0.9);
      this.neurons.push(neuron);
      this.addChild(neuron);
    }
  }
  createReceptors() {
    this.receptors = [];
    const count = Config.receptorCount.value;
    const notes = Config.notes;
    const hueStep = 1 / notes.length;
    for (let i = 0; i < count; i++) {
      const note = notes[i % notes.length];
      const hue = (i % notes.length) * hueStep;
      const color = HSLtoDEC(hue, 0.55, 0.55);
      const receptor = new Receptor(note, color);
      receptor.activated.add(this.onReceptorActivated);
      receptor.x = this.width * Random.float(0.05, 0.85);
      receptor.y = this.height * Random.float(0.05, 0.95);
      this.receptors.push(receptor);
      this.addChild(receptor);
    }
  }
  createSynapses() {
    this.synapses = [];
    this.neurons.forEach(neuron => {
      this.receptors.forEach(receptor => {
        this.synapses.push(
          new Synapse(neuron, receptor)
        );
      });
    });
  }
  update(dt) {
    // Update synapses.
    const color = Config.colors.synapse;
    this.connections.clear();
    this.synapses.forEach(synapse => {
      synapse.update(dt);
      if (synapse.connected) {
        this.connections.lineStyle(1, color, synapse.strength);
        this.connections.moveTo(synapse.neuron.x, synapse.neuron.y);
        this.connections.lineTo(synapse.receptor.x, synapse.receptor.y);
      }
    });
    // Update neurons and receptors.
    this.neurons.forEach(neuron => neuron.update(dt));
    this.receptors.forEach(receptor => receptor.update());
    this.sequencer.update(dt);
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
  }
  onReceptorActivated(note) {
    this.sequencer.schedule(note);
  }
  get height () {
    return this._height;
  }
  set height(value) {
    this._height = value;
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Brain;

// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Slider from './slider/slider';
import Config from '../config';
import './gui.css';

// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const TOGGLE_ICON = `
  <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 
    9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
  </svg>
`;

// ——————————————————————————————————————————————————
// GUI
// ——————————————————————————————————————————————————

class GUI {
  constructor() {
    this.createSliders();
    this.createToggle();
  }
  createSliders() {
    this.$sliders = document.createElement('div');
    this.$sliders.className = 'sliders';
    this.tempoSlider = new Slider('tempo', Config.tempo);
    this.wanderSlider = new Slider('wander', Config.wander);
    this.proximitySlider = new Slider('proximity', Config.transmissionRange);
    this.speedSlider = new Slider('velocity', Config.transmissionSpeed);
    this.$sliders.appendChild(this.tempoSlider.view);
    this.$sliders.appendChild(this.wanderSlider.view);
    this.$sliders.appendChild(this.proximitySlider.view);
    this.$sliders.appendChild(this.speedSlider.view);
    document.body.appendChild(this.$sliders);
  }
  createToggle() {
    this.onToggleClicked = this.onToggleClicked.bind(this);
    this.$toggle = document.createElement('button');
    this.$toggle.addEventListener('click', this.onToggleClicked);
    this.$toggle.className = 'toggle';
    this.$toggle.innerHTML = TOGGLE_ICON;
    document.body.appendChild(this.$toggle);
  }
  onToggleClicked() {
    this.$sliders.classList.toggle('open');
    this.$toggle.classList.toggle('active');
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default GUI;
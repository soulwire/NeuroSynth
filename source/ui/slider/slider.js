// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import './slider.css';

// ——————————————————————————————————————————————————
// Template
// ——————————————————————————————————————————————————

const TAU = Math.PI * 2;
const NORTH = Math.PI * -0.5;
const THICKNESS = 8;
const RADIUS = 50;
const INNER = RADIUS - THICKNESS / 2;
const PADDING = THICKNESS * 2;
const TEMPLATE = `
  <svg class="graphics" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle
      class="hitarea"
      cx="${RADIUS}"
      cy="${RADIUS}"
      r="${RADIUS}"
    />
    <circle
      class="track"
      stroke-width="${THICKNESS}"
      cx="${RADIUS}"
      cy="${RADIUS}"
      r="${INNER}"
    />
    <path class="bar" stroke-width="${THICKNESS}"/>
  </svg>
  <div class="label"
    style="left:${PADDING}px;right:${PADDING}px;top:${PADDING}px;bottom:${PADDING}px">
    <div class="title"></div>
    <div class="value"></div>
  </div>
`;

// ——————————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————————

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const step = (value, interval) => interval * Math.round(value / interval);

const map = (value, a, b, x, y) => (value - a) / (b - a) * (y - x) + x;

const arc = (x, y, radius, theta, gamma) => {
  const sx = x + Math.cos(gamma) * radius;
  const sy = y + Math.sin(gamma) * radius;
  const ex = x + Math.cos(theta) * radius;
  const ey = y + Math.sin(theta) * radius;
  const flag = gamma - theta <= Math.PI ? 0 : 1;
  return [
    'M', sx, sy,
    'A', radius, radius, 0, flag, 0, ex, ey
  ].join(' ');
};

const getPointer = (event) => {
  const { clientX: x, clientY: y } = (
     event.changedTouches ?
       event.changedTouches[0] :
       event
   );
  return { x, y };
};

const formatValue = (value, step) => {
  const dec = step.toString().match(/\.(\d+)/);
  return value.toFixed(dec ? dec[1].length : 0);
};

// ——————————————————————————————————————————————————
// Slider
// ——————————————————————————————————————————————————

class Slider {
  constructor(label, prop) {
    this.label = label;
    this.prop = prop;
    this.view = document.createElement('div');
    this.view.className = 'slider';
    this.view.innerHTML = TEMPLATE;
    this.setup();
    this.listen();
  }
  setup() {
    this.$title = this.view.querySelector('.title');
    this.$value = this.view.querySelector('.value');
    this.$bar = this.view.querySelector('.bar');
    this.$title.innerHTML = this.label;
    this.value = this.prop.value;
  }
  listen() {
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.view.addEventListener('mousedown', this.onPointerDown);
    this.view.addEventListener('touchstart', this.onPointerDown);
  }
  onPointerDown(event) {
    document.addEventListener('mousemove', this.onPointerMove);
    document.addEventListener('touchmove', this.onPointerMove);
    document.addEventListener('mouseup', this.onPointerUp);
    document.addEventListener('touchend', this.onPointerUp);
    document.addEventListener('mouseleave', this.onPointerUp);
    this.bounds = this.view.getBoundingClientRect();
    this.center = {
      x: this.bounds.left + this.bounds.width / 2,
      y: this.bounds.top + this.bounds.height / 2
    };
    this.onPointerMove(event);
  }
  onPointerMove(event) {
    const coord = getPointer(event);
    const dx = coord.x - this.center.x;
    const dy = coord.y - this.center.y;
    const theta = Math.atan2(dy, dx) - NORTH;
    const gamma = (theta + TAU) % TAU;
    this.value = map(gamma, 0, TAU, this.prop.min, this.prop.max);
  }
  onPointerUp() {
    document.removeEventListener('mousemove', this.onPointerMove);
    document.removeEventListener('touchmove', this.onPointerMove);
    document.removeEventListener('mouseup', this.onPointerUp);
    document.removeEventListener('touchend', this.onPointerUp);
    document.removeEventListener('mouseleave', this.onPointerUp);
  }
  get value() {
    return this.prop.value;
  }
  set value(value) {
    value = clamp(value, this.prop.min, this.prop.max);
    value = step(value, this.prop.step);
    const span = map(value, this.prop.min, this.prop.max, 0, TAU);
    const path = arc(RADIUS, RADIUS, INNER, NORTH, NORTH + span);
    this.$bar.setAttribute('d', path);
    this.$value.innerHTML = formatValue(value, this.prop.step);
    this.prop.value = value;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Slider;

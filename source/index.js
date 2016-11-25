// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { autoDetectRenderer } from 'pixi.js';
import Config from './config';
import Brain from './scene/brain';
import GUI from './ui/gui';

// ——————————————————————————————————————————————————
// Bootstrap
// ——————————————————————————————————————————————————

const init = () => {
  let clock, dt;
  const gui = new GUI();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const brain = new Brain(width, height);
  const renderer = new autoDetectRenderer(width, height, {
    backgroundColor: Config.colors.background,
    resolution: window.devicePixelRatio || 1,
    antialias: true
  });
  const update = (ellapsed) => {
    requestAnimationFrame(update);
    dt = Math.min(100, ellapsed - clock || 0);
    clock = ellapsed;
    brain.update(dt);
    renderer.render(brain);
  };
  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.view.style.height = height + 'px';
    renderer.view.style.width = width + 'px';
    renderer.resize(width, height);
    brain.resize(width, height);
  };
  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resize);
  resize();
  update();
};

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);
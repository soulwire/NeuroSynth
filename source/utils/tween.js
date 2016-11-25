//——————————————————————————————————————————————————
// Tween
//——————————————————————————————————————————————————

//————————————————————————————————————————————————
// Constants
//————————————————————————————————————————————————

const PI = Math.PI;
const acos = Math.acos;
const pow = Math.pow;
const cos = Math.cos;
const sin = Math.sin;
const rAF = requestAnimationFrame;
const cAF = cancelAnimationFrame;
const now = () => performance.now();

//————————————————————————————————————————————————
// Helpers
//————————————————————————————————————————————————

const isFunction = (object) => {
  return Object.prototype.toString.call(object) == '[object Function]';
}

const trigger = (callbacks, callback) => {
  if (isFunction(callback)) {
    callbacks.push(callback);
  } else {
    if (callbacks.length) {
      for (let i = 0, n = callbacks.length; i < n; i++) {
        callbacks[i].call(null, callback);
      }
    }        
  }
}

const ease = (core) => {
  core.in = core;
  core.out = (t) => 1 - core(1 - t);
  core.inOut = (t) => t <= 0.5 ? core(t * 2) / 2 : (2 - core(2 * (1 - t))) / 2;
  return core;
}

const copy = (target, options) => {
  const result = {};
  for (let key in options) {
    result[key] = target[key];
  }
  return result;
}

//————————————————————————————————————————————————
// Prototype
//————————————————————————————————————————————————

class Tween {
  constructor(target, duration, options) {
    this.startTime = now();
    this.duration = duration;
    this.options = options;
    this.target = target;
    this.easing = api.Linear;
    this.onStart = [];
    this.onStep = [];
    this.onDone = [];
    this.progress = 0;
    this.paused = false;
    this.alive = true;
    this.delay = 0;
  }
  wait(delay) {
    this.delay = delay;
    return this;
  }
  ease(callback) {
    this.easing = callback;
    return this;
  }
  kill() {
    this.alive = false;
    return this;
  }
  start(callback) {
    trigger(this.onStart, callback);
    return this;
  }
  pause() {
    if (!this.paused) {
      this.pauseTime = now();
      this.paused = true;
    }
  }
  play() {
    if (this.paused) {
      this.startTime += now() - this.pauseTime;
      this.paused = false;
    }
  }
  step(callback) {
    trigger(this.onStep, callback);
    return this;
  }
  done(callback) {
    trigger(this.onDone, callback);
    return this;
  }
}

//————————————————————————————————————————————————
// Engine
//————————————————————————————————————————————————

let running = false;
let tweens = [];
let req;

const update = () => {
  if (running) {
    let tween, delta, key, a, b;
    for (let i = tweens.length - 1; i >= 0; i--) {
      tween = tweens[i];
      if (tween.alive) {
        delta = (now() - tween.startTime) * 0.001;
        if (delta > tween.delay && !tween.paused) {
          if (tween.progress === 0) {
            tween.initial = copy(tween.target, tween.options); 
            trigger(tween.onStart, tween);
          }
          tween.progress = (delta - tween.delay) / tween.duration;
          tween.progress = Math.max(0.0, Math.min(tween.progress, 1.0));
          for (key in tween.options) {
            a = tween.initial[key];
            b = tween.options[key];
            tween.target[key] = a + (b - a) * tween.easing(tween.progress);
          }
          trigger(tween.onStep, tween);
        }
        if (tween.progress >= 1.0) {
          tween.alive = false;
          trigger(tween.onDone, tween);
        }  
      }
      if (!tween.alive) {
        tweens.splice(i, 1);
      }
    }
    if (tweens.length) {
      req = rAF(update);
    } else {
      running = false;
    }
  }
}

const start = () => {
  if (!running) {
    req = rAF(update);
    running = true;
  }
}

const stop = () => {
  running = false;
  cAF(req);
}

const queue = (tween) => {
  tweens.push(tween);
  start();
  return tween;
}

//————————————————————————————————————————————————
// API
//————————————————————————————————————————————————

const api = {
  Linear: ease((t) => t),
  Elastic: ease((t) => pow(2, 10 * --t) * cos(20 * t * PI * 1 / 3 )),
  Bounce: ease((t) => {
    for (let n, a = 0, b = 1; 1; a += b, b /= 2) {
      if (t >= (7 - 4 * a) / 11){
        n = -pow((11 - 6 * a - 11 * t) / 4, 2) + b * b;
        break;
      }
    }
    return n;
  }),
  Back: ease((t) => pow(t, 2) * ((1.618 + 1) * t - 1.618)),
  Sine: ease((t) => 1 - sin((1 - t) * PI / 2)),
  Circ: ease((t) => 1 - sin(acos(t))),
  Expo: ease((t) => pow(2, 10 * (t - 1))),
  Quad: ease((t) => pow(t, 2)),
  Cubic: ease((t) => pow(t, 3)),
  Quart: ease((t) => pow(t, 4)),
  Quint: ease((t) => pow(t, 5)),
  to: (target, duration, options) => 
    queue(new Tween(target, duration, options))
};

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default api;

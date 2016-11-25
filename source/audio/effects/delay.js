// ——————————————————————————————————————————————————
// Delay
// ——————————————————————————————————————————————————

class Delay {
  constructor(context, delay = 0.4, feedback = 0.15) {
    this.context = context;
    this.nodes = {
      delay: this.context.createDelay(),
      gain: this.context.createGain()
    };
    this.nodes.gain.connect(this.nodes.delay);
    this.nodes.delay.connect(this.nodes.gain);
    this.output = this.nodes.gain;
    this.feedback = feedback;
    this.delay = delay;
  }
  get delay() {
    return this.nodes.delay.delayTime.value;
  }
  set delay(seconds) {
    this.nodes.delay.delayTime.value = seconds;
  }
  get feedback() {
    return this.nodes.gain.gain.value;
  }
  set feedback(seconds) {
    this.nodes.gain.gain.value = seconds;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Delay;
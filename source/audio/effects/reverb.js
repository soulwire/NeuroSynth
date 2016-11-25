// ——————————————————————————————————————————————————
// Reverb
// ——————————————————————————————————————————————————

class Reverb {
  constructor(context, seconds = 5.0, decay = 2.0, reverse = false) {
    this.context = context;
    this.seconds = seconds;
    this.reverse = reverse;
    this.decay = decay;
    this.output = context.createConvolver();
    this.output.buffer = this.createImpulse(seconds, decay, reverse);
  }
  createImpulse(seconds, decay, reverse) {
    const rate = this.context.sampleRate;
    const length = rate * seconds;
    const impulse = this.context.createBuffer(2, length, rate);
    const L = impulse.getChannelData(0);
    const R = impulse.getChannelData(1);
    for (let n, i = 0; i < length; i++) {
      n = reverse ? length - i : i;
      L[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      R[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Reverb;
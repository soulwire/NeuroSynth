// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const RE_NOTE = /^([A-G])(?:(#)|(b))?(-?\d+)|/i;
const A4_OFFSETS = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
const A4_OCTAVE = 4;
const A4_FREQ = 440;

// ——————————————————————————————————————————————————
// Voice
// ——————————————————————————————————————————————————

class Voice {
  constructor(note = 'A4') {
    this.note = note;
    this.type = Voice.SINE;
    this.attack = 0.001;
    this.decay = 0.2;
    this.sustain = 0.01;
    this.release = 0.5;
  }
  get note() {
    return this._note;
  }
  set note(value) {
    this._note = value;
    const [, note, sharp, flat, octave] = value.match(RE_NOTE);
    const semitone = sharp ? 1 : flat ? -1 : 0;
    const offset = A4_OFFSETS[note];
    this.frequency = Math.pow(2,
      octave - A4_OCTAVE + (offset + semitone) / 12
    ) * A4_FREQ;
  }
}

Voice.SINE = 'sine';
Voice.SQUARE = 'square';
Voice.SAWTOOTH = 'sawtooth';
Voice.TRIANGLE = 'triangle';
Voice.CUSTOM = 'custom';

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Voice;
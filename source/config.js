// ——————————————————————————————————————————————————
// Constants
// ——————————————————————————————————————————————————

const SMALL = Math.sqrt(window.innerWidth * window.innerHeight) < 768;

// ——————————————————————————————————————————————————
// Config
// ——————————————————————————————————————————————————

const Config = {
  small: SMALL,
  notes: ['C', 'D', 'E', 'G', 'A'],
  octaves: [2, 3, 4, 5, 6],
  colors: {
    background: 0x1C1F24,
    synapse: 0xB8C5D6,
    neuron: [
      0x6EB4D1,
      0xFE5F55,
      0x5DD39E
    ],
    receptor: [
      0xF1BF98,
      0x8BE8CB,
      0x65ADF5,
      0xA08FF3,
      0xE57A44
    ]
  },
  neuronCount: {
    value: 5
  },
  receptorCount: {
    value: SMALL ? 10 : 15
  },
  transmissionRange: {
    min: 0,
    max: 400,
    value: SMALL ? 120 : 200,
    step: 1
  },
  transmissionSpeed: { // pixels per millisecond
    min: 0.05,
    max: 0.125,
    value: 0.085,
    step: 0.001
  },
  pulseInterval: {
    min: 600,
    max: 1200
  },
  tempo: {
    min: 60,
    max: 160,
    value: 80,
    step: 1
  }
};

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Config;

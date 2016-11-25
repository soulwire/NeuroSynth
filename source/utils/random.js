// ——————————————————————————————————————————————————
// Random
// ——————————————————————————————————————————————————

const Random = Math.random;

Random.float = (min, max) => {
  if (max == null) max = min, min = 0;
  return min + Random() * (max - min);
};

Random.int = (min, max) => Math.round(Random.float(min, max));

Random.sign = (chance = 0.5) => Random() >= chance ? -1 : 1;

Random.bool = (chance = 0.5) => Random() < chance;

Random.bit = (chance = 0.5) => Random() < chance ? 0 : 1;

Random.item = (list) => list[~~((Random()) * list.length)];

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Random;
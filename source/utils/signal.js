// ——————————————————————————————————————————————————
// Signal
// ——————————————————————————————————————————————————

class Signal {
  constructor() {
    this.subscribers = [];
  }
  add(handler) {
    this.subscribers.push(handler);
  }
  remove(handler) {
    const index = this.subscribers.indexOf(handler);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }
  dispatch(...data) {
    this.subscribers.forEach(handler => {
      handler.apply(handler, data);
    });
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Signal;
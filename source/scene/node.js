// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { Sprite } from 'pixi.js';

// ——————————————————————————————————————————————————
// Node
// ——————————————————————————————————————————————————

class Node extends Sprite {
  constructor(container, texture) {
    super(texture);
    this.anchor.set(0.5, 0.5);
    this.container = container;
    this.interactive = true;
    this.buttonMode = true;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.on('mousedown', this.onPointerDown);
    this.on('touchstart', this.onPointerDown);
    this.on('mouseup', this.onPointerUp);
    this.on('touchend', this.onPointerUp);
    this.on('mouseupoutside', this.onPointerUp);
    this.on('touchendoutside', this.onPointerUp);
    this.on('mousemove', this.onPointerMove);
    this.on('touchmove', this.onPointerMove);
  }
  onPointerDown(event) {
    this.dragOffset = event.data.getLocalPosition(this.container);
    this.dragData = event.data;
    this.dragging = true;
  }
  onPointerMove() {
    if (this.dragging) {
      const pointer = this.dragData.getLocalPosition(this.container.parent);
      this.container.x = pointer.x - this.dragOffset.x;
      this.container.y = pointer.y - this.dragOffset.y;
    }
  }
  onPointerUp() {
    this.dragData = null;
    this.dragging = false;
  }
  get radius() {
    return this.width / 2;
  }
  set radius(radius) {
    this.width = this.height = radius * 2;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Node;
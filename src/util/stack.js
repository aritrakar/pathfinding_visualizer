export default class Stack {
  constructor() {
    this.items = [];
  }

  // Add element to the stack
  push(element) {
    return this.items.push(element);
  }

  // Remove element from the stack
  pop() {
    return this.items.pop();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  clear() {
    this.item = [];
  }
}

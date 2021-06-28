export default class Queue {
  constructor() {
    this.items = [];
  }

  // add element to the queue
  enqueue(element) {
    return this.items.push(element);
  }

  // remove element from the queue
  dequeue() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
  }

  // view the last element
  peek() {
    return this.items[this.items.length - 1];
  }

  // check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // the size of the queue
  size() {
    return this.items.length;
  }

  // empty the queue
  clear() {
    this.items = [];
  }
}

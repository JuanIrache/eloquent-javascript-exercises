class GroupIterator {
  constructor(group) {
    this.i = 0;
    this.group = group;
  }
  next() {
    if (this.i === this.group.list.length) return { done: true };
    const result = { value: this.group.list[this.i], done: false };
    this.i++;
    return result;
  }
}

class Group {
  constructor() {
    this.list = [];
  }
  add(elt) {
    if (!this.has(elt)) this.list.push(elt);
  }
  delete(elt) {
    if (this.has(elt)) this.list.splice(this.list.indexOf(elt), 1);
  }
  has(elt) {
    return this.list.indexOf(elt) !== -1;
  }
  static from(iterable) {
    let result = new PGroup();
    for (const elt of iterable) {
      result.add(elt);
    }
    return result;
  }
  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

let group = PGroup.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false

for (let value of PGroup.from(['a', 'b', 'c'])) {
  console.log(value);
}
// → a
// → b
// → c

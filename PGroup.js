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

class PGroup {
  constructor(list) {
    this.list = list;
  }
  add(elt) {
    if (!this.has(elt)) return new PGroup(this.list.concat(elt));
    return this;
  }
  delete(elt) {
    if (this.has(elt)) return new PGroup(this.list.slice(this.list.indexOf(elt), 1));
    return this;
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

PGroup.empty = new PGroup([]);

let a = PGroup.empty.add('a');
let ab = a.add('b');
let b = ab.delete('a');

console.log(b.has('b'));
// → true
console.log(a.has('b'));
// → false
console.log(b.has('a'));
// → false

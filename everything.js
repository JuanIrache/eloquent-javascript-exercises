function every(array, test) {
  for (let i = 0; i < array.length; i++) {
    if (!test(array[i])) return false;
  }
  return true;
}

function every2(array, test) {
  return !array.some(elt => !test(elt));
}

console.log(every2([1, 3, 5], n => n < 10));
// → true
console.log(every2([2, 4, 16], n => n < 10));
// → false
console.log(every2([], n => n < 10));
// → true

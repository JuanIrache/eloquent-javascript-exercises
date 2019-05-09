function arrayToList(arr) {
  let list = null;
  for (let i = arr.length - 1; i >= 0; i--) {
    list = { value: arr[i], rest: list };
  }
  return list;
}

function listToArray(list) {
  let arr = [];
  for (let rest = list; rest; rest = rest.rest) {
    arr.push(rest.value);
  }
  return arr;
}

function prepend(value, list) {
  return { value, rest: list };
}

function nth(list, n) {
  if (n === 0) return list.value;
  if (list.rest != null) return nth(list.rest, n - 1);
  return undefined;
}

// Your code here.

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20

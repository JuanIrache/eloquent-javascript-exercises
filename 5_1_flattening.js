function flatten(arr) {
  return arr.reduce((acc, curr) => acc.concat(curr), []);
}

let arrays = [[1, 2, 3], [4, 5], [6]];
// Your code here.
console.log(flatten(arrays));

// → [1, 2, 3, 4, 5, 6]

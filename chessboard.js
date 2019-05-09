const size = 8;
let str = '';
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    str += (x + y) % 2 === 0 ? '#' : ' ';
  }
  str += '\n';
}
console.log(str);

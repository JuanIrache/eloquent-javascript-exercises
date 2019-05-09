// This is the old skipSpace. Modify it...
function skipSpace(string) {
  string = string.replace(/#.*/g, '');
  let first = string.search(/\S/);
  if (first == -1) return '';
  return string.slice(first);
}

console.log(parse('# hello\nx'));
// → {type: "word", name: "x"}

console.log(parse('a # one\n   # two\n()'));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}

const SCRIPTS = require('./5_scripts');

function characterScript(code) {
  for (let script of SCRIPTS) {
    if (
      script.ranges.some(([from, to]) => {
        return code >= from && code < to;
      })
    ) {
      return script;
    }
  }
  return null;
}

function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.findIndex(c => c.name == name);
    if (known == -1) {
      counts.push({ name, count: 1 });
    } else {
      counts[known].count++;
    }
  }
  return counts;
}

function dominant(counted) {
  return counted.reduce((acc, curr) => {
    if (acc == null) return curr;
    if (curr.count > acc.count) return curr;
    return acc;
  });
}

function dominantDirection(text) {
  return dominant(
    countBy(text, char => {
      const script = characterScript(char.codePointAt(0));
      return script ? script.direction : 'none';
    })
  ).name;
}

console.log(dominantDirection('Hello!'));
// → ltr
console.log(dominantDirection('Hey, مساء الخير'));
// → rtl

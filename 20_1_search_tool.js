const { readFileSync, statSync, readdirSync } = require('fs');
let { argv } = process;
const path = require('path');

if (argv.length > 3) {
  const re = new RegExp(argv[2]);
  let results = [];
  while (argv.length > 3) {
    const filename = argv.pop();
    const stats = statSync(path.join(__dirname, filename));
    if (stats.isDirectory()) {
      const children = readdirSync(path.join(__dirname, filename));
      argv = argv.concat(children.map(f => path.join(filename + '/', f)));
    } else {
      let data = readFileSync(path.join(__dirname, filename), 'utf8');
      if (re.test(data)) results.push(filename);
    }
  }
  console.log(results);
} else console.log('Invalid arguments');

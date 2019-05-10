async function locateScalpel(nest) {
  let name = nest.name;
  for (;;) {
    let direction = await anyStorage(nest, name, 'scalpel');
    if (direction === name) return name;
    name = direction;
  }
}

function locateScalpel2(nest) {
  const checkOne = function(name) {
    return anyStorage(nest, name, 'scalpel').then(direction => {
      if (direction === name) return name;
      return checkOne(direction);
    });
  };
  return checkOne(nest.name);
}

locateScalpel2(bigOak).then(console.log);
// → Butcher Shop

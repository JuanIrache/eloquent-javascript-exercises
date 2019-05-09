specialForms.set = (args, scope) => {
  if (args.length != 2 || args[0].type != 'word') {
    throw new SyntaxError('Incorrect use of set');
  }
  let value = evaluate(args[1], scope);
  let dealt = false;
  while (scope != null) {
    if (Object.prototype.hasOwnProperty.call(scope, args[0].name)) {
      dealt = true;
      scope[args[0].name] = value;
      break;
    } else {
      scope = Object.getPrototypeOf(scope);
    }
  }
  if (!dealt) throw new ReferenceError('Binding not found');
  return value;
};

run(`
  do(define(x, 4),
     define(setx, fun(val, set(x, val))),
     setx(50),
     print(x))
  `);
// → 50
run(`set(quux, true)`);
// → Some kind of ReferenceError

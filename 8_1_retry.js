class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure('Klunk');
  }
}

function reliableMultiply(a, b) {
  try {
    return primitiveMultiply(a, b);
  } catch (error) {
    if (error instanceof MultiplicatorUnitFailure) {
      return reliableMultiply(a, b);
    } else {
      throw error;
    }
  }
}

//Eloquent solution
// function reliableMultiply(a, b) {
//     for (;;) {
//       try {
//         return primitiveMultiply(a, b);
//       } catch (e) {
//         if (!(e instanceof MultiplicatorUnitFailure))
//           throw e;
//       }
//     }
//   }

console.log(reliableMultiply(8, 8));
// → 64

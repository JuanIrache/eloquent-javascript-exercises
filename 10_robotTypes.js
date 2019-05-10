const randomPick = require('./10_randomPick');
const findRoute = require('./7_findRoute');

module.exports = function({ roadGraph, mailRoute }) {
  function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
  }

  function routeRobot(state, memory) {
    if (memory.length == 0) {
      memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) };
  }

  function goalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
      let parcel = parcels[0];
      if (parcel.place != place) {
        route = findRoute(roadGraph, place, parcel.place);
      } else {
        route = findRoute(roadGraph, place, parcel.address);
      }
    }
    return { direction: route[0], memory: route.slice(1) };
  }

  function improvedRobot({ place, parcels }, route) {
    if (route.length == 0) {
      const bestRoute = prop => {
        const routes = parcels.filter(p => p[prop] != place).map(p => findRoute(roadGraph, place, p[prop]));
        if (!routes.length) return null;
        return routes.reduce((acc, curr) => (acc.lenght < curr.length ? acc : curr));
      };
      route = bestRoute('place') || bestRoute('address');
    }
    return { direction: route[0], memory: route.slice(1) };
  }

  //Eloquent solution
  function lazyRobot({ place, parcels }, route) {
    if (route.length == 0) {
      // Describe a route for every parcel
      let routes = parcels.map(parcel => {
        if (parcel.place != place) {
          return { route: findRoute(roadGraph, place, parcel.place), pickUp: true };
        } else {
          return { route: findRoute(roadGraph, place, parcel.address), pickUp: false };
        }
      });

      // This determines the precedence a route gets when choosing.
      // Route length counts negatively, routes that pick up a package
      // get a small bonus.
      function score({ route, pickUp }) {
        return (pickUp ? 0.5 : 0) - route.length;
      }
      route = routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
    }

    return { direction: route[0], memory: route.slice(1) };
  }

  //My solution after seing eloquent's

  function myLazyRobot({ place, parcels }, route) {
    if (route.length == 0) {
      const routeObjs = parcels.map(p => {
        if (p.place != place) return { route: findRoute(roadGraph, place, p.place), pickUp: true };
        else return { route: findRoute(roadGraph, place, p.address), pickUp: false };
      });
      routeObjs.sort((a, b) => (a.pickUp && !b.pickUp ? -1 : 1));
      const score = ({ route }) => -route.length;
      routeObjs.sort((a, b) => -b.route.length + a.route.length);
      route = routeObjs[0].route;
    }
    return { direction: route[0], memory: route.slice(1) };
  }

  return { randomRobot, routeRobot, goalOrientedRobot, improvedRobot, lazyRobot, myLazyRobot };
};

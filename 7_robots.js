const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  'Marketplace-Farm',
  'Marketplace-Post Office',
  'Marketplace-Shop',
  'Marketplace-Town Hall',
  'Shop-Town Hall'
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split('-'))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map(p => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState('Post Office', parcels);
};

const mailRoute = [
  "Alice's House",
  'Cabin',
  "Alice's House",
  "Bob's House",
  'Town Hall',
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  'Shop',
  "Grete's House",
  'Farm',
  'Marketplace',
  'Post Office'
];

function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

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

// const initialState = VillageState.random();
// runRobot(initialState, randomRobot);
// runRobot(initialState, routeRobot, []);
// runRobot(initialState, goalOrientedRobot, []);

function compareRobots(robot1, memory1, robot2, memory2) {
  let initialStates = [];
  for (let i = 0; i < 100; i++) {
    initialStates.push(VillageState.random());
  }
  const testRobot = (state, robot, memory) => {
    for (let turn = 0; ; turn++) {
      if (state.parcels.length == 0) {
        return turn;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    }
  };
  const computeResults = (robot, memory) =>
    initialStates.map(state => testRobot(state, robot, memory)).reduce((acc, curr) => acc + curr) / initialStates.length;
  console.log(
    `Robot 1 took ${computeResults(robot1, memory1)} turns on average, while Robot 2 took ${computeResults(robot2, memory2)} turns`
  );
}

compareRobots(lazyRobot, [], myLazyRobot, []);

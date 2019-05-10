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

const buildGraph = require('./buildGraph');
const roadGraph = buildGraph(roads);
const VillageState = require('./10_VillageState')(roadGraph);
const runRobot = require('./runRobot');
const { randomRobot, routeRobot, goalOrientedRobot, improvedRobot, lazyRobot, myLazyRobot } = require('./robotTypes.js')({
  roadGraph,
  mailRoute
});

const initialState = VillageState.random();
runRobot(initialState, randomRobot);
runRobot(initialState, routeRobot, []);
runRobot(initialState, goalOrientedRobot, []);

import { OuterExpressionKinds } from "typescript";
import { Knapsack, Thing, IInput } from "../interfaces";
import greedy from "./greedy";

export function generateNeighborhood(things: Thing[], knapsacks: Knapsack[]): Array<Thing[]> {
  // Solutions for sparing space
  const baseSolutions: Array<Thing[]> = [];
  // Neighborhood for moving outside item to spared space
  const neighborhood: Array<Thing[]> = [];

  // Put things into knapsacks
  const knapsackThingsMap = new Map<Knapsack, Thing[]>();
  things.forEach(thing => {
    if (thing.knapsack) {
      if (knapsackThingsMap.get(thing.knapsack) === undefined)
        knapsackThingsMap.set(thing.knapsack, []);
      knapsackThingsMap.get(thing.knapsack)?.push(thing);
    }
  })

  // Step 1 Try spare some space for outside items, and generate baseSolutions
  for (let i = 0; i < things.length; i++) {
    const thingToMove = things[i];

    // Method A Try to move `thingToMove` from one knapsack to another
    knapsacks.forEach(knapsack => {
      if (knapsack.capacity > thingToMove.weight && thingToMove.knapsack !== knapsack) {
        const solution = things.map(thing => ({ ...thing }));
        solution[i].knapsack = knapsack;
        baseSolutions.push(solution);
      }
    });

    // Method B Try to remove something for **moving in** `thingToMove`
    for (const [knapsack, thingsInKnapsack] of knapsackThingsMap.entries()) {
      thingsInKnapsack.forEach((thingToRemove, index) => {
        if (thingToRemove !== thingToMove && knapsack.capacity + thingToRemove.weight > thingToMove.weight) {
          const solution = things.map(thing => ({ ...thing }));
          solution[i].knapsack = thingToMove.knapsack;
          solution[index].knapsack = undefined;
          baseSolutions.push(solution);
        }
      })
    }
  }

  // Step 2 Move outside item in, and generate neighborhood
  const outsideThings = things.filter(thing => thing.knapsack === undefined);
  baseSolutions.forEach(solution => {
    for (const knapsack of knapsacks) {
      const rest = knapsack.capacity - solution.reduce(
        (sum, thing) => sum + (thing.knapsack !== knapsack ? 0 : thing.weight)
        , 0)
      outsideThings.forEach(thing => {
        if (thing.weight < rest) {
          const neighbor = solution.map(thing => ({ ...thing }));
          const thingToAdd = neighbor.find(thingInNeighbor => thingInNeighbor.index === thing.index)
          thingToAdd && (thingToAdd.knapsack = knapsack);
          neighborhood.push(neighbor);
        }
      })
    }
  })

  return neighborhood;
}

export function findBestNeighbor(neighborhood: Array<Thing[]>) {
  let bestNeighbor: Thing[] | null = null;
  let value = -1;
  for (const neighbor of neighborhood) {
    const tmp = neighbor.reduce((sum, thing) => sum + (thing.knapsack ? thing.value : 0), 0);
    if (tmp > value) {
      value = tmp;
      bestNeighbor = neighbor;
    }
  }
  return {
    bestNeighbor,
    value
  }
}

export default function neighborSearch(data: IInput) {
  const { things, value: greedyValue } = greedy(data);
  let bestSolution = things;
  let bestValue = greedyValue;

  while (true) {
    let neighborhood = generateNeighborhood(bestSolution, data.knapsacks);
    const { value } = findBestNeighbor(neighborhood);

    if (value > bestValue) {
      bestValue = value;
    } else {
      break;
    }
  }

  return {
    value: bestValue,
    things: bestSolution
  }
}

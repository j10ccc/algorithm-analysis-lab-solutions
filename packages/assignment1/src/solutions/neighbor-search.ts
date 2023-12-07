import { Knapsack, Thing, IInput } from "../interfaces";
import greedy from "./greedy";

/**
 * Generate neighborhood by sparing space and putting outside item in.
 * 
 * @param things Starting solution
 * @param knapsacks Original knapsacks from input data(with none things)
 * @returns All possible neighborhood 
 */
export function generateNeighborhood(things: Thing[], knapsacks: Knapsack[]): Array<Thing[]> {
  // Solutions for sparing space
  const baseSolutions: Array<Thing[]> = [];
  // Neighborhood for moving outside item to spared space
  const neighborhood: Array<Thing[]> = [];

  // Step 1 Try spare some space for outside items, and generate baseSolutions
  for (let i = 0; i < things.length; i++) {
    const thingToMove = things[i];
    if (!thingToMove.knapsack) continue;

    knapsacks.forEach(knapsack => {
      if (knapsack.capacity - knapsack.cost! >= thingToMove.weight && thingToMove.knapsack?.index !== knapsack.index) {
        // Method A Try to move `thingToMove` from one knapsack to another
        const solution = things.map(thing => ({ ...thing }));
        solution[i].knapsack = knapsack;
        baseSolutions.push(solution);
      } else if (thingToMove.knapsack?.index !== knapsack.index) {
        // Method B Try to remove something for **moving in** `thingToMove`
        things
          .filter(thing => thing.knapsack?.index === knapsack.index)
          .forEach(thingToRemove => {
            if (thingToRemove.index !== thingToMove.index && knapsack.capacity - knapsack.cost! + thingToRemove.weight >= thingToMove.weight) {
              const solution = things.map(thing => { 
                if (thing === thingToMove) 
                  return { ...thing, knapsack };
                else if (thing === thingToRemove)
                  return { ...thing, knapsack: undefined };
                else
                  return { ...thing };
              });
              baseSolutions.push(solution);
            }
          })
      }
    });
  }

  // Step 2 Move outside item in, and generate neighborhood
  const outsideThings = things.filter(thing => thing.knapsack === undefined);
  baseSolutions.forEach(solution => {
    for (const knapsack of knapsacks) {
      const rest = knapsack.capacity - solution.reduce(
        (sum, thing) => sum + (thing.knapsack?.index !== knapsack.index ? 0 : thing.weight)
        , 0)
      outsideThings.forEach(thing => {
        if (thing.weight <= rest) {
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

/**
 * Find the the neighbor with maximum value in passed neighborhood.
 * 
 * @param neighborhood
 * @returns The best neighbor and the maximum value
 */
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

/**
 * Neighbor search entry function.
 * 
 * Keeping finding better value from generated solutions until no one better.
 *
 * Start from the `greedy` result.
 *
 * @param data Input data
 * @returns bestValue and bestSolution consisted with things with knapsack reference.
 */
export default function neighborSearch(data: IInput) {
  const { things, value: greedyValue } = greedy(data);
  let bestSolution = things;
  let bestValue = greedyValue;

  while (true) {
    const knapsacks = data.knapsacks.map((knapsack, index) => {
      const cost = bestSolution.filter(thing => thing.knapsack?.index === index)
      .reduce((prev, curr) =>  curr.weight + prev, 0);
      return { ...knapsack, cost, index };
    });

    let neighborhood = generateNeighborhood(bestSolution, knapsacks);
    const { value, bestNeighbor } = findBestNeighbor(neighborhood);

    if (value > bestValue && bestNeighbor) {
      bestValue = value;
      bestSolution = bestNeighbor;
    } else {
      break;
    }
  }

  return {
    value: bestValue,
    things: bestSolution
  }
}

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
  // Neighborhood for moving outside item to spared space
  const neighborhood: Array<Thing[]> = [];
  const outsideThings = things.filter(thing => thing.knapsack === undefined);

  // Definition 1
  // Try spare some space for outside items, and generate baseSolutions
  // Solutions for sparing space
  const baseSolutions: Array<Thing[]> = [];
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
                if (thing.index === thingToMove.index)
                  return { ...thing, knapsack };
                else if (thing.index === thingToRemove.index)
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

  checkOverload(baseSolutions, knapsacks);

  // Move outside item in, and generate neighborhood
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

  checkOverload(baseSolutions, knapsacks);

  // Definition 2
  // Directly move outside item in without any pre-actions
  outsideThings.forEach(outsideThing => {
    knapsacks.forEach(knapsack => {
      if (knapsack.capacity - knapsack.cost! >= outsideThing.weight) {
        const neighbor = things.map(thing => {
          if (thing.index === outsideThing.index)
            return { ...thing, knapsack: knapsack };
          else
            return { ...thing };
        });
        neighborhood.push(neighbor);
      }
    })
  })

  checkOverload(neighborhood, knapsacks);

  // Definition 3
  // Replace item in knapsack with things outside 
  outsideThings.forEach(outsideThing => {
    const innerThings = things.filter(item => item.knapsack?.index !== undefined);
    innerThings.forEach(innerThing => {
      const knapsack = knapsacks[innerThing.knapsack!.index];
      if (knapsack.capacity - knapsack.cost! + innerThing.weight >= outsideThing.weight) {
        const neighbor = things.map(thing => {
          if (thing.index === outsideThing.index) return { ...thing, knapsack }
          else if (thing.index === innerThing.index) return { ...thing, knapsack: undefined }
          else return { ...thing }
        })
        neighborhood.push(neighbor);
      }
    })
  })

  checkOverload(neighborhood, knapsacks);

  return neighborhood;
}

function checkOverload(neighborhood: Thing[][], knapsacks: Knapsack[]) {
  neighborhood.forEach(solution => {
    knapsacks.forEach(knapsack => {
      const total = solution.filter(thing => thing.knapsack?.index === knapsack.index)
        .reduce((prev, curr) => curr.weight + prev, 0);
      if (total > knapsack.capacity) {
        console.log(total)
        throw new Error("Overload");
      }
    })
  })
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
        .reduce((prev, curr) => curr.weight + prev, 0);
      return { ...knapsack, cost, index };
    });

    let neighborhood = generateNeighborhood(bestSolution, knapsacks);
    const { value, bestNeighbor } = findBestNeighbor(neighborhood);

    if (value >= bestValue && bestNeighbor) {
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

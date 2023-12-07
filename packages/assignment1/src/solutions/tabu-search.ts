import { findBestNeighbor, generateNeighborhood } from "./neighbor-search";
import greedy from "./greedy";
import { IInput, Thing } from "../interfaces";

const IterateBound = 1000;
const TabuListLengthBound = 100;

/**
 * Tabu search entry function.
 * 
 * Store best solution from rounds of generated neighborhood, and record
 * the best in every round. Stop when there is no best solution available
 * or iterate limit runs out.
 * 
 * Start from the `greedy` result
 * 
 * @param data Input data
 * @returns bestValue and bestSolution consisted with things with knapsack reference.
 */
export default function tabuSearch(data: IInput) {
  const { things, value: greedyValue } = greedy(data);
  const tabuList: Array<Thing[]> = [];
  let startingSolution = things;
  let bestValue = greedyValue;
  let bestSolution = things;

  let iterateCount = 0;
  while (iterateCount++ < IterateBound) {
    const knapsacks = data.knapsacks.map((knapsack, index) => {
      const cost = startingSolution.filter(thing => thing.knapsack?.index === index)
      .reduce((prev, curr) =>  curr.weight + prev, 0);
      return { ...knapsack, cost, index };
    });

    const neighborhood = generateNeighborhood(startingSolution, knapsacks);
    const outsideTabuNeighborhood = neighborhood.filter(neighbor => {
      const exitedNeighbor = tabuList.find(neighborInTabu => {
        if (neighbor.length !== neighborInTabu?.length) throw new Error("Invalid neighbor");
        let i = 0;
        for (i = 0; i < neighbor.length; i++) {
          if (neighbor[i].knapsack?.index !== neighborInTabu[i].knapsack?.index) {
            break;
          }
        }
        if (i === neighbor.length) return true;
      })
      return !Boolean(exitedNeighbor);
    })
    const { bestNeighbor, value } = findBestNeighbor(outsideTabuNeighborhood);
    if (!bestNeighbor) break;
    if (value > bestValue) {
      bestSolution = bestNeighbor;
      bestValue = value;
    }
    // Control tabu list size
    if (tabuList.length > TabuListLengthBound) {
      tabuList.pop();
    }
    tabuList.push(bestNeighbor);
    startingSolution = bestNeighbor;
  }

  return {
    value: bestValue,
    things: bestSolution
  }
}

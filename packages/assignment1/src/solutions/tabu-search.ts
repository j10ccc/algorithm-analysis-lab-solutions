import { findBestNeighbor, generateNeighborhood } from "./neighbor-search";
import greedy from "./greedy";
import { IInput, Thing } from "../interfaces";

const IterateBound = 1000;
const TabuListLengthBound = 100;

export default function tabuSearch(data: IInput) {
  const { things, value: greedyValue } = greedy(data);
  const tabuList: Array<Thing[]> = [];
  let startingSolution = things;
  let bestValue = greedyValue;
  let bestSolution = things;

  let iterateCount = 0;
  while(iterateCount++ < IterateBound) {
    const neighborhood = generateNeighborhood(startingSolution, data.knapsacks);
    const outsideTabuNeighborhood = neighborhood.filter(neighbor => {
      const exitedNeighbor = tabuList.find(neighborInTabu => {
        if (neighbor.length !== neighborInTabu?.length) throw new Error("Invalid neighbor");
        let i = 0;
        for (i = 0; i < neighbor.length; i++) {
          if (neighbor[i].knapsack?.index !== neighborInTabu[i].knapsack) {
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
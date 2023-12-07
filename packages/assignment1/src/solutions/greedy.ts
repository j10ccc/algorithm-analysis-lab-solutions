import { Knapsack, Thing, IInput } from "../interfaces";

/**
 * Greedy algorithm all implementation.
 * 
 * @param data Input data
 * @returns value and solution consisted with things with knapsack reference.
 */
export default function greedy(data: IInput) {
  const knapsacks: Knapsack[] = data.knapsacks.map((item, index) => ({ ...item, index, cost: 0}));
  const things: Thing[] = data.things.map((item, index) => ({ ...item, index }));

  things.sort((a, b) => {
    return - a.value / a.weight + b.value / b.weight
  })

  things.forEach((thing) => {
    let selectKnapsack = knapsacks.find(knapsack => {
      return (knapsack.capacity - (knapsack.cost || 0)) > thing.weight;
    });
    if (selectKnapsack) {
      if (selectKnapsack.cost === undefined) selectKnapsack.cost = 0;
      selectKnapsack.cost += thing.weight;
      thing.knapsack = selectKnapsack;
    }
  })

  const sum = things.reduce((sum, thing) => sum += thing.knapsack ? thing.value : 0, 0);

  return {
    value: sum,
    things
  }
}


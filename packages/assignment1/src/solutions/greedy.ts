import { Knapsack, Thing, IInput } from "../interfaces";

export default function greedy(data: IInput) {
  const knapsacks: Knapsack[] = data.knapsacks;
  const things: Thing[] = data.things;

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
    things,
  }
}


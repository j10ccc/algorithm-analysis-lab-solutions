import { Knapsack, Thing, IInput } from "../interfaces";

export default function greedy(data: IInput) {
  const knapsacks: Knapsack[] = data.knapsacks;
  const things: Thing[] = data.things;

  things.sort((a, b) => {
    return - a.value / a.weight + b.value / b.weight
  })

  things.forEach((thing) => {
    let selectKnapsack = knapsacks.find(knapsack => {
      return knapsack.capacity > thing.weight;
    });
    if (selectKnapsack) {
      selectKnapsack.capacity -= thing.weight;
      thing.knapsack = selectKnapsack;
    }
  })

  const sum = things.reduce((sum, thing) => sum += thing.knapsack ? thing.value : 0, 0);

  return {
    value: sum,
    things,
  }
}


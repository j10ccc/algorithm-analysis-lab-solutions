export interface Thing {
  readonly weight: number;
  readonly value: number;
  knapsack?: Knapsack;
}

export interface Knapsack {
  capacity: number;
}

export interface IInput {
  readonly knapsacks: Knapsack[];
  readonly things: Thing[]
}

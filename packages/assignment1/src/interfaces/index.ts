export interface Thing {
  index: number;
  readonly weight: number;
  readonly value: number;
  knapsack?: Knapsack;
}

export interface Knapsack {
  index: number;
  readonly capacity: number;
  cost?: number;
}

export interface IInput {
  readonly knapsacks: Knapsack[];
  readonly things: Thing[]
}

export interface Thing {
  readonly weight: number;
  readonly value: number;
  knapsack?: Knapsack;
}

export interface Knapsack {
  readonly capacity: number;
  cost?: number;
}

export interface IInput {
  readonly knapsacks: Knapsack[];
  readonly things: Thing[]
}

export type Ticket = {
  id: string;
  name: string;
  numbers: number[];
  createdAt: string;
};

export type Draw = {
  id: string;
  date: string;
  numbers: number[];
  bonus?: number | null;
  createdAt: string;
};

export const MAIN_COUNT = 6;
export const NUMBER_MAX = 49;
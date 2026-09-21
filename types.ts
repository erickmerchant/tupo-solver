export type Color =
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "purple";

export type Cell = {
  color: Color;
  number: number;
};

export type Rule = {
  color?: Color | null;
  number?: number | null;
};

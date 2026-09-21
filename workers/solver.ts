import type { Cell, Color, Rule } from "../types.ts";

function match(cell: Cell, rule?: Rule): boolean {
  if (rule == null) {
    return true;
  }

  const colorMatch = rule.color == null || rule.color === cell.color;
  const numberMatch = rule.number == null || rule.number === cell.number;

  return colorMatch && numberMatch;
}

function* getBoards(
  size: number,
  tokens: Array<Cell>,
  rules: Array<Rule>,
  board: Array<Cell>,
): Iterable<Array<Cell>> {
  const intersection = board.filter((_, i) =>
    Math.floor(i / size) === Math.floor(board.length / size) ||
    i % size === board.length % size
  );
  const filtered = tokens.filter((t) =>
    !intersection.some((c) => c.color === t.color || c.number === t.number) &&
    match(t, rules[board.length])
  );

  for (const token of filtered) {
    if (board.length === (size ** 2) - 1) yield [...board, token];
    else {
      yield* getBoards(size, tokens.filter((t) => t !== token), rules, [
        ...board,
        token,
      ]);
    }
  }
}

self.onmessage = function (e: MessageEvent): void {
  const { size, colors, rules }: {
    size: number;
    colors: Array<Color>;
    rules: Array<Rule>;
  } = JSON.parse(e.data);
  const tokens: Array<Cell> = [];

  for (let c = 0; c < colors.length; c++) {
    for (let number = 1; number <= size; number++) {
      tokens.push({
        color: colors[c],
        number,
      } as Cell);
    }
  }

  const boards = Array.from(getBoards(size, tokens, rules, []));
  const result: { count: number; board?: Array<Cell> } = {
    count: boards.length,
  };

  if (boards.length === 1) {
    result.board = boards[0];
  }

  postMessage(JSON.stringify(result));
};

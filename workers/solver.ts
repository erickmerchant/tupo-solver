import type { Cell, Color, Rule } from "../types.ts";

function match(cell: Cell, rule?: Rule): boolean {
  if (rule == null) {
    return true;
  }

  const colorMatch = rule.color == null || rule.color === cell.color;
  const numberMatch = rule.number == null || rule.number === cell.number;

  return colorMatch && numberMatch;
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

  function* getBoards(
    board: Array<Cell>,
  ): Iterable<Array<Cell>> {
    const intersection = board.flatMap((c, i) =>
      Math.floor(i / size) === Math.floor(board.length / size) ||
        i % size === board.length % size
        ? [c.color, c.number]
        : []
    );
    const filtered = tokens.filter((t) =>
      !board.includes(t) &&
      !intersection.includes(t.color) && !intersection.includes(t.number) &&
      match(t, rules[board.length])
    );

    for (const token of filtered) {
      if (board.length === (size ** 2) - 1) yield [...board, token];
      else {
        yield* getBoards([
          ...board,
          token,
        ]);
      }
    }
  }

  const boards = Array.from(getBoards([]));
  const result: { count: number; board?: Array<Cell> } = {
    count: boards.length,
  };

  if (boards.length === 1) {
    result.board = boards[0];
  }

  postMessage(JSON.stringify(result));
};

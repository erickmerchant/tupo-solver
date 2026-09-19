type Cell = {
  c: "red" | "yellow" | "green" | "cyan" | "blue";
  n: number;
};

const COLORS = ["red", "yellow", "green", "cyan", "blue"];

const WIDTH = 5;

const TOKENS: Array<Cell> = [];

const RULES: Record<number, (t: Cell) => boolean> = {
  0: (t) => t.n === 3,
  3: (t) => t.c === "cyan",
  6: (t) => t.c === "yellow",
  8: (t) => t.n === 2,
  10: (t) => t.n === 0,
  12: (t) => t.n === 2,
  17: (t) => t.c === "green",
  18: (t) => t.c === "red",
  19: (t) => t.c === "cyan" && t.n === 4,
  21: (t) => t.n === 2,
  22: (t) => t.n === 4,
};

for (let c = 0; c < COLORS.length; c++) {
  for (let n = 0; n < WIDTH; n++) {
    TOKENS.push({
      c: COLORS[c],
      n,
    } as Cell);
  }
}

for (const board of getBoards([])) {
  printBoard(board);
}

function printBoard(board: Array<Cell>) {
  while (board.length) {
    const row = board.splice(0, WIDTH);

    console.log(
      row.map((col: Cell) => `%c${col.n + 1}`).join(" "),
      ...row.map((col: Cell) => `color: ${col.c}`),
    );
  }
}

function* getBoards(
  board: Array<Cell>,
): Iterable<Array<Cell>> {
  const intersection = board.filter((_, i) =>
    Math.floor(i / WIDTH) === Math.floor(board.length / WIDTH) ||
    i % WIDTH === board.length % WIDTH
  );
  const filtered = TOKENS.filter((t) =>
    !board.includes(t) &&
    !intersection.some((c) => c.c === t.c || c.n === t.n) &&
    (!RULES[board.length] || RULES[board.length](t))
  );

  for (const token of filtered) {
    if (board.length === (WIDTH ** 2) - 1) yield [...board, token];
    else {
      yield* getBoards([...board, token]);
    }
  }
}

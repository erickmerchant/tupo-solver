import type { Cell, Color, Rule } from "../types.ts";
import {
  effect,
  h,
  HandcraftElement,
  type HandcraftNode,
  watch,
} from "@handcraft/lib";

const { div, button, style, hr, p } = h.html;
const COLORS: Array<Color> = [
  "red",
  "yellow",
  "green",
  "blue",
  "purple",
];

export class TupoSolver extends HandcraftElement {
  static observedAttributes = ["size"];

  size = 4;
  state: {
    focused: number | null;
    rules: Array<Rule>;
    count: number;
    solved: boolean;
  } = watch({
    focused: null,
    rules: [],
    count: 0,
    solved: false,
  });

  override view(host: HandcraftNode) {
    const colors: Array<string> = watch([]);

    for (const color of COLORS.slice(0, this.size)) {
      colors.push(color);
    }

    this.state.rules = range(this.size ** 2).map(() =>
      watch({ number: null, color: null })
    );

    let worker: Worker;

    effect(() => {
      if (!this.ssr && !this.state.solved) {
        worker?.terminate();

        // const { resolve, promise } = Promise.withResolvers();
        worker = new Worker("/workers/solver.js", { type: "module" });

        worker.postMessage(JSON.stringify({
          size: this.size,
          colors,
          rules: this.state.rules,
        }));

        worker.onmessage = (
          e: MessageEvent<string>,
        ) => {
          const { count, board }: { count: number; board?: Array<Cell> } = JSON
            .parse(e.data);

          this.state.count = count;

          if (board) {
            this.state.rules = board;

            this.state.solved = true;

            this.state.focused = null;
          }
        };
      }
    });

    if (this.size >= 3 && this.size <= 5) {
      host.shadow({ mode: "open" }, [
        style(
          `* { box-sizing: border-box; margin: 0; max-inline-size: 100%; padding: 0; border: none; font: inherit; }`,
        ),
        div.part("root")(
          p.part("message")(() =>
            this.state.count
              ? `${this.state.count} possible ${
                this.state.count > 1 ? "boards" : "board"
              }`
              : ""
          ),
          div.part("board")(
            range(this.size ** 2).map((id) =>
              button(() => `${this.state.rules[id].number ?? ""}`)
                .part("input", {
                  selected: () => this.state.focused === id,
                })
                .style({
                  "--color": () => {
                    const rules = this.state.rules;

                    return rules[id].color != null
                      ? `var(--${rules[id].color})`
                      : "";
                  },
                })
                .on(
                  "focus",
                  () => {
                    if (!this.state.solved) this.state.focused = id;
                  },
                )
            ),
          ),
          div.part("controls")(
            ...range(this.size).map((i) =>
              button
                .on("click", () => {
                  const focused = this.state.focused;
                  const rules = this.state.rules;

                  if (focused == null || this.state.solved) return;

                  rules[focused].number = rules[focused].number === i + 1
                    ? null
                    : i + 1;
                })
                .part("button")(`${i + 1}`)
            ),
            hr.part("divider"),
            ...colors.map((color) =>
              button
                .part("button")
                .style({ "--color": `var(--${color})` })(
                  color[0],
                )
                .on("click", () => {
                  const focused = this.state.focused;
                  const rules = this.state.rules;

                  if (focused == null || this.state.solved) return;

                  rules[focused].color = rules[focused].color === color
                    ? null
                    : color as Color;
                })
            ),
          ),
        ),
      ]);
    }
  }
}

export default TupoSolver.define("tupo-solver") as HandcraftNode;

function range(n: number): Array<number> {
  return [...Array(n).keys()];
}

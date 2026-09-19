import { h, HandcraftElement, type HandcraftNode, watch } from "@handcraft/lib";

const { div, button, input, style, span, hr } = h.html;
const COLORS = ["crimson", "gold", "forestgreen", "skyblue", "rebeccapurple"];

export class TupoSolver extends HandcraftElement {
  static observedAttributes = ["size"];

  size = 4;
  colors: Array<string> = watch([]);
  state: {
    focused: number | null;
    rules: Record<number, { n?: number; c?: string }>;
  } = watch({ focused: null, rules: {} });

  override view(host: HandcraftNode) {
    for (const color of COLORS.slice(0, this.size)) {
      this.colors.push(color);
    }

    if (this.size <= 5) {
      host.shadow({ mode: "open" }, [
        style(
          `* { box-sizing: border-box; margin: 0; max-inline-size: 100%; padding: 0; border: none; font: inherit; }`,
        ),
        div.part("root")(
          div.part("board")(
            range(this.size ** 2).map((id) =>
              input.name("number").type("text").part("input", {
                selected: () => this.state.focused === id,
              }).on(
                "focus",
                () => this.state.focused = id,
              )
            ),
          ),
          div.part("controls")(
            ...range(this.size).map((i) => button.part("button")(`${i + 1}`)),
            hr.part("divider"),
            ...this.colors.map((color) =>
              button.part("button").style({ "--color": color })(
                span.part("color-label")(color),
              )
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

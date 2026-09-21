import { h } from "@handcraft/lib";
import tupoSolver from "../elements/tupo-solver.ts";

const { body, head, link, meta, title, html, script } = h.html;

export default function ({ params }: { params: { size: string } }) {
  return html.lang("en-US")(
    head(
      meta.charset("utf-8"),
      meta.name("viewport").content("width=device-width"),
      title("Tupo solver"),
      link.href("/styles/index.css").rel("stylesheet"),
      meta.name("description").content("a cheat app for tupo.collinsworth.dev"),
      script.type("module").src("/elements/tupo-solver.js"),
    ),
    body(tupoSolver.size(params.size)),
  );
}

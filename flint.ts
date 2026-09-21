import flint, { pattern as p } from "@flint/framework";
import css from "@flint/framework/handlers/css";
import js from "@flint/framework/handlers/js";
import { view } from "@handcraft/lib/ssr";
import index from "./pages/index.ts";

const app = flint()
  .route(p`/:size([3-5])/`, view(index), ["/3/", "/4/", "/5/"])
  .route("/workers/solver.js", js)
  .file("/elements/tupo-solver.js", js)
  .file(p`/*.woff2`)
  .file("/styles/index.css", css);

export default app;

if (import.meta.main) {
  app.run();
}

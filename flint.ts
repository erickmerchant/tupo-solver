import flint, { pattern as p } from "@flint/framework";
import css from "@flint/framework/handlers/css";
import js from "@flint/framework/handlers/js";
import { view } from "@handcraft/lib/ssr";
import index from "./pages/index.ts";

const app = flint()
  .file(p`/*.woff2`)
  .file("/elements/tupo-solver.js", js)
  .file("/styles/index.css", css)
  .route(p`/:size([1-5])/`, view(index), ["/4/", "/5/"]);

export default app;

if (import.meta.main) {
  app.run();
}

import { defineConfig } from "astro/config";

// Deployed under username.github.io/comp4020-ass1-BrynMtchll/, so every
// internal link and asset URL needs that path prefix. Astro applies `base` to
// asset URLs it generates itself (this file's imported CSS, `astro:assets`)
// automatically; anything you write by hand — an `<a href>`, a fetch path —
// needs `import.meta.env.BASE_URL` prepended yourself, or it 404s once
// deployed while working fine locally at the site root.
export default defineConfig({
  base: "/comp4020-ass1-BrynMtchll/",

  // CSS minification is off because it silently broke the entire zoom in
  // production while dev (which doesn't minify) looked perfect.
  //
  // The zoom layers need two declarations:
  //   animation: loop-1 linear;
  //   animation-timeline: scroll(root block);
  // The minifier folded them into one shorthand — `animation: linear loop-1
  // scroll(root)` — which Chrome rejects outright, because it does not accept
  // a timeline inside the `animation` shorthand. An invalid declaration is
  // dropped, so the deployed page had `transform: none` on every layer at
  // every scroll position: the counter still ran (that's JS) while nothing
  // moved. Verify by grepping the built CSS for `animation-timeline` as its
  // own declaration; if it has vanished into an `animation:` shorthand, the
  // zoom is dead again.
  vite: { build: { cssMinify: false } },
});

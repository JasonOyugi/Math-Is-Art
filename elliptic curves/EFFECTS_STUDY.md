# Carousel effects study · 14 November 2026

## References inspected

- [Ponpon Mania chapters](https://ponpon-mania.com/chapters), including its public [Nuxt rendering bundle](https://ponpon-mania.com/_nuxt/CfE0pqJa.js) and [chapters page script](https://ponpon-mania.com/_nuxt/Bg17DEuf.js). The page places the chapters over a WebGL canvas. In the browser, nested circles expand and the boundary dents toward the pointer; the effect relaxes after the pointer moves away. The bundle exposes circle, blur, displacement, mouse, velocity, and time parameters, though the production code is minified.
- [Adam Perlis’s project carousel](https://adamperlis.com/), including the public [carousel entry script](https://adamperlis.com/_astro/GlassCarousel.astro_astro_type_script_index_0_lang.CE4tdijp.js) and [rendering engine](https://adamperlis.com/_astro/engine.T7eqHWDB.js). The engine turns image planes away from the center and uses a postprocess lens with radial pull, fluid rim waves, chromatic dispersion, blur, and colored edge light. Its image shader samples the source texture across color channels near the lens rim.

## Math Is Art adaptation

The homepage uses original effects code and keeps its original SVG poster art. `dist/background.js` draws three nested, gently changing color fields and two expanding rings. Pointer position eases into the scene and deforms the circle boundaries locally, then releases. The canvas draws at a capped 30 frames per second and falls back to the static CSS background when reduced motion is requested or canvas is unavailable.

The side covers in `dist/carousel.css` use perspective rotation, blur, horizontal stretch, softened edges, and cyan/magenta/yellow light outside their rims. This is a lighter interpretation of Adam Perlis’s optical treatment. It does not copy his image shader or textures; the center cover remains crisp and readable.

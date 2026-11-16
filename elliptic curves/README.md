# Math Is Art · chapter carousel

The homepage is a full-screen, five-cover chapter selector inspired by the composition and interaction of [Ponpon Mania's chapters page](https://ponpon-mania.com/chapters). All mathematical poster art is original SVG/CSS. See [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) for the observed design patterns and implementation choices.

The five chapter covers are Arithmetic of curves, Differential geometry of curves, Galois theory, Classification theory (with a Geometry badge), and Spectral theory. Side covers, keyboard arrows, swipe, and wheel input change the selected cover. Selecting Arithmetic of curves opens its chapter list; the other covers retain previews marked “in preparation.”

The backdrop fills the screen with growing color circles and a pointer-responsive deformation. Neighboring covers turn in perspective, soften, stretch, and show spectral color at their edges while the centered cover stays sharp. Cover titles share one typographic pattern: the main words are upright; “of” is italic where it appears. The chapter info capsule and fullscreen control have been removed to leave the covers unobstructed. The public reference code and the original implementation are described in [EFFECTS_STUDY.md](./EFFECTS_STUDY.md).

The earlier [elliptic curve explorer](./dist/elliptic-curves.html) remains available through a secondary link. Run the static site from `dist/` with a local HTTP server or visit the private Sites deployment. Mathematical provenance and scope for the explorer remain in [REFERENCES.md](./REFERENCES.md).

The Arithmetic of curves cover now melts into a pink reading path inspired by [Lama Lama's featured-work list](https://lamalama.com/). It presents three chapter rows and 18 visual subchapter tiles. Rows turn orange on hover, and tiles open a preparation preview. The list's design choices and reference evidence are recorded in [DESIGN.md](./DESIGN.md).

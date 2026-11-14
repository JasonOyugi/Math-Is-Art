# Math Is Art · chapter carousel

The homepage is a full-screen, five-cover chapter selector inspired by the composition and interaction of [Ponpon Mania's chapters page](https://ponpon-mania.com/chapters). All mathematical poster art is original SVG/CSS. See [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) for the observed design patterns and implementation choices.

The five chapter covers are placeholders: Arithmetic of curves, Differential geometry of curves, Galois theory, Classification of surfaces, and Spectral theory. Side covers, arrow buttons, keyboard arrows, swipe, and wheel input change the selected cover. Selecting the centered cover opens a preview marked “in preparation.”

The backdrop fills the screen with growing color circles and a pointer-responsive deformation. Neighboring covers turn in perspective, soften, stretch, and show spectral color at their edges while the centered cover stays sharp. Cover titles share one typographic pattern: the main words are upright; “of” is italic where it appears. The previous about panel, cover numbering, and play icon have been removed. The public reference code and the original implementation are described in [EFFECTS_STUDY.md](./EFFECTS_STUDY.md).

The earlier [elliptic curve explorer](./dist/elliptic-curves.html) remains available through a secondary link. Run the static site from `dist/` with a local HTTP server or visit the private Sites deployment. Mathematical provenance and scope for the explorer remain in [REFERENCES.md](./REFERENCES.md).

# Arithmetic chapter list design

## Reference and capture

- Reference: [Lama Lama homepage](https://lamalama.com/), specifically the featured-work list after its hero.
- Inspected on 16 November 2026 through Firecrawl's live page capture and an in-app browser at a desktop viewport. [Inspected screenshot](./lamalama-list-reference.png) shows the stacked rows and image strips. The Firecrawl response reported HTTP 200 and a 2026 page modification date.
- The reference's live hover state was not captured. Its HTML includes a dedicated `js-backdrop-hover` element, while the requested orange hover treatment is an adaptation for Math Is Art.

## Observed visual system

- Dark charcoal ground (`#1A1C1C` in the captured branding data), warm off-white text (`#F9F4EB`), and fine horizontal separators.
- Compact sans-serif project names and small uppercase tags anchor the left side of each row. A horizontal strip of rectangular project imagery occupies the right side.
- The list spans the page width; each project row has generous vertical space. The imagery reads as a sequence of cropped previews, with some imagery extending beyond the viewport.
- Firecrawl identified `SuisseBPIntl` for headings and `Sometype` for supporting text. The observed body and heading sizes vary by section; these fonts and sizes are reference evidence, not requirements for the Math Is Art site.

## Math Is Art implementation

- Preserve the carousel's existing pink `#efa4b8`, orange `#f69235`, and dark ink. The arithmetic page uses pink as its full background; hovering or focusing a chapter row changes it to orange.
- Use a full-width stack of three chapter rows with thin dark rules. Each row has a large chapter title at left and a horizontally scrollable strip of subchapter tiles at right.
- Use original CSS mathematical patterns instead of Lama Lama's project photographs: curves, lattices, point fields, orbits, rings, and grids. Tiles carry their titles as readable labels.
- On opening Arithmetic of curves, a morphing pink shape covers the hero and the page scrolls to the list. Reduced-motion users receive an immediate transition.
- At narrow widths, each row stacks its title above the horizontal tile strip. Focus styles and native horizontal scrolling keep the tiles usable with keyboard and touch input.

## Scope still open

The mathematical text and interactive lessons inside each subchapter remain to be written. The tiles currently open a clear preparation preview, and the elliptic-curve explorer remains linked from the list.

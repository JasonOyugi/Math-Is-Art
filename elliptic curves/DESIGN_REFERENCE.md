# Ponpon Mania chapter selector: design reference

Captured 14 November 2026 from [ponpon-mania.com/chapters](https://ponpon-mania.com/chapters). A desktop screenshot of the second selected chapter at 1280 × 720 was inspected in the working design study. The page was inspected in a browser; Firecrawl scrape ID: `01a1dade-f9d6-73f8-a8f2-ed3f9c3bdb27`.

## Observed composition

The chapter selector fills the viewport. A giant colored disc sits behind a central square illustrated cover. Smaller covers flank it at roughly half scale, with slight rotation and perspective. The next cover extends toward the screen edge. The background and disc colors change with the selected chapter. A black capsule overlaps the bottom of the selected cover, containing a large play triangle, chapter title, volume/time metadata, and previous/next controls. The small header centers the stacked wordmark; “chapters” and “about” sit to its sides. A fullscreen control sits near the lower left.

Clicking a side cover brings it to the center. In the browser, the transition changed both the covers and the background palette. Clicking the center play area entered the chapter. The covers are rendered in a WebGL canvas; the capsule and header have DOM counterparts. Exact easing and timing were not measured.

## Extracted and estimated values

| Part | Evidence | Implementation guidance |
| --- | --- | --- |
| Font | Firecrawl brand extraction reports Libre Franklin with Helvetica/Arial fallback | Use a heavy, compact sans for Math Is Art's own wordmark and cover labels |
| Base dark | Extracted `#171717`; capsule appears near-black in screenshot | Dark capsule with white text, high contrast |
| Cream | Extracted secondary `#FFF6F0` | Warm light text and pale accents |
| Apricot | Extracted primary/accent `#FFCC8E` | Useful reference for the warm palette; vary per chapter |
| Center cover | Visually about 470 × 470 px in the 1280 × 720 capture | Responsive square poster around 65vh, capped near 470px |
| Side cover | Visually about 250–270px square | Scale near 0.55 with tilt and lower stacking order |
| Control capsule | Visually about 375 × 90px, black, very rounded | Overlap the cover's lower edge; keep title and controls legible |
| Backdrop | Full bleed bright, grainy, pink with a large orange disc on chapter 1; lavender/purple on chapter 2 | Change a pair of background/disc colors with the selected card; apply restrained texture |

Extracted branding is source identity. The dimensions and positions above are visual estimates from the inspected desktop screenshot. Mobile was not visually inspected; implement a responsive interpretation and test it in the target site.

## Math Is Art adaptation

- Keep the full-screen cover carousel, side-card selection, color-changing disc, overlapping capsule, and simple header.
- Make five *original* mathematical covers. Treat them as illustrated chapter posters, each with its own palette and graphic system.
- Use the five topics supplied by the user without subject-category navigation on the homepage.
- Show a deliberate “chapter in preparation” preview from the center card; the current curve explorer remains available through a quiet secondary link.
- Support click, arrow keys, swipe, visible previous/next buttons, and reduced motion.
- Do not reuse Ponpon Mania's illustrations, wordmark, audio, or chapter content.

## Open details

The source's WebGL motion and cover material are unique to its art. A CSS/SVG version can reproduce the layout and carousel behavior while making the mathematical imagery and text accessible.

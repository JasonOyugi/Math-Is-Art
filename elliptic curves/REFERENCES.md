# Elliptic Curve Atlas: reference map

This file records the sources and the decisions behind the first release. It is a reading list and a provenance record, not a claim that the site reproduces LMFDB's database.

## Questions carried forward from our chats

1. **Understanding LMFDB 11a** (chat, 6 November 2026): What do the pages for the 11a isogeny class and its individual curves mean? How are the listed quantities calculated, and what theory connects them? This motivates the field guide and the link to [LMFDB 11.a](https://www.lmfdb.org/EllipticCurve/Q/11.a/).
2. **Calculating Curve Orders** (chat, 7 November 2026): Examples of orders of functions at points, the smooth curve \(y^2=x^3+x\) versus the singular curve \(y^2=x^3+x^2\) at \((0,0)\), and the tangent-space criterion using \(M_P/M_P^2\). These are planned as a separate visual lesson. They come from Chapter I of Silverman's *The Arithmetic of Elliptic Curves*; see the publisher entry below.

## Primary references

| Source | Use in the site | Scope and caution |
| --- | --- | --- |
| [LMFDB: elliptic curves over ℚ](https://www.lmfdb.org/EllipticCurve/Q/) | Browse taxonomy: conductor, rank, torsion, labels, and curve records. | Full database remains at LMFDB. The Atlas currently has no live LMFDB data feed. |
| [LMFDB: 11.a isogeny class](https://www.lmfdb.org/EllipticCurve/Q/11.a/) and [11.a1](https://www.lmfdb.org/EllipticCurve/Q/11/a/1) | Case study for individual models, invariants, reduction, isogenies, and links to modular forms and L-functions. | LMFDB's minimal models often use the five-coefficient general Weierstrass form; the current Atlas calculator accepts only short form. Do not identify the calculator's presets with 11.a. |
| [LMFDB: source and acknowledgments](https://www.lmfdb.org/EllipticCurve/Q/Source) | Provenance for compiled data and algorithms. | Credits Cremona's tables and software, Stein–Watkins data, and later computations. Consult before importing records. |
| [LMFDB: completeness](https://www.lmfdb.org/EllipticCurve/Q/Completeness) and [reliability](https://www.lmfdb.org/EllipticCurve/Q/Reliability) | Coverage and validation notes for any future search interface. | Do not imply that an empty result proves nonexistence outside the documented ranges. |
| [LMFDB: labels](https://www.lmfdb.org/EllipticCurve/Q/Labels) | Distinguish LMFDB labels from Cremona labels and curve numbers. | Always display the label convention in use. |
| [SageMath: elliptic curves over the rationals](https://doc.sagemath.org/html/en/reference/arithmetic_curves/sage/schemes/elliptic_curves/ell_rational_field.html) | Computational API and examples for a later verified back end. | SageMath's complete arithmetic routines are not replicated by the browser demo. |
| [MIT 18.783, Lecture 1](https://math.mit.edu/classes/18.783/2015/Lecture1.pdf) | Smoothness condition, group law, point at infinity, and curves over finite fields. | Introductory theory for the current visual tools. |
| [Joseph H. Silverman, *The Arithmetic of Elliptic Curves*, 2nd ed.](https://link.springer.com/book/10.1007/978-0-387-09494-6) | Deeper reference for algebraic curves, local rings, valuations, and elliptic-curve arithmetic; source of the exercises discussed in chat. | Textbook is not reproduced; cite chapter and exercise when a detailed lesson is added. |

## Mathematics in the first release

The browser works with integral \(a,b\) between −12 and 12 and the short equation \(y^2=x^3+ax+b\). It displays real points in a finite viewport. The discriminant is \(\Delta=-16(4a^3+27b^2)\); \(\Delta\ne0\) is the smoothness condition in characteristic zero. The displayed \(j\)-invariant is \(1728\cdot4a^3/(4a^3+27b^2)\).

Integral points are found only by checking integer \(x\) from −50 to 50 and whether \(x^3+ax+b\) is a square. This search is **bounded** and does not establish all integral points. Point addition uses the usual secant or tangent slope and the formulas \(x_{P+Q}=m^2-x_P-x_Q\), \(y_{P+Q}=m(x_P-x_{P+Q})-y_P\). The UI rounds coordinates for display.

For each selected prime \(p\), the browser enumerates all residue pairs \((x,y)\) and counts solutions of \(y^2\equiv x^3+ax+b\pmod p\), then adds one for the point at infinity. When \(p\mid\Delta\), it marks the displayed model as singular modulo \(p\) and withholds the elliptic-curve group count. If a nonminimal model is used later, distinguish bad reduction of that model from bad reduction of the curve.

## Next content and data work

1. Add a worked 11.a tutorial with exact five-coefficient formulas, model changes, conductor, local reduction, rank, torsion, and isogeny maps, checking every value against LMFDB and SageMath.
2. Add the smooth/singular local-geometry lesson from the earlier chat: tangent spaces, \(M_P/M_P^2\), orders of vanishing, and why the singular local ring fails to be a discrete valuation ring.
3. If full catalog search is desired, choose a licensed and documented LMFDB data access route, cache with provenance and timestamps, and display coverage limits from LMFDB's completeness pages.
4. Add exact rational arithmetic for point addition; the current browser graph and calculator use JavaScript numbers and integer-point menus.


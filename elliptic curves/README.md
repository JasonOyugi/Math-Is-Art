# Elliptic Curve Atlas

An interactive, static first release for exploring short Weierstrass equations. Open `dist/index.html` through a local HTTP server, or use the private Sites deployment.

Features: responsive real curve graph; editable integer coefficients and example curves; discriminant, j-invariant, real shape, and bounded integral point search; secant/tangent point addition; finite-field point grids and counts; guided 11.a reading path; linked primary references.

All calculations happen in `dist/app.js` in the visitor's browser. There is no user data store, back-end arithmetic engine, or LMFDB mirror. See [REFERENCES.md](./REFERENCES.md) for provenance, limits, and the next lessons.

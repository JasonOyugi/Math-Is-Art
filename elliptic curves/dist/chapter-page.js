(() => {
  const scene = document.getElementById('scene');
  const page = document.getElementById('arithmetic');
  const dialog = document.getElementById('chapterDialog');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const artworkNotes = {
    'Varieties': 'On x² + y² = 1, the line y = (x + 1)/2 passes through (−1, 0) and meets the circle again at (3/5, 4/5).',
    'Curves': 'The heart is the degree-six algebraic curve (x² + y² − 1)³ − x²y³ = 0.',
    'Riemann–Roch': 'This square sketches the Grothendieck–Riemann–Roch relation between K-theory, rational cohomology, pushforward, and the Todd class.'
  };
  let opening = false;

  function openArithmetic() {
    if (opening) return;
    opening = true;
    if (!reducedMotion.matches) scene.classList.add('is-opening');
    history.replaceState(null, '', '#arithmetic');
    setTimeout(() => {
      page.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    }, reducedMotion.matches ? 0 : 720);
    setTimeout(() => {
      scene.classList.remove('is-opening');
      opening = false;
    }, reducedMotion.matches ? 0 : 1900);
  }

  window.mathArtChapters = { openArithmetic };

  document.querySelectorAll('.topic-tile').forEach(tile => tile.addEventListener('click', () => {
    const title = tile.querySelector('.tile-title').textContent;
    const parent = tile.dataset.parent;
    dialog.returnFocusTo = tile;
    dialog.querySelector('.dialog-kicker').textContent = `ARITHMETIC OF CURVES / ${parent.toUpperCase()}`;
    document.getElementById('dialogTitle').textContent = title;
    document.getElementById('dialogSource').textContent = artworkNotes[title] || `A visual study within ${parent}.`;
    dialog.querySelector('.dialog-note').textContent = 'This subchapter is in preparation. The visual reading path is ready for exploration.';
    document.getElementById('dialogExplorer').hidden = !(parent === 'Elliptic Curves' && title === 'Overview');
    dialog.showModal();
    document.getElementById('closeDialog').focus();
  }));
})();

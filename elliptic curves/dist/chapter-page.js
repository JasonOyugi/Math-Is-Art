(() => {
  const scene = document.getElementById('scene');
  const page = document.getElementById('arithmetic');
  const dialog = document.getElementById('chapterDialog');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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

  document.querySelector('.back-to-covers').addEventListener('click', event => {
    event.preventDefault();
    scene.classList.remove('is-opening');
    history.replaceState(null, '', '#chapters');
    scene.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });

  document.querySelectorAll('.topic-tile').forEach(tile => tile.addEventListener('click', () => {
    const title = tile.querySelector('.tile-title').textContent;
    const parent = tile.dataset.parent;
    dialog.returnFocusTo = tile;
    dialog.querySelector('.dialog-kicker').textContent = `ARITHMETIC OF CURVES / ${parent.toUpperCase()}`;
    document.getElementById('dialogTitle').textContent = title;
    document.getElementById('dialogSource').textContent = `A visual study within ${parent}.`;
    dialog.querySelector('.dialog-note').textContent = 'This subchapter is in preparation. The visual reading path is ready for exploration.';
    document.getElementById('dialogExplorer').hidden = !(parent === 'Elliptic Curves' && title === 'Overview');
    dialog.showModal();
    document.getElementById('closeDialog').focus();
  }));
})();

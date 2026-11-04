// Minimal stand-in for the dashboard runtime so the same chart code runs on a static page.
// Data comes from window.DASH_DATA, embedded in the page.
(function () {
  const D = window.DASH_DATA || {};
  const draws = new Map();
  window.dash = {
    colors: ['var(--accent)', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#f472b6', '#94a3b8'],
    data(id) {
      const rows = D[id];
      return rows ? { status: 'ok', data: rows, columns: Object.keys(rows[0] || {}), meta: [] } : { status: 'missing', data: [], meta: [] };
    },
    draw(name, fn) { draws.set(name, fn); },
    calc(id, spec) { D[id] = spec.fn(...spec.inputs.map((i) => D[i] || [])); },
    onData(fn) { draws.set('__ondata' + draws.size, () => fn()); },
  };
  let w = 0;
  function run() {
    draws.forEach((fn, name) => {
      if (name.startsWith('__ondata')) { fn(); return; }
      document.querySelectorAll('[data-draw="' + name + '"]').forEach((el) => {
        try { fn(el); } catch (e) { console.error('draw ' + name, e); }
      });
    });
  }
  function start() {
    run(); w = window.innerWidth;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    let t;
    window.addEventListener('resize', () => {
      if (window.innerWidth === w) return;
      w = window.innerWidth; clearTimeout(t); t = setTimeout(run, 120);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else setTimeout(start, 0);
})();

// Shared chart helpers (d3 v7 global). Every value drawn here comes from rows passed in by the page.
(function () {
  const ch = (window.ch = {});
  const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 });
  const F = {
    pct1: d3.format('.1%'),
    pct0: d3.format('.0%'),
    spct: (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + d3.format('.1%')(Math.abs(v)),
    num2: d3.format(',.2f'),
    pctint: (v) => d3.format(',.0f')(v) + '%',
    int: d3.format(','),
    num0: d3.format(',.0f'),
    num1: d3.format(',.1f'),
    num3: d3.format('.3f'),
    cutoff: d3.format('.2f'),
    x1: (v) => d3.format('.1f')(v) + '×',
    money: (v) => (v < 0 ? '−$' : '$') + d3.format(',.0f')(Math.abs(v)),
    moneyc: (v) => (v < 0 ? '−$' : '$') + compact.format(Math.abs(v)),
    compact: (v) => compact.format(v),
  };
  ch.F = F;
  ch.fmt = (name, v) => (Number.isFinite(v) ? (F[name] || F.num0)(v) : '—');
  ch.num = (v) => (v === '' || v == null ? NaN : Number(v));

  const BAD = ['error', 'missing', 'declined', 'connect'];
  // Returns true when the element must wait (and leaves it in its placeholder state).
  ch.pending = (el, ids, kind) => {
    const sts = ids.map((id) => dash.data(id).status);
    if (sts.every((s) => s === 'ok')) { el.classList.remove('dash-skeleton'); return false; }
    const failed = sts.some((s) => BAD.includes(s));
    if (kind === 'table') { el.replaceChildren(); return true; }
    if (kind === 'chart') {
      el.replaceChildren();
      if (failed) {
        el.classList.remove('dash-skeleton');
        const f = document.createElement('div'); f.className = 'dv-fail';
        const dot = document.createElement('span'); dot.className = 'dv-dot';
        f.append(dot, document.createTextNode('Failed to load'));
        el.append(f);
      } else el.classList.add('dash-skeleton');
      return true;
    }
    el.textContent = '—';
    el.classList.toggle('dash-skeleton', !failed);
    return true;
  };

  ch.where = (el) => {
    const w = el.getAttribute('data-where');
    if (!w) return null;
    return w.split('&').map((p) => p.split('=').map(decodeURIComponent));
  };
  ch.findRow = (rows, el) => {
    const r = el.getAttribute('data-row');
    if (r != null) return rows[Number(r)];
    const conds = ch.where(el);
    if (!conds) return rows[0];
    return rows.find((row) => conds.every(([k, v]) => String(row[k]) === v));
  };
  // A single figure: data-source + data-field (+ data-where / data-row), formatted by data-fmt.
  ch.value = (el) => {
    const id = el.getAttribute('data-source');
    if (ch.pending(el, [id], 'value')) return;
    const row = ch.findRow(dash.data(id).data, el);
    const f = el.getAttribute('data-fmt'), raw = row ? row[el.getAttribute('data-field')] : null;
    el.textContent = row ? (f === 'text' ? String(raw) : ch.fmt(f, ch.num(raw))) : '—';
  };
  ch.dim = (rows, dim) => rows.filter((r) => r.dimension === dim).sort((a, b) => ch.num(a.order) - ch.num(b.order));

  // ---------- tooltip ----------
  ch.tip = (el) => {
    let t = el.querySelector(':scope > .dv-tip');
    if (!t) { t = document.createElement('div'); t.className = 'dv-tip'; t.style.display = 'none'; el.append(t); }
    return t;
  };
  ch.showTip = (el, t, title, lines, px, py) => {
    t.replaceChildren();
    const h = document.createElement('div'); h.className = 'dv-tip-t'; h.textContent = title; t.append(h);
    lines.forEach(([name, val, color]) => {
      const row = document.createElement('div'); row.className = 'dv-tip-r';
      if (color) { const s = document.createElement('span'); s.className = 'dv-sw'; s.style.background = color; row.append(s); }
      const n = document.createElement('span'); n.textContent = name ? name + ' ' : '';
      const b = document.createElement('b'); b.textContent = val;
      row.append(n, b); t.append(row);
    });
    t.style.display = 'block';
    const W = el.clientWidth, tw = t.offsetWidth, th = t.offsetHeight;
    let x = px + 14; if (x + tw > W) x = Math.max(0, px - tw - 14);
    let y = py - th - 10; if (y < 0) y = py + 14;
    t.style.left = x + 'px'; t.style.top = y + 'px';
  };
  ch.hideTip = (t) => { t.style.display = 'none'; };

  ch.measure = (svg, texts, cls) => {
    const g = svg.append('g');
    let m = 0;
    texts.forEach((s) => { const t = g.append('text').attr('class', cls).text(s); m = Math.max(m, t.node().getComputedTextLength()); });
    g.remove();
    return Math.ceil(m);
  };
  const svgIn = (el, W, H, aria) => {
    const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img');
    if (aria) svg.attr('aria-label', aria);
    return svg;
  };
  ch.accent = () => dash.colors[0];
  ch.muted = 'var(--cds-chart-muted)';
  ch.critical = 'var(--cds-chart-status-critical)';

  // ---------- horizontal bars (supports negatives) ----------
  // o: {label(r), value(r), fmt(v), color(r,i), tip(r) -> [[name, text, color?]], aria, rowH}
  ch.hbar = (el, rows, o) => {
    el.replaceChildren();
    const W = Math.max(el.clientWidth || 0, 240);
    const rowH = o.rowH || 30, bh = Math.min(20, rowH - 10), top = 2;
    const H = top + rows.length * rowH + 2;
    const svg = svgIn(el, W, H, o.aria);
    const vals = rows.map(o.value);
    const lw = ch.measure(svg, rows.map(o.label), 'dv-tick');
    const vw = ch.measure(svg, vals.map(o.fmt), 'dv-lab');
    const min = Math.min(0, d3.min(vals)), max = Math.max(0, d3.max(vals));
    // Narrow widths: put category labels above their bars so the bars keep room.
    const side = (min < 0 ? vw + 8 : 0) + (max > 0 ? vw + 8 : 4);
    const stacked = W - (lw + 12) - side < 90;
    const lo = stacked ? 16 : 0, rH = rowH + lo, H2 = top + rows.length * rH + 2;
    svg.attr('viewBox', `0 0 ${W} ${H2}`);
    const x0 = (stacked ? 0 : lw + 12) + (min < 0 ? vw + 8 : 0);
    const x1 = Math.max(x0 + 24, W - (max > 0 ? vw + 8 : 4));
    const x = d3.scaleLinear([min, max], [x0, x1]);
    const g = svg.selectAll('g.dv-row').data(rows).join('g').attr('class', 'dv-row')
      .attr('transform', (d, i) => `translate(0,${top + i * rH})`);
    if (stacked) g.append('text').attr('class', 'dv-tick').attr('x', 0).attr('y', 12).text(o.label);
    else g.append('text').attr('class', 'dv-tick').attr('x', lw).attr('y', rowH / 2).attr('dy', '0.35em').attr('text-anchor', 'end').text(o.label);
    g.append('rect').attr('class', 'dv-bar').attr('x', (d) => x(Math.min(0, o.value(d)))).attr('y', lo + (rowH - bh) / 2)
      .attr('height', bh).attr('width', (d) => Math.max(1, Math.abs(x(o.value(d)) - x(0)))).attr('rx', 3)
      .style('fill', (d, i) => o.color(d, i));
    g.append('text').attr('class', 'dv-lab').attr('y', lo + rowH / 2).attr('dy', '0.35em')
      .attr('x', (d) => (o.value(d) < 0 ? x(o.value(d)) - 6 : x(o.value(d)) + 6))
      .attr('text-anchor', (d) => (o.value(d) < 0 ? 'end' : 'start')).text((d) => o.fmt(o.value(d)));
    if (min < 0) svg.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', top).attr('y2', H2 - 2).style('stroke', 'var(--cds-chart-axis)');
    const t = ch.tip(el);
    g.append('rect').attr('width', W).attr('height', rH).style('fill', 'transparent')
      .on('pointermove', (ev, d) => {
        const [px, py] = d3.pointer(ev, el);
        g.select('.dv-bar').style('opacity', (r) => (r === d ? 1 : 0.5));
        ch.showTip(el, t, o.label(d), o.tip ? o.tip(d) : [['', o.fmt(o.value(d))]], px, py);
      })
      .on('pointerleave', () => { g.select('.dv-bar').style('opacity', 1); ch.hideTip(t); });
  };

  // ---------- paired bars: two measures per row, each on its own scale ----------
  // o: {label(r), a:{title,value,fmt,color}, b:{...}, tip(r), aria}
  ch.pair = (el, rows, o) => {
    el.replaceChildren();
    const W = Math.max(el.clientWidth || 0, 280);
    const rowH = o.rowH || 28, bh = Math.min(18, rowH - 10), head = 22;
    const H = head + rows.length * rowH + 2;
    const svg = svgIn(el, W, H, o.aria);
    const av = rows.map(o.a.value), bv = rows.map(o.b.value);
    const lw = ch.measure(svg, rows.map(o.label), 'dv-tick');
    const aw = ch.measure(svg, av.map(o.a.fmt), 'dv-lab'), bw = ch.measure(svg, bv.map(o.b.fmt), 'dv-lab');
    const gap = 18, ax0 = lw + 12, pw = (W - ax0 - gap) / 2, bx0 = ax0 + pw + gap;
    const xa = d3.scaleLinear([0, d3.max(av)], [0, Math.max(20, pw - aw - 8)]);
    const xb = d3.scaleLinear([0, d3.max(bv)], [0, Math.max(20, pw - bw - 8)]);
    svg.append('text').attr('class', 'dv-tick dv-head').attr('x', ax0).attr('y', 13).text(o.a.title);
    svg.append('text').attr('class', 'dv-tick dv-head').attr('x', bx0).attr('y', 13).text(o.b.title);
    const g = svg.selectAll('g.dv-row').data(rows).join('g').attr('class', 'dv-row')
      .attr('transform', (d, i) => `translate(0,${head + i * rowH})`);
    g.append('text').attr('class', 'dv-tick').attr('x', lw).attr('y', rowH / 2).attr('dy', '0.35em').attr('text-anchor', 'end').text(o.label);
    [[o.a, xa, ax0], [o.b, xb, bx0]].forEach(([m, sc, x0]) => {
      g.append('rect').attr('class', 'dv-bar').attr('x', x0).attr('y', (rowH - bh) / 2).attr('height', bh)
        .attr('width', (d) => Math.max(1, sc(m.value(d)))).attr('rx', 3).style('fill', (d, i) => m.color(d, i));
      g.append('text').attr('class', 'dv-lab').attr('x', (d) => x0 + sc(m.value(d)) + 6).attr('y', rowH / 2).attr('dy', '0.35em').text((d) => m.fmt(m.value(d)));
    });
    svg.append('line').attr('x1', bx0 - gap / 2).attr('x2', bx0 - gap / 2).attr('y1', head - 4).attr('y2', H).style('stroke', 'var(--cds-chart-grid)');
    const t = ch.tip(el);
    g.append('rect').attr('width', W).attr('height', rowH).style('fill', 'transparent')
      .on('pointermove', (ev, d) => {
        const [px, py] = d3.pointer(ev, el);
        g.selectAll('.dv-bar').style('opacity', (r) => (r === d ? 1 : 0.5));
        ch.showTip(el, t, o.label(d), o.tip(d), px, py);
      })
      .on('pointerleave', () => { g.selectAll('.dv-bar').style('opacity', 1); ch.hideTip(t); });
  };

  // ---------- cumulative curve on 0..1 x 0..1, with a diagonal reference ----------
  // o: {pts:[{x,y,row}], hx (x to highlight), xTitle, yTitle, refLabel, hlText(p), tip(p), aria}
  ch.curve = (el, o) => {
    el.replaceChildren();
    const W = Math.max(el.clientWidth || 0, 260);
    const H = Math.round(Math.min(340, Math.max(230, W * 0.55)));
    const svg = svgIn(el, W, H, o.aria);
    const pct = d3.format('.0%');
    const ml = ch.measure(svg, ['100%'], 'dv-tick') + 10, mr = 14, mt = 22, mb = 40;
    const x = d3.scaleLinear([0, 1], [ml, W - mr]), y = d3.scaleLinear([0, 1], [H - mb, mt]);
    const xt = W < 420 ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1];
    const yt = [0, 0.25, 0.5, 0.75, 1];
    svg.append('g').selectAll('line').data(yt).join('line').attr('x1', ml).attr('x2', W - mr)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d)).style('stroke', 'var(--cds-chart-grid)');
    svg.append('g').selectAll('text').data(yt).join('text').attr('class', 'dv-tick').attr('x', ml - 8).attr('y', (d) => y(d))
      .attr('dy', '0.35em').attr('text-anchor', 'end').text(pct);
    svg.append('g').selectAll('text').data(xt).join('text').attr('class', 'dv-tick').attr('x', (d) => x(d)).attr('y', H - mb + 16)
      .attr('text-anchor', (d) => (d === 0 ? 'start' : d === 1 ? 'end' : 'middle')).text(pct);
    svg.append('line').attr('x1', ml).attr('x2', W - mr).attr('y1', y(0)).attr('y2', y(0)).style('stroke', 'var(--cds-chart-axis)');
    svg.append('text').attr('class', 'dv-tick').attr('x', (ml + W - mr) / 2).attr('y', H - 6).attr('text-anchor', 'middle').text(o.xTitle);
    svg.append('text').attr('class', 'dv-tick').attr('x', ml - 8).attr('y', 10).text(o.yTitle);
    svg.append('line').attr('x1', x(0)).attr('y1', y(0)).attr('x2', x(1)).attr('y2', y(1))
      .style('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '4 4');
    const refT = svg.append('text').attr('class', 'dv-tick').attr('text-anchor', 'end').text(o.refLabel);
    const rx = 0.82; refT.attr('x', x(rx) + 4).attr('y', y(rx) + 18);
    const pts = [{ x: 0, y: 0 }].concat(o.pts);
    const c = ch.accent();
    svg.append('path').datum(pts).attr('d', d3.line((d) => x(d.x), (d) => y(d.y)))
      .style('fill', 'none').style('stroke', c).attr('stroke-width', 2).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round');
    const small = o.pts.length <= 20;
    if (small) svg.append('g').selectAll('circle').data(o.pts).join('circle').attr('cx', (d) => x(d.x)).attr('cy', (d) => y(d.y)).attr('r', 3).style('fill', c);
    const hp = o.pts.find((p) => Math.abs(p.x - o.hx) < 1e-9);
    if (hp) {
      svg.append('line').attr('x1', x(hp.x)).attr('x2', x(hp.x)).attr('y1', y(0)).attr('y2', y(hp.y)).style('stroke', 'var(--cds-chart-reference)');
      svg.append('circle').attr('cx', x(hp.x)).attr('cy', y(hp.y)).attr('r', 5).style('fill', c).style('stroke', 'var(--color-panel)').attr('stroke-width', 2);
      const lab = svg.append('text').attr('class', 'dv-lab dv-strong').text(o.hlText(hp));
      const lwid = lab.node().getComputedTextLength();
      let lx = x(hp.x) + 10; if (lx + lwid > W - mr) lx = Math.max(ml + 4, x(hp.x) - lwid - 10);
      lab.attr('x', lx).attr('y', Math.max(mt + 4, y(hp.y) + 18));
    }
    const t = ch.tip(el);
    const dot = svg.append('circle').attr('r', 4).style('fill', c).style('display', 'none');
    svg.append('rect').attr('x', ml).attr('y', mt).attr('width', W - ml - mr).attr('height', H - mt - mb).style('fill', 'transparent')
      .on('pointermove', (ev) => {
        const [sx] = d3.pointer(ev, svg.node()); // viewBox units
        const xv = x.invert(sx);
        const p = d3.least(o.pts, (q) => Math.abs(q.x - xv));
        dot.attr('cx', x(p.x)).attr('cy', y(p.y)).style('display', null);
        const [px, py] = d3.pointer(ev, el);
        ch.showTip(el, t, o.tipTitle(p), o.tip(p), px, py);
      })
      .on('pointerleave', () => { dot.style('display', 'none'); ch.hideTip(t); });
  };
})();

// ---------- generic drawings shared by both dashboards ----------
(function () {
  const A = (el, k) => el.getAttribute('data-' + k);
  // One figure.
  dash.draw('v', (el) => ch.value(el));
  // Horizontal bars over one dimension of a segments dataset.
  dash.draw('bars', (el) => {
    const id = A(el, 'source');
    if (ch.pending(el, [id], 'chart')) return;
    let rows = ch.dim(dash.data(id).data, A(el, 'dim'));
    const f = A(el, 'measure'), fmt = (v) => ch.fmt(A(el, 'fmt'), v), val = (r) => ch.num(r[f]);
    if (A(el, 'sort') === 'value') rows = rows.slice().sort((a, b) => val(b) - val(a));
    const lim = Number(A(el, 'limit')); if (lim) rows = rows.slice(0, lim);
    const n = { top1: 1, top2: 2, top3: 3 }[A(el, 'accent')] || 0;
    const top = rows.map(val).sort((a, b) => b - a).slice(0, n);
    const ex = A(el, 'extra'), ex2 = A(el, 'extra2');
    ch.hbar(el, rows, {
      label: (r) => r.segment, value: val, fmt,
      color: (r) => (A(el, 'accent') === 'all' || top.includes(val(r)) ? ch.accent() : ch.muted),
      tip: (r) => {
        const l = [[A(el, 'measure-label'), fmt(val(r))]];
        if (ex) l.push([A(el, 'extra-label'), ch.fmt(A(el, 'extra-fmt'), ch.num(r[ex]))]);
        if (ex2) l.push([A(el, 'extra2-label'), ch.fmt(A(el, 'extra2-fmt'), ch.num(r[ex2]))]);
        return l;
      },
      aria: A(el, 'aria'),
    });
  });
  // Two measures per segment, side by side.
  dash.draw('pair', (el) => {
    const id = A(el, 'source');
    if (ch.pending(el, [id], 'chart')) return;
    const rows = ch.dim(dash.data(id).data, A(el, 'dim'));
    const m = (p, color) => ({
      title: A(el, p + '-title'), value: (r) => ch.num(r[A(el, p + '-field')]),
      fmt: (v) => ch.fmt(A(el, p + '-fmt'), v), color: () => color,
    });
    const a = m('a', ch.muted), b = m('b', ch.accent());
    ch.pair(el, rows, {
      label: (r) => r.segment, a, b, aria: A(el, 'aria'),
      tip: (r) => [[a.title, a.fmt(a.value(r)), ch.muted], [b.title, b.fmt(b.value(r)), ch.accent()]],
    });
  });
})();

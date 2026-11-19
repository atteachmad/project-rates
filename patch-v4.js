/* ============================================================================
   PROJECT RATES — PATCH V4 (frontend)   → simpan sebagai patch-v4.js (folder yang sama dengan index.html)
   Isi: menu per role, Pick Up multi-tanggal (pilih tanggal / rentang), gabung project (Ops),
        mode lihat-saja untuk SPV Sales.
   ============================================================================ */
(function () {
  'use strict';
  if (window.__PR_V4__) return;
  if (typeof S === 'undefined' || typeof PAGES === 'undefined' || typeof ACTIONS === 'undefined') { console.warn('patch-v4: aplikasi belum siap'); return; }
  window.__PR_V4__ = true;

  const CSS = `
.v4-seg{display:flex;gap:.25rem;padding:.2rem;border-radius:.9rem;background:rgba(20,24,26,.06)}
.v4-seg button{flex:1 1 0;min-width:0;padding:.5rem .4rem;border-radius:.7rem;font-size:.78rem;font-weight:700;color:rgba(20,24,26,.65);line-height:1.2}
.v4-seg button.on{background:#fff;color:#14181a;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.v4-box{border:1px solid rgba(20,24,26,.12);border-radius:1rem;padding:.8rem;display:grid;gap:.6rem;background:rgba(20,24,26,.02);min-width:0}
.v4-row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:flex-end}
.v4-row>*{min-width:0}
.v4-row .inp{flex:1 1 8rem}
.v4-chips{display:flex;flex-wrap:wrap;gap:.35rem;max-height:9rem;overflow-y:auto}
.v4-chip{display:inline-flex;align-items:center;gap:.3rem;padding:.25rem .55rem;border-radius:999px;background:#e7f1ec;color:#14532d;font-size:.75rem;font-weight:700}
.v4-chip button{font-size:.95rem;line-height:1;opacity:.6}
.v4-sum{font-size:.8rem;font-weight:700;color:#14532d}
.v4-hint{font-size:.72rem;color:rgba(20,24,26,.55);line-height:1.35}
.v4-card{border:1px solid rgba(20,24,26,.12);border-radius:1rem;padding:.85rem;background:#fff;display:grid;gap:.55rem;min-width:0}
.v4-card h3{font-weight:800;font-size:.95rem;overflow-wrap:anywhere}
.v4-top{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center}
.v4-tag{display:inline-block;padding:.12rem .5rem;border-radius:999px;font-size:.68rem;font-weight:800;background:#fef3c7;color:#92400e}
.v4-tag.k{background:#dbeafe;color:#1e40af}
.v4-tag.g{background:#dcfce7;color:#166534}
.v4-t{font-size:.8rem;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.25rem .75rem;padding:.4rem 0;border-top:1px dashed rgba(20,24,26,.12);min-width:0}
.v4-t>span{min-width:0;overflow-wrap:anywhere}
.v4-sg{font-size:.78rem;font-weight:700;color:#166534;background:#f0fdf4;border-radius:.6rem;padding:.4rem .6rem}
.v4-ck{display:flex;gap:.6rem;align-items:flex-start;padding:.55rem;border:1px solid rgba(20,24,26,.12);border-radius:.8rem;font-size:.82rem;min-width:0}
.v4-ck input{margin-top:.15rem;flex:none}
.v4-ck>div{min-width:0;overflow-wrap:anywhere}
.v4-ro [data-act="edit-project"],.v4-ro #fab,.v4-ro [data-act="add-project"],.v4-ro [data-act="new-project"]{display:none!important}
`;
  const st = document.createElement('style'); st.id = 'v4-css'; st.textContent = CSS; document.head.appendChild(st);

  const lv = () => (S.user && S.user.level) || (S.user && S.user.role) || '';
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtD = s => { const d = parse(s); return ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()] + ' ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1); };

  /* ------------------------------------------------------- menu per role */
  const NAV0 = {}; Object.keys(NAV).forEach(k => NAV0[k] = NAV[k].slice());
  function applyLevelNav() {
    if (!S.user) return;
    const l = lv(), find = (arr, k) => arr.find(n => n[0] === k);
    ['Admin', 'Sales', 'Koordinator', 'Driver'].forEach(k => { if (NAV0[k]) { NAV[k].length = 0; NAV0[k].forEach(n => NAV[k].push(n)); } });
    if (l === 'Admin') { const a = NAV.Admin.filter(n => n[0] !== 'users' && n[0] !== 'logs'); NAV.Admin.length = 0; a.forEach(n => NAV.Admin.push(n)); }
    if (l === 'SPV Operasional') {
      const src = NAV0.Admin.concat(NAV0.Koordinator), pick = [['ops', 'Panel Kerja'], ['overview', null], ['fleet', 'Armada'], ['quota', null], ['schedule', null]], out = [];
      pick.forEach(([k, nm]) => { const n = find(src, k); if (n) out.push(nm ? [k, nm].concat(n.slice(2)) : n); });
      NAV.Koordinator.length = 0; out.forEach(n => NAV.Koordinator.push(n)); HOME.Koordinator = 'ops';
    }
    document.body.classList.toggle('v4-ro', /^SPV Sales/.test(l));
  }
  function fixChip() {
    const l = lv(); if (!S.user || l === S.user.role) return;
    const el = [...document.querySelectorAll('header *, #menu *')].find(e => e.children.length === 0 && e.textContent.trim() === S.user.role);
    if (el) el.textContent = l;
  }
  const _rs = window.renderShell; if (typeof _rs === 'function') window.renderShell = function () { applyLevelNav(); const r = _rs.apply(this, arguments); fixChip(); return r; };
  const _sa = window.startApp; if (typeof _sa === 'function') window.startApp = async function () { return _sa.apply(this, arguments); };
  const _rt = window.route; if (typeof _rt === 'function') window.route = function () { applyLevelNav(); return _rt.apply(this, arguments); };

  /* -------------------------------------------- Pick Up multi-tanggal */
  let mode = 'one', dates = [];
  const addDate = d => { if (d && !dates.includes(d)) dates.push(d); dates.sort(); };
  function rangeDates(a, b, step) {
    const out = []; if (!a || !b || a > b) return out;
    const e = parse(b); let c = parse(a), n = 0;
    while (c <= e && n < 400) {
      const dow = c.getDay(), ok = step === 'wk' ? dow !== 0 && dow !== 6 : true;
      if (step === 'w1') { if (n % 7 === 0) out.push(ymd(c)); } else if (step === 'd2') { if (n % 2 === 0) out.push(ymd(c)); } else if (ok) out.push(ymd(c));
      c.setDate(c.getDate() + 1); n++;
    }
    return out;
  }
  function drawSched() {
    const box = document.getElementById('v4-sched'); if (!box) return;
    const f = document.getElementById('f-proj'); if (!f) return;
    const pk = f.elements.pickup;
    const seg = `<div class="v4-seg" role="group">${[['one', 'Satu tanggal'], ['pick', 'Pilih tanggal'], ['range', 'Rentang']].map(([k, l]) => `<button type="button" data-act="v4-mode" data-m="${k}" class="${mode === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    let body = '';
    if (mode === 'pick') body = `<div class="v4-row"><label class="lbl" style="flex:1 1 9rem">Tanggal<input class="inp" type="date" id="v4-d1"></label><button type="button" class="btn-ghost" data-act="v4-add">+ Tambah</button></div>`;
    if (mode === 'range') body = `<div class="v4-row"><label class="lbl" style="flex:1 1 8rem">Dari<input class="inp" type="date" id="v4-from" value="${pk.value.slice(0, 10)}"></label><label class="lbl" style="flex:1 1 8rem">Sampai<input class="inp" type="date" id="v4-to"></label></div>
      <label class="lbl">Pola<select class="inp" id="v4-step"><option value="d1">Setiap hari</option><option value="wk">Hari kerja (Sen–Jum)</option><option value="d2">Selang 1 hari</option><option value="w1">Mingguan (hari yang sama)</option></select></label>`;
    const chips = mode === 'one' ? '' : `<div class="v4-chips">${dates.map(d => `<span class="v4-chip">${esc(fmtD(d))}<button type="button" data-act="v4-del" data-d="${d}" aria-label="Hapus">×</button></span>`).join('')}</div>
      <div class="v4-sum">${dates.length ? dates.length + ' tanggal → ' + dates.length + ' baris project baru di spreadsheet' : 'Belum ada tanggal dipilih'}</div>
      <div class="v4-hint">Jam Pick Up mengikuti isian di atas. Maks 31 tanggal. Setiap tanggal tercatat sebagai baris baru (struktur header tidak berubah). Ketersediaan armada di atas dicek untuk tanggal pertama.</div>`;
    box.innerHTML = `<div class="v4-box"><div class="v4-hint" style="font-weight:700;color:#14181a">Jadwal Pick Up</div>${seg}${body}${chips}</div>`;
    if (dates.length && pk) { pk.value = dates[0] + 'T' + (pk.value.slice(11, 16) || '00:00'); }
    if (mode === 'range') { const sel = document.getElementById('v4-step'); if (sel) sel.value = box.dataset.step || 'd1'; const t = document.getElementById('v4-to'); if (t) t.value = box.dataset.to || ''; }
  }
  function recalcRange() {
    const box = document.getElementById('v4-sched'); if (!box || mode !== 'range') return;
    const a = document.getElementById('v4-from'), b = document.getElementById('v4-to'), s = document.getElementById('v4-step');
    box.dataset.step = s.value; box.dataset.to = b.value; dates = rangeDates(a.value, b.value, s.value).slice(0, 62);
    const chips = box.querySelector('.v4-chips'), sum = box.querySelector('.v4-sum');
    if (chips) chips.innerHTML = dates.map(d => `<span class="v4-chip">${esc(fmtD(d))}<button type="button" data-act="v4-del" data-d="${d}" aria-label="Hapus">×</button></span>`).join('');
    if (sum) sum.textContent = dates.length ? dates.length + ' tanggal → ' + dates.length + ' baris project baru di spreadsheet' + (dates.length > 31 ? ' (maks 31, kurangi rentang)' : '') : 'Belum ada tanggal dipilih';
  }
  document.addEventListener('input', e => { if (['v4-from', 'v4-to', 'v4-step'].includes(e.target.id)) recalcRange(); });
  ACTIONS['v4-mode'] = el => { mode = el.dataset.m; if (mode === 'one') dates = []; drawSched(); if (mode === 'one') { const f = document.getElementById('f-proj'); if (f) f.elements.pickup.dispatchEvent(new Event('input', { bubbles: true })); } };
  ACTIONS['v4-add'] = () => { const i = document.getElementById('v4-d1'); if (i && i.value) { addDate(i.value); drawSched(); } };
  ACTIONS['v4-del'] = el => { dates = dates.filter(d => d !== el.dataset.d); if (mode === 'range') { const b = document.getElementById('v4-sched'); drawSched(); recalcRangeKeep(); } else drawSched(); };
  function recalcRangeKeep() { const sum = document.querySelector('#v4-sched .v4-sum'); if (sum) sum.textContent = dates.length ? dates.length + ' tanggal → ' + dates.length + ' baris project baru di spreadsheet' : 'Belum ada tanggal dipilih'; }

  const _pf = window.projectForm;
  if (typeof _pf === 'function') window.projectForm = function (p) {
    const r = _pf.apply(this, arguments); mode = 'one'; dates = [];
    if (!p) { const f = document.getElementById('f-proj'), lab = f && f.elements.pickup && f.elements.pickup.closest('label'); if (lab && !document.getElementById('v4-sched')) { const d = document.createElement('div'); d.id = 'v4-sched'; d.className = 'sm:col-span-2'; lab.insertAdjacentElement('afterend', d); drawSched(); } }
    return r;
  };
  const _api = window.api;
  if (typeof _api === 'function') window.api = function (action, params) {
    if (action === 'projects.create' && mode !== 'one' && document.getElementById('f-proj')) {
      if (!dates.length) return Promise.reject(Object.assign(new Error('Pilih minimal satu tanggal Pick Up'), { code: 'BAD' }));
      if (dates.length > 31) return Promise.reject(Object.assign(new Error('Maksimal 31 tanggal per input'), { code: 'BAD' }));
      return _api.call(this, 'projects.createMulti', Object.assign({}, params, { dates: dates.slice() })).then(r => { try { toast(r.count + ' project dibuat (' + r.count + ' baris baru)'); } catch (e) { } return r; });
    }
    return _api.apply(this, arguments);
  };

  /* ----------------------------------------------------- gabung project */
  let J = { cands: [], groups: [], map: {} };
  const canJoin = () => S.user && (S.user.role === 'Admin' || S.user.role === 'Koordinator');
  async function joinSection() {
    let d; try { d = await api('join.candidates'); } catch (e) { return ''; }
    J.cands = d.candidates || []; J.groups = d.groups || [];
    const cards = J.cands.map((c, i) => `<article class="v4-card"><div class="v4-top"><span class="v4-tag ${c.type === 'dest' ? 'g' : 'k'}">${c.type === 'dest' ? 'Tujuan sama' : 'Satu koridor'}</span><b style="font-size:.85rem">${esc(fmtD(c.date))}</b></div>
      <h3>${esc(c.label)}</h3>${c.via && c.via.length > 1 ? `<div class="v4-hint">Rute: ${c.via.map(esc).join(' → ')}</div>` : ''}
      ${c.tasks.map(t => `<div class="v4-t"><span><b>${esc(t.project)}</b><br>AE ${esc(t.ae)}</span><span>${esc(t.dest)} · ${esc(t.vehicle)}<br>${esc(t.status)}</span></div>`).join('')}
      ${c.suggest ? `<div class="v4-sg">Saran: upgrade ke ${esc(c.suggest)} (${c.tasks.length} project, 1 armada)</div>` : ''}
      <button type="button" class="btn-primary" data-act="v4-join" data-i="${i}">Gabungkan & tentukan armada</button></article>`).join('');
    const grp = J.groups.filter(g => g.status === 'Aktif').map(g => `<div class="v4-card"><div class="v4-top"><span class="v4-tag g">${esc(g.id)}</span><b style="font-size:.85rem">${esc(fmtD(g.date))}</b></div><h3>${esc(g.far)} · ${esc(g.vehicle)}</h3><div class="v4-hint">${esc(g.petugas)} · ${esc(g.nopol)} · ${esc(g.via)}<br>AE: ${esc(g.aes)}</div><button type="button" class="btn-ghost" data-act="v4-jcancel" data-id="${esc(g.id)}">Batalkan gabungan</button></div>`).join('');
    return `<section><h2 class="h2 mb-3">Peluang gabung (hemat armada)${J.cands.length ? ` <span class="count hot">${J.cands.length}</span>` : ''}</h2>
      <div class="grid md:grid-cols-2 gap-3">${cards || '<div class="md:col-span-2">' + empty('Belum ada project dengan tanggal & tujuan/koridor yang sama') + '</div>'}</div>
      ${grp ? `<h3 class="font-bold mt-4 mb-2" style="font-size:.9rem">Gabungan aktif</h3><div class="grid md:grid-cols-2 gap-3">${grp}</div>` : ''}</section>`;
  }
  const _op = PAGES.ops && PAGES.ops.render;
  if (_op) PAGES.ops.render = async function (view) {
    await _op.apply(this, arguments);
    if (!canJoin()) return;
    const html = await joinSection(); if (!html || !view.isConnected) return;
    const secs = [...view.querySelectorAll('section')], tgt = secs.find(s => /Terjadwal/.test(s.textContent.slice(0, 40)));
    const wrap = document.createElement('div'); wrap.innerHTML = html;
    if (tgt) tgt.parentNode.insertBefore(wrap.firstElementChild, tgt); else view.appendChild(wrap.firstElementChild);
  };
  const refresh = async () => { try { await pollOnce(true); } catch (e) { } route(); };
  ACTIONS['v4-jcancel'] = el => guard(async () => { if (!confirm('Batalkan gabungan ' + el.dataset.id + '? Task tetap terkonfirmasi.')) return; await api('join.cancel', { id: el.dataset.id }); toast('Gabungan dibatalkan'); await refresh(); }, el);
  ACTIONS['v4-join'] = el => guard(async () => {
    const c = J.cands[+el.dataset.i]; if (!c) return;
    const vehicles = (S.boot && S.boot.vehicles || []).map(v => v.name), first = c.tasks[0];
    const a = await api('availability', { date: c.date, vehicle: c.suggest || first.vehicle });
    const units = a.units.slice().sort((x, y) => (x.state === 'Ready' ? 0 : 1) - (y.state === 'Ready' ? 0 : 1) || (y.match - x.match) || x.ritaseMonth - y.ritaseMonth);
    const sug = units.find(u => u.state === 'Ready' && u.match);
    openModal(`<form id="f-join" class="p-5 sm:p-7 space-y-4" novalidate><div class="flex items-start justify-between gap-3"><div><h2 class="text-xl font-extrabold">Gabung project</h2><p class="text-sm" style="opacity:.65">${esc(c.label)} · ${esc(fmtD(c.date))}</p></div><button type="button" class="icon-btn" data-act="close-modal">${ico('x')}</button></div>
      <div class="grid gap-2">${c.tasks.map(t => `<label class="v4-ck"><input type="checkbox" name="ids" value="${esc(t.id)}" checked><div><b>${esc(t.project)}</b><br><span class="v4-hint">AE ${esc(t.ae)} · ${esc(t.dest)} · ${esc(t.vehicle)}</span></div></label>`).join('')}</div>
      <label class="lbl">Armada gabungan (upgrade)<select class="inp" name="vehicle">${vehicles.map(v => `<option ${v === (c.suggest || first.vehicle) ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
      <div class="v4-seg" id="v4-src"><button type="button" class="on" data-s="Internal">Internal</button><button type="button" data-s="Vendor">Vendor</button></div>
      <div id="v4-int" class="grid sm:grid-cols-2 gap-2" style="max-height:34vh;overflow-y:auto">${units.map(u => { const dis = u.state === 'Maintenance'; return `<label class="ucard ${dis ? 'dis' : ''}"><input type="radio" name="petugas" value="${esc(u.name)}" data-nopol="${esc(u.nopol)}" ${dis ? 'disabled' : ''} ${sug && sug.name === u.name ? 'checked' : ''} hidden><div class="font-bold">${esc(u.name)}</div><div class="text-xs" style="opacity:.6">${esc(u.type)} · ${esc(u.nopol)}</div>${chip(u.state, STATE_CLS[u.state])}</label>`; }).join('')}</div>
      <label class="lbl hidden" id="v4-ven">Nama vendor / driver<input class="inp" name="vendor" maxlength="100"></label>
      <div class="grid sm:grid-cols-2 gap-3"><label class="lbl">Nopol<i class="req">*</i><input class="inp uppercase" name="nopol" maxlength="20" value="${esc(sug ? sug.nopol : '')}"></label><label class="lbl">Helper<input class="inp" name="helper" maxlength="100" placeholder="opsional"></label></div>
      <div id="f-err" class="hidden rounded-xl px-4 py-3 text-sm" style="background:#fee2e2;color:#991b1b"></div>
      <div class="flex gap-3"><button type="button" class="btn-ghost" data-act="close-modal">Batal</button><button class="btn-primary grow" type="submit">Gabungkan & kirim ke driver</button></div></form>`, true);
    const f = document.getElementById('f-join'); let src = 'Internal';
    f.addEventListener('click', e => { const b = e.target.closest('#v4-src button'); if (!b) return; src = b.dataset.s; f.querySelectorAll('#v4-src button').forEach(x => x.classList.toggle('on', x === b)); document.getElementById('v4-int').classList.toggle('hidden', src === 'Vendor'); document.getElementById('v4-ven').classList.toggle('hidden', src !== 'Vendor'); });
    f.addEventListener('change', e => { if (e.target.name === 'petugas') f.elements.nopol.value = e.target.dataset.nopol || f.elements.nopol.value; });
    f.addEventListener('submit', ev => { ev.preventDefault(); guard(async () => {
      const err = document.getElementById('f-err'); err.classList.add('hidden');
      const ids = [...f.querySelectorAll('[name=ids]:checked')].map(x => x.value);
      const pe = src === 'Vendor' ? f.elements.vendor.value.trim() : ((f.querySelector('[name=petugas]:checked') || {}).value || '');
      const show = m => { err.textContent = m; err.classList.remove('hidden'); };
      if (ids.length < 2) return show('Pilih minimal 2 project');
      if (!pe) return show(src === 'Vendor' ? 'Isi nama vendor' : 'Pilih driver');
      if (!f.elements.nopol.value.trim()) return show('Nopol wajib diisi');
      try { await api('join.create', { ids, vehicle: f.elements.vehicle.value, source: src, petugas: pe, nopol: f.elements.nopol.value.trim(), helper: f.elements.helper.value }); }
      catch (e) { return show(e.message || 'Gagal menggabungkan'); }
      closeModal(); toast('Project digabung, driver diberi notifikasi'); await refresh();
    }, f.querySelector('[type=submit]')); });
  }, el);

  const _dc = window.dispatchChip;
  if (typeof _dc === 'function') window.dispatchChip = function (t) { const r = _dc.apply(this, arguments); return t && t.jg ? r + `<span class="v4-tag g" title="Gabungan project">${esc(t.jg)}</span>` : r; };

  /* ------------------------------------------------ pemasangan terlambat */
  if (S.user && document.getElementById('view')) { applyLevelNav(); if (typeof renderShell === 'function') { renderShell(); route(); } }
})();

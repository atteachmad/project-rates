/* ============================================================================
   PROJECT RATES — PATCH V3 (frontend)
   Simpan file ini sebagai  patch-v3.js  di folder yang sama dengan index.html (GitHub Pages),
   lalu tambahkan SATU baris di index.html (lihat PATCH_V3.md, langkah F1).
   Isi: mobile tanpa scroll horizontal + bottom nav, filter rentang tanggal,
        grafik tren (hari/minggu/bulan/tahun, per AE / Profit / Revenue),
        visual interaktif (cross-filter ala Power BI), login @jne.co.id cukup OTP,
        pilih AE saat pertama masuk, kode darurat Admin.
   ============================================================================ */
(function () {
  'use strict';
  if (window.__PR_V3__) return;
  if (typeof S === 'undefined' || typeof PAGES === 'undefined' || typeof ACTIONS === 'undefined') { console.warn('patch-v3: aplikasi belum siap'); return; }
  window.__PR_V3__ = true;

  /* ------------------------------------------------------------------ CSS */
  const CSS = `
html,body{max-width:100%;overflow-x:clip}
@supports not (overflow:clip){html,body{overflow-x:hidden}}
#app,.view{min-width:0;max-width:100%}
img,svg,video{max-width:100%}
.banner{width:auto;box-sizing:border-box;max-width:calc(100vw - 1.5rem)}
.banner>div:first-child{min-width:0;flex:1 1 auto}
.banner .truncate{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pcard,.prow,.card{min-width:0}
.pcard h3,.prow h3,.card h3{overflow-wrap:anywhere}
.v3-hide{display:none!important}
.v3-h{display:flex;flex-direction:column;gap:.75rem;margin-bottom:1rem}
.v3-h h1{margin:0}
.v3-sub{font-size:.8rem;color:rgba(20,24,26,.6);margin:.2rem 0 0;line-height:1.35}
.v3-range{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem .625rem;width:100%;max-width:26rem}
.v3-range label{display:flex;flex-direction:column;gap:.2rem;font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(20,24,26,.55);min-width:0}
.v3-range input{-webkit-appearance:none;appearance:none;display:block;width:100%;min-width:0;max-width:100%;box-sizing:border-box;height:2.75rem;border:1.5px solid rgba(20,24,26,.12);border-radius:14px;background:rgba(255,255,255,.9);padding:0 .7rem;font:inherit;font-size:16px;font-weight:600;color:var(--ink);text-align:left}
.v3-range input:focus{outline:none;border-color:var(--forest)}
.v3-links{grid-column:1/-1;display:flex;justify-content:space-between;gap:.5rem}
.v3-links button{background:none;border:0;padding:.1rem 0;font:inherit;font-size:.76rem;font-weight:700;color:var(--forest);cursor:pointer}
.v3-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem;align-items:center}
.v3-fc{display:inline-flex;align-items:center;gap:.4rem;max-width:100%;height:2rem;padding:0 .35rem 0 .75rem;border-radius:999px;background:var(--ink);color:#fff;border:0;font:inherit;font-size:.76rem;font-weight:700;cursor:pointer}
.v3-fc span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.v3-fc i{display:grid;place-items:center;width:1.3rem;height:1.3rem;border-radius:99px;background:rgba(255,255,255,.2);font-style:normal;font-size:.8rem;line-height:1}
.v3-fl{height:2rem;padding:0 .8rem;border-radius:999px;border:1.5px solid rgba(20,24,26,.18);background:none;font:inherit;font-size:.76rem;font-weight:700;cursor:pointer;color:var(--ink)}
.v3-kpis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;margin-bottom:.75rem}
@media(min-width:1024px){.v3-kpis.k4{grid-template-columns:repeat(4,minmax(0,1fr))}}
.v3-tile{display:flex;flex-direction:column;justify-content:space-between;gap:.3rem;min-height:6.75rem;padding:.9rem 1rem;border-radius:18px;background:var(--bg,rgba(255,255,255,.88));color:var(--fg,var(--ink));border:1px solid rgba(20,24,26,.07);text-align:left;font:inherit;min-width:0;overflow:hidden;box-sizing:border-box}
button.v3-tile{cursor:pointer;transition:opacity .15s,transform .15s}
button.v3-tile:active{transform:scale(.98)}
.v3-tile.on{outline:3px solid var(--ink);outline-offset:-2px}
.v3-tile.dim{opacity:.5}
.v3-tl{font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v3-tv{font-size:clamp(1.2rem,5.4vw,1.85rem);font-weight:800;letter-spacing:-.03em;line-height:1.05;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v3-tv small{font-size:.55em;font-weight:700;opacity:.7;margin-right:.15em}
.v3-ts{font-size:.72rem;opacity:.8;overflow-wrap:anywhere;line-height:1.25;font-variant-numeric:tabular-nums}
.v3-card{background:rgba(255,255,255,.84);border:1px solid rgba(20,24,26,.07);border-radius:18px;padding:1rem;min-width:0;box-sizing:border-box}
.v3-ch{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:.8rem;min-width:0}
.v3-ch h2{font-size:1.02rem;font-weight:800;letter-spacing:-.01em;margin:0;min-width:0}
.v3-ch .link{white-space:nowrap}
.v3-selb{height:2.5rem;border-radius:12px;border:1.5px solid rgba(20,24,26,.14);background:#fff;padding:0 .6rem;font:inherit;font-size:16px;font-weight:700;max-width:55%;color:var(--ink)}
.v3-seg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.25rem;background:rgba(20,24,26,.07);border-radius:14px;padding:.25rem;margin-bottom:.6rem}
.v3-seg button{height:2.25rem;border:0;border-radius:10px;background:none;font:inherit;font-weight:700;font-size:.8rem;color:rgba(20,24,26,.7);cursor:pointer;min-width:0;padding:0}
.v3-seg button.on{background:var(--ink);color:#fff}
.v3-aebox{position:relative;margin-bottom:.8rem}
.v3-aebtn{width:100%;height:2.75rem;display:flex;align-items:center;justify-content:space-between;gap:.5rem;border:1.5px solid rgba(20,24,26,.12);border-radius:14px;background:#fff;padding:0 .85rem;font:inherit;font-size:.9rem;font-weight:600;cursor:pointer;color:var(--ink);box-sizing:border-box}
.v3-aebtn span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.v3-pop{position:absolute;z-index:40;left:0;right:0;top:calc(100% + .35rem);background:#fff;border:1px solid rgba(20,24,26,.1);border-radius:16px;box-shadow:0 20px 40px -16px rgba(20,24,26,.45);padding:.6rem}
.v3-pop input{width:100%;box-sizing:border-box;height:2.5rem;border:1.5px solid rgba(20,24,26,.12);border-radius:12px;padding:0 .75rem;font:inherit;font-size:16px;margin-bottom:.4rem}
.v3-pop input:focus{outline:none;border-color:var(--forest)}
.v3-aelist{max-height:14rem;overflow:auto;display:grid;gap:2px}
.v3-opt{display:flex;gap:.6rem;align-items:center;width:100%;min-height:2.5rem;padding:0 .5rem;border:0;background:none;border-radius:10px;font:inherit;font-size:.9rem;text-align:left;cursor:pointer;color:var(--ink)}
.v3-opt:hover,.v3-opt.on{background:rgba(47,93,78,.1)}
.v3-opt span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1}
.v3-ck{flex:none;width:1.1rem;height:1.1rem;border-radius:5px;border:1.5px solid rgba(20,24,26,.3);display:grid;place-items:center;font-style:normal;font-size:.7rem;color:#fff}
.v3-opt.on .v3-ck{background:var(--forest);border-color:var(--forest)}
#v3-chart{position:relative;width:100%;min-width:0}
#v3-chart svg{display:block;touch-action:pan-y;overflow:visible}
.v3-ax{font-size:10px;fill:currentColor;opacity:.6;font-family:inherit}
.v3-tip{position:absolute;top:0;pointer-events:none;background:var(--ink);color:#fff;border-radius:10px;padding:.45rem .65rem;font-size:.74rem;line-height:1.35;white-space:nowrap;z-index:5;display:none;box-shadow:0 10px 24px -8px rgba(0,0,0,.5)}
.v3-tip i{display:inline-block;width:.6rem;height:.6rem;border-radius:3px;margin-right:.35rem}
.v3-lg{display:flex;flex-wrap:wrap;gap:.35rem .9rem;margin-top:.6rem;font-size:.76rem;font-weight:600}
.v3-lg i{display:inline-block;width:.7rem;height:.7rem;border-radius:3px;margin-right:.3rem;vertical-align:-1px}
.v3-empty{padding:2.2rem 1rem;text-align:center;color:rgba(20,24,26,.5);font-weight:600;font-size:.9rem}
.v3-grid2{display:grid;grid-template-columns:minmax(0,1fr);gap:.75rem;margin-bottom:.75rem}
@media(min-width:768px){.v3-grid2{grid-template-columns:repeat(2,minmax(0,1fr))}}
.v3-bar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.2rem .6rem;width:100%;padding:.45rem .4rem;border:0;background:none;border-radius:10px;font:inherit;text-align:left;cursor:pointer;color:var(--ink);box-sizing:border-box}
.v3-bar:hover{background:rgba(20,24,26,.04)}
.v3-bar.on{background:rgba(47,93,78,.12)}
.v3-bar.dim{opacity:.4}
.v3-bl{font-size:.84rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.v3-bv{font-size:.8rem;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}
.v3-bt{grid-column:1/-1;display:block;height:.5rem;border-radius:99px;background:rgba(20,24,26,.08);overflow:hidden}
.v3-bt b{display:block;height:100%;border-radius:99px;min-width:2px}
.v3-rows{display:grid;gap:0}
.v3-rw{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr) 2.4rem;gap:.5rem;align-items:center;padding:.65rem .4rem;border:0;border-bottom:1px solid rgba(20,24,26,.08);background:none;font:inherit;font-size:.82rem;text-align:left;width:100%;color:var(--ink);box-sizing:border-box}
button.v3-rw{cursor:pointer}
button.v3-rw:hover{background:rgba(20,24,26,.03)}
button.v3-rw.on{background:rgba(47,93,78,.12)}
button.v3-rw.dim{opacity:.4}
.v3-rw.hd{font-size:.64rem;text-transform:uppercase;letter-spacing:.06em;color:rgba(20,24,26,.55);font-weight:700;padding-top:0}
.v3-rw>*{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v3-rw>:nth-child(n+2){text-align:right;font-variant-numeric:tabular-nums}
.v3-rw>:first-child{font-weight:700}
.v3-pcs{display:grid;grid-template-columns:minmax(0,1fr);gap:.75rem}
@media(min-width:640px){.v3-pcs{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1024px){.v3-pcs{grid-template-columns:repeat(3,minmax(0,1fr))}}
.v3-pc{background:var(--bg,#fff);color:var(--fg,var(--ink));border-radius:18px;padding:.9rem 1rem;display:grid;gap:.3rem;min-width:0;cursor:pointer;box-sizing:border-box}
.v3-pc-top{display:flex;align-items:center;justify-content:space-between;gap:.5rem;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;opacity:.85}
.v3-pc h3{font-weight:800;font-size:1rem;line-height:1.3;margin:0;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v3-pc-ae{font-size:.76rem;opacity:.8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v3-pc-bot{display:flex;align-items:flex-end;justify-content:space-between;gap:.5rem;margin-top:.35rem}
.v3-pc-meta{font-size:.74rem;opacity:.85;min-width:0;display:grid;gap:.1rem}
.v3-pc-meta span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v3-pc-bot b{font-size:1.1rem;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}
.v3-pc .chip{background:rgba(255,255,255,.88);color:var(--ink)}
.v3-sec{margin:1rem 0 .6rem}
.v3-bnav{display:none}
.v3-otp-help{font-size:.8rem;color:rgba(20,24,26,.65);display:grid;gap:.6rem;line-height:1.4}
.v3-aelist2{max-height:40vh;overflow:auto;display:grid;gap:2px}
@media(max-width:767px){
  input,select,textarea{font-size:16px!important}
  .nav-pills{display:none!important}
  .topbar{flex-wrap:nowrap!important;padding:.55rem .75rem!important}
  .topbar>.flex:last-child{margin-left:auto}
  .view{padding:1rem .875rem calc(5.9rem + env(safe-area-inset-bottom))!important}
  .fab{display:none!important}
  .topbar>.flex:last-child .btn-primary{display:inline-flex!important;height:2.5rem;padding:0 .9rem;font-size:.85rem}
  .board{grid-auto-flow:row!important;grid-auto-columns:auto!important;grid-template-columns:minmax(0,1fr)!important;overflow:visible!important;scroll-snap-type:none!important}
  .master{position:static!important;max-height:14rem}
  .view .grid>*{min-width:0}
  .view .flex.overflow-x-auto{flex-wrap:wrap}
  .tbl,.tbl tbody{display:block}
  .tbl thead{display:none}
  .tbl tbody{padding:.6rem;display:grid;gap:.6rem}
  .tbl tr{display:grid;gap:.3rem;background:#fff;border:1px solid rgba(20,24,26,.08);border-radius:14px;padding:.7rem .85rem}
  .tbl td{display:flex;justify-content:space-between;align-items:baseline;gap:.75rem;padding:0!important;border:0!important;min-width:0;overflow-wrap:anywhere;text-align:right;white-space:normal!important}
  .tbl td::before{content:attr(data-l);font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:rgba(20,24,26,.5);flex:none;text-align:left;font-weight:700}
  .tbl td[data-l=""]::before{display:none}
  .overflow-x-auto{overflow-x:visible!important}
  .v3-bnav{position:fixed;left:0;right:0;bottom:0;z-index:45;display:flex;background:rgba(255,253,248,.97);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid rgba(20,24,26,.1);padding:.3rem .25rem calc(.3rem + env(safe-area-inset-bottom))}
  .v3-bn{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:.25rem 0;border:0;background:none;color:rgba(20,24,26,.6);font:inherit;font-size:.66rem;font-weight:700;text-decoration:none;position:relative;cursor:pointer}
  .v3-bn i{display:grid;place-items:center;width:3.1rem;height:1.75rem;border-radius:999px}
  .v3-bn.on{color:var(--ink)}
  .v3-bn.on i{background:var(--sun)}
  .v3-bn span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .v3-nb{position:absolute;top:0;left:55%;background:var(--ember);color:#fff;border-radius:999px;font-size:.62rem;padding:0 .35rem;font-weight:800}
}
.v3-more{position:fixed;inset:0;z-index:50;background:rgba(20,24,26,.4);display:flex;align-items:flex-end}
.v3-more>div{width:100%;box-sizing:border-box;background:var(--paper);border-radius:22px 22px 0 0;padding:1rem 1rem calc(5.6rem + env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}
.v3-ml{display:flex;align-items:center;gap:.6rem;height:3rem;padding:0 .9rem;border-radius:14px;background:#fff;border:1px solid rgba(20,24,26,.08);font-weight:700;font-size:.9rem;text-decoration:none;color:var(--ink);min-width:0}
.v3-ml.on{background:var(--ink);color:#fff}
`;
  const st = document.createElement('style'); st.id = 'v3-css'; st.textContent = CSS; document.head.appendChild(st);

  /* ------------------------------------------------------------ util kecil */
  Object.assign(ICONS, {
    menu: 'M4 6h16M4 12h16M4 18h16',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    coins: 'M12 8c-4 0-7-1-7-2.5S8 3 12 3s7 1 7 2.5S16 8 12 8zM5 5.5v5C5 12 8 13 12 13s7-1 7-2.5v-5M5 10.5v5C5 17 8 18 12 18s7-1 7-2.5v-5',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
  });
  const NAVICON = { overview: 'grid', pipeline: 'nav', projects: 'list', finance: 'coins', ops: 'truck', fleet: 'truck', quota: 'truck', schedule: 'cal', users: 'user', logs: 'shield', faq: 'info', tugas: 'truck' };
  const PRIMARY = { Admin: ['overview', 'pipeline', 'finance', 'ops'], Sales: ['overview', 'pipeline', 'projects', 'schedule'], Koordinator: ['ops', 'quota', 'schedule'] };
  const nid = n => (+n || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 });
  const mshort = n => { n = +n || 0; const a = Math.abs(n); return a >= 1e9 ? (n / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' M' : a >= 1e6 ? nid(n / 1e6) + ' jt' : a >= 1e3 ? nid(n / 1e3) + ' rb' : String(Math.round(n)); };
  const lowc = s => String(s || '').toLowerCase();
  const UT = { p: s => { const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN; }, f: ms => new Date(ms).toISOString().slice(0, 10) };
  const DAY = 864e5, p2 = n => String(n).padStart(2, '0');
  const wkStart = d => { const t = UT.p(d), dow = (new Date(t).getUTCDay() + 6) % 7; return UT.f(t - dow * DAY); };
  const bKey = (d, g) => g === 'day' ? d : g === 'week' ? wkStart(d) : g === 'month' ? d.slice(0, 7) : d.slice(0, 4);
  const bNext = (k, g) => g === 'day' ? UT.f(UT.p(k) + DAY) : g === 'week' ? UT.f(UT.p(k) + 7 * DAY) : g === 'month' ? (+k.slice(5) === 12 ? (+k.slice(0, 4) + 1) + '-01' : k.slice(0, 5) + p2(+k.slice(5) + 1)) : String(+k + 1);
  const bShort = (k, g) => g === 'year' ? k : g === 'month' ? BULAN[+k.slice(5) - 1] + " '" + k.slice(2, 4) : (+k.slice(8)) + ' ' + BULAN[+k.slice(5, 7) - 1];
  const bFull = (k, g) => g === 'year' ? k : g === 'month' ? BULAN[+k.slice(5) - 1] + ' ' + k.slice(0, 4) : g === 'week' ? 'Minggu ' + fmtD(k) + ' – ' + fmtD(UT.f(UT.p(k) + 6 * DAY)) : dayName(k) + ', ' + fmtD(k);
  const GRANS = [['day', 'Hari'], ['week', 'Minggu'], ['month', 'Bulan'], ['year', 'Tahun']];
  const COARSER = { day: 'week', week: 'month', month: 'year', year: 'year' };
  const PAL = ['#2f5d4e', '#d9482b', '#c98a00', '#3b6ea8', '#7a4e9c'];
  const MET = { rv: { l: 'Revenue', adm: 1, money: 1 }, pf: { l: 'Profit', adm: 1, money: 1 }, rt: { l: 'Rates', money: 1 }, cnt: { l: 'Jumlah proyek' } };

  /* ------------------------------------------------ filter rentang tanggal */
  (function initRange() {
    let r = null; try { r = JSON.parse(store.get('pr_range') || 'null'); } catch (e) { }
    if (r && (r.from === '' || /^\d{4}-\d{2}-\d{2}$/.test(r.from)) && (r.to === '' || /^\d{4}-\d{2}-\d{2}$/.test(r.to))) S.range = { from: r.from, to: r.to };
    else { const [a, b] = monthRange(0); S.range = { from: a, to: b }; }
  })();
  const saveRange = () => store.set('pr_range', JSON.stringify(S.range));
  window.periodRange = () => [S.range.from || '', S.range.to || ''];
  window.periodBar = function () {
    return `<div class="v3-range" role="group" aria-label="Rentang tanggal Pick Up">
      <label>Dari tanggal<input type="date" data-v3="from" value="${esc(S.range.from)}" max="${esc(S.range.to)}"></label>
      <label>Sampai tanggal<input type="date" data-v3="to" value="${esc(S.range.to)}" min="${esc(S.range.from)}"></label>
      <div class="v3-links"><button type="button" data-act="v3-range-reset">Bulan ini</button><button type="button" data-act="v3-range-all">Semua tanggal</button></div></div>`;
  };
  const setRange = (a, b) => { if (a && b && a > b) { const t = a; a = b; b = t; } S.range = { from: a || '', to: b || '' }; saveRange(); V.rows = null; route(); };
  ACTIONS['v3-range-reset'] = () => { const [a, b] = monthRange(0); setRange(a, b); };
  ACTIONS['v3-range-all'] = () => setRange('', '');
  document.addEventListener('change', e => {
    const t = e.target, k = t.dataset && t.dataset.v3; if (!k) return;
    if (k === 'from') setRange(t.value, S.range.to);
    else if (k === 'to') setRange(S.range.from, t.value);
    else if (k === 'metric') { V.metric[V.mode] = t.value; V.X.bk = null; paint(); }
  });

  /* ------------------------------------------------------ state dashboard */
  const newX = () => ({ ae: [], st: [], vh: [], ds: [], bk: null });
  const V = { rows: null, key: '', mode: '', lastMode: '', gran: '', metric: { overview: '', finance: 'rvpf' }, X: newX(), aeOpen: false, aeQ: '', view: null, T: null, ro: null, trunc: false };
  const FIELD = { ae: 'ae', st: 'st', vh: 'vh', ds: 'ds' };
  const isAdm = () => S.user && S.user.role === 'Admin';
  const base = () => V.mode === 'finance' ? V.rows.filter(r => lowc(r.st) === 'closed won') : V.rows;
  const curMetric = () => { let m = V.metric[V.mode] || (isAdm() ? 'rv' : 'rt'); if (!isAdm() && MET[m].adm) m = 'rt'; if (m === 'rvpf' && !isAdm()) m = 'rt'; return m; };
  const mval = (r, m) => m === 'rv' ? r.rv : m === 'pf' ? r.pf : m === 'rt' ? r.rt : 1;
  const barMetric = () => { const m = curMetric(); return m === 'rvpf' ? 'rv' : m; };
  function pass(r, skip) {
    const X = V.X;
    if (skip !== 'ae' && X.ae.length && !X.ae.includes(r.ae)) return false;
    if (skip !== 'st' && V.mode !== 'finance' && X.st.length && !X.st.includes(r.st)) return false;
    if (skip !== 'vh' && X.vh.length && !X.vh.includes(r.vh)) return false;
    if (skip !== 'ds' && X.ds.length && !X.ds.includes(r.ds)) return false;
    if (skip !== 'bk' && X.bk && bKey(r.d, X.bk.g) !== X.bk.k) return false;
    return true;
  }
  const anyFilter = () => { const X = V.X; return X.ae.length || X.st.length || X.vh.length || X.ds.length || X.bk; };

  async function renderDash(view, mode, refresh) {
    V.mode = mode; V.view = view;
    if (V.lastMode !== mode) { V.X = newX(); V.gran = ''; V.aeOpen = false; V.aeQ = ''; V.lastMode = mode; }
    const key = S.range.from + '|' + S.range.to;
    if (!V.rows || V.key !== key || refresh) {
      let d;
      try { d = await api('analytics.data', { from: S.range.from, to: S.range.to }); }
      catch (e) { if (e.code === 'NOAE') { view.innerHTML = '<div class="v3-card v3-empty">Akun Anda belum dipetakan ke nama AE.</div>'; ensureAe(); return; } throw e; }
      V.rows = d.rows.map(a => ({ id: a[0], d: a[1], ae: a[2], st: a[3], nm: a[4], ds: a[5], vh: a[6], rt: +a[7] || 0, rv: +a[8] || 0, pf: +a[9] || 0 }));
      V.trunc = !!d.truncated; V.key = key;
    }
    paint();
  }
  PAGES.overview = { render: (view, refresh) => renderDash(view, 'overview', refresh) };
  PAGES.finance = { render: (view, refresh) => renderDash(view, 'finance', refresh) };

  /* ---------------------------------------------------------- bagian HTML */
  const stColor = s => { const l = lowc(s); return l === 'prospect' ? 'var(--sun)' : l === 'closed won' ? 'var(--forest)' : l === 'closed lost' ? 'var(--ember)' : '#b9b2a0'; };
  const stNone = s => s || '(tanpa stage)';
  function group(dim, valFn) {
    const m = new Map(), f = FIELD[dim];
    base().forEach(r => { if (!pass(r, dim)) return; const k = r[f] || ''; const o = m.get(k) || { k, v: 0, c: 0 }; o.v += valFn(r); o.c++; m.set(k, o); });
    return [...m.values()].sort((a, b) => b.v - a.v || b.c - a.c);
  }
  const fmtMet = (v, m) => MET[m].money ? 'Rp ' + mshort(v) : nf(v);
  function barsHTML(title, dim, top) {
    const m = barMetric(), items = group(dim, r => mval(r, m)), sel = V.X[dim];
    let show = items.slice(0, top); sel.forEach(k => { if (!show.some(x => x.k === k)) { const it = items.find(x => x.k === k); if (it) show.push(it); } });
    const mx = Math.max(1, ...show.map(x => x.v));
    const body = show.length ? show.map(x => {
      const on = sel.includes(x.k), dim_ = sel.length && !on, lbl = dim === 'st' ? stNone(x.k) : (x.k || '-');
      const col = dim === 'st' ? stColor(x.k) : 'var(--forest)';
      return `<button type="button" class="v3-bar${on ? ' on' : ''}${dim_ ? ' dim' : ''}" data-act="v3-tog" data-d="${dim}" data-k="${esc(x.k)}" title="${esc(lbl)}: ${esc(MET[m].money ? rp(x.v) : nf(x.v))} · ${x.c} proyek"><span class="v3-bl">${esc(lbl)}</span><span class="v3-bv">${esc(fmtMet(x.v, m))}</span><i class="v3-bt"><b style="width:${Math.max(0, x.v / mx * 100)}%;background:${col}"></b></i></button>`;
    }).join('') : '<div class="v3-empty">Tidak ada data</div>';
    return `<section class="v3-card"><div class="v3-ch"><h2>${esc(title)}</h2><span class="v3-ts" style="opacity:.55">${esc(MET[m].l)}</span></div>${body}</section>`;
  }
  function tile(label, big, sub, o = {}) {
    const inner = `<span class="v3-tl">${esc(label)}</span><span class="v3-tv" title="${esc(o.title || '')}">${big}</span><span class="v3-ts">${sub}</span>`;
    const cls = `v3-tile ${o.cls || ''}${o.on ? ' on' : ''}${o.dim ? ' dim' : ''}`;
    return o.k != null ? `<button type="button" class="${cls}" data-act="v3-tog" data-d="st" data-k="${esc(o.k)}">${inner}</button>` : `<div class="${cls}">${inner}</div>`;
  }
  const moneyBig = n => `<small>Rp</small>${esc(mshort(n))}`;
  function kpiHTML() {
    const adm = isAdm(), fin = V.mode === 'finance', all = base().filter(r => pass(r));
    const sum = (rs, k) => rs.reduce((a, r) => a + r[k], 0);
    if (fin) {
      const rv = sum(all, 'rv'), pf = sum(all, 'pf');
      return `<div class="v3-kpis k4">${tile('Proyek Won', nf(all.length), 'Closed Won')}${tile('Margin', rv ? nid(pf / rv * 100) + '%' : '-', 'Profit ÷ Revenue')}${tile('Revenue', moneyBig(rv), esc(rp(rv)), { title: rp(rv) })}${tile('Profit', moneyBig(pf), esc(rp(pf)), { title: rp(pf) })}</div>`;
    }
    const stages = (S.boot && S.boot.staging) || ['Prospect', 'Closed Won', 'Closed Lost'], X = V.X;
    const forSt = V.rows.filter(r => pass(r, 'st'));
    const byS = s => forSt.filter(r => lowc(r.st) === lowc(s));
    const sc = ['st-prospect', 'st-won', 'st-lost'], pick = n => stages.find(s => lowc(s) === n) || n;
    const P = byS(pick('prospect')), W = byS(pick('closed won')), L = byS(pick('closed lost'));
    const dm = s => X.st.length && !X.st.includes(s);
    const wr = W.length + L.length ? Math.round(W.length / (W.length + L.length) * 100) : 0;
    let h = `<div class="v3-kpis k4">${tile('Total proyek', nf(all.length), X.st.length ? 'sesuai filter' : 'pada rentang ini')}
      ${tile('Prospect', nf(P.length), esc(rp(sum(P, 'rt'))), { cls: sc[0], k: pick('prospect'), on: X.st.includes(pick('prospect')), dim: dm(pick('prospect')) })}
      ${tile('Closed Won', nf(W.length), esc(rp(sum(W, 'rt'))), { cls: sc[1], k: pick('closed won'), on: X.st.includes(pick('closed won')), dim: dm(pick('closed won')) })}
      ${tile('Closed Lost', nf(L.length), 'Win rate ' + wr + '%', { cls: sc[2], k: pick('closed lost'), on: X.st.includes(pick('closed lost')), dim: dm(pick('closed lost')) })}</div>`;
    if (adm) { const rv = sum(all, 'rv'), pf = sum(all, 'pf'); h += `<div class="v3-kpis">${tile('Revenue (Won)', moneyBig(rv), esc(rp(rv)), { title: rp(rv) })}${tile('Profit (Won)', moneyBig(pf), esc(rp(pf)), { title: rp(pf) })}</div>`; }
    return h;
  }
  function chipsHTML() {
    if (!anyFilter()) return '';
    const X = V.X, c = [];
    ['ae', 'st', 'vh', 'ds'].forEach(d => X[d].forEach(k => c.push(`<button type="button" class="v3-fc" data-act="v3-rm" data-d="${d}" data-k="${esc(k)}"><span>${esc({ ae: 'AE', st: 'Stage', vh: 'Armada', ds: 'Tujuan' }[d])}: ${esc(d === 'st' ? stNone(k) : k)}</span><i>×</i></button>`)));
    if (X.bk) c.push(`<button type="button" class="v3-fc" data-act="v3-rm" data-d="bk"><span>Periode: ${esc(bShort(X.bk.k, X.bk.g))}</span><i>×</i></button>`);
    return `<div class="v3-chips">${c.join('')}<button type="button" class="v3-fl" data-act="v3-reset">Reset filter</button></div>`;
  }
  function aeButtonHTML() {
    const n = V.X.ae.length, lbl = n === 0 ? 'Semua AE (ketik untuk mencari)' : n === 1 ? V.X.ae[0] : n + ' AE dipilih';
    return `<div class="v3-aebox"><button type="button" class="v3-aebtn" data-act="v3-ae-open" aria-expanded="${V.aeOpen}"><span>${ico('search', 'w-4 h-4 inline -mt-0.5')} ${esc(lbl)}</span><span>▾</span></button>${V.aeOpen ? `<div class="v3-pop"><input id="v3-aeq" data-v3="aeq" placeholder="Cari nama AE…" value="${esc(V.aeQ)}" autocomplete="off"><div class="v3-aelist" id="v3-aelist">${aeListHTML()}</div>${n ? '<button type="button" class="v3-fl" style="margin-top:.5rem;width:100%" data-act="v3-ae-clear">Hapus pilihan AE</button>' : ''}</div>` : ''}</div>`;
  }
  function aeListHTML() {
    const q = lowc(V.aeQ), names = [...new Set(V.rows.map(r => r.ae).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const l = names.filter(n => !q || lowc(n).includes(q)).slice(0, 80);
    return l.length ? l.map(n => { const on = V.X.ae.includes(n); return `<button type="button" class="v3-opt${on ? ' on' : ''}" data-act="v3-tog" data-d="ae" data-k="${esc(n)}" data-keep="1"><i class="v3-ck">${on ? '✓' : ''}</i><span>${esc(n)}</span></button>`; }).join('') : '<div class="v3-empty" style="padding:1rem">Tidak ditemukan</div>';
  }
  function trendCardHTML() {
    const adm = isAdm(), fin = V.mode === 'finance', m = curMetric();
    const opts = (adm ? (fin ? [['rvpf', 'Revenue + Profit']] : []).concat([['rv', 'Revenue'], ['pf', 'Profit'], ['rt', 'Rates'], ['cnt', 'Jumlah proyek']]) : [['rt', 'Rates'], ['cnt', 'Jumlah proyek']]);
    const g = V.gEff || V.gran || 'month';
    return `<section class="v3-card" style="margin-bottom:.75rem"><div class="v3-ch"><h2>Tren</h2><select class="v3-selb" data-v3="metric" aria-label="Metrik">${opts.map(([k, l]) => `<option value="${k}"${k === m ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="v3-seg" role="group" aria-label="Skala waktu">${GRANS.map(([k, l]) => `<button type="button" data-act="v3-gran" data-v="${k}" class="${g === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      ${adm ? aeButtonHTML() : ''}
      <div id="v3-chart"></div><div class="v3-lg" id="v3-lg"></div></section>`;
  }
  function recentHTML() {
    const rs = V.rows.filter(r => pass(r)).sort((a, b) => b.d.localeCompare(a.d)).slice(0, 6);
    return `<div class="v3-ch v3-sec"><h2 class="h2">Proyek terbaru</h2><a class="link" href="#/projects">Lihat semua →</a></div><div class="v3-pcs">${rs.length ? rs.map(r => `<article class="v3-pc ${stCls(r.st)}" data-act="open-project" data-id="${esc(r.id)}" tabindex="0" role="button"><div class="v3-pc-top"><span>${esc(fmtD(r.d))}</span>${dispatchChip(taskOf(r.id))}</div><h3>${esc(r.nm)}</h3><div class="v3-pc-ae">${esc(r.ae)}</div><div class="v3-pc-bot"><div class="v3-pc-meta"><span>${ico('pin', 'w-3.5 h-3.5 inline -mt-0.5')} ${esc(r.ds || '-')}</span><span>${ico('truck', 'w-3.5 h-3.5 inline -mt-0.5')} ${esc(r.vh || '-')}</span></div><b title="${esc(rp(r.rt))}">${r.rt ? 'Rp ' + esc(mshort(r.rt)) : '-'}</b></div></article>`).join('') : '<div class="v3-card v3-empty" style="grid-column:1/-1">Belum ada proyek pada rentang ini</div>'}</div>`;
  }
  function tasksHTML() {
    const ts = S.tasks.filter(t => !V.X.ae.length || V.X.ae.includes(t.ae)).slice(0, 5);
    return `<div class="v3-ch v3-sec"><h2 class="h2">Status penugasan</h2>${isAdm() ? '<a class="link" href="#/ops">Panel ops →</a>' : ''}</div><div style="display:grid;gap:.5rem">${ts.length ? ts.map(taskMini).join('') : '<div class="v3-card v3-empty">Belum ada penugasan</div>'}</div>`;
  }
  function aeTableHTML() {
    const g = {}, sel = V.X.ae;
    base().forEach(r => { if (!pass(r, 'ae')) return; const o = g[r.ae] = g[r.ae] || { ae: r.ae, c: 0, rv: 0, pf: 0 }; o.c++; o.rv += r.rv; o.pf += r.pf; });
    const l = Object.values(g).sort((a, b) => b.rv - a.rv);
    V.aeRows = l;
    return `<section class="v3-card"><div class="v3-ch"><h2>Revenue & Profit per Sales</h2><button type="button" class="btn-ghost" style="padding:.45rem .9rem" data-act="v3-csv">CSV</button></div><div class="v3-rows"><div class="v3-rw hd"><span>AE</span><span>Revenue</span><span>Profit</span><span>Proy.</span></div>${l.length ? l.map(a => `<button type="button" class="v3-rw${sel.includes(a.ae) ? ' on' : ''}${sel.length && !sel.includes(a.ae) ? ' dim' : ''}" data-act="v3-tog" data-d="ae" data-k="${esc(a.ae)}" title="${esc(a.ae)}: ${esc(rp(a.rv))} / ${esc(rp(a.pf))}"><span>${esc(a.ae)}</span><span>${esc(mshort(a.rv))}</span><span>${esc(mshort(a.pf))}</span><span>${nf(a.c)}</span></button>`).join('') : '<div class="v3-empty">Tidak ada data</div>'}</div></section>`;
  }
  function dashHTML() {
    const fin = V.mode === 'finance', adm = isAdm();
    const head = fin ? `<div><h1 class="h1">Revenue & Profit</h1><p class="v3-sub">Hanya proyek <b>Closed Won</b>, berdasarkan tanggal Pick Up. Revenue = kolom PRICE (sebelum PPN).</p></div>` : `<div><p class="v3-sub" style="margin:0">Halo, ${esc(S.user.name.split(' ')[0])}</p><h1 class="h1">${adm ? 'Sales Overview' : 'Overview Saya'}</h1></div>`;
    const stageBars = fin ? '' : barsHTML('Per stage', 'st', 5);
    const aeBars = adm ? barsHTML('Per AE', 'ae', 8) : '';
    let h = `<div class="v3-h">${head}${periodBar()}</div>${V.trunc ? '<div class="v3-card" style="margin-bottom:.75rem;font-size:.8rem">Data dibatasi 8.000 baris pertama. Persempit rentang tanggal untuk hasil lengkap.</div>' : ''}${chipsHTML()}${kpiHTML()}${trendCardHTML()}`;
    h += `<div class="v3-grid2">${aeBars}${stageBars}${barsHTML('Per jenis armada', 'vh', 6)}${barsHTML('Per kota tujuan', 'ds', 6)}</div>`;
    if (fin) h += adm ? aeTableHTML() : ''; else h += recentHTML() + tasksHTML();
    return h;
  }
  function paint() {
    const view = V.view; if (!view || !view.isConnected || !V.rows) return;
    const y = window.scrollY, T = trendData(); view.innerHTML = dashHTML(); drawTrend(T);
    if (V.aeOpen) { const i = $('#v3-aeq'); if (i && !V.noFocus) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
    V.noFocus = false; window.scrollTo(0, y);
  }

  /* ------------------------------------------------------- grafik tren SVG */
  function span() {
    const rs = base(), ds = rs.map(r => r.d).sort();
    let a = S.range.from || ds[0] || todayStr(), b = S.range.to || ds[ds.length - 1] || todayStr();
    if (a > b) { const t = a; a = b; b = t; } return [a, b];
  }
  function autoGran(a, b) { const d = (UT.p(b) - UT.p(a)) / DAY; return d <= 45 ? 'day' : d <= 190 ? 'week' : d <= 1100 ? 'month' : 'year'; }
  function buckets(a, b, g) { const out = []; let c = bKey(a, g); const last = bKey(b, g); for (let i = 0; i < 1500 && c <= last; i++) { out.push(c); c = bNext(c, g); } return out; }
  function trendData() {
    const [a, b] = span(); let g = V.gran || autoGran(a, b), keys = buckets(a, b, g);
    while (keys.length > 366 && g !== 'year') { g = COARSER[g]; keys = buckets(a, b, g); }
    V.gEff = g; const m = curMetric(); let defs;
    if (m === 'rvpf') defs = [{ name: 'Revenue', color: 'var(--c-rev)', f: r => r.rv }, { name: 'Profit', color: 'var(--c-prof)', f: r => r.pf }];
    else if (V.X.ae.length >= 1 && V.X.ae.length <= 5) defs = V.X.ae.map((n, i) => ({ name: n, color: PAL[i], f: r => r.ae === n ? mval(r, m) : 0 }));
    else defs = [{ name: V.X.ae.length ? V.X.ae.length + ' AE terpilih' : MET[m].l, color: 'var(--c-rev)', f: r => mval(r, m) }];
    const idx = {}; keys.forEach((k, i) => idx[k] = i); defs.forEach(d => d.vals = keys.map(() => 0));
    base().forEach(r => { if (!pass(r, 'bk')) return; const i = idx[bKey(r.d, g)]; if (i == null) return; defs.forEach(d => d.vals[i] += d.f(r)); });
    return { g, keys, series: defs, money: m === 'rvpf' || MET[m].money, metricName: m === 'rvpf' ? 'Revenue & Profit' : MET[m].l };
  }
  const niceMax = (v, cnt) => { if (v <= 0) return cnt ? 4 : 1; const p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p; const n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 4 ? 4 : f <= 8 ? 8 : 10; let r = n * p; if (cnt && r < 4) r = 4; return r; };
  function drawTrend(pre) {
    const box = $('#v3-chart'); if (!box) return;
    if (V.ro) { V.ro.disconnect(); V.ro = null; }
    const T = V.T = pre || trendData(), n = T.keys.length, lg = $('#v3-lg');
    const W = Math.max(240, Math.floor(box.clientWidth) || 320), H = 232, L = 46, R = 12, TP = 14, B = 28, iw = W - L - R, ih = H - TP - B;
    const all = T.series.flatMap(s => s.vals), mxv = Math.max(0, ...all);
    if (!n || mxv <= 0) { box.innerHTML = '<div class="v3-empty">Tidak ada data pada rentang & filter ini</div>'; if (lg) lg.innerHTML = ''; return; }
    const mx = niceMax(mxv, !T.money), X = i => L + (n < 2 ? iw / 2 : i * iw / (n - 1)), Y = v => TP + ih - (v / mx) * ih;
    const fmtY = v => T.money ? mshort(v) : nf(v);
    let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik tren ${esc(T.metricName)}">`;
    for (let i = 0; i <= 4; i++) { const v = mx * i / 4, y = Math.round(Y(v)) + .5; svg += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="currentColor" stroke-opacity="${i ? .1 : .35}" shape-rendering="crispEdges"/><text class="v3-ax" x="${L - 6}" y="${y + 3.5}" text-anchor="end">${esc(fmtY(v))}</text>`; }
    const maxLab = Math.max(2, Math.floor(iw / 56)), step = Math.max(1, Math.ceil(n / maxLab));
    for (let i = 0; i < n; i += step) { const x = Math.round(X(i)) + .5; svg += `<line x1="${x}" x2="${x}" y1="${TP + ih}" y2="${TP + ih + 4}" stroke="currentColor" stroke-opacity=".35" shape-rendering="crispEdges"/><text class="v3-ax" x="${x}" y="${H - 8}" text-anchor="${i === 0 && n > 2 ? 'start' : (i + step >= n && n > 2 ? 'end' : 'middle')}">${esc(bShort(T.keys[i], T.g))}</text>`; }
    const sIdx = V.X.bk && V.X.bk.g === T.g ? T.keys.indexOf(V.X.bk.k) : -1;
    if (sIdx >= 0) { const bw = n < 2 ? iw : iw / (n - 1); svg += `<rect x="${Math.max(L, X(sIdx) - bw / 2)}" y="${TP}" width="${Math.min(bw, iw)}" height="${ih}" fill="currentColor" fill-opacity=".08"/>`; }
    T.series.forEach((s, si) => {
      const pts = s.vals.map((v, i) => [X(i), Y(v)]);
      if (T.series.length === 1 && n > 1) svg += `<path d="M${pts[0][0]},${TP + ih} ${pts.map(p => 'L' + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')} L${pts[n - 1][0]},${TP + ih}Z" style="fill:${s.color};fill-opacity:.1"/>`;
      svg += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="none" style="stroke:${s.color}" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round"/>`;
      if (n <= 40) pts.forEach((p, i) => { svg += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === sIdx ? 5 : 3}" style="fill:${s.color}" stroke="#fff" stroke-width="1.5"/>`; });
    });
    svg += `<line class="v3-guide" y1="${TP}" y2="${TP + ih}" stroke="currentColor" stroke-opacity=".4" shape-rendering="crispEdges" style="display:none"/><rect class="v3-hit" x="${L}" y="0" width="${iw}" height="${H}" fill="transparent" style="cursor:pointer"/></svg><div class="v3-tip"></div>`;
    box.innerHTML = svg;
    if (lg) lg.innerHTML = T.series.length > 1 || V.X.ae.length ? T.series.map(s => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('') : '';
    const sv = box.querySelector('svg'), tip = box.querySelector('.v3-tip'), gd = sv.querySelector('.v3-guide'), hit = sv.querySelector('.v3-hit');
    const at = ev => { const r = sv.getBoundingClientRect(), x = (ev.clientX - r.left) * (W / r.width); return n < 2 ? 0 : Math.max(0, Math.min(n - 1, Math.round((x - L) / iw * (n - 1)))); };
    const show = i => {
      const x = Math.round(X(i)) + .5; gd.setAttribute('x1', x); gd.setAttribute('x2', x); gd.style.display = '';
      tip.innerHTML = `<b>${esc(bFull(T.keys[i], T.g))}</b>` + T.series.map(s => `<div><i style="background:${s.color}"></i>${esc(s.name)}: <b>${esc(T.money ? rp(s.vals[i]) : nf(s.vals[i]))}</b></div>`).join('');
      tip.style.display = 'block'; const tw = tip.offsetWidth; tip.style.left = Math.max(0, Math.min(W - tw, x - tw / 2)) + 'px';
    };
    hit.addEventListener('pointermove', e => show(at(e))); hit.addEventListener('pointerdown', e => show(at(e)));
    hit.addEventListener('pointerleave', () => { tip.style.display = 'none'; gd.style.display = 'none'; });
    hit.addEventListener('click', e => { const k = T.keys[at(e)]; V.X.bk = V.X.bk && V.X.bk.k === k && V.X.bk.g === T.g ? null : { g: T.g, k }; paint(); });
    if (window.ResizeObserver) { let w0 = box.clientWidth; V.ro = new ResizeObserver(() => { if (Math.abs(box.clientWidth - w0) > 2) { w0 = box.clientWidth; drawTrend(); } }); V.ro.observe(box); }
  }

  /* ------------------------------------------------------------- aksi visual */
  ACTIONS['v3-tog'] = el => {
    const d = el.dataset.d, k = el.dataset.k, a = V.X[d], i = a.indexOf(k);
    if (i >= 0) a.splice(i, 1); else a.push(k);
    V.noFocus = !el.dataset.keep; paint();
  };
  ACTIONS['v3-rm'] = el => { const d = el.dataset.d; if (d === 'bk') V.X.bk = null; else V.X[d] = V.X[d].filter(x => x !== el.dataset.k); paint(); };
  ACTIONS['v3-reset'] = () => { V.X = newX(); paint(); };
  ACTIONS['v3-gran'] = el => { V.gran = el.dataset.v; V.X.bk = null; paint(); };
  ACTIONS['v3-ae-open'] = () => { V.aeOpen = !V.aeOpen; paint(); };
  ACTIONS['v3-ae-clear'] = () => { V.X.ae = []; paint(); };
  ACTIONS['v3-csv'] = () => {
    const rows = [['AE', 'Proyek', 'Revenue', 'Profit'], ...(V.aeRows || []).map(a => [a.ae, a.c, Math.round(a.rv), Math.round(a.pf)])];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = `revenue-profit-${S.range.from || 'awal'}_${S.range.to || 'akhir'}.csv`; a.click(); URL.revokeObjectURL(a.href);
  };
  document.addEventListener('input', e => {
    const t = e.target; if (!t.dataset || t.dataset.v3 !== 'aeq') return;
    V.aeQ = t.value; const l = $('#v3-aelist'); if (l) l.innerHTML = aeListHTML();
  });
  document.addEventListener('click', e => { if (V.aeOpen && !e.target.closest('.v3-aebox')) { V.aeOpen = false; V.noFocus = true; paint(); } });

  /* ------------------------------------------------- bottom nav (mobile) */
  function mountNav() {
    const old = $('#v3-bnav'); if (old) old.remove();
    if (!S.user || !NAV[S.user.role]) return;
    const role = S.user.role, all = NAV[role]; if (all.length < 2) return;
    const prim = PRIMARY[role] || all.map(n => n[0]), main = all.filter(n => prim.includes(n[0])), rest = all.filter(n => !prim.includes(n[0]));
    const el = document.createElement('nav'); el.id = 'v3-bnav'; el.className = 'v3-bnav'; el.setAttribute('aria-label', 'Menu bawah');
    el.innerHTML = main.map(([k, l]) => `<a href="#/${k}" data-nav="${k}" class="v3-bn"><i>${ico(NAVICON[k] || 'box', 'w-5 h-5')}</i><span>${esc(l)}</span>${k === 'ops' ? '<b id="v3-nb-ops" class="v3-nb hidden">0</b>' : ''}</a>`).join('') + (rest.length ? `<button type="button" class="v3-bn" data-act="v3-more"><i>${ico('menu', 'w-5 h-5')}</i><span>Menu</span></button>` : '');
    document.body.appendChild(el);
    window.__v3rest = rest;
    route && S.page && $$('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === S.page));
  }
  ACTIONS['v3-more'] = () => {
    const ex = $('#v3-more'); if (ex) { ex.remove(); return; }
    const m = document.createElement('div'); m.id = 'v3-more'; m.className = 'v3-more';
    m.innerHTML = `<div>${(window.__v3rest || []).map(([k, l]) => `<a class="v3-ml${S.page === k ? ' on' : ''}" href="#/${k}">${ico(NAVICON[k] || 'box', 'w-5 h-5')}<span>${esc(l)}</span></a>`).join('')}</div>`;
    m.addEventListener('click', () => m.remove()); document.body.appendChild(m);
  };
  window.addEventListener('hashchange', () => { const m = $('#v3-more'); if (m) m.remove(); });
  setInterval(() => { const a = $('#nav-badge-ops'), b = $('#v3-nb-ops'); if (a && b) { b.textContent = a.textContent; b.classList.toggle('hidden', a.classList.contains('hidden')); } }, 1500);
  const _rs = window.renderShell; if (typeof _rs === 'function') window.renderShell = function () { const r = _rs.apply(this, arguments); mountNav(); return r; };

  /* -------------------------------------- pilih AE (akun Sales @jne.co.id baru) */
  async function ensureAe() {
    if (!S.user || S.user.role !== 'Sales' || S.user.aeName || $('#v3-aemodal')) return;
    let names = []; try { names = (await api('profile.aeList')).names || []; } catch (e) { }
    V.aeNames = names;
    openModal(`<div id="v3-aemodal" class="p-6 space-y-4"><h2 class="h2">Pilih nama AE Anda</h2><p class="text-sm" style="opacity:.65">Akun baru. Pilih nama AE sesuai kolom AE NAME di Sheet1 supaya proyek Anda tampil. Setelah dipilih, nama terkunci (Admin dapat mengubahnya di menu Pengguna).</p>
      <input class="inp" id="v3-aq" placeholder="Cari nama AE…" autocomplete="off"><div class="v3-aelist2" id="v3-al"></div>
      <button type="button" class="btn-ghost w-full" data-act="v3-ae-new">Saya AE baru — pakai nama saya</button></div>`);
    const draw = () => { const q = lowc($('#v3-aq').value); $('#v3-al').innerHTML = (names.filter(n => !q || lowc(n).includes(q)).slice(0, 60).map(n => `<button type="button" class="v3-opt" data-act="v3-ae-pick" data-name="${esc(n)}"><span>${esc(n)}</span></button>`).join('')) || '<div class="v3-empty" style="padding:1rem">Tidak ditemukan</div>'; };
    $('#v3-aq').addEventListener('input', draw); draw();
  }
  const saveAe = (name, btn) => guard(async () => { const r = await api('profile.setAe', { aeName: name }); S.user = r.user; S.boot = await api('bootstrap'); closeModal(); toast('Nama AE tersimpan'); V.rows = null; route(); }, btn);
  ACTIONS['v3-ae-pick'] = el => saveAe(el.dataset.name, el);
  ACTIONS['v3-ae-new'] = el => saveAe(String(S.user.name || S.user.email.split('@')[0]).toUpperCase(), el);
  const _sa = window.startApp; if (typeof _sa === 'function') window.startApp = async function () { const r = await _sa.apply(this, arguments); setTimeout(ensureAe, 500); return r; };

  /* ---------------------------------------------------- login @jne.co.id */
  function tuneLogin() {
    const inp = $('#in-email'), fe = $('#f-email'); if (!inp || !fe || inp.dataset.v3) return; inp.dataset.v3 = '1';
    const p = fe.parentElement.querySelector('p'); if (p) p.innerHTML = 'Gunakan email <b>@jne.co.id</b>: cukup masukkan email lalu kode OTP, <b>tanpa pengajuan akses</b>. Email @gmail.com perlu didaftarkan Admin.';
    const acc = $('[data-act="req-access"]'), box = acc && acc.parentElement;
    const sync = () => { if (box) box.classList.toggle('v3-hide', /@jne\.co\.id\s*$/i.test(inp.value)); };
    inp.addEventListener('input', sync); sync();
    const fc = $('#f-code'); if (fc && !$('#v3-resend')) fc.insertAdjacentHTML('beforeend', `<div class="v3-otp-help"><span>Belum masuk setelah 2 menit? Cek folder <b>Spam / Karantina</b> email kantor, lalu kirim ulang. Masih gagal: minta Admin membuat <b>kode darurat</b> (menu Pengguna).</span><button type="button" id="v3-resend" class="btn-ghost w-full" data-act="v3-resend">Kirim ulang kode</button></div>`);
  }
  const _sl = window.showLogin; if (typeof _sl === 'function') window.showLogin = function () { const r = _sl.apply(this, arguments); tuneLogin(); return r; };
  ACTIONS['v3-resend'] = el => { const email = ($('#in-email').value || '').trim().toLowerCase(); guard(async () => { await api('requestOtp', { email }); toast('Kode baru dikirim. Cek email Anda.'); el.disabled = true; let s = 60; const t = setInterval(() => { s--; el.textContent = s > 0 ? `Kirim ulang (${s} dtk)` : 'Kirim ulang kode'; if (s <= 0) { el.disabled = false; clearInterval(t); } }, 1000); }); };

  /* --------------------- dekorasi: label tabel mobile + tombol kode darurat */
  ACTIONS['v3-otp'] = el => guard(async () => {
    const r = await api('users.otp', { email: el.dataset.email });
    openModal(`<div class="p-6 space-y-4 text-center"><h2 class="h2">Kode darurat</h2><p class="text-sm" style="opacity:.65">Berikan kode ini ke <b>${esc(r.email)}</b> (WhatsApp/telepon). Berlaku ${r.minutes} menit, sekali pakai. Pengguna masukkan email di halaman login lalu isi kode ini (tanpa menekan kirim ulang).</p><div class="plate lg" style="letter-spacing:.3em">${esc(r.code)}</div><button class="btn-primary w-full" data-act="close-modal">Selesai</button></div>`);
  }, el);
  function decorate() {
    $$('table.tbl').forEach(t => {
      const h = [...t.querySelectorAll('thead th')].map(x => x.textContent.trim());
      t.querySelectorAll('tbody tr').forEach(tr => { if (tr.dataset.v3) return; tr.dataset.v3 = '1'; [...tr.children].forEach((td, i) => td.setAttribute('data-l', h[i] || '')); });
    });
    if (S.page === 'users' && isAdm()) $$('#view table.tbl tbody tr').forEach(tr => {
      if (tr.querySelector('.v3-otpbtn') || tr.children.length < 6) return;
      const email = tr.children[1].textContent.trim(), act = tr.children[tr.children.length - 1];
      if (/@/.test(email) && /YA/.test(tr.children[4].textContent)) act.insertAdjacentHTML('afterbegin', `<button type="button" class="chip chip-amber v3-otpbtn" style="margin-right:.35rem" data-act="v3-otp" data-email="${esc(email)}">Kode darurat</button>`);
    });
    tuneLogin();
  }
  new MutationObserver(debounce(decorate, 60)).observe(document.body, { childList: true, subtree: true });

  /* ---------------------------------- pemasangan terlambat (jika sudah login) */
  tuneLogin();
  if (S.user && $('#view')) { mountNav(); route(); setTimeout(ensureAe, 500); }
})();

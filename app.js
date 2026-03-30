// ══════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════
let jobs  = JSON.parse(localStorage.getItem('cv_jobs')  || '[]');
let stock = JSON.parse(localStorage.getItem('cv_stock') || '[]');
let inspections = JSON.parse(localStorage.getItem('cv_inspections') || '[]');
let editingJobId = null;
let editingStockId = null;

function save() {
  localStorage.setItem('cv_jobs',  JSON.stringify(jobs));
  localStorage.setItem('cv_stock', JSON.stringify(stock));
  localStorage.setItem('cv_inspections', JSON.stringify(inspections));
}

const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-public-anon-key';
let supabaseClient = null;

if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase script not loaded or invalid; persistence functions will be disabled.');
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

async function loadSupabase() {
  if (!supabaseClient) { toast('Supabase not initialized', 'var(--red)'); return; }
  try {
    const [{ data: jobsData, error: jobsError }, { data: stockData, error: stockError }, { data: inspectData, error: inspectError }] = await Promise.all([
      supabaseClient.from('jobs').select('*'),
      supabaseClient.from('stock').select('*'),
      supabaseClient.from('inspections').select('*')
    ]);

    if (jobsError || stockError || inspectError) {
      throw new Error((jobsError||stockError||inspectError).message);
    }

    jobs = jobsData.map(j => ({ ...j, created: j.created || Date.now() }));
    stock = stockData;
    inspections = inspectData;

    save();
    renderJobs(); renderStock(); renderInspect(); renderDashboard();
    toast('Loaded from Supabase ✓');
  } catch (err) {
    toast('Supabase load error: ' + err.message, 'var(--red)');
    console.error(err);
  }
}

async function syncSupabase() {
  if (!supabaseClient) { toast('Supabase not initialized', 'var(--red)'); return; }
  try {
    await supabaseClient.from('jobs').upsert(jobs);
    await supabaseClient.from('stock').upsert(stock);
    await supabaseClient.from('inspections').upsert(inspections);

    toast('Synced to Supabase ✓');
  } catch (err) {
    toast('Supabase sync error: ' + err.message, 'var(--red)');
    console.error(err);
  }
}

// ══════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.textContent.toLowerCase().includes(id === 'dashboard' ? 'dash' : id.slice(0,4))) b.classList.add('active');
  });
  if (id === 'dashboard') renderDashboard();
  if (id === 'jobs') renderJobs();
  if (id === 'upcoming') renderUpcoming();
  if (id === 'stock') renderStock();
  if (id === 'inspect') renderInspect();

  if (window.innerWidth <= 900) {
    document.querySelector('.nav')?.classList.remove('open');
  }
}

function toggleNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  nav.classList.toggle('open');
}

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════
function statusBadge(s) {
  const map = { quoted:'badge-quoted', booked:'badge-booked', 'in-progress':'badge-progress', done:'badge-done' };
  const label = { quoted:'Quoted', booked:'Booked', 'in-progress':'In Progress', done:'Done' };
  return `<span class="badge ${map[s]||''}">${label[s]||s}</span>`;
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function daysUntil(d) {
  if (!d) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const dt = new Date(d + 'T00:00:00');
  return Math.round((dt - today) / 86400000);
}

function toast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color || 'var(--green)';
  t.style.color = '#000';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ══════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════
function renderDashboard() {
  document.getElementById('dash-date').textContent = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const active   = jobs.filter(j => j.status !== 'done').length;
  const thisWeek = jobs.filter(j => { const d = daysUntil(j.date); return d !== null && d >= 0 && d <= 7; }).length;
  const lowItems = stock.filter(s => s.qty <= s.min).length;
  const booked   = jobs.filter(j => j.status === 'booked').length;
  const inspectCount = inspections.length;

  document.getElementById('kpi-row').innerHTML = `
    <div class="kpi blue"><div class="kpi-label">Active Jobs</div><div class="kpi-value">${active}</div><div class="kpi-sub">not yet complete</div></div>
    <div class="kpi gold"><div class="kpi-label">This Week</div><div class="kpi-value">${thisWeek}</div><div class="kpi-sub">scheduled jobs</div></div>
    <div class="kpi green"><div class="kpi-label">Booked</div><div class="kpi-value">${booked}</div><div class="kpi-sub">confirmed work</div></div>
    <div class="kpi ${lowItems>0?'red':'green'}"><div class="kpi-label">Low Stock</div><div class="kpi-value">${lowItems}</div><div class="kpi-sub">items below minimum</div></div>
    <div class="kpi blue"><div class="kpi-label">Inspect List</div><div class="kpi-value">${inspectCount}</div><div class="kpi-sub">pending visits</div></div>
    <div class="kpi blue"><div class="kpi-label">Total Stock Items</div><div class="kpi-value">${stock.length}</div><div class="kpi-sub">tracked</div></div>
  `;

  const upcoming = jobs
    .filter(j => { const d = daysUntil(j.date); return d !== null && d >= 0 && d <= 7 && j.status !== 'done'; })
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(0,5);
  document.getElementById('dash-upcoming').innerHTML = upcoming.length
    ? upcoming.map(j => `<div class="mini-job" onclick="showPage('jobs')"><span class="mini-job-name">${j.name}</span>${statusBadge(j.status)}<span class="mini-job-date">${fmtDate(j.date)}</span></div>`).join('')
    : '<div class="empty"><div class="empty-icon">✅</div><strong>All clear</strong><p>No jobs this week.</p></div>';

  const low = stock.filter(s => s.qty <= s.min).slice(0,5);
  document.getElementById('dash-stock').innerHTML = low.length
    ? low.map(s => `<div class="mini-job" onclick="showPage('stock')"><span class="mini-job-name">${s.name}</span><span class="badge badge-done">${s.qty} ${s.unit||'units'}</span></div>`).join('')
    : '<div class="empty"><div class="empty-icon">📦</div><strong>Stock OK</strong><p>All items above minimum.</p></div>';

  const recent = [...jobs].sort((a,b) => (b.created||0)-(a.created||0)).slice(0,5);
  document.getElementById('dash-jobs').innerHTML = recent.length
    ? `<div class="tbl-wrap"><table><thead><tr><th>Customer</th><th>Ref</th><th>Date</th><th>Status</th></tr></thead><tbody>
        ${recent.map(j => `<tr onclick="showPage('jobs')" style="cursor:pointer"><td>${j.name}</td><td><span class="mono">${j.ref||'—'}</span></td><td><span class="mono">${fmtDate(j.date)}</span></td><td>${statusBadge(j.status)}</td></tr>`).join('')}
       </tbody></table></div>`
    : '<div class="empty"><div class="empty-icon">🪟</div><strong>No jobs yet</strong></div>';
}

// ══════════════════════════════════════════
//  JOBS
// ══════════════════════════════════════════
function renderJobs() {
  const q = (document.getElementById('job-search')?.value||'').toLowerCase();
  const f = document.getElementById('job-filter')?.value||'';
  let filtered = jobs.filter(j => {
    const match = !q || j.name.toLowerCase().includes(q) || (j.ref||'').toLowerCase().includes(q);
    const stat  = !f || j.status === f;
    return match && stat;
  }).sort((a,b) => (b.created||0)-(a.created||0));

  const tbody = document.getElementById('jobs-tbody');
  const empty = document.getElementById('jobs-empty');

  if (!filtered.length) { tbody.innerHTML=''; empty.style.display=''; return; }
  empty.style.display='none';

  tbody.innerHTML = filtered.map(j => `
    <tr>
      <td><span class="mono">${j.ref||'—'}</span></td>
      <td><strong>${j.name}</strong>${j.address ? `<br><span style="font-size:11px;color:var(--muted)">${j.address}</span>`:''}</td>
      <td>${j.phone ? `<span class="mono" style="font-size:12px">${j.phone}</span>`:''} ${j.email ? `<br><span style="font-size:11px;color:var(--muted)">${j.email}</span>`:''}${!j.phone&&!j.email?'—':''}</td>
      <td><span class="mono">${fmtDate(j.date)}</span></td>
      <td style="max-width:180px;font-size:12px">${j.products||'—'}</td>
      <td>${statusBadge(j.status)}</td>
      <td style="max-width:160px;font-size:12px;color:var(--muted)">${j.notes||''}</td>
      <td><div class="action-row">
        <button class="btn btn-ghost btn-sm" onclick="editJob('${j.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteJob('${j.id}')">✕</button>
      </div></td>
    </tr>
  `).join('');
}

function openJobModal(id) {
  editingJobId = id || null;
  const m = document.getElementById('job-overlay');
  document.getElementById('job-modal-title').textContent = id ? 'Edit Job' : 'New Job';
  if (id) {
    const j = jobs.find(x => x.id === id);
    if (!j) return;
    document.getElementById('j-name').value    = j.name||'';
    document.getElementById('j-ref').value     = j.ref||'';
    document.getElementById('j-phone').value   = j.phone||'';
    document.getElementById('j-email').value   = j.email||'';
    document.getElementById('j-date').value    = j.date||'';
    document.getElementById('j-status').value  = j.status||'quoted';
    document.getElementById('j-address').value = j.address||'';
    document.getElementById('j-products').value= j.products||'';
    document.getElementById('j-notes').value   = j.notes||'';
  } else {
    ['j-name','j-ref','j-phone','j-email','j-date','j-address','j-products','j-notes'].forEach(id => document.getElementById(id).value='');
    document.getElementById('j-status').value='quoted';
  }
  m.classList.add('open');
}

function editJob(id) { openJobModal(id); }

function closeJobModal(e) {
  if (e && e.target !== document.getElementById('job-overlay')) return;
  document.getElementById('job-overlay').classList.remove('open');
}

function saveJob() {
  const name = document.getElementById('j-name').value.trim();
  if (!name) { toast('Customer name is required.', 'var(--red)'); return; }
  if (editingJobId) {
    const j = jobs.find(x => x.id === editingJobId);
    Object.assign(j, getJobForm());
    toast('Job updated ✓');
  } else {
    jobs.unshift({ id: uid(), created: Date.now(), ...getJobForm() });
    toast('Job added ✓');
  }
  save(); document.getElementById('job-overlay').classList.remove('open'); renderJobs(); renderDashboard();
}

function getJobForm() {
  return {
    name:     document.getElementById('j-name').value.trim(),
    ref:      document.getElementById('j-ref').value.trim(),
    phone:    document.getElementById('j-phone').value.trim(),
    email:    document.getElementById('j-email').value.trim(),
    date:     document.getElementById('j-date').value,
    status:   document.getElementById('j-status').value,
    address:  document.getElementById('j-address').value.trim(),
    products: document.getElementById('j-products').value.trim(),
    notes:    document.getElementById('j-notes').value.trim(),
  };
}

function deleteJob(id) {
  if (!confirm('Delete this job?')) return;
  jobs = jobs.filter(j => j.id !== id);
  save(); renderJobs(); renderDashboard();
  toast('Job deleted', 'var(--muted)');
}

// ══════════════════════════════════════════
//  UPCOMING
// ══════════════════════════════════════════
function renderUpcoming() {
  const today = new Date(); today.setHours(0,0,0,0);
  const sorted = jobs
    .filter(j => j.date && j.status !== 'done')
    .sort((a,b) => a.date.localeCompare(b.date));

  const list  = document.getElementById('upcoming-list');
  const empty = document.getElementById('upcoming-empty');

  if (!sorted.length) { list.innerHTML=''; empty.style.display=''; return; }
  empty.style.display='none';

  list.innerHTML = sorted.map(j => {
    const d = daysUntil(j.date);
    let dclass, dlabel;
    if (d < 0)      { dclass='overdue'; dlabel=`${Math.abs(d)}d overdue`; }
    else if (d===0) { dclass='today';   dlabel='Today'; }
    else if (d<=3)  { dclass='soon';    dlabel=`In ${d}d`; }
    else            { dclass='future';  dlabel=`In ${d}d`; }

    return `<div class="tl-item" onclick="editJob('${j.id}')">
      <div class="tl-date">${fmtDate(j.date)}</div>
      <div class="tl-content">
        <div class="tl-name">${j.name} ${j.ref ? `<span class="mono" style="font-size:11px;color:var(--muted)">· ${j.ref}</span>`:''}</div>
        <div class="tl-detail">${j.address||''} ${j.products ? '· '+j.products.slice(0,60)+(j.products.length>60?'…':''):''}</div>
      </div>
      ${statusBadge(j.status)}
      <div class="tl-days ${dclass}">${dlabel}</div>
    </div>`;
  }).join('');
}

function addInspectItem() {
  const text = (document.getElementById('inspect-input').value || '').trim();
  if (!text) { toast('Inspection note is required.', 'var(--red)'); return; }
  inspections.unshift({ id: uid(), text, created: Date.now(), done: false });
  document.getElementById('inspect-input').value = '';
  save(); renderInspect(); toast('Inspect item added ✓');
}

function deleteInspect(id) {
  inspections = inspections.filter(i => i.id !== id);
  save(); renderInspect(); toast('Inspect item removed', 'var(--muted)');
}

function toggleInspectDone(id) {
  const item = inspections.find(i => i.id === id);
  if (!item) return;
  item.done = !item.done;
  save(); renderInspect();
}

function renderInspect() {
  const q = (document.getElementById('inspect-search')?.value || '').toLowerCase();
  const list = document.getElementById('inspect-list');
  const empty = document.getElementById('inspect-empty');

  let filtered = inspections;
  if (q) filtered = filtered.filter(i => i.text.toLowerCase().includes(q));

  if (!filtered.length) { list.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';

  list.innerHTML = filtered.map(i => `
    <div class="mini-job" style="justify-content: space-between;">
      <div style="display:flex;align-items:center;gap:10px;flex:1;">
        <input type="checkbox" ${i.done ? 'checked' : ''} onclick="toggleInspectDone('${i.id}')"> 
        <span style="text-decoration:${i.done ? 'line-through' : 'none'};">${i.text}</span>
      </div>
      <div class="action-row">
        <button class="btn btn-danger btn-sm" onclick="deleteInspect('${i.id}')">✕</button>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════
//  STOCK
// ══════════════════════════════════════════
function renderStock() {
  const q = (document.getElementById('stock-search')?.value||'').toLowerCase();
  const c = document.getElementById('stock-cat')?.value||'';
  let filtered = stock.filter(s => {
    const match = !q || s.name.toLowerCase().includes(q) || (s.sku||'').toLowerCase().includes(q);
    const cat   = !c || s.category === c;
    return match && cat;
  });

  const tbody = document.getElementById('stock-tbody');
  const empty = document.getElementById('stock-empty');

  if (!filtered.length) { tbody.innerHTML=''; empty.style.display=''; return; }
  empty.style.display='none';

  tbody.innerHTML = filtered.map(s => {
    const low = s.qty <= s.min;
    const pct = s.min > 0 ? Math.min(100, Math.round((s.qty/Math.max(s.min*2,s.qty))*100)) : 100;
    const barColor = low ? 'var(--red)' : (pct < 60 ? 'var(--amber)' : 'var(--green)');
    return `<tr>
      <td><strong>${s.name}</strong><div class="stock-bar"><div class="stock-fill" style="width:${pct}%;background:${barColor}"></div></div></td>
      <td><span class="chip">${s.category}</span></td>
      <td><span class="mono">${s.sku||'—'}</span></td>
      <td><span class="${low?'low-stock':'ok-stock'}" style="font-weight:600">${s.qty}</span></td>
      <td><span class="mono">${s.min}</span></td>
      <td>${s.unit||'—'}</td>
      <td style="font-size:12px;color:var(--muted)">${s.supplier||'—'}</td>
      <td><div class="action-row">
        <button class="btn btn-ghost btn-sm" onclick="adjustStock('${s.id}')">±</button>
        <button class="btn btn-ghost btn-sm" onclick="editStock('${s.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStock('${s.id}')">✕</button>
      </div></td>
    </tr>`;
  }).join('');
}

function adjustStock(id) {
  const s = stock.find(x => x.id === id);
  if (!s) return;
  const v = prompt(`Adjust quantity for "${s.name}" (current: ${s.qty})\nEnter new quantity:`);
  if (v === null) return;
  const n = parseInt(v);
  if (isNaN(n) || n < 0) { toast('Invalid quantity', 'var(--red)'); return; }
  s.qty = n; save(); renderStock(); renderDashboard();
  toast(`Stock updated: ${n} ${s.unit||'units'}`);
}

function openStockModal(id) {
  editingStockId = id || null;
  document.getElementById('stock-modal-title').textContent = id ? 'Edit Stock Item' : 'Add Stock Item';
  if (id) {
    const s = stock.find(x => x.id === id);
    if (!s) return;
    document.getElementById('s-name').value     = s.name||'';
    document.getElementById('s-cat').value      = s.category||'Window Unit';
    document.getElementById('s-sku').value      = s.sku||'';
    document.getElementById('s-qty').value      = s.qty??0;
    document.getElementById('s-min').value      = s.min??2;
    document.getElementById('s-unit').value     = s.unit||'';
    document.getElementById('s-supplier').value = s.supplier||'';
  } else {
    ['s-name','s-sku','s-unit','s-supplier'].forEach(id => document.getElementById(id).value='');
    document.getElementById('s-qty').value = 0;
    document.getElementById('s-min').value = 2;
    document.getElementById('s-cat').value = 'Window Unit';
  }
  document.getElementById('stock-overlay').classList.add('open');
}

function editStock(id) { openStockModal(id); }

function closeStockModal(e) {
  if (e && e.target !== document.getElementById('stock-overlay')) return;
  document.getElementById('stock-overlay').classList.remove('open');
}

function saveStock() {
  const name = document.getElementById('s-name').value.trim();
  if (!name) { toast('Item name is required.', 'var(--red)'); return; }
  if (editingStockId) {
    const s = stock.find(x => x.id === editingStockId);
    Object.assign(s, getStockForm());
    toast('Item updated ✓');
  } else {
    stock.push({ id: uid(), ...getStockForm() });
    toast('Item added ✓');
  }
  save(); document.getElementById('stock-overlay').classList.remove('open'); renderStock(); renderDashboard();
}

function getStockForm() {
  return {
    name:     document.getElementById('s-name').value.trim(),
    category: document.getElementById('s-cat').value,
    sku:      document.getElementById('s-sku').value.trim(),
    qty:      parseInt(document.getElementById('s-qty').value)||0,
    min:      parseInt(document.getElementById('s-min').value)||0,
    unit:     document.getElementById('s-unit').value.trim(),
    supplier: document.getElementById('s-supplier').value.trim(),
  };
}

function deleteStock(id) {
  if (!confirm('Delete this stock item?')) return;
  stock = stock.filter(s => s.id !== id);
  save(); renderStock(); renderDashboard();
  toast('Item deleted', 'var(--muted)');
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
renderDashboard();

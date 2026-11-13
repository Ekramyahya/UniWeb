'use strict';
const KEY = 'uniHubV1';
let S = { courses: [], tasks: [], exams: [], required: 136, focus: { sessions: 0, minutes: 0 } }, cal = new Date();
const $ = s => document.querySelector(s),
  h = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e }, // textContent فقط: لا innerHTML
  clean = (v, n = 60) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n),
  okDate = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(new Date(d)),
  okTime = t => /^([01]\d|2[0-3]):[0-5]\d$/.test(t),
  save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch { } },
  left = d => Math.ceil((new Date(d + 'T00:00:00') - new Date().setHours(0, 0, 0, 0)) / 864e5),
  pts = g => g >= 95 ? 5 : g >= 90 ? 4.75 : g >= 85 ? 4.5 : g >= 80 ? 4 : g >= 75 ? 3.5 : g >= 70 ? 3 : g >= 65 ? 2.5 : g >= 60 ? 2 : 1,
  graded = () => S.courses.filter(c => Number.isFinite(c.grade)),
  gpa = () => { const g = graded(), t = g.reduce((a, c) => a + c.credits, 0); return t ? g.reduce((a, c) => a + pts(c.grade) * c.credits, 0) / t : 0 },
  done = () => graded().filter(c => c.grade >= 60).reduce((a, c) => a + c.credits, 0),
  del = (k, id) => { S[k] = S[k].filter(x => x.id !== id); save(); render() },
  btn = (txt, fn, c) => { const b = h('button', c || '', txt); b.type = 'button'; b.onclick = fn; return b },
  row = (p, t, sub, els) => { const r = h('div', 'row'), d = h('div'); d.append(h('b', '', t), h('small', '', sub)); r.append(d, ...els); p.append(r) },
  pad = n => String(n).padStart(2, '0'),
  gpaLabel = () => { if (!graded().length) return ''; const g = gpa(); return tr(g >= 4.5 ? 'exc' : g >= 3.75 ? 'vg' : g >= 2.75 ? 'gd' : 'low') };
const okItem = {
  courses: x => typeof x.name === 'string' && Number.isFinite(x.credits) && Number.isInteger(x.day) && okTime(x.start) && okTime(x.end),
  tasks: x => typeof x.title === 'string' && okDate(x.due),
  exams: x => typeof x.course === 'string' && okDate(x.date)
};
function load(r) { // تحميل آمن مع التحقق من كل عنصر
  if (!r || typeof r !== 'object') return;
  for (const k in okItem) if (Array.isArray(r[k])) S[k] = r[k].slice(0, 500).filter(x => x && typeof x === 'object' && typeof x.id === 'string' && okItem[k](x));
  if (Number.isFinite(r.required)) S.required = Math.min(300, Math.max(1, r.required));
  if (r.focus && Number.isFinite(r.focus.sessions) && Number.isFinite(r.focus.minutes)) S.focus = { sessions: Math.min(1e5, Math.max(0, r.focus.sessions | 0)), minutes: Math.min(1e7, Math.max(0, r.focus.minutes | 0)) };
}
try { load(JSON.parse(localStorage.getItem(KEY) || 'null')) } catch { }

function bind(id, fn) {
  $(id).addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f));
    if (fn(d) !== false) { f.reset(); save(); render() }
  });
}
const bad = () => (alert(tr('check')), false);
bind('#fCourse', d => {
  const cr = +d.credits, day = +d.day, g = d.grade === '' ? null : +d.grade;
  if (!clean(d.name) || !(cr >= 1 && cr <= 6) || !(day >= 0 && day < 5) || !okTime(d.start) || !okTime(d.end) || d.start >= d.end || (g !== null && !(g >= 0 && g <= 100))) return bad();
  S.courses.push({ id: crypto.randomUUID(), name: clean(d.name), credits: cr, day, start: d.start, end: d.end, grade: g });
});
bind('#fTask', d => {
  if (!clean(d.title) || !okDate(d.due)) return bad();
  S.tasks.push({ id: crypto.randomUUID(), title: clean(d.title, 80), course: clean(d.course), due: d.due, done: false });
});
bind('#fExam', d => {
  if (!clean(d.course) || !okDate(d.date)) return bad();
  S.exams.push({ id: crypto.randomUUID(), course: clean(d.course), date: d.date });
});

const alerts = () => {
  const a = [];
  S.tasks.filter(t => !t.done).forEach(t => { const l = left(t.due); if (l < 0) a.push(['danger', tr('lateTask', t.title)]); else if (l <= 2) a.push(['warn', tr('dueSoon', t.title, l)]) });
  S.exams.forEach(e => { const l = left(e.date); if (l >= 0 && l <= 7) a.push(['warn', tr('examSoon', e.course, l)]) });
  return a;
};
const ach = () => [
  ['📚', tr('a1'), S.courses.length > 0],
  ['⭐', tr('a2'), gpa() >= 4.5],
  ['✅', tr('a3'), S.tasks.filter(t => t.done).length >= 5],
  ['🎯', tr('a4'), done() >= S.required / 4],
  ['⏱️', tr('a5'), S.tasks.length > 0 && !S.tasks.some(t => !t.done && left(t.due) < 0)],
  ['⏳', tr('a6'), S.focus.sessions >= 5]
];

function rDash() {
  const s = $('#stats'); s.replaceChildren();
  const nx = [...S.exams].filter(e => left(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  [[tr('sGpa'), gpa().toFixed(2)], [tr('sHrs'), done() + ' / ' + S.required], [tr('sPend'), S.tasks.filter(t => !t.done).length], [tr('sNext'), nx ? tr('dayN', left(nx.date)) : '—']]
    .forEach(([k, v]) => { const c = h('div', 'card stat'); c.append(h('small', '', k), h('strong', '', v)); s.append(c) });
  const a = $('#alerts'); a.replaceChildren();
  alerts().forEach(([c, t]) => a.append(h('p', 'al ' + c, t)));
  if (!a.children.length) a.append(h('p', 'al', tr('noAlerts')));
  const b = $('#badges'); b.replaceChildren();
  ach().forEach(([i, t, on]) => b.append(h('span', 'badge' + (on ? ' on' : ''), i + ' ' + t)));
  const gl = gpaLabel(); if (gl) s.firstChild.append(h('small', 'badge on', gl));
  const td = $('#today'); td.replaceChildren();
  const cs = S.courses.filter(c => c.day === new Date().getDay()).sort((x, y) => x.start.localeCompare(y.start));
  if (!cs.length) td.append(h('small', '', tr('noToday')));
  cs.forEach(c => row(td, c.name, `${c.start} - ${c.end}`, []));
  const dn = S.tasks.filter(t => t.done).length;
  $('#taskBar').max = S.tasks.length || 1; $('#taskBar').value = dn; $('#taskTxt').textContent = tr('taskPct', dn, S.tasks.length);
}
function rSched() {
  const box = $('#schedule'); box.replaceChildren();
  days().forEach((d, i) => {
    const col = h('div', 'card'); col.append(h('h3', '', d));
    const cs = S.courses.filter(c => c.day === i).sort((x, y) => x.start.localeCompare(y.start));
    if (!cs.length) col.append(h('small', '', tr('noLec')));
    cs.forEach(c => row(col, c.name, `${c.start} - ${c.end}`, [btn(tr('del'), () => del('courses', c.id), 'danger')]));
    box.append(col);
  });
}
function rGpa() {
  $('#gpaVal').textContent = gpa().toFixed(2); $('#hrsDone').textContent = done();
  $('#reqIn').value = S.required; const p = $('#hrsBar'); p.max = S.required; p.value = Math.min(done(), S.required);
  const box = $('#grades'); box.replaceChildren();
  if (!S.courses.length) box.append(h('small', '', tr('hint')));
  S.courses.forEach(c => {
    const i = h('input'); i.type = 'number'; i.min = 0; i.max = 100; i.value = c.grade ?? ''; i.setAttribute('aria-label', tr('gradeOf', c.name));
    i.onchange = () => { const v = i.value === '' ? null : +i.value; if (v === null || (v >= 0 && v <= 100)) { c.grade = v; save(); render() } };
    row(box, c.name, tr('hrsN', c.credits), [i]);
  });
}
function rTasks() {
  const box = $('#taskList'); box.replaceChildren();
  if (!S.tasks.length) box.append(h('small', '', tr('noTasks')));
  [...S.tasks].sort((a, b) => a.due.localeCompare(b.due)).forEach(t => {
    const l = left(t.due);
    row(box, (t.done ? '✅ ' : '') + t.title, `${t.course || tr('general')} | ${t.due} | ${t.done ? tr('complete') : l < 0 ? tr('late') : tr('inN', l)}`,
      [btn(t.done ? tr('undo') : tr('doneBtn'), () => { t.done = !t.done; save(); render() }, 'ok'), btn(tr('del'), () => del('tasks', t.id), 'danger')]);
  });
}
function rExams() {
  const box = $('#examList'); box.replaceChildren();
  if (!S.exams.length) box.append(h('small', '', tr('noExams')));
  [...S.exams].sort((a, b) => a.date.localeCompare(b.date)).forEach(e => {
    const l = left(e.date);
    row(box, e.course, `${e.date} | ${l < 0 ? tr('over') : tr('inN', l)}`, [btn(tr('del'), () => del('exams', e.id), 'danger')]);
  });
}
function rCal() {
  const y = cal.getFullYear(), m = cal.getMonth(), box = $('#calGrid'); box.replaceChildren();
  $('#calTitle').textContent = cal.toLocaleDateString(lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US', { month: 'long', year: 'numeric' });
  tr('wd').split(',').forEach(d => box.append(h('div', 'hd', d)));
  for (let i = 0; i < new Date(y, m, 1).getDay(); i++) box.append(h('div'));
  const now = new Date();
  for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
    const k = `${y}-${pad(m + 1)}-${pad(d)}`, c = h('div', y === now.getFullYear() && m === now.getMonth() && d === now.getDate() ? 'today' : '', d);
    S.tasks.filter(t => t.due === k).forEach(t => c.append(h('span', '', '📝 ' + t.title)));
    S.exams.filter(e => e.date === k).forEach(e => c.append(h('span', '', '📚 ' + e.course)));
    box.append(c);
  }
}
function rAna() {
  const box = $('#analysis'); box.replaceChildren();
  const g = graded().sort((a, b) => b.grade - a.grade), good = [], weak = [], tips = [];
  g.forEach(c => { if (c.grade >= 90) good.push(`${c.name}: ${c.grade}%`); else if (c.grade < 70) weak.push(`${c.name}: ${c.grade}%`) });
  const tot = S.tasks.length, dn = S.tasks.filter(t => t.done).length, late = S.tasks.filter(t => !t.done && left(t.due) < 0).length;
  if (tot) { const r = dn / tot; (r >= .7 ? good : weak).push(tr('comp', Math.round(r * 100))) }
  if (late) weak.push(tr('lateN', late));
  if (g.length > 1 && g.at(-1).grade < 85) tips.push(tr('focus', g.at(-1).name));
  if (g.length && gpa() < 3) tips.push(tr('daily'));
  if (late) tips.push(tr('lateFirst'));
  S.exams.filter(e => left(e.date) >= 0 && left(e.date) <= 7).forEach(e => tips.push(tr('revise', e.course)));
  if (done() < S.required / 4 && S.courses.length) tips.push(tr('pace'));
  [[tr('strengths'), good, 'good'], [tr('weak'), weak, 'bad'], [tr('tips'), tips, 'tip']].forEach(([t, items, cls]) => {
    const c = h('div', 'card ' + cls); c.append(h('h2', '', t));
    if (!items.length) c.append(h('small', '', tr('needData')));
    items.forEach(i => c.append(h('p', '', i)));
    box.append(c);
  });
}
function render() { [rDash, rSched, rGpa, rTasks, rExams, rCal, rTimer, rAna].forEach(f => f()) }

document.querySelectorAll('nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('main>section').forEach(s => s.hidden = s.id !== b.dataset.v);
  document.querySelectorAll('nav button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
});
$('#reqIn').onchange = e => { const v = +e.target.value; if (v >= 1 && v <= 300) { S.required = v; save(); render() } };
$('#prev').onclick = () => { cal = new Date(cal.getFullYear(), cal.getMonth() - 1, 1); rCal() };
$('#next').onclick = () => { cal = new Date(cal.getFullYear(), cal.getMonth() + 1, 1); rCal() };
const notify = b => { try { new Notification(tr('title'), { body: b }); return true } catch { return false } };
$('#notif').onclick = async () => {
  const m = $('#notifMsg'); m.textContent = '';
  if (!('Notification' in window)) return void (m.textContent = tr('nSupport'));
  let p = Notification.permission;
  if (p === 'default') { try { p = await Notification.requestPermission() } catch { } }
  if (p !== 'granted') return void (m.textContent = tr('nDenied'));
  const l = alerts().slice(0, 3).map(a => a[1]); if (!l.length) l.push(tr('nTest'));
  m.textContent = l.map(notify).every(Boolean) ? tr('nOk') : tr('nSupport');
};
// ===== المؤقت =====
const T = { mode: 'focus', len: { focus: 25, rest: 5 }, left: 1500, end: 0, id: 0 }; let ac;
const fmt = s => pad(Math.floor(s / 60)) + ':' + pad(s % 60);
function rTimer() {
  const tot = T.len[T.mode] * 60;
  $('#tTime').textContent = fmt(T.left); $('#tBar').max = tot; $('#tBar').value = tot - T.left;
  $('#tGo').textContent = tr(T.id ? 'tPause' : 'tStart');
  $('#mFocus').setAttribute('aria-pressed', String(T.mode === 'focus')); $('#mRest').setAttribute('aria-pressed', String(T.mode === 'rest'));
  $('#tSum').textContent = tr('tSum', S.focus.sessions, S.focus.minutes);
  document.title = T.id ? fmt(T.left) + ' | ' + tr('title') : tr('title');
}
function tStop() { clearInterval(T.id); T.id = 0 }
function tMode(m) { tStop(); T.mode = m; T.left = T.len[m] * 60; rTimer() }
function tTick() {
  T.left = Math.max(0, Math.ceil((T.end - Date.now()) / 1000));
  if (T.left > 0) return rTimer();
  tStop(); const f = T.mode === 'focus';
  if (f) { S.focus.sessions++; S.focus.minutes += T.len.focus; save() }
  try { const o = ac.createOscillator(); o.connect(ac.destination); o.frequency.value = 880; o.start(); o.stop(ac.currentTime + .6) } catch { }
  notify(tr(f ? 'tDoneF' : 'tDoneR')); tMode(f ? 'rest' : 'focus'); render();
}
$('#tGo').onclick = () => {
  if (T.id) { T.left = Math.max(1, Math.ceil((T.end - Date.now()) / 1000)); tStop(); return rTimer() }
  try { ac = ac || new AudioContext() } catch { }
  T.end = Date.now() + T.left * 1000; T.id = setInterval(tTick, 250); rTimer();
};
$('#tReset').onclick = () => tMode(T.mode);
$('#mFocus').onclick = () => tMode('focus'); $('#mRest').onclick = () => tMode('rest');
for (const [id, k] of [['#lenF', 'focus'], ['#lenR', 'rest']]) $(id).onchange = e => {
  const v = +e.target.value;
  if (v >= 1 && v <= 180) { T.len[k] = v; if (!T.id && T.mode === k) tMode(k) } else e.target.value = T.len[k];
};
$('#exp').onclick = () => {
  const a = h('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' }));
  a.download = 'uni-hub-backup.json'; a.click(); URL.revokeObjectURL(a.href);
};
$('#imp').onchange = async e => {
  try { const f = e.target.files[0]; if (f && f.size < 1e6) { load(JSON.parse(await f.text())); save(); render() } } catch { alert(tr('check')) }
  e.target.value = '';
};
render();

// Leonida Legend — GTA VI trophy guide & tracker.
// One offline page: the official 55 trophies with cited guides, a six-stage platinum roadmap,
// a missables view, and a checklist whose progress lives in localStorage (export/import as JSON).
const KEY = 'gta6-trophy-checklist';
const SPOILER_KEY = 'gta6-trophy-spoilershield';

const STAGES = [
  { n: 1, title: 'Story playthrough', blurb: 'Play the story in order: the opening, the named missions and Chapters 1–4 through to the final mission. Three trophies in this stage are missable — Catch Me If You Can is tied to the story\u2019s VCIA visit, and Actions Speak Louder and Bad Luck, I Guess are earned by how you play the story itself — so read their warnings before the endgame.' },
  { n: 2, title: 'Strangers & side strands', blurb: 'Clear the stranger strands end to end: the final missions for Andy, Kenton, Billy, Randy and Tyrone, Bret\u2019s hunt, and eight completed strands for the Strangers & Freaks silver. A strand only counts when its final mission is done.' },
  { n: 3, title: 'Collectibles & exploration', blurb: 'Sweep Leonida region by region: meditation spots, collectible card sets, WAiNK locations, vehicle discoveries, full map exploration, every garage property and the Scooter Bros registrations. The same journeys feed several of these at once.' },
  { n: 4, title: 'Activities & challenges', blurb: 'Sample everything once for Master of None, then finish the graded work: gold medals in every Shooting Range challenge, a Top Fun drone race win at every location, 20 different race wins, Cal\u2019s fishing challenge, an arcade game, bowling at Kolt & Associates, 250 stunts and 50 challenges.' },
  { n: 5, title: 'Free-roam feats, crime & cash', blurb: 'The sandbox stage: partner feats, robberies (shops, a jewelry store, bank vaults, an armored truck, one illegal operation per gang), the Combat Focus and wanted-level feats, and the money circuit — launder $250,000 of marked bills and spend $100,000 — that funds the garage set in stage 3.' },
  { n: 6, title: '100% & the platinum', blurb: 'Close out the in-game completion counter for A Long Road, and the platinum, Vice Got a Price!, follows the moment the other 54 are earned. If anything is still open, the tracker\u2019s filters will find it.' },
];

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byName = new Map(trophies.map((t) => [t.name, t]));

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
earned = new Set([...earned].filter((n) => byName.has(n)));
let spoilerShield = localStorage.getItem(SPOILER_KEY) === '1';

const $ = (id) => document.getElementById(id);
const els = {
  cards: $('cards'), stages: $('stages'), missables: $('missable-list'), empty: $('empty'),
  q: $('q'), kind: $('kind'), grade: $('grade'), state: $('state'), spoilers: $('spoilers'),
};

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function isSpoilered(t) {
  return spoilerShield && t.kind === 'story' && t.id !== 1 && !earned.has(t.name);
}

function card(t, { openGuide = false } = {}) {
  const el = document.createElement('article');
  const hid = isSpoilered(t);
  el.className = `card grade-${t.grade}` + (earned.has(t.name) ? ' earned' : '') + (hid ? ' spoilered' : '');
  const top = document.createElement('div');
  top.className = 'card-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    save();
    renderAll();
  });
  const head = document.createElement('div');
  const name = document.createElement('h3');
  name.className = 'card-name';
  name.textContent = hid ? '??? — story trophy' : t.name;
  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = hid ? 'Hidden by the spoiler shield until you earn it.' : `\u201C${t.description}\u201D`;
  head.append(name, desc);
  top.append(box, head);
  el.append(top);

  const tags = document.createElement('div');
  tags.className = 'tags';
  const gradeTag = document.createElement('span');
  gradeTag.className = `tag grade-${t.grade}`;
  gradeTag.textContent = t.grade;
  tags.append(gradeTag);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = t.kind;
  tags.append(kindTag);
  const stageTag = document.createElement('span');
  stageTag.className = 'tag';
  stageTag.textContent = `Stage ${t.stage}`;
  tags.append(stageTag);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag missable';
    m.textContent = '⚠ Missable';
    tags.append(m);
  }
  el.append(tags);

  if (t.missable && t.earnBy) {
    const eb = document.createElement('p');
    eb.className = 'earnby';
    eb.textContent = `Earn it: ${t.earnBy}.`;
    el.append(eb);
  }

  const det = document.createElement('details');
  det.className = 'guide';
  if (openGuide) det.open = true;
  const sum = document.createElement('summary');
  sum.textContent = 'Guide & sources';
  const body = document.createElement('p');
  body.textContent = hid ? 'Earn this story trophy to reveal its guide — no spoilers.' : t.guide;
  const src = document.createElement('p');
  src.className = 'sources';
  const b = document.createElement('b');
  b.textContent = 'Sources: ';
  src.append(b, document.createTextNode((t.sources ?? []).join(' · ')));
  det.append(sum, body, src);
  el.append(det);
  return el;
}

function renderHeader() {
  const total = trophies.length;
  const n = earned.size;
  const pct = Math.round((n / total) * 100);
  $('progress').textContent = `${n} of ${total} earned`;
  $('ring-pct').textContent = `${pct}%`;
  $('ring').style.setProperty('--p', pct);
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  $('grade-counts').innerHTML = grades.map((g) => {
    const all = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
    return `${g}: <b>${got}/${all}</b>`;
  }).join(' · ');
  const plat = byName.get('Vice Got a Price!');
  $('plat-note').textContent = earned.has(plat.name)
    ? 'Platinum earned — you are a Leonida Legend.'
    : `Platinum: ${n} of ${total - 1} other trophies banked — it lands with the last one.`;
  $('missable-count').textContent = trophies.filter((t) => t.missable && !earned.has(t.name)).length;
}

function matches(t) {
  if (els.kind.value !== 'all' && t.kind !== els.kind.value) return false;
  if (els.grade.value !== 'all' && t.grade !== els.grade.value) return false;
  if (els.state.value === 'earned' && !earned.has(t.name)) return false;
  if (els.state.value === 'unearned' && earned.has(t.name)) return false;
  const q = els.q.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${t.kind} ${t.grade}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderTracker() {
  const list = trophies.filter(matches);
  els.cards.replaceChildren(...list.map((t) => card(t)));
  els.empty.hidden = list.length > 0;
}

function renderRoadmap() {
  els.stages.replaceChildren();
  for (const s of STAGES) {
    const list = trophies.filter((t) => t.stage === s.n);
    const done = list.filter((t) => earned.has(t.name)).length;
    const wrap = document.createElement('div');
    wrap.className = 'stage';
    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${s.n} of ${STAGES.length}`;
    const h = document.createElement('h2');
    h.textContent = s.title;
    const prog = document.createElement('span');
    prog.className = 'stage-progress';
    prog.textContent = `${done}/${list.length} earned`;
    head.append(num, h, prog);
    const blurb = document.createElement('p');
    blurb.className = 'stage-blurb';
    blurb.textContent = s.blurb;
    const grid = document.createElement('div');
    grid.className = 'cards';
    grid.append(...list.map((t) => card(t)));
    wrap.append(head, blurb, grid);
    els.stages.append(wrap);
  }
}

function renderMissables() {
  const list = trophies.filter((t) => t.missable);
  els.missables.replaceChildren(...list.map((t) => card(t, { openGuide: true })));
}

function renderAll() {
  renderHeader();
  renderTracker();
  renderRoadmap();
  renderMissables();
}

$('export').addEventListener('click', () => {
  const payload = JSON.stringify({ game: doc.game, earned: [...earned] }, null, 1);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  $('io-note').textContent = `Exported ${earned.size} earned trophies to gta6-trophy-progress.json.`;
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    earned = new Set(names.filter((n) => byName.has(n)));
    save();
    renderAll();
    $('io-note').textContent = `Imported progress: ${earned.size} trophies marked earned.`;
  } catch {
    $('io-note').textContent = 'That file could not be read as trophy progress — nothing was changed.';
  }
  e.target.value = '';
});

for (const el of [els.q, els.kind, els.grade, els.state]) {
  el.addEventListener('input', renderTracker);
  el.addEventListener('change', renderTracker);
}
els.spoilers.checked = spoilerShield;
els.spoilers.addEventListener('change', () => {
  spoilerShield = els.spoilers.checked;
  localStorage.setItem(SPOILER_KEY, spoilerShield ? '1' : '0');
  renderAll();
});

const viewBtns = [...document.querySelectorAll('.view-btn')];
for (const btn of viewBtns) {
  btn.addEventListener('click', () => {
    for (const b of viewBtns) b.classList.toggle('active', b === btn);
    for (const v of ['tracker', 'roadmap', 'missables']) {
      $(`view-${v}`).hidden = v !== btn.dataset.view;
    }
  });
}

renderAll();

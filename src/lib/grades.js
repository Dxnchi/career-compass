// Grade helpers, subject matching and report-card parsing (Week 3: "Extract subjects and marks").
// Pure JS, no React/Expo imports, so it can be unit-tested with plain Node.

export const MIN_SUBJECTS = 6;

// NSC achievement levels
export function getLevelFromPercentage(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const n = Math.round(Number(value));
  if (Number.isNaN(n) || n < 0 || n > 100) return 0;
  if (n >= 80) return 7;
  if (n >= 70) return 6;
  if (n >= 60) return 5;
  if (n >= 50) return 4;
  if (n >= 40) return 3;
  if (n >= 30) return 2;
  return 1;
}

// Used only when a report card shows a level (1-7) but no percentage.
const LEVEL_MIDPOINTS = { 1: 15, 2: 35, 3: 45, 4: 55, 5: 65, 6: 75, 7: 90 };

const AFRICAN_LANGUAGES = [
  ['sepedi', 'Sepedi', 'sepedi|sesotho\\s+sa\\s+leboa'], // before Sesotho
  ['sesotho', 'Sesotho', 'sesotho'],
  ['zulu', 'isiZulu', '(?:isi)?\\s*zulu'],
  ['xhosa', 'isiXhosa', '(?:isi)?\\s*xhosa'],
  ['ndebele', 'isiNdebele', '(?:isi)?\\s*ndebele'],
  ['swati', 'siSwati', '(?:si)?\\s*swati'],
  ['setswana', 'Setswana', 'setswana'],
  ['tshivenda', 'Tshivenda', 'tshivenda|venda'],
  ['xitsonga', 'Xitsonga', 'xitsonga|tsonga'],
];

const HL = '(?:home\\s+lang(?:uage)?|hl)';
const FAL = '(?:first\\s+additional(?:\\s+lang(?:uage)?)?|fal)';

// Order matters: specific patterns first, generic ones last.
// `approx: true` = we had to guess (e.g. "English" with no HL/FAL), so ask the student to check.
export const SUBJECT_CATALOGUE = [
  { id: 'eng_fal', name: 'English First Additional Language', category: 'Language', re: new RegExp(`\\b(?:english|eng)\\s+${FAL}\\b`) },
  { id: 'eng', name: 'English Home Language', category: 'Language', re: new RegExp(`\\b(?:english|eng)\\s+${HL}\\b`) },
  { id: 'eng', name: 'English Home Language', category: 'Language', re: /\b(?:english|eng)\b(?:\s+lang(?:uage)?\b)?/, approx: true },
  { id: 'afr_hl', name: 'Afrikaans Home Language', category: 'Language', re: new RegExp(`\\b(?:afrikaans|afr)\\s+${HL}\\b`) },
  { id: 'afr', name: 'Afrikaans First Additional Language', category: 'Language', re: new RegExp(`\\b(?:afrikaans|afr)\\s+${FAL}\\b`) },
  { id: 'afr', name: 'Afrikaans First Additional Language', category: 'Language', re: /\b(?:afrikaans|afr)\b(?:\s+lang(?:uage)?\b)?/, approx: true },
  ...AFRICAN_LANGUAGES.flatMap(([key, label, src]) => [
    { id: `${key}_fal`, name: `${label} First Additional Language`, category: 'Language', re: new RegExp(`\\b(?:${src})\\s+${FAL}\\b`) },
    { id: `${key}_hl`, name: `${label} Home Language`, category: 'Language', re: new RegExp(`\\b(?:${src})\\s+${HL}\\b`) },
    { id: `${key}_hl`, name: `${label} Home Language`, category: 'Language', re: new RegExp(`\\b(?:${src})\\b(?:\\s+lang(?:uage)?\\b)?`), approx: true },
  ]),
  { id: 'techmath', name: 'Technical Mathematics', category: 'Core Subject', re: /\btechnical\s+math(?:ematics|s)?\b/ },
  { id: 'mathlit', name: 'Mathematical Literacy', category: 'Core Subject', re: /\bmath(?:ematical|s)?\s+lit(?:eracy)?\b/ },
  { id: 'math', name: 'Mathematics', category: 'Core Subject', re: /\bmath(?:ematics|s)?\b/ },
  { id: 'lo', name: 'Life Orientation', category: 'Core Subject', re: /\blife\s+orientation\b|\blo\b/ },
  { id: 'maritime', name: 'Maritime Economics', category: 'Elective', re: /\bmaritime\s+economics\b/ },
  { id: 'nautical', name: 'Nautical Science', category: 'Elective', re: /\bnautical\s+sci(?:ences?)?\b/ },
  { id: 'marine', name: 'Marine Sciences', category: 'Elective', re: /\bmarine\s+sci(?:ences?)?\b/ },
  { id: 'techsci', name: 'Technical Sciences', category: 'Elective', re: /\btechnical\s+sci(?:ences?)?\b/ },
  { id: 'sport', name: 'Sport and Exercise Science', category: 'Elective', re: /\bsport\s+(?:and|&)?\s*exercise\s+sci(?:ences?)?\b/ },
  { id: 'equine', name: 'Equine Studies', category: 'Elective', re: /\bequine\b/ },
  { id: 'dance', name: 'Dance Studies', category: 'Elective', re: /\bdance\s+stud(?:ies|y)\b/ },
  { id: 'agrimgmt', name: 'Agricultural Management Practices', category: 'Elective', re: /\bagri(?:cultural)?\s+management\b/ },
  { id: 'agritech', name: 'Agricultural Technology', category: 'Elective', re: /\bagri(?:cultural)?\s+technology\b/ },
  { id: 'civil', name: 'Civil Technology', category: 'Elective', re: /\bcivil\s+technology\b/ },
  { id: 'electrical', name: 'Electrical Technology', category: 'Elective', re: /\belectrical\s+technology\b/ },
  { id: 'mechanical', name: 'Mechanical Technology', category: 'Elective', re: /\bmechanical\s+technology\b/ },
  { id: 'sasl_hl', name: 'South African Sign Language Home Language', category: 'Language', re: /\bsouth\s+african\s+sign\s+language\b|\bsasl\b/ },
  { id: 'phys', name: 'Physical Sciences', category: 'Elective', re: /\bphys(?:ical)?\s+sci(?:ences?)?\b/ },
  { id: 'lifesci', name: 'Life Sciences', category: 'Elective', re: /\blife\s+sci(?:ences?)?\b/ },
  { id: 'geo', name: 'Geography', category: 'Elective', re: /\bgeo(?:graphy)?\b/ },
  { id: 'hist', name: 'History', category: 'Elective', re: /\bhistory\b/ },
  { id: 'acc', name: 'Accounting', category: 'Elective', re: /\baccounting\b/ },
  { id: 'bus', name: 'Business Studies', category: 'Elective', re: /\bbusiness\s+stud(?:ies|y)\b/ },
  { id: 'econ', name: 'Economics', category: 'Elective', re: /\beconomics\b/ },
  { id: 'it', name: 'Information Technology', category: 'Elective', re: /\binformation\s+technology\b/ },
  { id: 'cat', name: 'Computer Applications Technology', category: 'Elective', re: /\bcomputer\s+applications?\s+technology\b|\bcat\b/ },
  { id: 'egd', name: 'Engineering Graphics and Design', category: 'Elective', re: /\bengineering\s+graphics\b|\begd\b/ },
  { id: 'consumer', name: 'Consumer Studies', category: 'Elective', re: /\bconsumer\s+stud(?:ies|y)\b/ },
  { id: 'tourism', name: 'Tourism', category: 'Elective', re: /\btourism\b/ },
  { id: 'hospitality', name: 'Hospitality Studies', category: 'Elective', re: /\bhospitality\b/ },
  { id: 'drama', name: 'Dramatic Arts', category: 'Elective', re: /\bdramatic\s+arts?\b/ },
  { id: 'visual', name: 'Visual Arts', category: 'Elective', re: /\bvisual\s+arts?\b/ },
  { id: 'music', name: 'Music', category: 'Elective', re: /\bmusic\b/ },
  { id: 'religion', name: 'Religion Studies', category: 'Elective', re: /\breligion\s+stud(?:ies|y)\b/ },
  { id: 'agri', name: 'Agricultural Sciences', category: 'Elective', re: /\bagri(?:cultural)?\s+sci(?:ences?)?\b/ },
];

// Lower-case, keep letters/digits/%/. only
function normalise(line) {
  return String(line)
    .toLowerCase()
    .replace(/[^a-z0-9%.]+/g, ' ')
    .replace(/(^|\s)\.+(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findSubject(norm) {
  for (const entry of SUBJECT_CATALOGUE) {
    const m = entry.re.exec(norm);
    if (m) return { entry, start: m.index, end: m.index + m[0].length };
  }
  return null;
}

// Pull a mark out of the text that follows a subject name.
function extractMark(rest) {
  const cleaned = rest
    .replace(/\b(?:level|lvl|lv|code|symbol|rating|achievement)\s*\d\b/g, ' ')
    .replace(/\bterm\s*\d\b/g, ' ');
  const tokens = [...cleaned.matchAll(/(\d{1,3}(?:\.\d+)?)(\s*%)?/g)]
    .map((m) => ({ value: parseFloat(m[1]), pct: Boolean(m[2]) }))
    .filter((t) => t.value <= 100);

  const pcts = tokens.filter((t) => t.pct);
  if (pcts.length) return { percentage: Math.round(pcts[0].value), confident: pcts.length === 1 };

  const marks = tokens.filter((t) => t.value >= 8);
  if (marks.length) return { percentage: Math.round(marks[0].value), confident: marks.length === 1 };

  const level = tokens.find((t) => t.value >= 1 && t.value <= 7);
  if (level) return { percentage: LEVEL_MIDPOINTS[Math.round(level.value)], confident: false, fromLevel: true };

  return null;
}

const NUMBER_ONLY = /^\s*\d{1,3}(?:\.\d+)?\s*%?\s*$/;

/**
 * Turn raw OCR text into [{ id, name, category, level, percentage, confidence }]
 * confidence: 'high' | 'low'. 'low' rows are highlighted on the Confirm screen.
 */
export function parseReportCardText(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const norms = lines.map(normalise);
  const used = new Set();
  const found = [];
  const seen = new Set();

  for (let i = 0; i < norms.length; i++) {
    const hit = findSubject(norms[i]);
    if (!hit || seen.has(hit.entry.id)) continue;
    seen.add(hit.entry.id);
    used.add(i);

    found.push({ entry: hit.entry, mark: extractMark(norms[i].slice(hit.end)), lineIndex: i });
  }

  // Some subjects have no mark on their own line (name and mark on separate lines, or column-style OCR).
  const missing = found.filter((f) => !f.mark);
  if (missing.length) {
    const orphans = norms
      .map((n, idx) => ({ n, idx }))
      .filter(({ n, idx }) => !used.has(idx) && NUMBER_ONLY.test(n));

    if (orphans.length === missing.length) {
      // Pair numbers with subjects in reading order. Trust it only when each number sits right under its subject.
      missing.forEach((f, k) => {
        f.mark = {
          percentage: Math.round(parseFloat(orphans[k].n)),
          confident: orphans[k].idx === f.lineIndex + 1,
        };
      });
    } else {
      // Counts don't match: only accept a number printed directly under the subject name.
      missing.forEach((f) => {
        const next = f.lineIndex + 1;
        if (next < norms.length && !used.has(next) && !findSubject(norms[next])) {
          const m = extractMark(norms[next]);
          if (m) f.mark = m;
        }
      });
    }
  }

  return found.map(({ entry, mark }) => {
    const hasMark = mark && mark.percentage <= 100;
    const confident = hasMark && mark.confident && !entry.approx;
    return {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      percentage: hasMark ? mark.percentage : '',
      level: hasMark ? getLevelFromPercentage(mark.percentage) : 0,
      confidence: confident ? 'high' : 'low',
    };
  });
}

// Look up a printed subject name (e.g. "Phys Sci", "English HL") in the catalogue.
// Strict: the catalogue name must account for the whole printed name, so "Maritime Economics"
// is NOT collapsed into "Economics". Unmatched names are kept as printed.
export function matchSubjectName(name) {
  const norm = normalise(name);
  const hit = findSubject(norm);
  if (!hit || hit.start !== 0) return null;
  const rest = norm.slice(hit.end).replace(/\b(?:language|lang|subject)\b/g, '').trim();
  return rest === '' ? hit.entry : null;
}

/**
 * Turn the subjects returned by the vision model ([{ name, mark, level, confident }])
 * into app grades. Names are canonicalised against the NSC catalogue, marks are validated,
 * and levels are always derived from the percentage here, never trusted from the model.
 */
export function gradesFromExtracted(items) {
  const seen = new Set();
  const out = [];
  (Array.isArray(items) ? items : []).forEach((item, i) => {
    const printed = String(item?.name || '').trim();
    if (!printed) return;
    const entry = matchSubjectName(printed);
    const id = entry ? entry.id : `ocr-${i}-${normalise(printed).replace(/\s+/g, '-')}`;
    if (seen.has(id)) return;
    seen.add(id);

    let pct = null;
    let fromLevel = false;
    if (item.mark !== null && item.mark !== undefined && item.mark !== '' && Number.isFinite(Number(item.mark))) {
      const m = Math.round(Number(item.mark));
      if (m >= 0 && m <= 100) pct = m;
    }
    if (pct === null) {
      const lvl = Math.round(Number(item?.level));
      if (lvl >= 1 && lvl <= 7) {
        pct = LEVEL_MIDPOINTS[lvl];
        fromLevel = true;
      }
    }

    const confident = pct !== null && !fromLevel && item.confident !== false && !(entry && entry.approx);
    out.push({
      id,
      name: entry ? entry.name : printed,
      category: entry ? entry.category : 'Elective',
      percentage: pct === null ? '' : pct,
      level: pct === null ? 0 : getLevelFromPercentage(pct),
      confidence: confident ? 'high' : 'low',
    });
  });
  return out;
}

// ---- Full list of NSC subjects for the "Add subject" dropdown ----
const FOREIGN_SAL = [
  'Arabic', 'French', 'German', 'Gujarati', 'Hebrew', 'Hindi', 'Italian', 'Latin',
  'Mandarin', 'Modern Greek', 'Portuguese', 'Spanish', 'Tamil', 'Telugu', 'Urdu',
];

// Subjects offered but not needed for OCR matching (rarely printed, or too generic to match safely in text).
const EXTRA_SUBJECTS = [
  { id: 'design', name: 'Design', category: 'Elective' },
];

// Extra search words (people type "maths", "bio", "hl", ...)
const SEARCH_ALIASES = {
  math: 'maths math', mathlit: 'maths lit math lit', techmath: 'tech maths', lo: 'lo life skills',
  phys: 'physics chemistry phys sci', lifesci: 'biology life sci', cat: 'cat computers computer', it: 'it programming',
  egd: 'egd graphics', econ: 'eco', bus: 'business', acc: 'accounts', geo: 'geo', hist: 'history',
};

const CATEGORY_ORDER = { 'Core Subject': 0, Language: 1, Elective: 2 };

function buildAllSubjects() {
  const byId = new Map();
  SUBJECT_CATALOGUE.forEach((e) => {
    if (!e.approx && !byId.has(e.id)) byId.set(e.id, { id: e.id, name: e.name, category: e.category });
  });
  EXTRA_SUBJECTS.forEach((e) => byId.set(e.id, e));
  AFRICAN_LANGUAGES.forEach(([key, label]) => {
    byId.set(`${key}_sal`, { id: `${key}_sal`, name: `${label} Second Additional Language`, category: 'Language' });
  });
  FOREIGN_SAL.forEach((label) => {
    const id = `${label.toLowerCase().replace(/\s+/g, '_')}_sal`;
    byId.set(id, { id, name: `${label} Second Additional Language`, category: 'Language' });
  });

  return [...byId.values()]
    .map((subj) => {
      const words = [SEARCH_ALIASES[subj.id] || ''];
      if (/home language/i.test(subj.name)) words.push('hl');
      if (/first additional/i.test(subj.name)) words.push('fal');
      if (/second additional/i.test(subj.name)) words.push('sal');
      return { ...subj, keywords: words.join(' ').trim() };
    })
    .sort(
      (a, b) =>
        CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category] || a.name.localeCompare(b.name)
    );
}

export const ALL_NSC_SUBJECTS = buildAllSubjects();

// Subjects that are not already in the student's list (matched by id or by name).
export function getAddableSubjects(currentGrades) {
  const ids = new Set();
  const names = new Set();
  (currentGrades || []).forEach((g) => {
    if (g?.id) ids.add(g.id);
    if (g?.name) names.add(normalise(g.name));
  });
  return ALL_NSC_SUBJECTS.filter((s) => !ids.has(s.id) && !names.has(normalise(s.name)));
}

// Every word typed must appear in the subject's name or search words.
export function searchSubjects(list, query) {
  const tokens = normalise(query || '').split(' ').filter(Boolean);
  if (tokens.length === 0) return list;
  return list.filter((s) => {
    const hay = normalise(`${s.name} ${s.keywords || ''}`);
    return tokens.every((t) => hay.includes(t));
  });
}

// Starting rows when OCR fails and the student types marks in by hand.
export function manualEntryTemplate() {
  const pick = (id, name, category) => ({ id, name, category, percentage: '', level: 0, confidence: 'low' });
  return [
    pick('eng', 'English Home Language', 'Language'),
    pick('afr', 'Afrikaans First Additional Language', 'Language'),
    pick('math', 'Mathematics', 'Core Subject'),
    pick('lo', 'Life Orientation', 'Core Subject'),
  ];
}

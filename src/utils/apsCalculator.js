// src/utils/apsCalculator.js

export function percentageToLevel(percentage) {
  const p = Number(percentage);
  if (p >= 80) return 7;
  if (p >= 70) return 6;
  if (p >= 60) return 5;
  if (p >= 50) return 4;
  if (p >= 40) return 3;
  if (p >= 30) return 2;
  return 1;
}

export function calculateAPS(subjects, rules = { excludeLO: true, maxSubjects: 6 }) {
  if (!Array.isArray(subjects)) {
    return { totalAPS: 0, evaluatedSubjects: [], allSubjects: [] };
  }

  let filtered = subjects
    .filter(Boolean)
    .map((s) => {
      // Support either s.name or s.subject safely
      const rawName = s.name || s.subject || '';
      const subjectName = typeof rawName === 'string' ? rawName.trim() : '';
      const percentage = Number(s.percentage) || 0;
      const level = s.level ? Number(s.level) : percentageToLevel(percentage);
      const isLO = subjectName.toLowerCase().includes('life orientation');

      return {
        name: subjectName,
        subject: subjectName,
        level,
        percentage,
        isLO,
      };
    })
    .filter((s) => s.name.length > 0);

  let loSubject = filtered.find((s) => s.isLO);
  let nonLoSubjects = filtered.filter((s) => !s.isLO);

  // Sort highest to lowest level
  nonLoSubjects.sort((a, b) => b.level - a.level);
  let topSubjects = nonLoSubjects.slice(0, rules.maxSubjects);

  let totalAPS = topSubjects.reduce((sum, s) => sum + s.level, 0);

  if (!rules.excludeLO && loSubject) {
    totalAPS += loSubject.level;
  }

  return {
    totalAPS,
    evaluatedSubjects: topSubjects,
    allSubjects: filtered,
  };
}

// src/services/matchingEngine.js
import { calculateAPS } from '../utils/apsCalculator';

export function evaluateStudentEligibility(studentSubjects, programmes = []) {
  const { totalAPS, allSubjects } = calculateAPS(studentSubjects);

  // Normalized map: { "mathematics": 5, "english home language": 6 }
  const subjectMap = (allSubjects || []).reduce((acc, curr) => {
    if (curr?.name) {
      acc[curr.name.toLowerCase().trim()] = curr.level || 0;
    }
    return acc;
  }, {});

  if (!Array.isArray(programmes)) {
    return [];
  }

  return programmes.map((programme) => {
    const missingRequirements = [];
    const passedRequirements = [];

    // Safely retrieve requirements (handles Supabase format or empty mock data)
    const rawRequirements = Array.isArray(programme?.programme_requirements)
      ? programme.programme_requirements
      : Array.isArray(programme?.admissionRequirements)
      ? programme.admissionRequirements.map((r) => ({
          subject_name: r.subject,
          min_level: r.requiredLevel || 4,
          is_alternative_group: null,
        }))
      : [];

    const groupedRequirements = {};
    const standaloneRequirements = [];

    for (const req of rawRequirements) {
      if (req.is_alternative_group) {
        if (!groupedRequirements[req.is_alternative_group]) {
          groupedRequirements[req.is_alternative_group] = [];
        }
        groupedRequirements[req.is_alternative_group].push(req);
      } else {
        standaloneRequirements.push(req);
      }
    }

    // 1. Evaluate Standalone Prerequisites
    for (const req of standaloneRequirements) {
      const subjectKey = (req.subject_name || '').toLowerCase().trim();
      const studentLevel = subjectMap[subjectKey] || 0;

      if (studentLevel >= req.min_level) {
        passedRequirements.push({
          subject: req.subject_name,
          required: req.min_level,
          achieved: studentLevel,
        });
      } else {
        missingRequirements.push({
          subject: req.subject_name,
          required: req.min_level,
          achieved: studentLevel,
        });
      }
    }

    // 2. Evaluate Alternative Groups (e.g. Maths vs Maths Lit)
    for (const [groupName, options] of Object.entries(groupedRequirements)) {
      let groupPassed = false;
      let bestAchieved = null;

      for (const option of options) {
        const subjectKey = (option.subject_name || '').toLowerCase().trim();
        const studentLevel = subjectMap[subjectKey] || 0;

        if (studentLevel >= option.min_level) {
          groupPassed = true;
          bestAchieved = {
            subject: option.subject_name,
            required: option.min_level,
            achieved: studentLevel,
          };
          break;
        }
      }

      if (groupPassed && bestAchieved) {
        passedRequirements.push(bestAchieved);
      } else {
        missingRequirements.push({
          subject: options.map((o) => `${o.subject_name} (L${o.min_level})`).join(' OR '),
          required: 'Group Requirement',
          achieved: 0,
        });
      }
    }

    const minAps = Number(programme?.min_aps || programme?.requiredAps) || 0;
    const ecpMinAps = Number(programme?.ecp_min_aps) || minAps - 4;

    const meetsSubjects = missingRequirements.length === 0;
    const meetsAPS = totalAPS >= minAps;
    const meetsECP = programme?.ecp_available && totalAPS >= ecpMinAps;

    let status = 'INELIGIBLE';
    if (meetsSubjects && meetsAPS) {
      status = 'DIRECT_MATCH';
    } else if (meetsSubjects && meetsECP) {
      status = 'ECP_ELIGIBLE';
    }

    return {
      ...programme,
      programmeId: programme?.id,
      programmeName: programme?.name || programme?.title,
      faculty: programme?.faculty,
      minAPS: minAps,
      requiredAps: minAps,
      studentAPS: totalAPS,
      status,
      passedRequirements,
      missingRequirements,
    };
  });
}

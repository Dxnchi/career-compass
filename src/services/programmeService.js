// src/services/programmeService.js
import { supabase } from '../lib/supabase';
import { evaluateStudentEligibility } from './matchingEngine';

export async function getMatchingProgrammes(studentSubjects) {
  const { data: programmes, error } = await supabase
    .from('programmes')
    .select(`
      id,
      name,
      faculty,
      min_aps,
      ecp_available,
      ecp_min_aps,
      programme_requirements (
        id,
        subject_name,
        min_level,
        is_alternative_group
      )
    `);

  if (error) throw error;

  const results = evaluateStudentEligibility(studentSubjects, programmes);
  
  return results.sort((a, b) => {
    if (a.status === 'DIRECT_MATCH' && b.status !== 'DIRECT_MATCH') return -1;
    if (b.status === 'DIRECT_MATCH' && a.status !== 'DIRECT_MATCH') return 1;
    return b.studentAPS - a.studentAPS;
  });
}

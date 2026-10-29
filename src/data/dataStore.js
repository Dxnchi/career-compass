export const INITIAL_USER_PROFILE = {
  name: 'Thabo Mokoena',
  grade: 'Grade 11 Student',
  school: 'Brakpan High School, Gauteng',
  email: 'thabo.mokoena@student.za',
  phone: '+27 82 555 0192',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  targetCareer: 'Software Engineering & AI',
  preferredProvince: 'Western Cape / Gauteng',
};

export const INITIAL_SUBJECT_GRADES = [
  { id: 'math', name: 'Mathematics', category: 'Core Subject', level: 5, percentage: 68 },
  { id: 'eng', name: 'English Home Language', category: 'Language', level: 6, percentage: 75 },
  { id: 'phys', name: 'Physical Sciences', category: 'Elective', level: 4, percentage: 58 },
  { id: 'lo', name: 'Life Orientation', category: 'Core Subject', level: 7, percentage: 84 },
  { id: 'afr', name: 'Afrikaans First Additional', category: 'Language', level: 5, percentage: 64 },
  { id: 'geo', name: 'Geography', category: 'Elective', level: 6, percentage: 73 },
];

export function calculateAPS(subjects) {
  if (!Array.isArray(subjects)) return 0;

  // Filter out Life Orientation and take the best 6 subjects
  const nonLo = subjects.filter(
    (s) => !s.name?.toLowerCase().includes('life orientation')
  );

  // Sort descending by achievement level
  nonLo.sort((a, b) => (b.level || 0) - (a.level || 0));

  // Sum top 6 non-LO subjects
  return nonLo.slice(0, 6).reduce((sum, s) => sum + (s.level || 0), 0);
}

export const INITIAL_PROGRAM_MATCHES = [
  {
    id: 'uct-cs',
    title: 'BSc Computer Science',
    universityName: 'University of Cape Town',
    universityShort: 'UCT',
    location: 'Cape Town',
    durationYears: 3,
    nqfLevel: 7,
    matchScore: 95,
    status: 'eligible',
    coverImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80',
    description: 'A rigorous foundation in software engineering, algorithms, and computational theory, preparing you for global tech leadership.',
    requiredAps: 38,
    studentAps: 42,
    aiCareerInsight: 'High demand in South African fintech, cloud engineering, and AI sectors.',
  },
  {
    id: 'sun-ee',
    title: 'BEng Electrical Engineering',
    universityName: 'Stellenbosch University',
    universityShort: 'Stellenbosch',
    location: 'Stellenbosch',
    durationYears: 4,
    nqfLevel: 8,
    matchScore: 88,
    status: 'close',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Specialized education spanning power systems, renewable energy, and embedded electronics.',
    requiredAps: 40,
    studentAps: 39,
    aiCareerInsight: 'Renowned for energy systems and satellite engineering.',
  },
  {
    id: 'up-ds',
    title: 'BCom Data Science',
    universityName: 'University of Pretoria',
    universityShort: 'UP',
    location: 'Pretoria',
    durationYears: 3,
    nqfLevel: 7,
    matchScore: 92,
    status: 'eligible',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Combines commercial acumen, business intelligence, machine learning, and statistical modeling.',
    requiredAps: 34,
    studentAps: 42,
    aiCareerInsight: 'Graduates are sought after by banks (Discovery, Standard Bank, Capitec) and tech consultancies.',
  },
];

export const DEADLINES_DATA = [
  { id: 'dl-1', month: 'AUG', day: '31', title: 'UCT Early Applications', subtitle: 'Submit final grade 11 marks.' },
  { id: 'dl-2', month: 'SEP', day: '30', title: 'Wits General Apps Close', subtitle: 'Ensure NBT results are linked.' },
  { id: 'dl-3', month: 'OCT', day: '31', title: 'NSFAS Funding Opens', subtitle: 'Prepare supporting documents.' },
];
// Add to the bottom of src/data/dataStore.js
import { supabase } from '../lib/supabase';

/**
 * Fetches all programmes from Supabase with nested requirements and university info.
 * Maps DB column names to your UI keys (name -> title, min_aps -> requiredAps).
 */
export async function fetchProgramsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('programmes')
      .select(`
        id,
        name,
        faculty,
        min_aps,
        ecp_available,
        ecp_min_aps,
        description,
        cover_image,
        institutions (
          name,
          code
        ),
        programme_requirements (
          id,
          subject_name,
          min_level,
          is_alternative_group
        )
      `);

    if (error) {
      console.warn('Supabase fetchPrograms error, falling back to initial data:', error.message);
      return INITIAL_PROGRAM_MATCHES;
    }

    if (!data || data.length === 0) {
      return INITIAL_PROGRAM_MATCHES;
    }

    // Map database shape to match your UI's expected card properties
    return data.map((prog) => ({
      id: prog.id,
      title: prog.name,
      name: prog.name,
      faculty: prog.faculty,
      requiredAps: prog.min_aps,
      min_aps: prog.min_aps,
      ecp_available: prog.ecp_available,
      ecp_min_aps: prog.ecp_min_aps,
      universityName: prog.institutions?.name || 'South African University',
      universityShort: prog.institutions?.code || 'SA',
      description: prog.description || 'Undergraduate degree programme.',
      coverImage: prog.cover_image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      programme_requirements: prog.programme_requirements || [],
    }));
  } catch (err) {
    console.error('Network error fetching programs:', err);
    return INITIAL_PROGRAM_MATCHES;
  }
}

/**
 * Fetches university institutions for ExploreScreen
 */
export async function fetchUniversitiesFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('institutions')
      .select('*');

    if (error) {
      console.warn('Supabase fetchUniversities error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Network error fetching universities:', err);
    return [];
  }
}
import { supabase } from '../lib/supabase';

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
  return subjects.reduce((sum, subject) => sum + subject.level, 0);
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

// Offline fallback list for the Explore screen (used when Supabase is unreachable or empty).
export const UNIVERSITIES_DATA = [
  { id: 'uni-uct', name: 'University of Cape Town', location: 'Cape Town, Western Cape', description: 'Public research university in Cape Town.' },
  { id: 'uni-wits', name: 'University of the Witwatersrand', location: 'Johannesburg, Gauteng', description: 'Public research university in Johannesburg.' },
  { id: 'uni-up', name: 'University of Pretoria', location: 'Pretoria, Gauteng', description: 'Public research university in Pretoria.' },
  { id: 'uni-sun', name: 'Stellenbosch University', location: 'Stellenbosch, Western Cape', description: 'Public research university in Stellenbosch.' },
  { id: 'uni-uj', name: 'University of Johannesburg', location: 'Johannesburg, Gauteng', description: 'Public university in Johannesburg.' },
];

// ---- Supabase loaders used by App.js on start-up ----
// These never throw: on any problem (offline, missing table, unexpected columns) they return null,
// and App.js keeps the bundled offline data above.
// NOTE: table names 'programs' and 'universities' are assumptions. Change them if your tables differ.
const looksLikeProgram = (r) => r && typeof r.title === 'string' && typeof r.universityName === 'string';
const looksLikeUniversity = (r) => r && typeof r.name === 'string';

async function loadTable(table, isValid) {
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error || !Array.isArray(data)) return null;
    const rows = data.filter(isValid);
    return rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
}

export const fetchProgramsFromSupabase = () => loadTable('programs', looksLikeProgram);
export const fetchUniversitiesFromSupabase = () => loadTable('universities', looksLikeUniversity);

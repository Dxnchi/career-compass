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
  { id: '1', name: 'English Home Language', subject: 'English Home Language', percentage: 72, level: 6 },
  { id: '2', name: 'Mathematics', subject: 'Mathematics', percentage: 68, level: 5 },
  { id: '3', name: 'Physical Sciences', subject: 'Physical Sciences', percentage: 64, level: 5 },
  { id: '4', name: 'Life Sciences', subject: 'Life Sciences', percentage: 75, level: 6 },
  { id: '5', name: 'Geography', subject: 'Geography', percentage: 70, level: 6 },
  { id: '6', name: 'IsiZulu First Additional Language', subject: 'IsiZulu First Additional Language', percentage: 78, level: 6 },
  { id: '7', name: 'Life Orientation', subject: 'Life Orientation', percentage: 82, level: 7 },
];

export const INITIAL_PROGRAM_MATCHES = [
  {
    id: 'prog-1',
    title: 'BSc Computer Science & Informatics',
    name: 'BSc Computer Science & Informatics',
    universityName: 'University of Johannesburg',
    faculty: 'Science',
    location: 'Auckland Park, Johannesburg',
    min_aps: 30,
    requiredAps: 30,
    ecp_available: true,
    ecp_min_aps: 26,
    durationYears: 3,
    nqfLevel: 7,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Focuses on software engineering, algorithms, database systems, and artificial intelligence.',
    aiCareerInsight: 'High demand across South African fintech, cloud consulting, and telecommunications sectors.',
    programme_requirements: [
      { subject_name: 'Mathematics', min_level: 5, is_alternative_group: null },
      { subject_name: 'English Home Language', min_level: 4, is_alternative_group: 'ENG' },
      { subject_name: 'English First Additional Language', min_level: 5, is_alternative_group: 'ENG' },
    ],
  },
  {
    id: 'prog-2',
    title: 'BCom Information Systems',
    name: 'BCom Information Systems',
    universityName: 'University of Johannesburg',
    faculty: 'College of Business & Economics',
    location: 'Auckland Park, Johannesburg',
    min_aps: 28,
    requiredAps: 28,
    ecp_available: true,
    ecp_min_aps: 25,
    durationYears: 3,
    nqfLevel: 7,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Bridges business strategy and enterprise software development, systems analysis, and digital transformation.',
    aiCareerInsight: 'Strong graduate placement as Business Analysts, Systems Architects, and Product Managers.',
    programme_requirements: [
      { subject_name: 'Mathematics', min_level: 4, is_alternative_group: null },
      { subject_name: 'English Home Language', min_level: 4, is_alternative_group: 'ENG' },
      { subject_name: 'English First Additional Language', min_level: 4, is_alternative_group: 'ENG' },
    ],
  },
  {
    id: 'prog-3',
    title: 'BSc Eng Electrical & Information Engineering',
    name: 'BSc Eng Electrical & Information Engineering',
    universityName: 'University of the Witwatersrand',
    faculty: 'Engineering & the Built Environment',
    location: 'Braamfontein, Johannesburg',
    min_aps: 42,
    requiredAps: 42,
    ecp_available: false,
    ecp_min_aps: 42,
    durationYears: 4,
    nqfLevel: 8,
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Covers embedded systems, power electronics, telecommunications, and software engineering.',
    aiCareerInsight: 'Accredited by ECSA for international engineering recognition.',
    programme_requirements: [
      { subject_name: 'Mathematics', min_level: 6, is_alternative_group: null },
      { subject_name: 'Physical Sciences', min_level: 6, is_alternative_group: null },
      { subject_name: 'English Home Language', min_level: 5, is_alternative_group: 'ENG' },
      { subject_name: 'English First Additional Language', min_level: 5, is_alternative_group: 'ENG' },
    ],
  },
];

export const UNIVERSITIES_DATA = [
  {
    id: 'uj',
    code: 'UJ',
    name: 'University of Johannesburg',
    location: 'Johannesburg, Gauteng',
    province: 'Gauteng',
    ranking: 5,
    closeDate: '30 Sep',
    portalUrl: 'https://www.uj.ac.za/admissions-aid/apply/',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Renowned for Science, Accounting, Engineering, and cutting-edge 4IR initiatives.',
  },
  {
    id: 'wits',
    code: 'WITS',
    name: 'University of the Witwatersrand',
    location: 'Braamfontein, Gauteng',
    province: 'Gauteng',
    ranking: 2,
    closeDate: '30 Sep',
    portalUrl: 'https://www.wits.ac.za/undergraduate/apply-to-wits/',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'World-class research institution leading in Medicine, Mining, Commerce, and Law.',
  },
  {
    id: 'uct',
    code: 'UCT',
    name: 'University of Cape Town',
    location: 'Rondebosch, Western Cape',
    province: 'Western Cape',
    ranking: 1,
    closeDate: '31 Jul',
    portalUrl: 'https://applyonline.uct.ac.za/',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    description: 'Top-ranked African university offering prestigious faculties across all academic disciplines.',
  },
  {
    id: 'up',
    code: 'UP',
    name: 'University of Pretoria',
    location: 'Pretoria, Gauteng',
    province: 'Gauteng',
    ranking: 4,
    closeDate: '31 Aug',
    portalUrl: 'https://www.up.ac.za/online-application',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    description: 'Leader in Engineering (EBIT), Veterinary Science, Law, and Health Sciences.',
  },
];

export const DEADLINES_DATA = [
  { id: 'dl-1', month: 'AUG', day: '31', title: 'UCT Early Applications', subtitle: 'Submit final grade 11 marks.' },
  { id: 'dl-2', month: 'SEP', day: '30', title: 'Wits General Apps Close', subtitle: 'Ensure NBT results are linked.' },
  { id: 'dl-3', month: 'OCT', day: '31', title: 'NSFAS Funding Opens', subtitle: 'Prepare supporting documents.' },
];

// Offline fallback list for the Explore screen (used when Supabase is unreachable or empty).
export const UNIVERSITY_DATA = [
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

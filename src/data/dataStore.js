import { supabase } from '../lib/supabase';

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
  {
    id: 'd1',
    category: 'Funding',
    month: 'SEP',
    day: '01',
    title: 'NSFAS Online Applications Open',
    subtitle: 'Apply early on my.nsfas.org.za with certified ID and proof of income.',
    url: 'https://my.nsfas.org.za/',
  },
  {
    id: 'd2',
    category: 'Admissions',
    month: 'SEP',
    day: '30',
    title: 'UJ & Wits General Admissions Close',
    subtitle: 'Final deadline for undergraduate degree applications.',
    url: 'https://www.uj.ac.za/admissions-aid/apply/',
  },
  {
    id: 'd3',
    category: 'Testing',
    month: 'OCT',
    day: '14',
    title: 'National Benchmark Test (NBT) Window',
    subtitle: 'Final booking window for faculties requiring AQL and MAT scores.',
    url: 'https://www.nbt.ac.za/',
  },
];

export async function fetchProgramsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('programmes')
      .select(`
        *,
        institutions ( name, code ),
        programme_requirements ( subject_name, min_level, is_alternative_group )
      `);

    if (error) throw error;
    if (!data || data.length === 0) return INITIAL_PROGRAM_MATCHES;

    return data.map((item) => ({
      ...item,
      id: item.id,
      title: item.name || item.title || 'Degree Programme',
      name: item.name || item.title || 'Degree Programme',
      universityName: item.institutions?.name || 'South African University',
      universityCode: item.institutions?.code || '',
      faculty: item.faculty || 'General Faculty',
      location: item.location || 'South Africa',
      min_aps: item.min_aps || 26,
      requiredAps: item.min_aps || 26,
      ecp_available: Boolean(item.ecp_available),
      ecp_min_aps: item.ecp_min_aps || (item.min_aps ? item.min_aps - 4 : 22),
      durationYears: item.duration_years || 3,
      nqfLevel: item.nqf_level || 7,
      coverImage:
        item.cover_image ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      description:
        item.description ||
        `Undergraduate ${item.faculty || ''} programme offered at ${item.institutions?.name || 'the university'}.`,
      aiCareerInsight:
        item.ai_career_insight ||
        'Graduates qualify for strong entry-level roles across South African private and public sectors.',
      programme_requirements: Array.isArray(item.programme_requirements)
        ? item.programme_requirements
        : [],
    }));
  } catch (err) {
    console.warn('Supabase fetchPrograms notice, using fallback data:', err.message);
    return INITIAL_PROGRAM_MATCHES;
  }
}

export async function fetchUniversitiesFromSupabase() {
  try {
    const { data, error } = await supabase.from('institutions').select('*');
    if (error) throw error;
    if (!data || data.length === 0) return UNIVERSITIES_DATA;

    return data.map((u, idx) => ({
      id: u.id || `uni-${idx}`,
      code: u.code || 'UNI',
      name: u.name || 'University',
      location: u.location || 'South Africa',
      province: u.province || 'Gauteng',
      ranking: u.ranking || idx + 1,
      closeDate: u.close_date || '30 Sep',
      portalUrl: u.portal_url || `https://www.google.com/search?q=${encodeURIComponent(u.name + ' online application')}`,
      image:
        u.image ||
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
      description:
        u.description ||
        `Official undergraduate admissions and degree faculties for ${u.name}.`,
    }));
  } catch (err) {
    console.warn('Supabase fetchUniversities notice, using fallback data:', err.message);
    return UNIVERSITIES_DATA;
  }
}

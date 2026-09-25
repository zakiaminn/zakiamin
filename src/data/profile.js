// Single source of truth for the personal facts that show up in more than one
// place (the toolkit, the experience ledger, the résumé view, the contact
// section). Keeping them here stops the on-site copy and the résumé from
// drifting apart.

export const profile = {
  name: 'Zaki Amin',
  role: 'Data & Full-Stack Engineer',
  location: 'Toronto, Canada',
  // What a recruiter most needs to know, up front.
  // A non-breaking hyphen (U+2011) so "co-op" never splits across lines.
  seeking: 'Summer 2027 co\u2011op',
  email: 'zakiiaminn@gmail.com',
  github: 'https://github.com/zakiaminn',
  linkedin: 'https://www.linkedin.com/in/zakiamin/',
};

export const skillGroups = [
  {
    label: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'Java', 'C', 'C++', 'C#'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'Node / Express', 'FastAPI', '.NET'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'TimescaleDB', 'Redis', 'Supabase', 'pandas / NumPy'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Docker', 'Vercel', 'Railway', 'Xcode', 'Android Studio'],
  },
];

// `kind` lets the résumé split this single list into Education vs Experience
// while the on-page section still renders it as one chronological run.
// `start`/`end` are kept apart so the years can be set in the mono and the
// words in Bricolage. A null `end` reads as "present".
export const timeline = [
  {
    id: 'sheridan',
    kind: 'education',
    start: '2024',
    end: null,
    role: 'Computer Science, Sheridan College',
    detail:
      'Specializing in data analytics: data pipelines, database management, and software architecture. The trading and analytics systems on this page were built outside of coursework.',
  },
  {
    id: 'freelance',
    kind: 'experience',
    start: '2022',
    end: '2024',
    role: 'Freelance Web Developer',
    detail:
      'Designed and shipped custom web applications for clients, including a real estate platform with dynamic listing logic and bespoke React components.',
  },
];

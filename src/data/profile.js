// Single source of truth for the personal facts that show up in more than one
// place (About skills, the Experience timeline, the résumé view, the footer).
// Keeping them here stops the on-site copy and the résumé from drifting apart.

export const profile = {
  name: 'Zaki Amin',
  role: 'Data & Full-Stack Engineer',
  location: 'Toronto, Canada',
  // What a recruiter most needs to know, up front.
  seeking: 'Summer 2027 Co-op',
  email: 'zakiiaminn@gmail.com',
  github: 'https://github.com/zakiaminn',
  linkedin: 'https://www.linkedin.com/in/zakiamin/',
};

export const skillGroups = [
  {
    label: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#'],
  },
  {
    label: 'Frameworks & Runtimes',
    items: ['React', 'Next.js', 'Node / Express', 'FastAPI', '.NET'],
  },
  {
    label: 'Data & Infrastructure',
    items: ['SQL', 'PostgreSQL', 'TimescaleDB', 'Redis', 'Supabase', 'Data Analytics'],
  },
  {
    label: 'Tools & Platforms',
    items: ['Git', 'Docker', 'Xcode', 'Android Studio', 'Vercel / Railway'],
  },
];

// `kind` lets the résumé split this single list into Education vs Experience
// while the on-page section still renders it as one chronological run.
export const timeline = [
  {
    id: 'sheridan',
    kind: 'education',
    year: '2024 - Present',
    role: 'Computer Science, Sheridan College',
    detail:
      'Specializing in Data Analytics: data pipelines, database management, and scalable software architecture. Building telemetry and analytics engines outside of coursework, not just for it.',
  },
  {
    id: 'freelance',
    kind: 'experience',
    year: '2022 - 2024',
    role: 'Freelance Web Developer',
    detail:
      'Designed and shipped custom web applications for clients, including a real estate platform with dynamic listing logic, bespoke React components, and interface polish clients actually noticed.',
  },
  {
    id: 'calgary',
    kind: 'education',
    year: '2021 - 2023',
    role: 'Computer Science, University of Calgary',
    detail:
      'Foundational computer science coursework: the algorithms and software-design fundamentals everything since has built on.',
  },
];

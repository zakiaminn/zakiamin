// Personal profile information for the résumé page

export const profile = {
  name: 'Zaki Amin Ahmad',
  role: 'Data & Full-Stack Engineer',
  location: 'Toronto, Canada',
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

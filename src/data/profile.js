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
    items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'Java', 'C', 'C++', 'C#', 'HTML / CSS', 'Bash', 'Assembly (MIPS, x86)'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'Node / Express', 'FastAPI', 'Spring Boot', 'ASP.NET Core', '.NET MAUI', 'Blazor', 'Tailwind CSS', 'Vite', 'Framer Motion', 'three.js', 'Streamlit'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'PostGIS', 'TimescaleDB', 'SQL Server', 'SQLite', 'Redis', 'Supabase', 'Firebase', 'SQLAlchemy', 'Entity Framework Core', 'pandas / NumPy / SciPy', 'Jupyter', 'Excel', 'SSIS', 'BeautifulSoup', 'Hadoop / HDFS'],
  },
  {
    label: 'Practices',
    items: ['ETL pipelines', 'Data warehousing (star schema, OLAP)', 'REST APIs', 'OAuth 2.0 / JWT', 'Statistical testing', 'UML & design patterns', 'TCP/IP & sockets', 'LLM integration'],
  },
  {
    label: 'Testing',
    items: ['pytest', 'JUnit', 'Vitest', 'Playwright'],
  },
  {
    label: 'DevOps & cloud',
    items: ['Git', 'GitHub Actions', 'Docker', 'Linux', 'Cloudflare', 'Oracle Cloud', 'Gradle', 'CMake', 'npm'],
  },
  {
    label: 'Tools',
    items: ['Wireshark', 'SAP ERP', 'Xcode', 'Android Studio'],
  },
  {
    label: 'Hardware',
    items: ['ESP32', 'Arduino / PlatformIO', 'VHDL / Quartus', '3D CAD (build123d)'],
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

// Number, date and name formatting for the analytics page.

const whole = new Intl.NumberFormat('en-CA');
const compact = new Intl.NumberFormat('en-CA', { notation: 'compact', maximumFractionDigits: 1 });

/** 1,284 in full under 10,000; 12.9K above. */
export function formatCount(value) {
  return value >= 10000 ? compact.format(value) : whole.format(value);
}

const MINUS = '−';

/**
 * The change on the previous period as { text, tone }: "+12%" is pos, "−8%"
 * is neg (a real minus), and a period with nothing to compare against says so.
 */
export function formatChange(current, previous) {
  if (!previous) return current ? { text: 'New', tone: 'pos' } : { text: 'No change', tone: 'flat' };
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return { text: 'No change', tone: 'flat' };
  return change > 0 ? { text: `+${change}%`, tone: 'pos' } : { text: `${MINUS}${Math.abs(change)}%`, tone: 'neg' };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const clock = new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false });

// "2026-11-25" is a calendar day, not an instant, so it's read as UTC midnight.
const asDate = (day) => new Date(`${day}T00:00:00Z`);

/** "25 Nov" */
export function formatDay(day) {
  const date = asDate(day);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

/** "Wed 25 Nov" */
export function formatDayLong(day) {
  return `${WEEKDAYS[asDate(day).getUTCDay()]} ${formatDay(day)}`;
}

/** "14:02", in the reader's own time */
export const formatClock = (iso) => clock.format(new Date(iso));

const PAGES = {
  '/': 'Front page',
  '/batin/': 'Batin write-up',
};

export const pageName = (path) => PAGES[path] || path;

export function referrerName(domain) {
  if (!domain || domain === '$direct') return 'Direct or unknown';
  return domain.replace(/^www\./, '');
}

// The values the site sends in link_type, source, section and cta.
const DETAILS = {
  email: 'Email',
  'copy-email': 'Copied the address',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  live: 'Live site',
  writeup: 'Write-up',
  npm: 'npm',
  hero: 'Lead story',
  nav: 'Masthead or bar',
  footer: 'Bookend',
  work: 'Work',
  experience: 'Experience',
  toolkit: 'Toolkit',
  contact: 'Contact',
};

export const detailName = (detail) => DETAILS[detail] || detail || 'Not recorded';

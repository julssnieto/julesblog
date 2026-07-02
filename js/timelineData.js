// Career/education timeline + skills + languages for the About/Portfolio
// page. Changes rarely, so this is a plain hardcoded module rather than a
// database table — edit and redeploy when it needs updating.

export const SKILLS = [
  'Excel · Power Query · VBA', 'Power BI', 'PowerPoint', 'SQL',
  'Agile · Scrum', 'Jira', 'AI automation'
];

export const TIMELINE = [
  { year: '2025', month: 'April', mono: 'PwC', org: 'PwC Netherlands', loc: 'Amsterdam', now: true,
    role: 'Operations Transformation — Senior Consultant',
    desc: 'Helping NN Group allocate capital into AI: a prioritisation framework and multi-year business cases used across 9 countries, with commercial KPIs so investment lands on the highest-ROI use cases.',
    tags: ['AI strategy', 'Prioritisation', 'Business cases', 'Commercial KPIs'] },
  { year: '2023', month: 'June', mono: 'PwC', org: 'PwC Netherlands', loc: 'Amsterdam', now: false,
    role: 'Operations Transformation — Consultant',
    desc: 'Supported HEINEKEN on a large-scale agile transformation of their global pricing & promotions strategy across 5 countries, and analysed an automotive org structure across 6 European countries.',
    tags: ['Agile delivery', 'Pricing & promotions', 'SQL', 'Excel VBA', 'Power BI'] },
  { year: '2023', month: 'March', mono: 'PwC', org: 'PwC Netherlands', loc: 'Amsterdam', now: false,
    role: 'Program & Portfolio Management Intern',
    desc: 'First step into consulting — supporting program and portfolio delivery across client engagements.',
    tags: ['Program management', 'Portfolio', 'Jira'] },
  { year: '2021', month: 'September', mono: 'VU', org: 'Vrije Universiteit Amsterdam', loc: 'Amsterdam', now: false,
    role: 'MSc, Business Strategy & Organisation',
    desc: 'Master’s focused on strategy and organisation design, bridging analytical rigour with how change actually lands in a business.',
    tags: ['Business strategy', 'Organisation design', 'Graduated 2023'] },
  { year: '2021', month: 'February', mono: 'RMT', org: 'RMT', loc: 'Barcelona', now: false,
    role: 'Strategy & Sales Intern',
    desc: 'Shaped the market-expansion strategy of a sustainable-construction startup through European market research and partnership analysis.',
    tags: ['Market research', 'Go-to-market', 'Partnerships', 'Accelerator finalist'] },
  { year: '2017', month: 'September', mono: 'UB', org: 'University of Barcelona', loc: 'Barcelona', now: false,
    role: 'BSc, International Business Administration',
    desc: 'Honours in International Commercial Management, with distinctions in international operations and in organisation, innovation & technology.',
    tags: ['International business', 'Honours', 'Graduated 2021'] }
];

export const LANGS = [
  ['Spanish', 'Native'], ['Catalan', 'Native'], ['English', 'Fluent'],
  ['German', 'Fluent'], ['Dutch', 'B1'], ['French', 'B1']
];

// Career/education timeline + skills + languages for the About/Portfolio
// page. Changes rarely, so this is a plain hardcoded module rather than a
// database table — edit and redeploy when it needs updating.

export const SKILLS = [
  'Excel · Power Query · VBA', 'PowerPoint', 'Power BI',
  'Agile · Scrum', 'Jira', 'AI Web/App Dev'
];

export const EXPERIENCE = [
  {
    year: '2025', dateRange: 'Apr 2025 – Jun 2026', mono: 'PwC',
    org: 'PwC Netherlands', loc: 'Amsterdam', now: true,
    role: 'TOM & Transformation — Senior Consultant',
    intro: 'I specialize in Target Operating Model (TOM) design — shaping new processes, governance, and ways of working for any kind of organizational transformation. My work runs across the full picture: redesigning end-to-end processes and decision-making structures, defining accountability and governance, and standing up the program and portfolio management capabilities that keep large-scale change on track.',
    projects: [
      {
        name: 'Financial services organization',
        desc: 'Supported in strategically allocating its capital into AI, by designing a robust prioritization framework and multi-year Business Cases to be used across 9 countries. Defined commercial KPIs to ensure resource allocation was aligned with the most profitable use cases and drive high ROI. Designed the new processes & governance for their Data & AI teams across nine countries.',
        tags: ['Strategic Portfolio Management', 'TOM Design', 'Data & AI']
      },
      {
        name: 'Telecommunications company',
        desc: 'Assessed and delivered a high-level redesign of their end-to-end Purchase-to-Pay processes, producing an in-depth report alongside a target operating model and implementation roadmap.',
        tags: ['TOM Assessment & Roadmap', 'Purchase-to-Pay']
      },
      {
        name: 'Leading automotive company',
        desc: 'Conducted a thorough analysis of their organizational structure across six European countries, leveraging SQL and Excel Macro VBA. Delivered a comprehensive, data-backed assessment with actionable recommendations for organizational optimization.',
        tags: ['Organizational Design', 'Data Analytics']
      },
      {
        name: 'Geoengineering company',
        desc: 'Supported a Global Business Services (GBS) transformation of their Finance function, focusing on the change management needed for the transformation to land well, alongside program management.',
        tags: ['Change Management', 'GBS Finance', 'Program Management']
      }
    ]
  },
  {
    year: '2023', dateRange: 'Jun 2023 – Mar 2025', mono: 'PwC',
    org: 'PwC Netherlands', loc: 'Amsterdam', now: false,
    role: 'TOM & Transformation — Consultant',
    projects: [
      {
        name: 'HEINEKEN',
        desc: 'Spent over 1.5 years in a large-scale technology implementation program supporting HEINEKEN’s global pricing and promotions strategy. Worked with multiple cross-functional teams across five countries to plan, monitor, and drive execution, using Agile Scrum and Jira.',
        tags: ['Agile · Scrum', 'Pricing & Promotions', 'Cross-functional Delivery']
      },
      {
        name: 'Financial services provider',
        desc: 'Helped design the portfolio management practice for their Finance Transformation Office (FTO).',
        tags: ['Portfolio Management', 'Finance Transformation', 'Operating Model Design']
      }
    ]
  },
  {
    year: '2023', dateRange: 'Mar 2023 – May 2023', mono: 'PwC',
    org: 'PwC Netherlands', loc: 'Amsterdam', now: false,
    role: 'Program & Portfolio Management Intern',
    intro: 'Supported a range of internal initiatives, most notably the development of a Strategic Portfolio Management handbook, along with hands-on project and portfolio management work.',
    tags: ['Portfolio Management', 'Strategic Handbook', 'Project Coordination']
  },
  {
    year: '2021', dateRange: 'Feb 2021 – Jul 2021', mono: 'RMT',
    org: 'RMT', loc: 'Barcelona', now: false,
    role: 'Strategy & Sales Intern',
    intro: 'Supported the market expansion strategy of a sustainable construction startup based in Barcelona through extensive market research and analysis of strategic partnerships across various European countries.',
    tags: ['Market Research', 'Go-to-Market', 'Partnerships']
  }
];

export const EDUCATION = [
  {
    year: '2021', dateRange: '2021 – 2023', mono: 'VU',
    org: 'Vrije Universiteit Amsterdam', loc: 'Amsterdam',
    role: 'MSc, Business Strategy & Organisation',
    desc: 'A research-driven program focused on how organizations grow, renew, and reinvent themselves. Coursework spanned strategic entrepreneurship and organizational renewal, growth strategies, new business models and consulting, corporate social responsibility, multi-stakeholder management, business ethics, and cross-cultural management.'
  },
  {
    year: '2017', dateRange: '2017 – 2021', mono: 'UB',
    org: 'University of Barcelona', loc: 'Barcelona',
    role: 'BSc, International Business Administration',
    desc: 'A broad, international foundation in business. Graduated with (MH) honours in 3 subjects: International Commercial Management, German and English for business, and (EX) excellence in International Operations Management and Organization, Innovation and Technology.'
  }
];

export const CERTIFICATES = [
  'Professional Scrum Product Owner',
  'Professional Scrum Master',
  'CAPM Certified — Project Management Institute',
  'Leading SAFe',
  'Lean Six Sigma Yellow Belt',
  'Finalist, 6-Month Startup Accelerator Competition'
];

export const LANGS = [['Spanish', 'Native'], ['Catalan', 'Native'], ['English', 'Fluent'], ['German', 'Fluent'], ['Dutch', 'B1'], ['French', 'B1']];

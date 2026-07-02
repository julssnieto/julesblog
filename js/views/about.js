import { esc } from '../utils.js';
import { SKILLS, EXPERIENCE, EDUCATION, CERTIFICATES, LANGS } from '../timelineData.js';

const PROJECT_COLORS = ['var(--ocean)', 'var(--accent-2)', 'var(--ink)'];

function tagsHTML(tags) {
  return '<div class="ktl-tags">' + tags.map(t => '<span class="ktl-tag">' + esc(t) + '</span>').join('') + '</div>';
}

function projectHTML(p, i) {
  const c = PROJECT_COLORS[i % PROJECT_COLORS.length];
  return '<div class="ktl-project" style="border-left-color:' + c + '">'
    + '<h4 class="ktl-project-name" style="color:' + c + '">' + esc(p.name) + '</h4>'
    + '<p class="ktl-project-desc">' + esc(p.desc) + '</p>'
    + tagsHTML(p.tags)
    + '</div>';
}

function expItem(j) {
  return '<div class="ktl-item reveal' + (j.now ? ' ktl-now' : '') + '">'
    + '<div class="ktl-date"><div class="ktl-year">' + esc(j.year) + '</div><div class="ktl-month">' + esc(j.dateRange) + '</div></div>'
    + '<div class="ktl-nodecol"><div class="ktl-node">' + esc(j.mono) + '</div></div>'
    + '<div class="ktl-card">'
    + '<div class="ktl-org">' + esc(j.org) + ' <span>· ' + esc(j.loc) + '</span></div>'
    + '<h3 class="ktl-role">' + esc(j.role) + '</h3>'
    + (j.intro ? '<p class="ktl-desc">' + esc(j.intro) + '</p>' : '')
    + (j.projects ? '<div class="ktl-projects">' + j.projects.map(projectHTML).join('') + '</div>' : '')
    + (!j.projects && j.tags ? tagsHTML(j.tags) : '')
    + '</div></div>';
}

function eduItem(e) {
  return '<div class="ktl-item reveal">'
    + '<div class="ktl-date"><div class="ktl-year">' + esc(e.year) + '</div><div class="ktl-month">' + esc(e.dateRange) + '</div></div>'
    + '<div class="ktl-nodecol"><div class="ktl-node">' + esc(e.mono) + '</div></div>'
    + '<div class="ktl-card">'
    + '<div class="ktl-org">' + esc(e.org) + ' <span>· ' + esc(e.loc) + '</span></div>'
    + '<h3 class="ktl-role">' + esc(e.role) + '</h3>'
    + '<p class="ktl-desc">' + esc(e.desc) + '</p>'
    + '</div></div>';
}

function certHTML() {
  return '<div class="cert-section"><p class="label">Certificates</p>'
    + '<div class="cert-grid">' + CERTIFICATES.map(c => '<span class="cert-chip">✓ ' + esc(c) + '</span>').join('') + '</div></div>';
}

export function renderAbout() {
  return '<div class="fade">'
    + '<section class="about-hero"><div class="inner"><img src="assets/jules.jpg" alt="Julia Nieto"><div>'
    + '<p class="label">My Portfolio</p><h1>Julia Nieto</h1>'
    + '<p>I’m a <em>lifelong learner</em> helping organizations translate complex data into actionable strategies to drive <span class="hl-sweep">profitability and growth</span>.</p>'
    + '</div></div></section>'
    + '<section class="about-sec"><div class="about-lead"><span>Half Spanish, half German, living in the Netherlands.</span> In my free time, I enjoy traveling and practicing sports with a board (e.g. skateboarding and surfing).</div>'
    + '<p class="about-body">Technical Skills</p>'
    + '<div class="skills">' + SKILLS.map(s => '<span class="skill">' + esc(s) + '</span>').join('') + '</div></section>'
    + '<section class="about-sec" style="padding-top:52px"><p class="label">Experience</p><h2 class="tl-title">The journey so far — <em>most recent first</em></h2>'
    + '<div class="ktl"><div class="ktl-rail"><span class="ktl-fill"></span></div>' + EXPERIENCE.map(expItem).join('') + '</div></section>'
    + '<section class="about-sec" style="padding-top:52px"><p class="label">Education</p><h2 class="tl-title">The academic path — <em>most recent first</em></h2>'
    + '<div class="ktl"><div class="ktl-rail"><span class="ktl-fill"></span></div>' + EDUCATION.map(eduItem).join('') + '</div>'
    + certHTML()
    + '</section>'
    + '<section class="about-grid" style="grid-template-columns:1fr">'
    + '<div><p class="label">Languages</p><div class="langs">' + LANGS.map(l => '<div class="lang"><b>' + esc(l[0]) + '</b><br><span>' + esc(l[1]) + '</span></div>').join('') + '</div></div>'
    + '</section></div>';
}

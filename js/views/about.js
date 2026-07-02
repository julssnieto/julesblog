import { esc } from '../utils.js';
import { SKILLS, TIMELINE, LANGS } from '../timelineData.js';

export function renderAbout() {
  const items = TIMELINE.map(j => (
    '<div class="ktl-item reveal' + (j.now ? ' ktl-now' : '') + '">'
    + '<div class="ktl-date"><div class="ktl-year">' + esc(j.year) + '</div><div class="ktl-month">' + esc(j.month) + '</div></div>'
    + '<div class="ktl-nodecol"><div class="ktl-node">' + esc(j.mono) + '</div></div>'
    + '<div class="ktl-card">'
    + '<div class="ktl-org">' + esc(j.org) + ' <span>· ' + esc(j.loc) + '</span></div>'
    + '<h3 class="ktl-role">' + esc(j.role) + '</h3>'
    + '<p class="ktl-desc">' + esc(j.desc) + '</p>'
    + '<div class="ktl-tags">' + j.tags.map(t => '<span class="ktl-tag">' + esc(t) + '</span>').join('') + '</div>'
    + '</div></div>'
  )).join('');

  return '<div class="fade">'
    + '<section class="about-hero"><div class="inner"><img src="assets/jules.jpg" alt="Julia Nieto"><div>'
    + '<p class="label">My Portfolio</p><h1>Julia Nieto</h1>'
    + '<p>I’m a <em>lifelong learner</em> helping organizations translate complex data into actionable strategies to drive <span class="hl-sweep">profitability and growth</span>.</p>'
    + '</div></div></section>'
    + '<section class="about-sec"><div class="about-lead"><span>Half Spanish, half German, living in the Netherlands.</span> In my free time, I enjoy traveling and practicing sports with a board (e.g. skateboarding and surfing).</div>'
    + '<p class="about-body">Find below my experience ↓</p>'
    + '<div class="skills">' + SKILLS.map(s => '<span class="skill">' + esc(s) + '</span>').join('') + '</div></section>'
    + '<section class="about-sec" style="padding-top:52px"><p class="label">Experience &amp; education</p><h2 class="tl-title">The journey so far — <em>most recent first</em></h2>'
    + '<div class="ktl"><div class="ktl-rail"><span class="ktl-fill"></span></div>' + items + '</div></section>'
    + '<section class="about-grid" style="grid-template-columns:1fr">'
    + '<div><p class="label">Languages</p><div class="langs">' + LANGS.map(l => '<div class="lang"><b>' + esc(l[0]) + '</b><br><span>' + esc(l[1]) + '</span></div>').join('') + '</div></div>'
    + '</section></div>';
}

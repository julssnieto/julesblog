import { esc, fmtShort, readTime, prefersReduced } from '../utils.js';

// Soft, faded multicolor blob patterns (blue/gold/warm-neutral only, no
// green) used behind the featured post in place of a real cover photo.
// Deterministically picked per category so the same category always gets
// the same look, without needing any image upload.
const ART_THEMES = [
  'radial-gradient(circle at 18% 22%, #CDE4F0 0%, transparent 55%), radial-gradient(circle at 82% 18%, #F6D262 0%, transparent 52%), radial-gradient(circle at 55% 88%, #0B4A6F 0%, transparent 62%), linear-gradient(rgba(255,255,255,.32),rgba(255,255,255,.32))',
  'radial-gradient(circle at 20% 80%, #6FA6C4 0%, transparent 55%), radial-gradient(circle at 80% 75%, #EAB308 0%, transparent 50%), radial-gradient(circle at 50% 15%, #DCEAF1 0%, transparent 60%), linear-gradient(rgba(255,255,255,.3),rgba(255,255,255,.3))',
  'radial-gradient(circle at 25% 30%, #E0A800 0%, transparent 50%), radial-gradient(circle at 78% 65%, #8FC1DE 0%, transparent 55%), radial-gradient(circle at 55% 95%, #3A2A1E 0%, transparent 68%), linear-gradient(rgba(255,255,255,.38),rgba(255,255,255,.38))',
  'radial-gradient(circle at 15% 70%, #0B4A6F 0%, transparent 58%), radial-gradient(circle at 85% 25%, #F6EEDD 0%, transparent 50%), radial-gradient(circle at 50% 10%, #CF9B00 0%, transparent 55%), linear-gradient(rgba(255,255,255,.3),rgba(255,255,255,.3))',
  'radial-gradient(circle at 20% 20%, #CDE4F0 0%, transparent 52%), radial-gradient(circle at 80% 80%, #EDE0C8 0%, transparent 55%), radial-gradient(circle at 50% 50%, #6FA6C4 0%, transparent 60%), linear-gradient(rgba(255,255,255,.28),rgba(255,255,255,.28))'
];

function artTheme(category) {
  let h = 0;
  const s = category || '';
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return ART_THEMES[h % ART_THEMES.length];
}

function hero(anim) {
  const wrapCls = 'jn-portrait-wrap' + (anim ? ' intro' : '');
  function a(base, d) { return anim ? 'class="' + base + ' slide" style="animation-delay:' + d + 's"' : 'class="' + base + '"'; }
  return '<section class="jn-hero">'
    + '<div class="' + wrapCls + '"><div class="jn-gradient"></div><img class="jn-portrait" src="assets/jules.jpg" alt="Jules"><span class="jn-sticker">it’s me, Jules</span></div>'
    + '<p ' + a('eyebrow', 1.25) + '><i></i>Notes on business &amp; strategy</p>'
    + '<h1 ' + a('jn-h1', 1.37) + '>Hi — welcome to <em>Jules’ blog.</em></h1>'
    + '<p ' + a('jn-lead', 1.5) + '>This is where I share what I’m reading, learning, and slowly figuring out about business and strategy.</p>'
    + '<p ' + a('jn-sub', 1.62) + '>A spot to gather the insights from the podcasts, articles, and books I’m learning from.</p>'
    + '<p class="jn-tag' + (anim ? ' jn-tag-sweep' : '') + '"' + (anim ? ' style="animation-delay:1.9s"' : '') + '>Part journal, part playground, part accountability partner.</p>'
    + '<div class="scrollcue">Read the blog<span class="chev"></span></div>'
    + '</section>';
}

function filtersHTML(cats, filter) {
  return '<div class="filters">' + ['All'].concat(cats.map(c => c.name)).map(c => {
    const v = (c === 'All' ? 'all' : c);
    const on = (v === filter);
    return '<button class="filter' + (on ? ' active' : '') + '" data-a="filter" data-cat="' + esc(v) + '">' + esc(c) + '</button>';
  }).join('') + '</div>';
}

function cardHTML(p, isAdmin) {
  return '<article class="card" data-a="open" data-id="' + esc(p.slug) + '">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:15px">'
    + '<span class="cat" style="margin-bottom:0">' + esc(p.category) + '</span>'
    + (!p.published ? '<span class="status-chip draft">Draft</span>' : '')
    + '</div>'
    + '<h3>' + esc(p.title) + '</h3>'
    + '<p>' + esc(p.excerpt) + '</p>'
    + '<div class="foot"><span class="meta">' + fmtShort(p.date) + '</span><span class="meta">' + readTime(p.body_html) + '</span></div>'
    + (isAdmin ? '<div class="admin-row"><button class="btn-edit" data-a="edit" data-id="' + esc(p.id) + '">Edit</button><button class="btn-del" data-a="del" data-id="' + esc(p.id) + '">Delete</button></div>' : '')
    + '</article>';
}

export async function renderHome({ posts, cats, isAdmin, filter, introAnim }) {
  let html = hero(introAnim);
  html += '<section class="sec reveal" id="blogsec"><div class="wrap">';
  if (posts.length === 0) {
    html += '<div class="empty"><h3>No posts yet — this is where it begins.</h3><p>A blank page, on purpose. Set up your account and write your first post.</p>'
      + '<div style="margin-top:24px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn-primary" data-a="write-new">Write your first post</button>' + (isAdmin ? '<button class="btn-ghost" data-a="open-cats">Manage categories</button>' : '') + '</div>'
      + '</div>';
  } else {
    const sorted = posts.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
    const publishedOnly = sorted.filter(p => p.published);
    const featured = (filter === 'all') ? (publishedOnly.find(p => p.featured) || publishedOnly[0]) : null;
    const match = p => filter === 'all' || p.category === filter;
    const rest = sorted.filter(p => !featured || p.id !== featured.id).filter(match);
    if (featured) {
      html += '<article class="featured fade" data-a="open" data-id="' + esc(featured.slug) + '">'
        + '<div class="art" style="background-image:' + artTheme(featured.category) + '"><span class="tag">Featured</span></div>'
        + '<div class="body"><span class="cat">' + esc(featured.category) + '</span><h3>' + esc(featured.title) + '</h3><p>' + esc(featured.excerpt) + '</p>'
        + '<div class="readrow"><span class="readlink">Read the post →</span><span class="meta">' + readTime(featured.body_html) + '</span></div></div></article>';
    }
    html += '<div class="blog-head"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><h2>All posts</h2><button class="btn-write-inline" data-a="write-new">Write a post</button>' + (isAdmin ? '<button class="btn-cat" data-a="open-cats">Categories</button>' : '') + '</div>' + filtersHTML(cats, filter) + '</div>';
    html += '<div class="grid">' + rest.map(p => cardHTML(p, isAdmin)).join('') + '</div>';
    if (rest.length === 0 && filter !== 'all') { html += '<p style="text-align:center;color:var(--ink-mute);font-style:italic;padding:36px 0">Nothing in this category yet.</p>'; }
  }
  html += '</div></section>';
  return html;
}

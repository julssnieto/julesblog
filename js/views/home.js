import { esc, fmtShort, readTime, prefersReduced } from '../utils.js';

function hero(anim) {
  const wrapCls = 'jn-portrait-wrap' + (anim ? ' intro' : '');
  function a(base, d) { return anim ? 'class="' + base + ' slide" style="animation-delay:' + d + 's"' : 'class="' + base + '"'; }
  return '<section class="jn-hero">'
    + '<div class="' + wrapCls + '"><div class="jn-gradient"></div><img class="jn-portrait" src="assets/jules.jpg" alt="Jules"><span class="jn-sticker">it’s me, Jules</span></div>'
    + '<p ' + a('eyebrow', 1.25) + '><i></i>Notes on business &amp; strategy</p>'
    + '<h1 ' + a('jn-h1', 1.37) + '>Hi — welcome to <em>Jules’ blog.</em></h1>'
    + '<p ' + a('jn-lead', 1.5) + '>This is where I share what I’m reading, learning, and slowly figuring out about business and strategy.</p>'
    + '<p ' + a('jn-sub', 1.62) + '>A spot to gather the insights from the podcasts, articles, and books I’m learning from.</p>'
    + '<p ' + a('jn-tag', 1.74) + '>Part journal, part playground, part accountability partner.</p>'
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
    + '<span class="cat">' + esc(p.category) + '</span>'
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
    const featured = (filter === 'all') ? (sorted.find(p => p.featured) || sorted[0]) : null;
    const match = p => filter === 'all' || p.category === filter;
    const rest = sorted.filter(p => !featured || p.id !== featured.id).filter(match);
    if (featured) {
      html += '<article class="featured fade" data-a="open" data-id="' + esc(featured.slug) + '">'
        + '<div class="art"><svg viewBox="0 0 600 400" preserveAspectRatio="none"><path d="M0,250 C150,180 300,320 450,240 C540,190 600,250 600,250 L600,400 L0,400 Z" fill="rgba(58,42,30,.10)"/><path d="M0,292 C150,232 320,350 470,280 C560,238 600,292 600,292 L600,400 L0,400 Z" fill="rgba(58,42,30,.06)"/></svg><span class="tag">Featured</span></div>'
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

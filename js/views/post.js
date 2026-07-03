import { esc, fmtLong, readTime } from '../utils.js';
import { sanitizeHtml } from '../sanitize.js';

function sourcesHTML(sources) {
  if (!sources || !sources.length) return '';
  return '<div class="sources-box"><p class="sources-title">Sources</p><ul class="sources-list">'
    + sources.map(s => (
      '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title || s.url) + '</a></li>'
    )).join('')
    + '</ul></div>';
}

export function renderPost(post, isAdmin) {
  if (!post) return '<section class="sec"><div class="wrap"><p>Post not found.</p></div></section>';
  return '<article class="post fade"><button class="back" data-a="home">← Back to blog</button>'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">'
    + '<span class="cat" style="margin-bottom:0">' + esc(post.category) + '</span>'
    + (!post.published ? '<span class="status-chip draft">Draft</span>' : '')
    + '</div>'
    + '<h1>' + esc(post.title) + '</h1>'
    + '<div class="pmeta">' + fmtLong(post.date) + ' · ' + readTime(post.body_html) + '</div>'
    + '<div class="pbody">' + sanitizeHtml(post.body_html) + '</div>'
    + sourcesHTML(post.sources)
    + (isAdmin ? '<div class="post-admin"><button class="btn-ghost" data-a="edit" data-id="' + esc(post.id) + '">Edit</button><button class="btn-ghost" data-a="del" data-id="' + esc(post.id) + '" style="color:#B06A5E">Delete</button></div>' : '')
    + '</article>';
}

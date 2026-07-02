import { esc, fmtLong, readTime } from '../utils.js';
import { sanitizeHtml } from '../sanitize.js';

export function renderPost(post, isAdmin) {
  if (!post) return '<section class="sec"><div class="wrap"><p>Post not found.</p></div></section>';
  return '<article class="post fade"><button class="back" data-a="home">← Back to blog</button>'
    + '<span class="cat">' + esc(post.category) + '</span>'
    + '<h1>' + esc(post.title) + '</h1>'
    + '<div class="pmeta">' + fmtLong(post.date) + ' · ' + readTime(post.body_html) + '</div>'
    + '<div class="pbody">' + sanitizeHtml(post.body_html) + '</div>'
    + (isAdmin ? '<div class="post-admin"><button class="btn-ghost" data-a="edit" data-id="' + esc(post.id) + '">Edit</button><button class="btn-ghost" data-a="del" data-id="' + esc(post.id) + '" style="color:#B06A5E">Delete</button></div>' : '')
    + '</article>';
}

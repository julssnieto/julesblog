import { esc } from '../utils.js';
import { sanitizeHtml } from '../sanitize.js';
import { toolbarHTML } from '../editor.js';

export function renderWrite({ editingPost, cats }) {
  let optCats = cats.slice();
  if (editingPost && editingPost.category && !optCats.some(c => c.name === editingPost.category)) {
    optCats = [{ id: '', name: editingPost.category }].concat(optCats);
  }
  const opts = optCats.map(c => {
    const sel = (editingPost && editingPost.category === c.name) ? ' selected' : '';
    return '<option value="' + esc(c.id) + '" data-name="' + esc(c.name) + '"' + sel + '>' + esc(c.name) + '</option>';
  }).join('');
  const body = editingPost ? sanitizeHtml(editingPost.body_html) : '';

  return '<section class="write fade">'
    + '<p style="font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#2F6E8F;margin:0 0 8px">' + (editingPost ? 'Edit post' : 'New post') + '</p>'
    + '<h1 style="font-family:\'Newsreader\',Georgia,serif;font-weight:500;font-size:34px;margin:0 0 28px;color:#3A2A1E">' + (editingPost ? 'Edit your post' : 'Write a post') + '</h1>'
    + '<label>Title</label><input id="f-title" class="title" placeholder="A clear, specific title" value="' + esc(editingPost ? editingPost.title : '') + '">'
    + '<label>Category</label><select id="f-cat">' + opts + '</select>'
    + '<label>Body</label>'
    + toolbarHTML()
    + '<div id="editor" class="editor" contenteditable="true" data-ph="Start writing… select any text to style it with the toolbar above.">' + body + '</div>'
    + '<p class="hint">Tip: highlight the text you want to change, then pick a font, size, colour, or style from the toolbar.</p>'
    + '<div style="display:flex;gap:12px"><button class="btn-primary" data-a="save">' + (editingPost ? 'Update post' : 'Publish') + '</button><button class="btn-ghost" data-a="cancel">Cancel</button></div>'
    + '</section>';
}

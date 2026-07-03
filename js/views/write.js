import { esc } from '../utils.js';
import { sanitizeHtml } from '../sanitize.js';
import { toolbarHTML } from '../editor.js';

function sourceRowHTML(source) {
  const title = source ? source.title || '' : '';
  const url = source ? source.url || '' : '';
  return '<div class="source-row">'
    + '<input class="src-title" type="text" placeholder="Source title (optional)" value="' + esc(title) + '">'
    + '<input class="src-url" type="text" placeholder="https://example.com/article" value="' + esc(url) + '">'
    + '<button type="button" class="btn-remove-source" data-a="remove-source" title="Remove source">✕</button>'
    + '</div>';
}

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
  const isDraft = editingPost ? !editingPost.published : false;
  const sources = (editingPost && editingPost.sources && editingPost.sources.length) ? editingPost.sources : [];
  const sourceRows = (sources.length ? sources : [null]).map(sourceRowHTML).join('');

  const publishLabel = editingPost && editingPost.published ? 'Update post' : 'Publish';
  const draftLabel = editingPost && !editingPost.published ? 'Save draft' : 'Save as draft';

  return '<section class="write fade">'
    + '<p style="font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--link);margin:0 0 8px">' + (editingPost ? 'Edit post' : 'New post')
    + (editingPost ? (isDraft ? ' <span class="status-chip draft">Draft</span>' : ' <span class="status-chip published">Published</span>') : '') + '</p>'
    + '<h1 style="font-family:\'Newsreader\',Georgia,serif;font-weight:500;font-size:34px;margin:0 0 28px;color:var(--ink)">' + (editingPost ? 'Edit your post' : 'Write a post') + '</h1>'
    + '<label>Title</label><input id="f-title" class="title" placeholder="A clear, specific title" value="' + esc(editingPost ? editingPost.title : '') + '">'
    + '<label>Category</label><select id="f-cat">' + opts + '</select>'
    + '<label>Body</label>'
    + toolbarHTML()
    + '<div id="editor" class="editor" contenteditable="true" data-ph="Start writing… select any text to style it with the toolbar above.">' + body + '</div>'
    + '<p class="hint">Tip: highlight the text you want to change, then pick a font, size, colour, or style from the toolbar.</p>'
    + '<label>Sources <span class="hint-inline">— links readers can follow to dig deeper (optional)</span></label>'
    + '<div id="sources-list">' + sourceRows + '</div>'
    + '<button type="button" class="btn-cat" data-a="add-source" style="margin:10px 0 26px">+ Add source</button>'
    + '<div style="display:flex;gap:12px;flex-wrap:wrap">'
    + '<button class="btn-primary" data-a="save-publish">' + publishLabel + '</button>'
    + '<button class="btn-ghost" data-a="save-draft">' + draftLabel + '</button>'
    + '<button class="btn-ghost" data-a="cancel">Cancel</button>'
    + '</div>'
    + '</section>';
}

export function setupSourcesEditor() {
  const list = document.getElementById('sources-list');
  if (!list) return;
  const addBtn = document.querySelector('[data-a="add-source"]');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const div = document.createElement('div');
      div.innerHTML = sourceRowHTML(null);
      list.appendChild(div.firstElementChild);
    });
  }
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a="remove-source"]');
    if (!btn) return;
    const row = btn.closest('.source-row');
    if (row) row.remove();
  });
}

export function collectSources() {
  return Array.from(document.querySelectorAll('#sources-list .source-row')).map(row => ({
    title: row.querySelector('.src-title').value.trim(),
    url: row.querySelector('.src-url').value.trim()
  })).filter(s => s.title || s.url);
}

// Minimal hash router: #/, #/about, #/post/:slug, #/write, #/write/:id.
// Hash-based on purpose — needs zero server-side rewrite rules, so any
// static host (Netlify, GitHub Pages, etc.) works with no configuration.

export function parseHash() {
  const raw = (location.hash || '').replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean);
  if (parts[0] === 'about') return { view: 'about' };
  if (parts[0] === 'post' && parts[1]) return { view: 'post', id: parts[1] };
  if (parts[0] === 'write') return { view: 'write', id: parts[1] || null };
  return { view: 'home' };
}

export function navigate(view, id) {
  let hash = '#/';
  if (view === 'about') hash = '#/about';
  else if (view === 'post') hash = '#/post/' + encodeURIComponent(id);
  else if (view === 'write') hash = id ? '#/write/' + encodeURIComponent(id) : '#/write';
  if (location.hash === hash) {
    // Same route (e.g. clicking "Write" while already on it) — re-render manually.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = hash;
  }
}

export function onRouteChange(cb) {
  window.addEventListener('hashchange', () => cb(parseHash()));
  cb(parseHash());
}

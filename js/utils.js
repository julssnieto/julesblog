export function esc(s) {
  return (s == null ? '' : String(s)).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export function stripHTML(h) {
  const d = document.createElement('div');
  d.innerHTML = h || '';
  return (d.textContent || d.innerText || '').replace(/\s+/g, ' ').trim();
}

export function excerpt(b) {
  const s = stripHTML(b);
  return s.length > 150 ? s.slice(0, 150).replace(/\s+\S*$/, '') + '…' : s;
}

export function readTime(b) {
  const w = stripHTML(b).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(w / 200)) + ' min read';
}

const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MOL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function fmtShort(iso) {
  const d = new Date(iso);
  return MO[d.getMonth()] + ' ' + d.getFullYear();
}

export function fmtLong(iso) {
  const d = new Date(iso);
  return d.getDate() + ' ' + MOL[d.getMonth()] + ' ' + d.getFullYear();
}

export function top() {
  try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
}

export function prefersReduced() {
  try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (e) { return false; }
}

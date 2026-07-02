import DOMPurify from 'https://esm.sh/dompurify@3';

// Allowlist matches exactly what the write-view toolbar (js/editor.js) can
// produce. Runs at save-time (before writing to the DB) and again at
// render-time (before injecting into any visitor's page via innerHTML) —
// defense in depth, since a pasted-in chunk of HTML from another site could
// otherwise smuggle event handlers or scripts through the rich-text editor.
const CONFIG = {
  ALLOWED_TAGS: [
    'p', 'div', 'span', 'br',
    'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'font',
    'h1', 'h2', 'h3', 'h4',
    'blockquote', 'ul', 'ol', 'li', 'a'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'color', 'face', 'size'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
  ALLOW_DATA_ATTR: false
};

export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html || '', CONFIG);
}

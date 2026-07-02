// Rich-text toolbar for the write view, ported from the prototype's
// contenteditable + document.execCommand implementation.

export function toolbarHTML() {
  return '<div id="toolbar" class="toolbar">'
    + '<select class="tb-sel" id="sel-block" title="Text style"><option value="<p>">Paragraph</option><option value="<h2>">Heading</option><option value="<h3>">Subheading</option><option value="<blockquote>">Quote</option></select>'
    + '<select class="tb-sel" id="sel-font" title="Font"><option value="\'Hanken Grotesk\', sans-serif">Sans</option><option value="\'Newsreader\', Georgia, serif">Serif</option><option value="Georgia, serif">Georgia</option><option value="\'Courier New\', monospace">Mono</option></select>'
    + '<select class="tb-sel" id="sel-size" title="Text size"><option value="2">Small</option><option value="3" selected>Normal</option><option value="5">Large</option><option value="7">Huge</option></select>'
    + '<span class="tb-div"></span>'
    + '<button type="button" class="tb-btn" data-cmd="bold" title="Bold" style="font-weight:800">B</button>'
    + '<button type="button" class="tb-btn" data-cmd="italic" title="Italic" style="font-style:italic;font-family:Georgia,serif">I</button>'
    + '<button type="button" class="tb-btn" data-cmd="underline" title="Underline" style="text-decoration:underline">U</button>'
    + '<button type="button" class="tb-btn" data-cmd="strikeThrough" title="Strikethrough" style="text-decoration:line-through">S</button>'
    + '<span class="tb-div"></span>'
    + '<label class="tb-color" title="Text colour">A<input type="color" id="inp-color" value="#3A2A1E"></label>'
    + '<label class="tb-color" title="Highlight"><span style="background:#FCEFA8;padding:0 3px;border-radius:3px">H</span><input type="color" id="inp-hl" value="#FCEFA8"></label>'
    + '<span class="tb-div"></span>'
    + '<button type="button" class="tb-btn" data-cmd="insertUnorderedList" title="Bulleted list">•</button>'
    + '<button type="button" class="tb-btn" data-cmd="insertOrderedList" title="Numbered list">1.</button>'
    + '<button type="button" class="tb-btn" data-cmd="justifyLeft" title="Align left">L</button>'
    + '<button type="button" class="tb-btn" data-cmd="justifyCenter" title="Align centre">C</button>'
    + '<span class="tb-div"></span>'
    + '<button type="button" class="tb-btn" data-cmd="createLink" title="Add link">Link</button>'
    + '<button type="button" class="tb-btn" data-cmd="removeFormat" title="Clear formatting">Clear</button>'
    + '</div>';
}

export function setupEditor() {
  const editor = document.getElementById('editor');
  const toolbar = document.getElementById('toolbar');
  if (!editor || !toolbar) return;
  try { document.execCommand('styleWithCSS', false, true); } catch (e) {}

  let saved = null;
  function saveSel() {
    const s = window.getSelection();
    if (s && s.rangeCount && editor.contains(s.anchorNode)) saved = s.getRangeAt(0).cloneRange();
  }
  function restoreSel() {
    editor.focus();
    if (saved) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(saved); }
  }
  function exec(cmd, val) {
    restoreSel();
    try { document.execCommand(cmd, false, val); } catch (e) {}
    saveSel();
    updateActive();
  }
  function updateActive() {
    ['bold', 'italic', 'underline', 'strikeThrough'].forEach(c => {
      const b = toolbar.querySelector('[data-cmd="' + c + '"]');
      if (b) { try { b.classList.toggle('on', document.queryCommandState(c)); } catch (e) {} }
    });
  }
  editor.addEventListener('keyup', () => { saveSel(); updateActive(); });
  editor.addEventListener('mouseup', () => { saveSel(); updateActive(); });
  editor.addEventListener('focus', saveSel);

  toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      const c = btn.getAttribute('data-cmd');
      let v = null;
      if (c === 'createLink') { v = window.prompt('Link address (URL):', 'https://'); if (!v) return; }
      exec(c, v);
    });
  });

  const fontSel = document.getElementById('sel-font');
  if (fontSel) fontSel.addEventListener('change', () => exec('fontName', fontSel.value));
  const blockSel = document.getElementById('sel-block');
  if (blockSel) blockSel.addEventListener('change', () => { exec('formatBlock', blockSel.value); blockSel.selectedIndex = 0; });
  const sizeSel = document.getElementById('sel-size');
  if (sizeSel) sizeSel.addEventListener('change', () => exec('fontSize', sizeSel.value));
  const col = document.getElementById('inp-color');
  if (col) col.addEventListener('input', () => exec('foreColor', col.value));
  const hl = document.getElementById('inp-hl');
  if (hl) hl.addEventListener('input', () => exec('hiliteColor', hl.value));
}

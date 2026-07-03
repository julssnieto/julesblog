import * as api from './api.js';
import { esc, top, prefersReduced, excerpt as makeExcerpt, stripHTML } from './utils.js';
import { navigate, onRouteChange } from './router.js';
import { setupEditor } from './editor.js';
import { updateTimeline, bindTimelineScroll } from './timeline.js';
import { renderHome } from './views/home.js';
import { renderPost } from './views/post.js';
import { renderWrite } from './views/write.js';
import { renderAbout } from './views/about.js';

const state = { route: { view: 'home' }, filter: 'all', showLogin: false, loginErr: '', pendingRoute: null, showCats: false, catErr: '' };
let session = null;
let cats = [];
let introDone = false;
let renderToken = 0;
let currentEditingPost = null;

function isAdmin() { return !!session; }

function nav() {
  const admin = isAdmin();
  return '<header class="nav"><div class="wrap nav-inner">'
    + '<button class="brand" data-a="home">Jules’ <span>Blog</span></button>'
    + '<nav class="links">'
    + '<button class="nav-btn" data-a="home">Blog</button>'
    + '<button class="nav-btn dim" data-a="about">My Portfolio</button>'
    + (admin ? '<button class="nav-write" data-a="write-new">Write</button><button class="nav-signout" data-a="signout">Sign out</button>' : '')
    + '</nav></div></header>';
}

function footer() {
  const admin = isAdmin();
  return '<footer><div class="wrap"><div class="foot-top">'
    + '<div class="foot-contact"><a href="mailto:julianietokeiner@gmail.com">julianietokeiner@gmail.com</a><br><a href="#" target="_blank" rel="noopener">LinkedIn — Julia Nieto Keiner</a><br><span style="color:var(--ink-mute)">Kalverstraat, Amsterdam</span></div>'
    + '</div><div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' Julia Nieto</span>'
    + (admin ? '<span style="color:var(--ink-mute)">Signed in as admin</span>' : '<button class="foot-admin" data-a="open-login">Admin</button>')
    + '</div></div></footer>';
}

function loginModal() {
  if (!state.showLogin) return '';
  const err = state.loginErr ? '<p class="err">' + esc(state.loginErr) + '</p>' : '';
  return '<div class="overlay"><div class="modal">'
    + '<p class="label" style="margin-bottom:10px">Admin access</p>'
    + '<h3>Sign in</h3><p class="desc">Enter your email and password to write and manage posts.</p>'
    + '<input id="m-email" type="email" placeholder="Email" autocomplete="username">'
    + '<input id="m-pass" type="password" placeholder="Password" autocomplete="current-password">'
    + err
    + '<div class="row"><button class="btn-primary" data-a="submit-login">Sign in</button><button class="btn-ghost" data-a="close-login">Cancel</button></div>'
    + '</div></div>';
}

function catModal() {
  if (!state.showCats) return '';
  const rows = cats.map(c => (
    '<div class="cat-row"><span>' + esc(c.name) + '</span><button data-a="del-cat" data-catid="' + esc(c.id) + '">Remove</button></div>'
  )).join('') || '<p style="color:var(--ink-soft);font-size:14px;margin:0">No categories yet — add one below.</p>';
  const err = state.catErr ? '<p class="err">' + esc(state.catErr) + '</p>' : '';
  return '<div class="overlay"><div class="modal">'
    + '<p class="label">Blog categories</p>'
    + '<h3>Manage categories</h3>'
    + '<p class="desc">Add or remove the labels you can give your posts.</p>'
    + '<div class="cat-list">' + rows + '</div>'
    + '<div style="display:flex;gap:8px;margin-top:12px"><input id="new-cat" type="text" placeholder="New category name" style="margin-bottom:0;flex:1"><button class="btn-primary" data-a="add-cat" style="padding:13px 18px">Add</button></div>'
    + err
    + '<div class="row"><button class="btn-ghost" data-a="close-cats" style="flex:1">Done</button></div>'
    + '</div></div>';
}

function modalHTML() {
  if (state.showLogin) return loginModal();
  if (state.showCats) return catModal();
  return '';
}

function setupReveal() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .1 });
  els.forEach(e => io.observe(e));
}

async function render() {
  const myToken = ++renderToken;
  const route = state.route;
  let main = '';

  if (route.view === 'home') {
    const posts = await api.getPosts();
    if (myToken !== renderToken) return;
    const introAnim = !introDone && !prefersReduced();
    introDone = true;
    main = await renderHome({ posts, cats, isAdmin: isAdmin(), filter: state.filter, introAnim });
  } else if (route.view === 'post') {
    const post = await api.getPost(route.id);
    if (myToken !== renderToken) return;
    main = renderPost(post, isAdmin());
  } else if (route.view === 'write') {
    if (!isAdmin()) { navigate('home'); return; }
    const editingPost = route.id ? await api.getPostById(route.id) : null;
    if (myToken !== renderToken) return;
    currentEditingPost = editingPost;
    main = renderWrite({ editingPost, cats });
  } else if (route.view === 'about') {
    main = renderAbout();
  }

  if (myToken !== renderToken) return;
  document.getElementById('app').innerHTML = nav() + '<main>' + main + '</main>' + footer();
  document.getElementById('modal').innerHTML = modalHTML();
  setupReveal();
  if (route.view === 'write') setupEditor();
  if (route.view === 'about') { bindTimelineScroll(); if (window.requestAnimationFrame) requestAnimationFrame(updateTimeline); }
  const em = document.getElementById('m-email'); if (em) em.focus();
  const nc = document.getElementById('new-cat'); if (nc) nc.focus();
}

/* ---------------------------------------------------------------------
 * Actions
 * ------------------------------------------------------------------- */
async function savePost() {
  const t = (document.getElementById('f-title') || {}).value || '';
  const catSel = document.getElementById('f-cat');
  const catId = catSel ? catSel.value : '';
  const catName = catSel && catSel.selectedOptions[0] ? catSel.selectedOptions[0].getAttribute('data-name') : '';
  const ed = document.getElementById('editor');
  const body = ed ? ed.innerHTML : '';
  if (!t.trim() || !stripHTML(body)) { alert('Please add a title and some body text before publishing.'); return; }

  const editingId = state.route.id;
  try {
    let saved;
    if (editingId) {
      saved = await api.updatePost(editingId, { title: t.trim(), categoryId: catId, categoryName: catName, bodyHtml: body, excerpt: makeExcerpt(body) });
    } else {
      saved = await api.createPost({ title: t.trim(), categoryId: catId, categoryName: catName, bodyHtml: body, excerpt: makeExcerpt(body), featured: false });
    }
    navigate('post', saved.slug);
  } catch (e) {
    alert('Could not save the post: ' + (e && e.message ? e.message : e));
  }
}

async function delPost(id) {
  if (!isAdmin()) return;
  if (!confirm('Delete this post? This cannot be undone.')) return;
  try {
    await api.deletePost(id);
    if (state.route.view === 'post') navigate('home'); else render();
  } catch (e) {
    alert('Could not delete the post: ' + (e && e.message ? e.message : e));
  }
}

async function submitLogin() {
  const email = (document.getElementById('m-email') || {}).value || '';
  const pass = (document.getElementById('m-pass') || {}).value || '';
  const { error } = await api.signIn(email.trim(), pass);
  if (error) { state.loginErr = 'Email or password is incorrect.'; render(); return; }
  session = await api.getSession();
  state.showLogin = false; state.loginErr = '';
  if (state.pendingRoute) { const r = state.pendingRoute; state.pendingRoute = null; navigate(r.view, r.id); }
  else render();
}

async function addCat() {
  const inp = document.getElementById('new-cat');
  const v = (inp ? inp.value : '').trim();
  if (!v) { state.catErr = 'Enter a category name.'; render(); return; }
  if (v.toLowerCase() === 'all') { state.catErr = '“All” is reserved for the filter.'; render(); return; }
  if (v.length > 26) { state.catErr = 'Keep it under 26 characters.'; render(); return; }
  if (cats.some(c => c.name.toLowerCase() === v.toLowerCase())) { state.catErr = 'That category already exists.'; render(); return; }
  try {
    await api.createCategory(v);
    cats = await api.getCategories();
    state.catErr = '';
    render();
  } catch (e) {
    state.catErr = 'Could not add that category: ' + (e && e.message ? e.message : e);
    render();
  }
}

async function delCat(id) {
  const cat = cats.find(c => c.id === id);
  if (!cat) return;
  if (cats.length <= 1) { alert('Keep at least one category.'); return; }
  if (!confirm('Remove the “' + cat.name + '” category? Posts using it will keep their existing label until edited.')) return;
  try {
    await api.deleteCategory(id);
    cats = await api.getCategories();
    if (state.filter === cat.name) state.filter = 'all';
    state.catErr = '';
    render();
  } catch (e) {
    alert('Could not remove that category: ' + (e && e.message ? e.message : e));
  }
}

/* ---------------------------------------------------------------------
 * Event delegation
 * ------------------------------------------------------------------- */
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('overlay')) {
    state.showLogin = false; state.loginErr = ''; state.pendingRoute = null; state.showCats = false; state.catErr = '';
    render();
    return;
  }
  const t = e.target.closest('[data-a]');
  if (!t) return;
  const a = t.getAttribute('data-a');
  const id = t.getAttribute('data-id');
  const cat = t.getAttribute('data-cat');
  const catid = t.getAttribute('data-catid');

  if (a === 'home') navigate('home');
  else if (a === 'about') navigate('about');
  else if (a === 'open') navigate('post', id);
  else if (a === 'filter') { state.filter = cat; render(); }
  else if (a === 'write-new') {
    if (!isAdmin()) { state.pendingRoute = { view: 'write' }; state.showLogin = true; state.loginErr = ''; render(); return; }
    navigate('write');
  } else if (a === 'edit') {
    if (!isAdmin()) return;
    e.preventDefault();
    navigate('write', id);
  } else if (a === 'del') { e.preventDefault(); delPost(id); }
  else if (a === 'save') savePost();
  else if (a === 'cancel') {
    if (currentEditingPost) navigate('post', currentEditingPost.slug); else navigate('home');
  } else if (a === 'open-login') { state.showLogin = true; state.loginErr = ''; render(); }
  else if (a === 'close-login') { state.showLogin = false; state.loginErr = ''; state.pendingRoute = null; render(); }
  else if (a === 'submit-login') submitLogin();
  else if (a === 'signout') { api.signOut().then(async () => { session = null; render(); }); }
  else if (a === 'open-cats') { state.showCats = true; state.catErr = ''; render(); }
  else if (a === 'close-cats') { state.showCats = false; state.catErr = ''; render(); }
  else if (a === 'add-cat') addCat();
  else if (a === 'del-cat') { e.preventDefault(); delCat(catid); }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && state.showLogin && document.getElementById('m-pass')) submitLogin();
  if (e.key === 'Enter' && state.showCats && document.activeElement && document.activeElement.id === 'new-cat') { e.preventDefault(); addCat(); }
  if (e.key === 'Escape' && (state.showLogin || state.showCats)) { state.showLogin = false; state.showCats = false; state.catErr = ''; render(); }
});

/* ---------------------------------------------------------------------
 * Boot
 * ------------------------------------------------------------------- */
async function boot() {
  session = await api.getSession();
  // Supabase fires an initial auth event echoing the session we already
  // just fetched above — skip that one so it doesn't trigger a redundant
  // render() that races the route-triggered first render and silently
  // consumes the one-time intro-animation flag.
  let firstAuthEvent = true;
  api.onAuthChange((s) => {
    if (firstAuthEvent) { firstAuthEvent = false; session = s; return; }
    session = s;
    render();
  });
  cats = await api.getCategories();
  onRouteChange((route) => { state.route = route; render(); top(); });
}

boot();

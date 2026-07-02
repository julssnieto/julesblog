import { supabase, isConfigured } from './supabaseClient.js';
import { sanitizeHtml } from './sanitize.js';

/* ---------------------------------------------------------------------
 * Dev-mode mock backend.
 * Used only while js/supabaseClient.js still has placeholder credentials,
 * so every view can be built and clicked through before a Supabase project
 * exists. Once real credentials are pasted in, isConfigured flips to true
 * and none of this code executes.
 * ------------------------------------------------------------------- */
const DEFAULT_CATS = ['Strategy', 'Operations', 'Data & AI', 'Ways of working', 'Reading notes'];

let mockCats = DEFAULT_CATS.map((name, i) => ({ id: 'cat-' + i, name, slug: slugify(name) }));
let mockPosts = [
  {
    id: 'p1', slug: 'welcome-to-the-blog', title: 'Welcome to the blog',
    category: 'Strategy', excerpt: 'A short note on why this exists and what to expect.',
    body_html: '<p>This is a sample post shown in dev mode. Once Supabase is connected, real posts will appear here instead.</p>',
    featured: true, published: true, date: new Date().toISOString().slice(0, 10)
  },
  {
    id: 'p2', slug: 'a-note-on-prioritisation', title: 'A note on prioritisation',
    category: 'Operations', excerpt: 'Second sample post, so the grid and filters have something to show.',
    body_html: '<p>Second sample post body.</p>', featured: false, published: true,
    date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10)
  }
];
let mockSession = null;

function slugify(t) {
  return ((t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 56) || 'post')
    + '-' + Math.random().toString(36).slice(2, 6);
}

/* ---------------------------------------------------------------------
 * Auth
 * ------------------------------------------------------------------- */
export async function getSession() {
  if (!isConfigured) return mockSession;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthChange(cb) {
  if (!isConfigured) return { unsubscribe() {} };
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return data.subscription;
}

export async function signIn(email, password) {
  if (!isConfigured) {
    // Dev mode only: any credentials succeed, purely so the admin-only UI
    // can be exercised locally. This path never runs once real Supabase
    // keys are configured.
    mockSession = { user: { email } };
    return { error: null };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signOut() {
  if (!isConfigured) { mockSession = null; return; }
  await supabase.auth.signOut();
}

/* ---------------------------------------------------------------------
 * Categories
 * ------------------------------------------------------------------- */
export async function getCategories() {
  if (!isConfigured) return mockCats.slice();
  const { data, error } = await supabase.from('categories').select('*').order('created_at');
  if (error) throw error;
  return data;
}

export async function createCategory(name) {
  if (!isConfigured) {
    const cat = { id: 'cat-' + Date.now(), name, slug: slugify(name) };
    mockCats.push(cat);
    return cat;
  }
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug: slugify(name) })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  if (!isConfigured) { mockCats = mockCats.filter(c => c.id !== id); return; }
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

/* ---------------------------------------------------------------------
 * Posts
 * Rows come back from Supabase joined with the category name so the rest
 * of the app can keep treating `post.category` as a plain string, same as
 * the original prototype.
 * ------------------------------------------------------------------- */
function mapRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.categories ? row.categories.name : (row.category || ''),
    category_id: row.category_id,
    excerpt: row.excerpt,
    body_html: row.body_html,
    featured: row.featured,
    published: row.published,
    date: (row.created_at || row.date || '').slice(0, 10)
  };
}

export async function getPosts({ includeUnpublished = false } = {}) {
  if (!isConfigured) {
    return mockPosts
      .filter(p => includeUnpublished || p.published)
      .slice()
      .sort((a, b) => (b.date < a.date ? -1 : 1));
  }
  let q = supabase.from('posts').select('*, categories(name)').order('created_at', { ascending: false });
  if (!includeUnpublished) q = q.eq('published', true);
  const { data, error } = await q;
  if (error) throw error;
  return data.map(mapRow);
}

export async function getPost(slug) {
  if (!isConfigured) return mockPosts.find(p => p.slug === slug || p.id === slug) || null;
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function getPostById(id) {
  if (!isConfigured) return mockPosts.find(p => p.id === id) || null;
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function createPost({ title, categoryId, categoryName, bodyHtml, excerpt, featured }) {
  const clean = sanitizeHtml(bodyHtml);
  if (!isConfigured) {
    const post = {
      id: 'p-' + Date.now(), slug: slugify(title), title, category: categoryName,
      excerpt, body_html: clean, featured: !!featured, published: true,
      date: new Date().toISOString().slice(0, 10)
    };
    mockPosts.push(post);
    return post;
  }
  const { data, error } = await supabase
    .from('posts')
    .insert({
      slug: slugify(title), title, category_id: categoryId,
      excerpt, body_html: clean, featured: !!featured, published: true
    })
    .select('*, categories(name)')
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updatePost(id, { title, categoryId, categoryName, bodyHtml, excerpt, featured }) {
  const clean = sanitizeHtml(bodyHtml);
  if (!isConfigured) {
    const p = mockPosts.find(x => x.id === id);
    if (p) Object.assign(p, { title, category: categoryName, body_html: clean, excerpt, featured: !!featured });
    return p;
  }
  const { data, error } = await supabase
    .from('posts')
    .update({ title, category_id: categoryId, excerpt, body_html: clean, featured: !!featured })
    .eq('id', id)
    .select('*, categories(name)')
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function deletePost(id) {
  if (!isConfigured) { mockPosts = mockPosts.filter(p => p.id !== id); return; }
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

// Scroll-driven progress rail for the About page's career timeline,
// ported from the prototype.

export function updateTimeline() {
  const rail = document.querySelector('.ktl-rail');
  if (!rail) return;
  const fill = rail.querySelector('.ktl-fill');
  const rr = rail.getBoundingClientRect();
  const trigger = window.innerHeight * 0.66;
  const px = Math.max(0, Math.min(rr.height, trigger - rr.top));
  if (fill) fill.style.height = px + 'px';
  document.querySelectorAll('.ktl-item .ktl-node').forEach(node => {
    const nr = node.getBoundingClientRect();
    const center = (nr.top + nr.height / 2) - rr.top;
    node.classList.toggle('lit', px >= center);
  });
}

let bound = false;
export function bindTimelineScroll() {
  if (bound) return;
  bound = true;
  window.addEventListener('scroll', () => requestAnimationFrame(updateTimeline), { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(updateTimeline));
}

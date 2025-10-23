import legacy from './projects.json';

function joinList(list, sep = ' • ') {
  return Array.isArray(list) ? list.filter(Boolean).map(String).join(sep) : '';
}

function normalizeCustomTimeline(arr) {
  return arr.map((it, idx) => ({
    id: it.id || `step-${idx + 1}`,
    // Do not auto-fallback title/phase; allow hiding when omitted
    title: it.title,
    phase: it.phase,
    date: it.date,
    summary: it.summary,
    media: it.media,
    links: it.links,
    content: Array.isArray(it.content) ? it.content : undefined,
  }));
}

function buildDerivedTimeline(p) {
  const items = [];
  if (p.summary) items.push({ id: 'concept', title: 'Concept', phase: 'Concept', summary: p.summary });
  if (Array.isArray(p.stack) && p.stack.length) items.push({ id: 'stack', title: 'Tech Stack', phase: 'Tech', summary: joinList(p.stack, ', ') });
  if (Array.isArray(p.features) && p.features.length) items.push({ id: 'features', title: 'Features', phase: 'Build', summary: joinList(p.features) });
  if (Array.isArray(p.modes) && p.modes.length) items.push({ id: 'modes', title: 'Modes', phase: 'Design', summary: joinList(p.modes) });
  if (Array.isArray(p.hardware) && p.hardware.length) items.push({ id: 'hardware', title: 'Hardware', phase: 'Hardware', summary: joinList(p.hardware) });
  if (Array.isArray(p.software) && p.software.length) items.push({ id: 'software', title: 'Software', phase: 'Software', summary: joinList(p.software) });

  const derivedHighlights = []
    .concat(p.highlights || [], p.learned || [], p.impact || [], p.modules || [], p.gameplay || [], p.progress || [])
    .filter(Boolean);
  if (derivedHighlights.length) items.push({ id: 'highlights', title: 'Highlights', phase: 'Results', summary: joinList(derivedHighlights) });
  return items;
}

function toTimeline(p) {
  let items = [];
  if (Array.isArray(p.timeline) && p.timeline.length) {
    items = normalizeCustomTimeline(p.timeline);
  } else {
    items = buildDerivedTimeline(p);
  }

  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.category || '',
    year: undefined,
    tags: (Array.isArray(p.stack) ? p.stack.slice(0, 4) : []),
    image: p.image,
    items,
    links: p.links || undefined,
  };
}

export const projects = Array.isArray(legacy) ? legacy.map(toTimeline) : [];
export default projects;

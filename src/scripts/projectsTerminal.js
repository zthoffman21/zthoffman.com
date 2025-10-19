function initProjectsTerminal() {
  const out = document.getElementById('termOut');
  const input = document.getElementById('termInput');
  if (!out || !input) return;

  // Load data from data attribute injected by ProjectsTerminal.astro
  let data = [];
  try {
    const host = document.getElementById('projects');
    const raw = host && host.getAttribute('data-projects');
    if (raw) data = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load projects for terminal', e);
    data = [];
  }

  const state = { history: [], histIndex: -1 };

  function print(line = '') { out.innerHTML += line + '\n'; out.scrollTop = out.scrollHeight; }
  function clear() { out.innerHTML = ''; }
  
  function list() {
    const items = data;
    print('');
    if (!items.length) {
      print('<span class="muted">No projects loaded. Try `help` or clear filters.</span>');
    } else {
      items.forEach((p, i) => print(`<span class=\"muted\">${String(i+1).padStart(2,'0')}</span>  <a href=\"#\" data-open=\"${i+1}\" class=\"term-link\">${p.title}</a>  <span class=\"muted\">${(p.stack||[]).slice(0,3).join(', ')}</span>`));
    }
    print('');
  }
  function help() {
    // spacer + header
    print('');
    print('Commands:');
    const rows = [
      ['ls | list', 'List projects'],
      ['open <project title>', 'Open details'],
      ['back', 'Go back to list'],
      ['clear', 'Clear screen'],
      ['help', 'Show this help']
    ];

    rows.forEach(([cmd, desc]) => {
      const line = document.createElement('div');
      const left = document.createElement('span');
      left.className = 'mono leftcol';
      left.textContent = cmd;
      line.appendChild(left);
      line.appendChild(document.createTextNode(desc));
      out.appendChild(line);
    });
    out.scrollTop = out.scrollHeight;
  }
  function openProject(key) {
    if (!key) return;
    let p = null;
    const n = parseInt(key, 10);
    if (!isNaN(n) && n >= 1 && n <= data.length) p = data[n - 1];
    if (!p) p = data.find(d => d.slug === key);
    if (!p) p = data.find(d => d.title.toLowerCase().includes(String(key).toLowerCase()));
    if (!p) { print(`No project found for: ${key}`); return; }
    clear();
    print(`<span class=\"title\">${p.title}</span>`);
    print('');
    if (p.summary) print(`${p.summary}`);
    if (p.stack && p.stack.length) print(`<span class=\"label\">Stack:</span> ${p.stack.join(', ')}`);
    if (p.highlights && p.highlights.length) {
      print(`<span class=\"label\">Highlights:</span>`);
      p.highlights.forEach(h => print(`  - ${h}`));
    }
    // Extra sections from original site content
    const extraSections = [
      ['Hardware', p.hardware],
      ['Software', p.software],
      ['Progress & Roadmap', p.progress],
      ['Modes', p.modes],
      ['Features', p.features],
      ['Quickstart', p.quickstart],
      ['Modules & Assets', p.modules],
      ['Gameplay', p.gameplay]
    ];
    extraSections.forEach(([label, list]) => {
      if (Array.isArray(list) && list.length) {
        print(`<span class=\"label\">${label}:</span>`);
        list.forEach(item => print(`  - ${item}`));
      }
    });
    if (p.learned && p.learned.length) {
      print(`<span class=\"label\">What I Learned:</span>`);
      p.learned.forEach(l => print(`  - ${l}`));
    }
    if (p.impact && p.impact.length) {
      print(`<span class=\"label\">Impact:</span>`);
      p.impact.forEach(i => print(`  - ${i}`));
    }
    if (p.metrics && Object.keys(p.metrics).length) {
      const parts = Object.entries(p.metrics).map(([k,v]) => `${k}: ${v}`);
      if (parts.length) print(`<span class=\"label\">Metrics:</span> ${parts.join(' | ')}`);
    }
    if (p.links && (p.links.github || p.links.demo)) {
      const links = [p.links.github ? `<a href=\"${p.links.github}\" target=\"_blank\">GitHub</a>` : '', p.links.demo ? `<a href=\"${p.links.demo}\" target=\"_blank\">Demo</a>` : ''].filter(Boolean).join(' | ');
      if (links) print(`<span class=\"label\">Links:</span> ${links}`);
    }
    print('');
    print(`<span class=\"muted\">Type</span> <span class=\"label\">list</span> <span class=\"muted\">or</span> <span class=\"label\">back</span> <span class=\"muted\">to return</span>`);
    print('');
  }

  out.addEventListener('click', (e) => {
    const a = e.target.closest('[data-open]');
    if (!a) return;
    e.preventDefault();
    openProject(a.getAttribute('data-open'));
  });

  function prompt(cmd) {
    if (!cmd) return;
    state.history.unshift(cmd); state.histIndex = -1;
    const [c, ...rest] = cmd.trim().split(/\s+/);
    const arg = rest.join(' ');
    switch ((c||'').toLowerCase()) {
      case 'ls':
      case 'list': list(); break;
      case 'help': help(); break;
      case 'open': openProject(arg); break;
      case 'back': list(); break;
      case 'clear': clear(); break;
      default:
        if (c) openProject(cmd); else list();
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); prompt(input.value); input.value = ''; }
    else if (e.key === 'Tab') { e.preventDefault(); const t = input.value.trim().toLowerCase(); if (!t) return; const m = data.find(p => p.title.toLowerCase().startsWith(t) || p.slug.startsWith(t)); if (m) input.value = m.slug; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (state.history.length){ state.histIndex = Math.min(state.histIndex+1, state.history.length-1); input.value = state.history[state.histIndex]; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (state.histIndex>0){ state.histIndex -= 1; input.value = state.history[state.histIndex]; } else { state.histIndex=-1; input.value=''; } }
  });

  // Boot
  clear();
  print('zthoffmanOS Project Terminal');
  print(`Loaded ${data.length} projects. Type help or click a project name in the list.`);
  list();
  out.addEventListener('click', ()=> input.focus());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsTerminal, { once: true });
} else {
  initProjectsTerminal();
}



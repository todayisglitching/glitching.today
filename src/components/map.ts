// ============================================================
// Карта связей — созвездие с force-симуляцией на SVG
// ============================================================

import {
  ADJACENCY,
  CONNECTIONS,
  ME,
  PEOPLE,
  Person,
  degreeOf,
  groupOf,
  mutualsOf,
  socialLinksOf,
} from '../data/people';
import type { Lang, Strings } from '../data/i18n';

const W = 1000;
const H = 640;
const PAD = 66;
const SVG_NS = 'http://www.w3.org/2000/svg';

interface SimNode {
  person: Person;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  degree: number;
  color: string;
  pinned: boolean;
}

interface MapOptions {
  lang: Lang;
  strings: Strings;
}

interface MapHandle {
  destroy: () => void;
}

// Позиции переживают смену языка (страница перерисовывается).
const positionCache = new Map<string, { x: number; y: number }>();

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {}
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function radiusFor(degree: number): number {
  if (degree === 0) return 34;
  if (degree === 1) return 25;
  if (degree === 2) return 19;
  return 15;
}

function brightnessFor(degree: number): number {
  if (degree === 0) return 1;
  if (degree === 1) return 1;
  if (degree === 2) return 0.62;
  if (degree === 3) return 0.4;
  return 0.25;
}

/** Радиус орбиты для степени — эллипс под пропорции сцены. */
function ringFor(degree: number): { x: number; y: number } {
  const step = Math.min(Math.max(degree, 1), 5) - 1;
  return { x: 150 + step * 65, y: 90 + step * 35 };
}

function initials(name: string): string {
  const clean = name.trim();
  return clean ? clean[0].toUpperCase() : '?';
}

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function createMap(
  canvas: HTMLElement,
  cardEl: HTMLElement,
  { lang, strings }: MapOptions
): MapHandle {
  const nodes: SimNode[] = [];

  // --- начальные позиции: группы по кругу, я в центре ---
  const groupIds = [
    ...new Set(PEOPLE.map((p) => p.group).filter((g): g is string => Boolean(g))),
  ];
  const groupAnchors = new Map<string, { x: number; y: number }>();
  groupIds.forEach((id, i) => {
    const angle = (i / groupIds.length) * Math.PI * 2 - Math.PI / 2;
    groupAnchors.set(id, {
      x: W / 2 + Math.cos(angle) * 300,
      y: H / 2 + Math.sin(angle) * 200,
    });
  });

  for (const person of [ME, ...PEOPLE]) {
    const degree = degreeOf(person.id);
    const anchor = person.id === ME.id
      ? { x: W / 2, y: H / 2 }
      : groupAnchors.get(person.group ?? '') ?? { x: W / 2, y: H / 2 };
    const cached = positionCache.get(person.id);
    const angle = Math.random() * Math.PI * 2;
    const spread = 42 + Math.random() * 46;
    nodes.push({
      person,
      x: cached?.x ?? anchor.x + Math.cos(angle) * spread,
      y: cached?.y ?? anchor.y + Math.sin(angle) * spread,
      vx: 0,
      vy: 0,
      r: radiusFor(person.id === ME.id ? 0 : degree),
      degree,
      color: person.id === ME.id ? '#a78bfa' : groupOf(person.group)?.color ?? '#8f8fa8',
      pinned: false,
    });
  }

  const byId = new Map(nodes.map((n) => [n.person.id, n]));

  // --- SVG ---
  const svg = svgEl('svg', {
    class: 'graph-svg',
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-label': strings.map.title,
  });

  const defs = svgEl('defs');
  svg.appendChild(defs);

  const viewport = svgEl('g', { class: 'graph-viewport' });
  svg.appendChild(viewport);

  const cloudLayer = svgEl('g', { class: 'graph-clouds' });
  const edgeLayer = svgEl('g', { class: 'graph-edges' });
  const groupLabelLayer = svgEl('g', { class: 'graph-group-labels' });
  const nodeLayer = svgEl('g', { class: 'graph-nodes' });
  viewport.append(cloudLayer, edgeLayer, groupLabelLayer, nodeLayer);

  // группы: мягкая зона с обводкой + подпись
  const clouds = new Map<string, SVGCircleElement>();
  const groupLabels = new Map<string, SVGTextElement>();
  for (const id of groupIds) {
    const group = groupOf(id);
    if (!group) continue;
    const cloud = svgEl('circle', {
      class: 'group-zone',
      fill: group.color,
      'fill-opacity': 0.05,
      stroke: group.color,
      'stroke-opacity': 0.24,
      'stroke-width': 1,
      'stroke-dasharray': '2 6',
      r: 10,
    });
    clouds.set(id, cloud);
    cloudLayer.appendChild(cloud);

    const label = svgEl('text', {
      class: 'graph-group-label',
      fill: group.color,
      'text-anchor': 'middle',
    });
    label.textContent = group.label[lang].toUpperCase();
    groupLabels.set(id, label);
    groupLabelLayer.appendChild(label);
  }

  // рёбра
  const edgeEls = new Map<string, SVGLineElement>();
  const edgeKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  for (const [a, b] of CONNECTIONS) {
    const line = svgEl('line', {
      class: 'graph-edge',
      'stroke-opacity': Math.min(brightnessFor(degreeOf(a)), brightnessFor(degreeOf(b))) * 0.45,
    });
    edgeEls.set(edgeKey(a, b), line);
    edgeLayer.appendChild(line);
  }

  // узлы
  interface NodeView {
    group: SVGGElement;
    image?: SVGImageElement;
    label: SVGTextElement;
  }
  const views = new Map<string, NodeView>();
  const clipCounter = { n: 0 };

  for (const node of nodes) {
    const g = svgEl('g', {
      class: 'graph-node',
      'data-id': node.person.id,
      transform: `translate(${node.x} ${node.y})`,
      tabindex: '0',
      role: 'button',
      'aria-label': [node.person.name, node.person.handle].filter(Boolean).join(' '),
    });
    g.style.opacity = String(brightnessFor(node.degree));

    const halo = svgEl('circle', {
      class: 'node-halo',
      r: node.r + 7,
      fill: node.color,
      opacity: node.person.id === ME.id ? 0.28 : 0.16,
    });
    g.appendChild(halo);

    const disc = svgEl('circle', {
      class: 'node-disc',
      r: node.r,
      fill: node.color,
      'fill-opacity': node.person.id === ME.id ? 0.9 : 0.24,
      stroke: node.color,
      'stroke-width': node.person.id === ME.id ? 2 : 1.5,
    });
    g.appendChild(disc);

    let image: SVGImageElement | undefined;
    if (node.person.avatar) {
      const clipId = `node-clip-${clipCounter.n++}`;
      const clip = svgEl('clipPath', { id: clipId });
      clip.appendChild(svgEl('circle', { r: node.r }));
      defs.appendChild(clip);
      image = svgEl('image', {
        href: node.person.avatar,
        x: -node.r,
        y: -node.r,
        width: node.r * 2,
        height: node.r * 2,
        'clip-path': `url(#${clipId})`,
        preserveAspectRatio: 'xMidYMid slice',
      });
      g.appendChild(image);
    } else {
      const text = svgEl('text', {
        class: 'node-initials',
        'text-anchor': 'middle',
        dy: '0.35em',
        'font-size': node.r * 0.85,
        fill: node.color,
      });
      text.textContent = initials(node.person.name);
      g.appendChild(text);
    }

    const label = svgEl('text', {
      class: 'node-label',
      x: node.r + 9,
      y: 4,
      'font-size': node.person.id === ME.id ? 13 : 11,
      fill: 'currentColor',
    });
    label.textContent = node.person.name;
    g.appendChild(label);

    views.set(node.person.id, { group: g, image, label });
    nodeLayer.appendChild(g);
  }

  // --- выделение ---
  let selectedId: string | null = null;

  function neighboursOf(id: string): Set<string> {
    return ADJACENCY.get(id) ?? new Set<string>();
  }

  function degreeLabel(degree: number): string {
    if (degree === 0) return strings.map.me;
    if (degree === 1) return strings.map.direct;
    // «рук» — это посредники между нами, поэтому степень 2 = через 1 руку.
    const hands = degree - 1;
    if (hands < 0 || hands > 20) return strings.map.far;
    const template = hands === 1
      ? strings.map.handshake
      : hands <= 4
        ? strings.map.handshakeFew
        : strings.map.handshakeMany;
    return template.replace('{n}', String(hands));
  }

  function renderCard(person: Person | null): void {
    if (!person) {
      cardEl.innerHTML = `<div class="map-card-empty"><span class="map-empty-dot"></span>${esc(strings.map.hint)}</div>`;
      cardEl.classList.remove('is-open');
      return;
    }

    const degree = degreeOf(person.id);
    const group = groupOf(person.group);
    const mutuals = person.id === ME.id ? [] : mutualsOf(person.id);
    const color = person.id === ME.id ? '#a78bfa' : group?.color ?? '#8f8fa8';

    const mutualHtml = person.id === ME.id
      ? ''
      : `<div class="map-card-mutual">
          <h4>${esc(strings.map.mutualTitle)}</h4>
          ${mutuals.length
            ? `<div class="map-mutual-list">${mutuals
                .map((m) => `<span class="map-mutual-chip">${esc(m.name)}</span>`)
                .join('')}</div>`
            : `<p class="map-card-muted">${esc(strings.map.noMutual)}</p>`}
        </div>`;

    const how = person.how?.[lang];
    const tags = (person.tags ?? []).map((t) => `<span class="chip">${esc(t)}</span>`).join('');
    const socials = socialLinksOf(person);
    const socialsHtml = socials.length
      ? `<div class="map-card-socials">${socials
          .map((s) => `<a class="map-social" href="${esc(s.href)}" target="_blank" rel="noopener">
              ${esc(s.label)}<span aria-hidden="true">↗</span>
            </a>`)
          .join('')}</div>`
      : '';

    cardEl.innerHTML = `
      <button class="map-card-close" type="button" aria-label="${esc(strings.map.close)}">×</button>
      <div class="map-card-head">
        <div class="map-card-avatar" style="--node-color:${color}">
          ${person.avatar
            ? `<img src="${esc(person.avatar)}" alt="${esc(person.name)}">`
            : esc(initials(person.name))}
        </div>
        <div class="map-card-id">
          <h3>${esc(person.name)}</h3>
          ${person.handle ? `<span>${esc(person.handle)}</span>` : ''}
        </div>
      </div>
      <div class="map-card-meta">
        <span class="degree-pill" style="--node-color:${color}">
          <i></i>${esc(degreeLabel(degree))}
        </span>
        ${group ? `<span class="map-card-group" style="color:${group.color}">${esc(group.label[lang])}</span>` : ''}
      </div>
      ${how ? `<p class="map-card-how">${esc(how)}</p>` : ''}
      ${tags ? `<div class="map-card-tags">${tags}</div>` : ''}
      ${socialsHtml}
      ${mutualHtml}
    `;

    cardEl.classList.add('is-open');
    cardEl.querySelector<HTMLButtonElement>('.map-card-close')?.addEventListener('click', () => select(null));
  }

  function select(id: string | null): void {
    selectedId = id;
    const focused = id ? neighboursOf(id) : new Set<string>();

    for (const node of nodes) {
      const view = views.get(node.person.id);
      if (!view) continue;
      const isSelected = node.person.id === id;
      const isNeighbour = focused.has(node.person.id);
      let opacity = brightnessFor(node.degree);
      if (id && !isSelected && !isNeighbour) opacity *= 0.18;
      view.group.style.opacity = String(opacity);
      view.group.classList.toggle('is-selected', isSelected);
      view.group.classList.toggle('is-neighbour', isNeighbour);
    }

    for (const [a, b] of CONNECTIONS) {
      const line = edgeEls.get(edgeKey(a, b));
      if (!line) continue;
      const touches = id !== null && (a === id || b === id);
      line.classList.toggle('is-active', touches);
      line.setAttribute(
        'stroke-opacity',
        String(touches ? 0.75 : Math.min(brightnessFor(degreeOf(a)), brightnessFor(degreeOf(b))) * 0.45)
      );
    }

    renderCard(id ? byId.get(id)?.person ?? null : null);
  }

  // --- физика ---
  let running = true;
  let rafId = 0;
  let idleFrames = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick(): void {
    const damping = 0.82;

    // отталкивание
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        if (dist < 0.01) {
          dx = Math.random() - 0.5;
          dy = Math.random() - 0.5;
          dist = 0.01;
        }
        const minDist = a.r + b.r + 40;
        if (dist < minDist) {
          const push = ((minDist - dist) / dist) * 0.22;
          const fx = dx * push;
          const fy = dy * push;
          if (!a.pinned) { a.vx -= fx; a.vy -= fy; }
          if (!b.pinned) { b.vx += fx; b.vy += fy; }
        }
      }
    }

    // пружины
    for (const [aId, bId] of CONNECTIONS) {
      const a = byId.get(aId);
      const b = byId.get(bId);
      if (!a || !b) continue;
      const rest = aId === ME.id || bId === ME.id ? 245 : 138;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.max(Math.hypot(dx, dy), 0.01);
      const force = (dist - rest) * 0.012;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      if (!a.pinned) { a.vx += fx; a.vy += fy; }
      if (!b.pinned) { b.vx -= fx; b.vy -= fy; }
    }

    // тяга к центру и к своей группе
    for (const node of nodes) {
      if (node.pinned) continue;
      if (node.person.id === ME.id) {
        node.vx += (W / 2 - node.x) * 0.06;
        node.vy += (H / 2 - node.y) * 0.06;
      } else {
        node.vx += (W / 2 - node.x) * 0.0002;
        node.vy += (H / 2 - node.y) * 0.0002;
        const anchor = groupAnchors.get(node.person.group ?? '');
        if (anchor) {
          node.vx += (anchor.x - node.x) * 0.003;
          node.vy += (anchor.y - node.y) * 0.003;
        }
        // кольцо по степени: чем дальше человек, тем шире орбита
        const ring = ringFor(node.degree);
        const rx = node.x - W / 2;
        const ry = node.y - H / 2;
        const norm = Math.hypot(rx / ring.x, ry / ring.y) || 0.001;
        node.vx += ((W / 2 + rx / norm) - node.x) * 0.004;
        node.vy += ((H / 2 + ry / norm) - node.y) * 0.004;
      }
      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx;
      node.y += node.vy;

      // границы
      const minX = PAD + node.r;
      const maxX = W - PAD - node.r;
      const minY = PAD + node.r;
      const maxY = H - PAD - node.r;
      if (node.x < minX) { node.x = minX; node.vx *= -0.4; }
      if (node.x > maxX) { node.x = maxX; node.vx *= -0.4; }
      if (node.y < minY) { node.y = minY; node.vy *= -0.4; }
      if (node.y > maxY) { node.y = maxY; node.vy *= -0.4; }
    }
  }

  function paint(): void {
    for (const node of nodes) {
      const view = views.get(node.person.id);
      if (view) view.group.setAttribute('transform', `translate(${node.x.toFixed(1)} ${node.y.toFixed(1)})`);
      positionCache.set(node.person.id, { x: node.x, y: node.y });
    }

    for (const [aId, bId] of CONNECTIONS) {
      const line = edgeEls.get(edgeKey(aId, bId));
      const a = byId.get(aId);
      const b = byId.get(bId);
      if (!line || !a || !b) continue;
      line.setAttribute('x1', String(a.x));
      line.setAttribute('y1', String(a.y));
      line.setAttribute('x2', String(b.x));
      line.setAttribute('y2', String(b.y));
    }

    // зоны и подписи групп
    for (const id of groupIds) {
      const members = nodes.filter((n) => n.person.group === id);
      if (!members.length) continue;
      const cx = members.reduce((sum, n) => sum + n.x, 0) / members.length;
      const cy = members.reduce((sum, n) => sum + n.y, 0) / members.length;
      const radius = Math.max(...members.map((n) => Math.hypot(n.x - cx, n.y - cy))) + 52;

      const cloud = clouds.get(id);
      if (cloud) {
        cloud.setAttribute('cx', String(cx));
        cloud.setAttribute('cy', String(cy));
        cloud.setAttribute('r', String(radius));
      }
      const label = groupLabels.get(id);
      if (label) {
        label.setAttribute('x', String(cx));
        label.setAttribute('y', String(Math.max(14, cy - radius - 8)));
      }
    }
  }

  function loop(): void {
    if (!running) return;
    tick();
    paint();
    const avgSpeed = nodes.reduce((sum, n) => sum + Math.hypot(n.vx, n.vy), 0) / nodes.length;
    idleFrames = avgSpeed < 0.06 ? idleFrames + 1 : 0;
    if (idleFrames > 45) {
      running = false;
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  function wake(): void {
    idleFrames = 0;
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(loop);
    }
  }

  if (reduceMotion) {
    for (let i = 0; i < 400; i++) tick();
    paint();
  } else {
    loop();
  }

  // --- зум и пан ---
  let scale = 1;
  let tx = 0;
  let ty = 0;
  const MIN_SCALE = 0.6;
  const MAX_SCALE = 3.2;

  function applyViewport(): void {
    viewport.setAttribute('transform', `translate(${tx} ${ty}) scale(${scale})`);
  }

  function clientToLocal(clientX: number, clientY: number): { x: number; y: number } {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const ctm = viewport.getScreenCTM();
    if (!ctm) return { x: W / 2, y: H / 2 };
    const local = point.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }

  function clientToViewBox(clientX: number, clientY: number): { x: number; y: number } {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: W / 2, y: H / 2 };
    const local = point.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }

  function zoomAt(factor: number, px: number, py: number): void {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    if (next === scale) return;
    tx = px - (px - tx) * (next / scale);
    ty = py - (py - ty) * (next / scale);
    scale = next;
    applyViewport();
  }

  function resetView(): void {
    scale = 1;
    tx = 0;
    ty = 0;
    applyViewport();
  }

  const onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const point = clientToViewBox(event.clientX, event.clientY);
    zoomAt(Math.exp(-event.deltaY * 0.0012), point.x, point.y);
  };
  svg.addEventListener('wheel', onWheel, { passive: false });

  // панорамирование по пустому месту
  let panning = false;
  let panStart = { x: 0, y: 0 };
  let panOrigin = { x: 0, y: 0 };

  const onPointerDown = (event: PointerEvent): void => {
    const target = event.target as Element;
    if (target.closest('.graph-node')) return;
    panning = true;
    panStart = clientToViewBox(event.clientX, event.clientY);
    panOrigin = { x: tx, y: ty };
    svg.setPointerCapture(event.pointerId);
    svg.classList.add('is-panning');
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!panning) return;
    const point = clientToViewBox(event.clientX, event.clientY);
    tx = panOrigin.x + (point.x - panStart.x);
    ty = panOrigin.y + (point.y - panStart.y);
    applyViewport();
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (!panning) return;
    panning = false;
    svg.classList.remove('is-panning');
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
  };

  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);

  // перетаскивание узлов + клик
  const nodeCleanup: Array<() => void> = [];

  for (const node of nodes) {
    const view = views.get(node.person.id);
    if (!view) continue;
    const g = view.group;

    let dragging = false;
    let moved = false;
    let pointerId = -1;

    const down = (event: PointerEvent): void => {
      event.stopPropagation();
      event.preventDefault();
      dragging = true;
      moved = false;
      pointerId = event.pointerId;
      node.pinned = true;
      node.vx = 0;
      node.vy = 0;
      wake();
      g.setPointerCapture(event.pointerId);
      g.classList.add('is-dragging');
    };

    const move = (event: PointerEvent): void => {
      if (!dragging) return;
      event.stopPropagation();
      const local = clientToLocal(event.clientX, event.clientY);
      const dx = local.x - node.x;
      const dy = local.y - node.y;
      if (Math.hypot(dx, dy) > 1.5) moved = true;
      node.x = local.x;
      node.y = local.y;
    };

    const up = (event: PointerEvent): void => {
      if (!dragging) return;
      dragging = false;
      node.pinned = false;
      g.classList.remove('is-dragging');
      if (g.hasPointerCapture(pointerId)) g.releasePointerCapture(pointerId);
      if (!moved) select(node.person.id);
      wake();
      event.stopPropagation();
    };

    const key = (event: KeyboardEvent): void => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select(node.person.id);
      }
    };

    g.addEventListener('pointerdown', down);
    g.addEventListener('pointermove', move);
    g.addEventListener('pointerup', up);
    g.addEventListener('pointercancel', up);
    g.addEventListener('keydown', key);
    nodeCleanup.push(() => {
      g.removeEventListener('pointerdown', down);
      g.removeEventListener('pointermove', move);
      g.removeEventListener('pointerup', up);
      g.removeEventListener('pointercancel', up);
      g.removeEventListener('keydown', key);
    });
  }

  // клик по фону снимает выделение
  const onBackgroundClick = (event: MouseEvent): void => {
    const target = event.target as Element;
    if (!target.closest('.graph-node')) select(null);
  };
  svg.addEventListener('click', onBackgroundClick);

  // кнопки зума
  const zoomButtons = cardEl.parentElement?.querySelectorAll<HTMLButtonElement>('[data-map-action]') ?? [];
  const buttonHandlers: Array<{ el: HTMLButtonElement; fn: () => void }> = [];
  zoomButtons.forEach((button) => {
    const action = button.dataset.mapAction;
    const fn = (): void => {
      if (action === 'in') zoomAt(1.25, W / 2, H / 2);
      else if (action === 'out') zoomAt(0.8, W / 2, H / 2);
      else resetView();
    };
    button.addEventListener('click', fn);
    buttonHandlers.push({ el: button, fn });
  });

  canvas.innerHTML = '';
  canvas.appendChild(svg);
  applyViewport();
  renderCard(null);

  return {
    destroy(): void {
      running = false;
      cancelAnimationFrame(rafId);
      for (const cleanup of nodeCleanup) cleanup();
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('pointerdown', onPointerDown);
      svg.removeEventListener('pointermove', onPointerMove);
      svg.removeEventListener('pointerup', onPointerUp);
      svg.removeEventListener('pointercancel', onPointerUp);
      svg.removeEventListener('click', onBackgroundClick);
      for (const { el, fn } of buttonHandlers) el.removeEventListener('click', fn);
      canvas.innerHTML = '';
      cardEl.innerHTML = '';
    },
  };
}

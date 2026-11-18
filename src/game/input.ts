import type { Settings } from './save';

export interface InputFrame {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  confirm: boolean;
  cancel: boolean;
  menu: boolean;
  upEdge: boolean;
  downEdge: boolean;
  leftEdge: boolean;
  rightEdge: boolean;
  confirmEdge: boolean;
  cancelEdge: boolean;
  menuEdge: boolean;
}

const held = new Set<string>();
const edges = new Set<string>();
let padPrev = new Set<string>();

let binds: () => Settings = () => ({
  volume: 0.4,
  textSpeed: 2,
  instant: false,
  reduced: false,
  logAlways: true,
  confirm: 'KeyZ',
  cancel: 'KeyX',
  menu: 'KeyC',
});

function actionFor(code: string): string | null {
  const settings = binds();
  if (code === 'ArrowUp' || code === 'KeyW') return 'up';
  if (code === 'ArrowDown' || code === 'KeyS') return 'down';
  if (code === 'ArrowLeft' || code === 'KeyA') return 'left';
  if (code === 'ArrowRight' || code === 'KeyD') return 'right';
  if (code === settings.confirm || code === 'Enter' || code === 'NumpadEnter') return 'confirm';
  if (code === settings.cancel || code === 'Escape') return 'cancel';
  if (code === settings.menu) return 'menu';
  return null;
}

export function attachInput(readSettings: () => Settings): void {
  binds = readSettings;
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const name = actionFor(event.code);
    if (!name) return;
    event.preventDefault();
    held.add(name);
    edges.add(name);
  });
  window.addEventListener('keyup', (event) => {
    const name = actionFor(event.code);
    if (!name) return;
    held.delete(name);
  });
}

function pollPad(): void {
  if (navigator.webdriver) return;
  const list = navigator.getGamepads?.() ?? [];
  const now = new Set<string>();
  for (const pad of list) {
    if (!pad) continue;
    const up = pad.buttons[12]?.pressed || (pad.axes[1] ?? 0) < -0.5;
    const down = pad.buttons[13]?.pressed || (pad.axes[1] ?? 0) > 0.5;
    const left = pad.buttons[14]?.pressed || (pad.axes[0] ?? 0) < -0.5;
    const right = pad.buttons[15]?.pressed || (pad.axes[0] ?? 0) > 0.5;
    if (up) now.add('up');
    if (down) now.add('down');
    if (left) now.add('left');
    if (right) now.add('right');
    if (pad.buttons[0]?.pressed) now.add('confirm');
    if (pad.buttons[1]?.pressed) now.add('cancel');
    if (pad.buttons[9]?.pressed) now.add('menu');
  }
  for (const name of now) {
    held.add(name);
    if (!padPrev.has(name)) edges.add(name);
  }
  for (const name of padPrev) {
    if (!now.has(name)) held.delete(name);
  }
  padPrev = now;
}

function frame(withEdges: boolean): InputFrame {
  const on = (name: string): boolean => held.has(name);
  const edge = (name: string): boolean => withEdges && edges.has(name);
  return {
    up: on('up'),
    down: on('down'),
    left: on('left'),
    right: on('right'),
    confirm: on('confirm'),
    cancel: on('cancel'),
    menu: on('menu'),
    upEdge: edge('up'),
    downEdge: edge('down'),
    leftEdge: edge('left'),
    rightEdge: edge('right'),
    confirmEdge: edge('confirm'),
    cancelEdge: edge('cancel'),
    menuEdge: edge('menu'),
  };
}

export function snapshot(): InputFrame {
  pollPad();
  const sample = frame(true);
  edges.clear();
  return sample;
}

export function heldFrame(): InputFrame {
  pollPad();
  return frame(false);
}

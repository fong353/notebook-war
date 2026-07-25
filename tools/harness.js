/* 无头测试台：把游戏的 <script> 抽出来，在 node 里跑真实模拟。
   DOM / canvas 全部用吞噬型 Proxy 顶掉，只保留会影响逻辑的少数几个值。
   这样量数据、跑几十局都不用开浏览器。 */
const fs = require('fs'), path = require('path'), vm = require('vm');

function anyProxy(name) {
  const f = function () { return P; };
  const P = new Proxy(f, {
    get(t, k) {
      if (k === 'length') return 0;
      if (k === Symbol.toPrimitive || k === 'toString' || k === 'valueOf') return () => '';
      if (k === Symbol.iterator) return function* () {};
      if (k === 'width' || k === 'height') return 900;
      if (k === 'getBoundingClientRect') return () => ({ left: 0, top: 0, width: 900, height: 600 });
      if (k === 'classList') return P;
      if (k === 'dataset') return P;
      return P;
    },
    set() { return true; },
    apply() { return P; },
    has() { return true; },
  });
  return P;
}

/* 记录绘制包围盒用的假 2D context */
function boxCtx() {
  const b = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
  const T = (x, y) => {
    if (!isFinite(x) || !isFinite(y)) return;
    b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x);
    b.y0 = Math.min(b.y0, y); b.y1 = Math.max(b.y1, y);
  };
  let lw = 1.7;
  const c = {
    __box: b, __reset() { b.x0 = b.y0 = 1e9; b.x1 = b.y1 = -1e9; },
    save() {}, restore() {}, beginPath() {}, stroke() {}, fill() {}, closePath() {},
    setLineDash() {}, translate() {}, scale() {}, rotate() {}, fillText() {}, clip() {},
    clearRect() {}, fillRect() {}, drawImage() {}, createLinearGradient: () => anyProxy(),
    setTransform() {}, resetTransform() {}, transform() {}, createPattern: () => null,
    strokeRect() {}, arcTo() {}, roundRect() {}, isPointInPath: () => false,
    createRadialGradient: () => anyProxy(), setLineWidth() {},
    getImageData: () => ({ data: [] }), putImageData() {}, measureText: () => ({ width: 10 }),
    moveTo: T, lineTo: T,
    arc(x, y, r) { T(x - r, y - r); T(x + r, y + r); },
    ellipse(x, y, rx, ry) { T(x - rx, y - ry); T(x + rx, y + ry); },
    quadraticCurveTo(a, d, x, y) { T(a, d); T(x, y); },
    bezierCurveTo(a, d, e, g, x, y) { T(a, d); T(e, g); T(x, y); },
    rect(x, y, w, h) { T(x, y); T(x + w, y + h); },
    get lineWidth() { return lw; }, set lineWidth(v) { lw = v; },
  };
  for (const k of ['strokeStyle','fillStyle','globalAlpha','lineCap','lineJoin','font',
                   'textAlign','textBaseline','shadowBlur','shadowColor','globalCompositeOperation','filter'])
    Object.defineProperty(c, k, { set() {}, get() { return ''; }, configurable: true });
  return c;
}

function load(file, opts = {}) {
  const src = fs.readFileSync(path.resolve(file), 'utf8');
  const code = src.match(/<script>([\s\S]*)<\/script>/)[1];
  const gctx = boxCtx();
  const doc = anyProxy('document');
  const sandbox = {
    console,
    document: new Proxy({}, {
      get(t, k) {
        if (k === 'getElementById' || k === 'querySelector') return () => elStub(gctx);
        if (k === 'querySelectorAll') return () => [];
        if (k === 'createElement') return () => elStub(gctx);
        if (k === 'body' || k === 'documentElement') return elStub(gctx);
        if (k === 'addEventListener') return () => {};
        return doc[k];
      },
    }),
    requestAnimationFrame: () => 0, cancelAnimationFrame: () => {},
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    location: { search: opts.search || '', href: '' },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    matchMedia: () => ({ matches: false, addListener() {}, addEventListener() {} }),
    devicePixelRatio: 1, innerWidth: 1200, innerHeight: 800,
    Image: function () { return anyProxy(); },
    AudioContext: function () { return anyProxy(); },
    webkitAudioContext: function () { return anyProxy(); },
    performance: { now: () => 0 },
    URLSearchParams,
    Math, JSON, Date, parseInt, parseFloat, isFinite, isNaN,
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox; sandbox.self = sandbox;
  vm.createContext(sandbox);
  /* 游戏里的 UNITS / update 等都是 const，不会挂到 vm 的全局对象上。
     在同一个脚本作用域里留一个 eval 探针，就能读写它们 */
  vm.runInContext(code + '\n;globalThis.__peek = function (expr) { return eval(expr); };',
                  sandbox, { filename: file });
  sandbox.__gctx = gctx;
  const peek = sandbox.__peek;
  sandbox.$ = peek;                       // g.$('units.length')
  sandbox.get = n => peek(n);
  return sandbox;
}

function elStub(gctx) {
  return new Proxy({}, {
    get(t, k) {
      if (k === 'getContext') return () => gctx;
      if (k === 'width' || k === 'height') return 900;
      if (k === 'getBoundingClientRect') return () => ({ left: 0, top: 0, width: 900, height: 600 });
      if (k === 'querySelectorAll') return () => [];
      if (k === 'appendChild' || k === 'removeChild' || k === 'remove') return () => {};
      if (k === 'addEventListener') return () => {};
      if (k === 'classList' || k === 'style' || k === 'dataset') return anyProxy();
      if (k === 'firstElementChild' || k === 'firstChild') return elStub(gctx);
      if (k === 'textContent' || k === 'innerHTML' || k === 'value') return '';
      return anyProxy();
    },
    set() { return true; },
  });
}

module.exports = { load, boxCtx };

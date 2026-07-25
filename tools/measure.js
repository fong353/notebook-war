/* 量出每个单位实际画多大（含武器的视觉包围盒） */
const { load } = require('./harness');
module.exports = function measure(file) {
  const g = load(file);
  const UNITS = g.$('UNITS'), ALL = g.$('ALL'), DRAW = g.$('DRAW'), seed = g.$('seed');
  const c = g.__gctx, out = {};
  for (const k of ALL) {
    const d = UNITS[k];
    if (!d || !DRAW[k]) continue;
    const u = { d, ph: 1.1, flash: 0, prone: 0, aimEl: .15, hp: d.hp, max: d.hp, sd: 7,
      dropping: 0, face: 1, alt: d.alt || 0, wz: .5, wx: 0, side: 0, smokeT: 0,
      bunker: null, dmgTrack: 0, turnT: 0, rank: 0, leg: 0, egress: 0, fuel: 9, tgt: null };
    c.__reset(); c.lineWidth = 1.7;
    g.$('(function(c){ ctx = c; })')(c);
    seed(11);
    try { DRAW[k](u, 0); } catch (e) { out[k] = { err: e.message }; continue; }
    const b = c.__box;
    out[k] = { h: b.y1 - b.y0, w: b.x1 - b.x0, top: b.y0, bot: b.y1 };
  }
  return { g, UNITS, out };
};

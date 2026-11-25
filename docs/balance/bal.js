const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForTimeout(2500);
  const R = await p.evaluate(() => {
    const ZS = 0.8;   // 평타 비중 (허수아비 측정 75~88%)
    const CH = 'theron';
    const bossDef = n => (BOSSES['b' + n] || {}).def || 0;
    const mobDef = n => { const a = Object.values(MON).filter(m => m.ch === n && !m.elite).map(m => m.def || 0); return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; };
    const metr = (s, n) => { const S = calcStats(s), cf = 1 + S.crit / 100 * (CRIT_MULT - 1 + (S.critDmg || 0) / 100), as = ZS * (1 + S.aspd / 100) + (1 - ZS) * (1 + (S.cdr || 0) / 100 * 0),
        aw = awakened(s.level) ? 1.3 : 1, df = d => 100 / (100 + d * (1 - (S.pen || 0) / 100));
      return { boss: S.atk * cf * (1 + S.bossDmg / 100) * as * aw * df(bossDef(n)), mob: S.atk * cf * as * aw * df(mobDef(n)), ehp: S.hp * (100 + S.def) / 100 / (1 - (S.dmgRed || 0) / 100), S }; };
    const clone = s => JSON.parse(JSON.stringify(s));
    const refSave = (n, grade) => { const s = newSave(CH); s.level = Math.min(MAX_LEVEL, 8 * n - 1); s.flags = {}; presetGear(s, slotLeq(3 * n + 1, n, 0), n, grade == null ? (n === 1 ? 0 : 1) : grade); for (const k of SLOTS) { s.equip[k].q = 1; s.equip[k].pot = []; } return s; };
    const pct = (a, b) => Math.round((b / a - 1) * 1000) / 10;
    const stages = [1, 3, 5, 10, 15, 19, 20, 25, 30];
    const out = { stages: [], means: {} };
    const add = (name, n, base, s2) => { const m0 = metr(base, n), m1 = metr(s2, n); (out.means[name] = out.means[name] || {})[n] = { boss: pct(m0.boss, m1.boss), mob: pct(m0.mob, m1.mob), ehp: pct(m0.ehp, m1.ehp) }; };
    for (const n of stages) {
      const s = refSave(n), m = metr(s, n), S = m.S;
      out.stages.push({ n, level: s.level, rawLevel: 8 * n - 1, e: s.slotE.weapon.e, T: s.slotE.weapon.T, ilvl: n, grade: s.equip.weapon.grade, atk: Math.round(S.atk), hp: Math.round(S.hp), def: Math.round(S.def), crit: +S.crit.toFixed(1), critOver: +(S.critOver || 0).toFixed(1), aspd: +S.aspd.toFixed(1), bossDmg: +S.bossDmg.toFixed(1), pen: +S.pen.toFixed(1), bossDef: bossDef(n), mobDef: +mobDef(n).toFixed(1), recCp: recCp ? null : null });
      // 1 레벨 +1 / +10
      { const t = clone(s); t.level = Math.min(MAX_LEVEL, s.level + 1); add('레벨 +1', n, s, t); }
      { const t = clone(s); t.level = Math.min(MAX_LEVEL, s.level + 10); add('레벨 +10', n, s, t); }
      // 2 강화 +1 (6칸 모두)
      { const t = clone(s); for (const k of SLOTS) t.slotE[k].e = Math.min(ENH_MAX, t.slotE[k].e + 1); add('강화 +1 (6칸 모두)', n, s, t); }
      for (const k of SLOTS) { const t = clone(s); t.slotE[k].e = Math.min(ENH_MAX, t.slotE[k].e + 1); add('강화 +1 · ' + SLOT_INFO[k].name, n, s, t); }
      // 3 등급 한 단계 (6칸)
      { const t = clone(s); for (const k of SLOTS) { const g = Math.min(3, t.equip[k].grade + 1); const it = makeItem(k, CH, g, n, t); it.q = 1; it.pot = []; t.equip[k] = it; } add('장비 등급 +1단계 (6칸)', n, s, t); }
      // 4 아이템 레벨 +1 (다음 장 장비)
      { const t = clone(s); for (const k of SLOTS) { const it = makeItem(k, CH, t.equip[k].grade, Math.min(CH_LAST, n + 1), t); it.q = 1; it.pot = []; t.equip[k] = it; } add('아이템 레벨 +1 (다음 장 장비)', n, s, t); }
      // 5 계승 T+1 (6칸)
      { const t = clone(s); for (const k of SLOTS) t.slotE[k].T += 1; add('계승 +1 (6칸)', n, s, t); }
      // 6 품질 중급→최상급
      { const t = clone(s); for (const k of SLOTS) t.equip[k].q = 3; add('품질 중급→최상급 (6칸)', n, s, t); }
      { const t = clone(s); for (const k of SLOTS) t.equip[k].q = 2; add('품질 중급→상급 (6칸)', n, s, t); }
      // 7 잠재 한 줄 (레전드 평균)
      for (const pk of Object.keys(POT)) { const t = clone(s), [lo, hi] = POT[pk].r; t.equip.weapon.pot = [{ k: pk, v: (lo + hi) / 2 * 1.75 }]; add('잠재 1줄 · ' + POT[pk].n, n, s, t); }
      // 8 반지
      for (const rc of [10, 20, 30]) { const t = clone(s); t.equip.acc1 = makeRing(rc, t); t.equip.acc1.pot = []; t.slotE.acc1 = { e: 0, T: 0, gauge: 0 }; add('반지 ' + rc + '장 (잠재 없이)', n, s, t); }
      { const t = clone(s); t.equip.acc1 = makeRing(10, t); t.equip.acc1.pot = []; t.slotE.acc1 = { e: 0, T: 0, gauge: 0 }; const u = clone(t); u.slotE.acc1.e = 15; add('반지 칸 강화 +15', n, t, u); }
      // 9 펫 도감 10마리, 업적 10개
      { const t = clone(s); t.pets = {}; for (let i = 1; i <= 10; i++) t.pets['b' + i] = 1; add('쁘띠 도감 +10마리', n, s, t); }
      // 10 각성 (Lv75) — 레벨 74 → 75
      out.awaken = { atk: 1.3 };
    }
    // 강화 단계별 비용·확률
    out.enh = ENH_RATE.map((r, e) => ({ e, rate: r, tries: +expectedTries(e).toFixed(2), gold1: enhGold(e, 0), gold2: enhGold(e, 2) }));
    out.grades = GRADES.map(g => ({ name: g.name, mul: g.mul, p: g.p })); out.quality = QUALITY.map((q, i) => ({ n: q.n, mul: q.mul, w: QUALITY_W[i] }));
    out.opts = OPTS; out.slotOpts = SLOT_OPTS; out.slotInfo = SLOT_INFO; out.pot = POT; out.potBySlot = POT_BY_SLOT;
    out.lvl = [1, 25, 50, 75, 100, 120, 150].map(L => { const s = refSave(1); s.level = L; const S = calcStats(s); return { L, atk: Math.round(10 + 2.2 * (L - 1)), hp: 100 + 16 * (L - 1), def: 3 + (L - 1), aspd: Math.min(ASPD_LV_MAX, ASPD_LV * (L - 1)) }; });
    out.trophy = TROPHY_PER; out.ringDefs = RINGS; out.ringEnh = RING_ENH; out.CRIT_MULT = CRIT_MULT; out.caps = { aspd: ASPD_CAP, pen: 60, cdr: 40, hpGain: 40, xpGain: 60, dmgRed: 30, jumpP: 25, spd: 40 };
    out.recLevelOver = [10, 15, 18, 19, 20, 25, 30].map(n => ({ n, want: 8 * n - 1 }));
    return out; });
  fs.writeFileSync(process.argv[2] + '/bal.json', JSON.stringify(R, null, 1)); console.log('ok', Object.keys(R.means).length, 'means'); await b.close(); })();

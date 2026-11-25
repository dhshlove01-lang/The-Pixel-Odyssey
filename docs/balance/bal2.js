const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForTimeout(2500);
  const R = await p.evaluate(() => {
    const ZS = 0.8, CH = 'theron';
    const bossDef = n => BOSSES['b' + n].def;
    const met = (s, n) => { const S = calcStats(s), cf = 1 + S.crit / 100 * (CRIT_MULT - 1 + (S.critDmg || 0) / 100), as = ZS * (1 + S.aspd / 100) + (1 - ZS), aw = awakened(s.level) ? 1.3 : 1;
      return { boss: S.atk * cf * (1 + S.bossDmg / 100) * as * aw * 100 / (100 + bossDef(n) * (1 - S.pen / 100)), mob: S.atk * cf * as * aw, cp: S.cp, atk: S.atk, S }; };
    const clone = s => JSON.parse(JSON.stringify(s));
    const ref = (n, gr) => { const s = newSave(CH); s.level = Math.min(MAX_LEVEL, 8 * n - 1); s.flags = {}; const Tc = INHERIT_CH.filter(c => c < n).length, e = Math.min(ENH_MAX, 3 * n + 1);
      presetGear(s, slotLeq(e, n, Tc), n, gr); for (const k of SLOTS) { s.slotE[k].e = e; s.slotE[k].T = Tc; s.equip[k].q = 1; s.equip[k].pot = []; } return s; };
    const pct = (a, b) => Math.round((b / a - 1) * 1000) / 10;
    const out = {};
    // 1) 무기 경우의 수: 등급 × 품질 × 강화(0/15) — 10장·20장
    out.weapon = [];
    for (const n of [10, 20]) { const base = ref(n, 1); const m0 = met(base, n);
      for (let gr = 0; gr <= 3; gr++) for (let q = 0; q <= 3; q++) for (const e of [0, 15]) {
        const s = clone(base); const it = makeItem('weapon', CH, gr, n, s); it.q = q; it.pot = []; delete it.skill; s.equip.weapon = it; s.slotE.weapon.e = e;
        const m = met(s, n); out.weapon.push({ n, gr, q, e, atk: Math.round(m.atk), boss: pct(m0.boss, m.boss), cp: pct(m0.cp, m.cp) }); } }
    // 2) 잠재 등급(= 장비 등급)별 풀세트: 6부위+반지, 부위마다 가장 센 줄로 (평균값 / 최대값)
    const bestPot = { weapon: ['bossDmg', 'critDmg', 'atkP'], pauldron: ['critDmg', 'atkP', 'critDmg'], helm: ['atkP', 'atkP', 'atkP'], chest: ['atkP', 'atkP', 'atkP'], legs: ['atkP', 'atkP', 'atkP'], boots: ['atkP', 'atkP', 'atkP'], acc1: ['critDmg', 'atkP', 'critDmg'] };
    const mobPot = Object.assign({}, bestPot, { weapon: ['critDmg', 'atkP', 'critDmg'] });
    out.potset = [];
    for (const n of [10, 20]) for (let gr = 0; gr <= 3; gr++) for (const how of ['avg', 'max']) for (const tgt of ['boss', 'mob']) {
      const s = ref(n, gr), m0 = met(s, n), t = clone(s), P = tgt === 'boss' ? bestPot : mobPot, lines = POT_LINES[gr], k = 1 + gr * 0.25;
      t.equip.acc1 = makeRing(10, t); t.slotE.acc1 = { e: 0, T: 0, gauge: 0 }; t.equip.acc1.pot = [];
      const s2 = clone(t);
      for (const sl of SLOTS) s2.equip[sl].pot = P[sl].slice(0, lines).map(x => ({ k: x, v: (how === 'max' ? POT[x].r[1] : (POT[x].r[0] + POT[x].r[1]) / 2) * k }));
      s2.equip.acc1.pot = P.acc1.map(x => ({ k: x, v: (how === 'max' ? POT[x].r[1] : (POT[x].r[0] + POT[x].r[1]) / 2) * 1.75 }));
      const a = met(t, n), c = met(s2, n);
      out.potset.push({ n, gr, how, tgt, lines, dmg: pct(a[tgt], c[tgt]), cp: pct(a.cp, c.cp) }); }
    // 3) 전투력이 실제 딜을 따라가나: 수단별 cp% vs 보스 딜% (10장·20장)
    out.cpvs = [];
    const means = {
      '레벨 +10': (s) => { s.level = Math.min(MAX_LEVEL, s.level + 10); },
      '각성 (Lv74→75)': null,
      '강화 +1 (6칸)': s => { for (const k of SLOTS) s.slotE[k].e = Math.min(ENH_MAX, s.slotE[k].e + 1); },
      '등급 +1 (6칸)': s => { for (const k of SLOTS) { const it = makeItem(k, CH, Math.min(3, s.equip[k].grade + 1), s.equip[k].ilvl, s); it.q = 1; it.pot = []; s.equip[k] = it; } },
      '계승 +1 (6칸)': s => { for (const k of SLOTS) s.slotE[k].T += 1; },
      '품질 최상급 (6칸)': s => { for (const k of SLOTS) s.equip[k].q = 3; },
      '잠재 공격력 1줄': s => { s.equip.weapon.pot = [{ k: 'atkP', v: 8.75 }]; },
      '잠재 치명타 피해 1줄': s => { s.equip.weapon.pot = [{ k: 'critDmg', v: 17.5 }]; },
      '잠재 보스 피해 1줄': s => { s.equip.weapon.pot = [{ k: 'bossDmg', v: 13.125 }]; },
      '잠재 받는 피해 감소 1줄': s => { s.equip.weapon.pot = [{ k: 'dmgRed', v: 4.375 }]; },
      '반지 30장': s => { s.equip.acc1 = makeRing(30, s); s.equip.acc1.pot = []; s.slotE.acc1 = { e: 0, T: 0, gauge: 0 }; },
      '쁘띠 도감 10마리': s => { s.pets = {}; for (let i = 1; i <= 10; i++) s.pets['b' + i] = 1; },
    };
    for (const n of [10, 20]) { const s = ref(n, 1), m0 = met(s, n);
      for (const [nm, f] of Object.entries(means)) {
        if (!f) { const a = clone(s); a.level = 74; const b2 = clone(s); b2.level = 75; const ma = met(a, n), mb = met(b2, n); out.cpvs.push({ n, nm, boss: pct(ma.boss, mb.boss), cp: pct(ma.cp, mb.cp) }); continue; }
        const t = clone(s); f(t); const m = met(t, n); out.cpvs.push({ n, nm, boss: pct(m0.boss, m.boss), cp: pct(m0.cp, m.cp) }); } }
    // 4) 권장 전투력 vs 실제로 가능한 전투력
    out.rec = [];
    for (const n of [1, 5, 10, 11, 15, 19, 20, 21, 25, 30]) {
      let rc = null; try { const keep = G.save; G.save = { char: CH }; rc = recCp(n); G.save = keep; } catch (e) { }
      const r1 = met(ref(n, 1), n).cp, r3 = (() => { const s = ref(n, 3); for (const k of SLOTS) s.equip[k].q = 3; return met(s, n).cp; })();
      out.rec.push({ n, rec: rc, rare: Math.round(r1), legend: Math.round(r3) }); }
    return out; });
  fs.writeFileSync(process.argv[2] + '/bal2.json', JSON.stringify(R)); await b.close(); })();

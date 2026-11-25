const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForTimeout(2500);
  const R = await p.evaluate(() => {
    const CH = 'theron', ZS = 0.8;
    const s0 = newSave(CH); s0.level = 60; startGame(s0, false);
    const metr = (s, n, def) => { const S = calcStats(s), cf = 1 + S.crit / 100 * (CRIT_MULT - 1 + (S.critDmg || 0) / 100), as = ZS * (1 + S.aspd / 100) + (1 - ZS), aw = awakened(s.level) ? 1.3 : 1;
      return { dps: S.atk * cf * (1 + S.bossDmg / 100) * as * aw * 100 / (100 + def * (1 - S.pen / 100)), ehp: S.hp * (100 + S.def) / 100 }; };
    const mk = (n, real, grade) => { const s = newSave(CH); s.flags = {};
      if (!real) { s.level = 8 * n - 1; presetGear(s, slotLeq(3 * n + 1, n, 0), n, grade); }
      else { s.level = Math.min(MAX_LEVEL, 8 * n - 1); const Tcap = INHERIT_CH.filter(c => c < n).length, e = Math.min(ENH_MAX, 3 * n + 1);
        presetGear(s, slotLeq(e, n, Tcap), n, grade); for (const k of SLOTS) { s.slotE[k].e = e; s.slotE[k].T = Math.min(Tcap, s.slotE[k].T); } }
      for (const k of SLOTS) { s.equip[k].q = 1; s.equip[k].pot = []; } return s; };
    const rows = [];
    for (let n = 1; n <= 30; n++) {
      const id = 'b' + n; G.boss = null; spawnBoss(id); const B = G.boss, def = B.d.def;
      const ref = metr(mk(n, false, n === 1 ? 0 : 1), n, def), realR = metr(mk(n, true, n === 1 ? 0 : 1), n, def), realL = metr(mk(n, true, 3), n, def);
      const sR = mk(n, true, 1);
      rows.push({ n, hp: B.mhp, atkMul: +B.atkMul.toFixed(2), def, refLv: 8 * n - 1, realLv: sR.level, refT: mk(n, false, 1).slotE.weapon.T, realT: sR.slotE.weapon.T,
        refDps: Math.round(ref.dps), realDps: Math.round(realR.dps), legDps: Math.round(realL.dps), refEhp: Math.round(ref.ehp), realEhp: Math.round(realR.ehp), legEhp: Math.round(realL.ehp) });
    }
    G.boss = null; return rows; });
  fs.writeFileSync(process.argv[2] + '/gap.json', JSON.stringify(R)); await b.close(); })();

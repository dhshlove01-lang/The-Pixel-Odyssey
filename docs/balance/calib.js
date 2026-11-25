const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const res = [];
  for (const n of [5, 10, 11, 15, 20, 25, 30]) for (const spec of ['base', 'max']) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:8765/test/index.html'); await p.waitForTimeout(2200);
    const info = await p.evaluate(([n, spec]) => {
      const s = newSave('theron'); s.level = Math.min(MAX_LEVEL, 8 * n - 1); s.flags = { mobility: true };
      const Tcap = INHERIT_CH.filter(c => c < n).length, e = Math.min(ENH_MAX, 3 * n + 1), gr = spec === 'max' ? 3 : (n === 1 ? 0 : 1);
      presetGear(s, slotLeq(e, n, Tcap), n, gr); for (const k of SLOTS) { s.slotE[k].e = e; s.slotE[k].T = Tcap; s.equip[k].q = spec === 'max' ? 3 : 1; s.equip[k].pot = []; }
      if (spec === 'max') {
        const mx = k => Math.round(POT[k].r[1] * 1.75 * 10) / 10;
        const P = { weapon: ['bossDmg', 'bossDmg', 'critDmg'], pauldron: ['critDmg', 'critDmg', 'critDmg'], helm: ['atkP', 'atkP', 'atkP'], chest: ['atkP', 'atkP', 'atkP'], legs: ['atkP', 'atkP', 'atkP'], boots: ['atkP', 'atkP', 'atkP'] };
        for (const k of SLOTS) s.equip[k].pot = P[k].map(x => ({ k: x, v: mx(x) }));
        const r = makeRing(30, s); r.pot = [{ k: 'atkP', v: mx('atkP') }, { k: 'critDmg', v: mx('critDmg') }, { k: 'critDmg', v: mx('critDmg') }]; s.equip.acc1 = r; s.slotE.acc1 = { e: 15, T: 0, gauge: 0 };
        for (const t of TRAITS.theron) s.traits[t.id] = 15; s.pets = {}; for (let i = 1; i <= 30; i++) s.pets['b' + i] = 1;
      }
      startGame(s, false);
      const id = Object.keys(MAPS).find(k => MAPS[k].ch === Math.min(n, 20) && !MAPS[k].safe && !MAPS[k].boss && !MAPS[k].gate && !MAPS[k].sewer); loadMap(id);
      G.devNoSpawn = true; for (const m of G.mons) { m.st = 'die'; m.dead = 0; m.minion = true; }
      const def = BOSSES['b' + n].def; G.player.face = 1; dummySpawn(def); G.player.x = DUMMY.e.x - 70; G.devGod = true; G.devSpeed = 3;
      G.boss = null; spawnBoss('b' + n); const hp = G.boss.mhp; G.boss = null;
      return { lv: s.level, e, T: Tcap, def, hp, atk: Math.round(G.stats.atk) };
    }, [n, spec]);
    await p.waitForTimeout(400);
    const t0 = Date.now();
    while (Date.now() - t0 < 30000) { for (const k of ['KeyX', 'KeyC', 'KeyA', 'KeyS', 'KeyD']) await p.keyboard.press(k); await p.keyboard.down('KeyZ'); await p.waitForTimeout(110); await p.keyboard.up('KeyZ');
      await p.evaluate(() => { const p = G.player, d = DUMMY.e; if (d && Math.abs(p.x - (d.x - 70)) > 120) p.x = d.x - 70; p.face = 1; }); }
    const m = await p.evaluate(() => ({ tot: DUMMY.tot, sec: DUMMY.t1 - DUMMY.t0 }));
    const dps = m.tot / Math.max(1, m.sec); res.push(Object.assign({ n, spec, dps: Math.round(dps), killSec: Math.round(info.hp / dps) }, info));
    console.log(JSON.stringify(res[res.length - 1]), errs.slice(0, 1)); await p.close();
  }
  fs.writeFileSync(process.argv[2] + '/calib.json', JSON.stringify(res)); await b.close(); })();

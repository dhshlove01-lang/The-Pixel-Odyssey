/* 재화 검증 (2026-11-25, 사용자: "재화로 강화 단계 검증, 부족하면 잡몹 파밍 시간 계산 · 재화 밸런스도")
   실행: node docs/balance/econ.js  (http.server 8765) → docs/balance/econ_261125.json
   장마다:
   - 들어오는 것: 그 장 퀘스트 보상(골드·경험치), 몹 1마리당 기대 골드(공식: 골드 범위 평균 × 몹 골드 배율 + 파편 골드), 몹 1마리당 장비 드롭(등급별 확률),
                 AI 가 그 장 사냥터에서 60초(게임 시간) 사냥한 분당 처치 수(전사·궁수 평균) → 분당 골드·분당 장비
   - 나가는 것(그 장 '열심히 한 스펙'에 필요한 만큼, 앞 장 스펙에서 더 올리는 몫): 강화(부위 6개, 장인의 기운 포함 기대 시도 × 비용),
                 품질 리롤(새로 최상급 부위 × 1/0.5% 회 × (품질석 1 + 200골드)), 잠재 리롤(새 장비마다 원하는 줄 맞추기 기대 횟수, 잠금 비용 포함) */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'bossai.js'), 'utf8');
const injSrc = src.slice(src.indexOf('const INJECT = () => {') + 'const INJECT = '.length, src.indexOf('\n};\n', src.indexOf('const INJECT')) + 2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://127.0.0.1:8765/test/index.html'); await p.waitForTimeout(1800);
  await p.evaluate(`(${injSrc})()`);
  const base = await p.evaluate(() => {
    /* 강화 기대 비용: +e → +e+1, 성공률 r, 실패하면 게이지 += r × GAUGE_RATE (100 이면 확정) */
    const enhStep = (e, T) => { const r = ENH_RATE[e] / 100; let gauge = 0, pReach = 1, tries = 0; for (let i = 0; i < 400 && pReach > 1e-9; i++) { if (gauge >= 100) { tries += pReach; break; } tries += pReach; pReach *= (1 - r); gauge += ENH_RATE[e] * GAUGE_RATE; } return tries * enhGold(e, T); };
    const enhTo = (e0, e1, T) => { let g = 0; for (let e = e0; e < e1; e++) g += enhStep(e, T); return g; };
    const out = [];
    let prev = null;
    for (let n = 1; n <= 30; n++) {
      const qs = Object.values(QUESTS).filter(q => q.ch === n);
      const qGold = qs.reduce((a, q) => a + ((q.rew && q.rew.gold) || 0), 0), qXp = qs.reduce((a, q) => a + ((q.rew && q.rew.xp) || 0), 0);
      const qKills = qs.filter(q => q.type === 'kill' || q.type === 'elite').reduce((a, q) => a + (q.need || 0), 0);
      const mons = Object.values(MON).filter(m => m.ch === n && !m.boss && !m.elite && m.gold);
      const gpk = mons.length ? mons.reduce((a, d) => a + ((d.gold[0] + d.gold[1]) / 2) * GOLD_DROP_X + (d.stone ? d.stone[0] * ((d.stone[1] + d.stone[2]) / 2) * stoneGold(d.ch || 1) * GOLD_DROP_X : 0), 0) / mons.length : 0;
      const itemsPk = GRADES.map(g => g.p);
      const { P } = hardSpec(n, 'theron');
      const T = P.T || 0;
      const e0 = prev ? prev.e : 0;
      const enhGoldNeed = 6 * enhTo(e0, P.e, T);
      const newQ3 = Math.max(0, (P.q3 || 0) - (prev ? prev.q3 || 0 : 0));
      const qualRerolls = newQ3 * (1 / 0.005) + (P.q2 && !(prev && prev.q2) ? 6 * (1 / 0.3) : 0);
      /* 잠재: 등급이 오른 부위는 새 장비 → 원하는 줄(부위 풀 6개 중 1개, 평균 이상 굴림)을 줄마다 맞추고 잠근다. 줄당 기대 약 12회, 잠근 줄마다 비용 2배 */
      const lines = [0, 1, 2, 3].map(g => POT_LINES[g]);
      const gradeOf = (PP, i) => i < (PP.leg || 0) ? 3 : i < (PP.uniq || 0) ? 2 : n >= 2 ? 1 : 0;
      let potRolls = 0, potCost = 0;
      for (let i = 0; i < 6; i++) { const g1 = gradeOf(P, i), g0 = prev ? gradeOf(prev, i) : -1; if (g1 > g0 || n % 5 === 1) { for (let L = 0; L < lines[g1]; L++) { const m = Math.pow(2, L); potRolls += 12; potCost += 12 * m; } } }
      out.push({ n, qGold, qXp, qKills, gpk: Math.round(gpk * 10) / 10, itemsPk, e: P.e, T, q3: P.q3, uniq: P.uniq, leg: P.leg, enhGoldNeed: Math.round(enhGoldNeed),
        qualRerolls: Math.round(qualRerolls), qualGold: Math.round(qualRerolls * REROLL_GOLD), qualStones: Math.round(qualRerolls), potRolls, potStones: potCost, potGold: potCost * REROLL_GOLD,
        disStones: DIS_STONES.slice(), lv: P.L });
      prev = P;
    }
    return out;
  });
  /* 분당 처치: AI 사냥 (전사·궁수), 그 장 첫 사냥터 60초 */
  const farm = {};
  for (const n of Array.from({ length: 30 }, (_, i) => i + 1)) {
    let tot = 0, cnt = 0;
    for (const ch of ['theron', 'kallisto']) {
      const k = await p.evaluate(async ([n, ch]) => {
        const { s } = hardSpec(n, ch); for (const k in TUT) s.flags['tut_' + k] = 1; s.seenCh = {}; for (let i = 1; i <= 30; i++) s.seenCh[i] = 1;
        startGame(s, false); const A = acctSeen(); if (A) for (const k in TUT) A['tut_' + k] = 1;
        loadMap(CHAPTERS[n].a); G.devSpeed = 4;
        let kills = 0; const _k = killMon; killMon = function (e) { if (!e.minion) kills++; return _k(e); };
        const R = { theron: 110, kallisto: 300 }[ch];
        const tick = () => { const P = G.player; for (const k of ['left', 'right', 'z', 'x', 'c']) IN.down[k] = false; if (P.hp < P.mhp) P.hp = P.mhp; if (P.dead > 0) { P.dead = 0; P.hp = P.mhp; }
          let t = null, d = 1e9; for (const m of G.mons) if (m.st !== 'die' && Math.abs(m.x - P.x) < d) { d = Math.abs(m.x - P.x); t = m; }
          if (!t) return; P.face = Math.sign(t.x - P.x) || 1; if (d > R) IN.down[t.x < P.x ? 'left' : 'right'] = true; else { IN.down.z = true; if (P.cd.x <= 0) IN.down.x = true; else if (P.cd.c <= 0) IN.down.c = true; } };
        const _uw = updateWorld; updateWorld = function (rdt) { try { tick(); } catch (e) { } return _uw(rdt); };
        const t0 = G.t; await new Promise(res => { const iv = setInterval(() => { if (G.t - t0 >= 60) { clearInterval(iv); res(); } }, 200); });
        updateWorld = _uw; killMon = _k; G.devSpeed = 1;
        return kills;
      }, [n, ch]);
      tot += k; cnt++;
      await p.reload(); await p.waitForTimeout(1500); await p.evaluate(`(${injSrc})()`);
    }
    farm[n] = tot / cnt;
    console.log('farm', n, farm[n]);
  }
  for (const r of base) r.killsPerMin = farm[r.n];
  fs.writeFileSync(path.join(__dirname, 'econ_261125.json'), JSON.stringify(base, null, 1));
  console.log('done');
  await b.close();
})();

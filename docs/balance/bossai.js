/* 보스전 AI 시뮬레이션 (2026-11-25, 사용자: "AI 기준 모든 보스 권장 전투력 · 4직업 평균 DPS")
   실행: 저장소 루트에서 python3 -m http.server 8765 --bind 127.0.0.1 → node docs/balance/bossai.js [장 번호 ...]
   결과: docs/balance/bossai_<날짜>.json (장 × 직업마다 스펙·전투력·허수아비 DPS(지속/궁극기 포함)·보스전 DPS·초당 받은 피해·처치 시간)

   스펙 = '열심히 한 플레이어' (사용자 선택, 트로피 포함): 기준 스펙 SPEC9(n) 보다 한 단계 위 — 3장부터 전 부위 유니크, 8장부터 레전드 1부위(SPEC9 가 더 많으면 그쪽),
          강화 +2(최대 15), 5장부터 최상급 품질 3부위, 잠재 굴림 1.2배 이상, 특성은 그 레벨 포인트를 다 찍음,
          보스 트로피는 앞 보스 전부 초회·타임어택 + 5장 이상 아래 보스 노히트, 쁘띠는 1장 보스 것. 레벨 = SPEC9 의 그 장 도착 레벨.
   허수아비: 그 장 보스의 방어력. 지속 = 궁극기 없이 Z·X·C·A·S·D 를 재사용 대기마다 20초(게임 시간), 궁극기 포함 = 시작에 V 한 번 + 30초.
   보스전 AI: 진짜 보스방에서 60초(게임 시간). 매 틱 앞으로 0.6초 안에 터질 장판·전조·날아오는 탄·그림 판정을 피해 안전한 자리로 움직이고,
          피할 곳이 없으면 가드, 안전하면 보스를 향해 공격·스킬. 맞은 피해는 기록하고 체력은 다시 채워 끝까지 싸운다(죽지 않음). */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ARGS = process.argv.slice(2), TI = ARGS.indexOf('--tune'), OVER = TI >= 0 ? JSON.parse(fs.readFileSync(ARGS[TI + 1], 'utf8')) : null, OUTI = ARGS.indexOf('--out'), SI = ARGS.indexOf('--spec'), SPEC = SI >= 0 ? JSON.parse(fs.readFileSync(ARGS[SI + 1], 'utf8')) : null;
const CHS = ARGS.filter((a, i) => !(TI >= 0 && i === TI + 1) && !(OUTI >= 0 && i === OUTI + 1) && !(SI >= 0 && i === SI + 1)).map(Number).filter(Boolean);
const LIST = CHS.length ? CHS : Array.from({ length: 30 }, (_, i) => i + 1);
const CLASSES = ['theron', 'kallisto', 'lykos', 'mage'];
const SPEED = 4;

const INJECT = () => {
  window.hardSpec = function (n, ch) {
    const s = { char: ch, level: 1, traits: {}, equip: {}, slotE: {}, nextUid: 1, flags: { mobility: n >= 4, pet: true }, quests: {}, mats: {}, pets: {} };
    const base = SPEC9(n), P = Object.assign({}, base, {
      e: Math.min(ENH_MAX, base.e + 2),
      uniq: n >= 3 ? 6 : base.uniq,
      leg: Math.max(base.leg || 0, n >= 8 ? 1 : 0),
      q3: Math.max(base.q3 || 0, n >= 5 ? 3 : 0), q2: true,
      potK: Math.max(base.potK || 1, 1.2),
    });
    const rnd0 = Math.random; Math.random = seeded(n * 7919 + 17 + ch.length);
    s.level = P.L; s.tp = 0;
    /* 재화로 가능한 스펙(사용자 선택): 강화 = min(그 장까지 번 골드로 가능한 단계, 목표), 상급·최상급 부위 수, 부위마다 맞춘 잠재 줄 수(중간 굴림) */
    const AF = window.__spec && window.__spec[n];
    if (AF) { P.e = Math.min(P.e, AF.e); P.q3 = AF.q3 || 0; P.q2n = AF.q2; P.potK = 1; P.lines = AF.potLines; }
    SLOTS.forEach((k, i) => {
      s.slotE[k] = { e: P.e, T: P.T, gauge: 0 };
      const g = i < P.leg ? 3 : i < P.uniq ? 2 : n >= 2 ? 1 : 0;
      const it = makeItem(k, s.char, g, n, s); it.q = i < P.q3 ? 3 : AF ? (i < P.q3 + P.q2n ? 2 : 1) : P.q2 ? 2 : 1;
      it.pot = POT9.slice(0, AF ? Math.min(POT_LINES[g], P.lines[i] || 0) : POT_LINES[g]).map(([pk, v]) => ({ k: pk, v: Math.round(v * (1 + g * 0.25) * P.potK * 10) / 10 }));
      if (AF && window.__randPot !== false && typeof rollPot === 'function') {   // 장비는 등급만큼 무작위 잠재를 달고 나온다 — 리롤로 맞춘 줄만 좋은 옵션으로 바꾼다
        const rnd = rollPot(g, k); for (let j = it.pot.length; j < rnd.length; j++) it.pot.push(rnd[j]); }
      it.opts = it.opts || []; s.equip[k] = it;
    });
    Math.random = rnd0;
    let pts = P.L;   // 특성 포인트: 1레벨부터 1점
    for (const t of TRAITS[s.char]) for (const r of t.ranks) { const cur = s.traits[t.id] || 0; if (pts >= r.cost && cur < t.ranks.length) { pts -= r.cost; s.traits[t.id] = cur + 1; } else break; }
    s.tp = pts; s.potions = 0; s.scrolls = 0;
    /* 보스 트로피(영구 공격력%·치명타 피해): 앞 보스 전부 초회 토벌·타임어택, 노히트는 5장 이상 아래 보스만 (스펙이 앞선 뒤 다시 잡은 것으로) */
    s.troph = {}; for (let i = 1; i < n; i++) s.troph['b' + i] = { k: 3, best: 1, c: 1, t: 1, n: i <= n - 5 ? 1 : 0 };
    /* 쁘띠 도감(기대값, 사용자 선택): 1장 쁘띠는 확정, 앞 보스는 각 10번 잡았다고 보고 1-0.95^10 ≈ 40% → 앞 보스 수 × 0.4 마리 */
    s.pets = { b1: 1 }; s.pet = 'b1'; const np = Math.round(0.4 * Math.max(0, n - 2)); for (let i = 2; i < 2 + np; i++) s.pets['b' + i] = 1;
    return { s, P };
  };
  /* ---- AI ---- */
  const AI = window.AI = { on: false, mode: 'boss', dmg: 0, hits: 0, guards: 0, t: 0, last: 0 };
  const _hurt = hurtPlayer;
  hurtPlayer = function (raw, sx, o) {
    const p = G.player, before = p.hp, r = _hurt(raw, sx, o);
    if (AI.on) { const d = Math.max(0, before - p.hp); if (d > 0) { AI.dmg += d; AI.hits++; } if (p.hp < p.mhp) p.hp = p.mhp; if (p.dead > 0) { p.dead = 0; p.hp = p.mhp; } }
    return r;
  };
  const RANGE = { theron: 110, lykos: 95, kallisto: 330, mage: 300 };
  function danger(x, look) {
    const b = G.boss, p = G.player; let d = 0;
    for (const h of G.haz || []) {
      if (h.visual || h.dead || h.src !== b) continue;
      const tl = h.warn - h.t; if (tl > look) continue; if (h.t > h.warn + h.act) continue;
      if (h.ring) { if (h.t >= h.warn) { const r = (h.t - h.warn) * h.speed; if (Math.abs(Math.abs(x - h.x) - r) < 90) d += 3; } continue; }
      if (hazHitsAt(h, x, GROUND, p.h)) d += h.t >= h.warn ? 5 : 3;
    }
    for (const t of G.tg9 || []) {
      const left = (t.dur || 0) - (t.t || 0); if (left > look) continue;
      const w = (t.width || 120) / 2 + 16;
      if (t.kind === 'ground_zone' || t.kind === 'vertical_beam' || t.kind === 'zone') { if (Math.abs(x - t.x) < w) d += 3; }
      else if (t.kind === 'dash_line') { const a = Math.min(t.x, t.targetX), c = Math.max(t.x, t.targetX); if (x > a - 20 && x < c + 20 && (t.y || GROUND) > GROUND - 160) d += 2; }
      else if (t.kind === 'aim_ray' && t.angles) { for (const ang of t.angles) { const L = t.rayLength || 600, ex = t.x + Math.cos(ang) * L, ey = t.y + Math.sin(ang) * L, cy = GROUND - 40;
        const dx = ex - t.x, dy = ey - t.y, k = Math.max(0, Math.min(1, ((x - t.x) * dx + (cy - t.y) * dy) / (dx * dx + dy * dy || 1))); if (Math.hypot(t.x + dx * k - x, t.y + dy * k - cy) < 50) d += 2; } }
    }
    for (const q of G.projs || []) {
      if (q.from !== 'm' || q.dead || q.harmless) continue;
      for (const s of [0.1, 0.25, 0.4]) { const qx = q.x + q.vx * s, qy = q.y + (q.vy || 0) * s; if (Math.abs(qx - x) < 34 + (q.w || 20) / 2 && qy > GROUND - 90 && qy < GROUND + 10) { d += 3; break; } }
    }
    for (const v of G.vfx9 || []) { const M = v.mv; if (!M || M.hit) continue; const hb = typeof vfx9HitBox === 'function' ? vfx9HitBox(v) : null; if (!hb || hb.y1 < GROUND - 90) continue;
      for (const s of [0, 0.25, 0.5]) { const off = M.mode === 'fly' ? M.dir * Math.max(200, M.sp) * s : 0; if (x > hb.x0 + off - 20 && x < hb.x1 + off + 20) { d += 4; break; } } }
    if (b && b.st !== 'die' && Math.abs(x - b.x) < b.w * 0.45) d += 1;
    return d;
  }
  /* A·S·D·V 는 다른 동작 중이 아닐 때만 나간다(skillInput) — 준비된 스킬이 있으면 그 틱에는 Z·X·C 를 누르지 않고 스킬부터 */
  function attack(p, ult) {
    if (G.save.char === 'kallisto' && G.save.flags.mobility && !(p.focusCd > 0)) IN.press.shift = true;
    AI.skip = AI.skip || {};
    if (AI.tried && (p.cd[AI.tried] || 0) <= 0 && !p.act && !G.ult) AI.skip[AI.tried] = G.t + 3;   // 눌렀는데 안 나간 스킬(대상 없음 등)은 3초 건너뛴다
    AI.tried = null;
    if (!p.act && !(p.cast > 0)) {
      const ready = (ult ? ['kv'] : []).concat(['ka', 'ks', 'kd']).find(k => (p.cd[k] || 0) <= 0 && !(AI.skip[k] > G.t) && skillUnlocked(SK_KEYS[k], G.save.level));
      if (ready) { IN.press[ready] = true; AI.tried = ready; if (ready === 'kv') AI.ult = false; return; }
    }
    IN.down.z = true; if (p.cd.x <= 0) IN.down.x = true; else if (p.cd.c <= 0) IN.down.c = true;
  }
  function aiTick() {
    if (!AI.on) return;
    const p = G.player, b = G.boss; if (!p) return;
    for (const k of ['left', 'right', 'z', 'x', 'c']) IN.down[k] = false;
    const target = AI.mode === 'dummy' ? (DUMMY && DUMMY.e) : b;
    if (!target || target.st === 'die') return;
    const ch = G.save.char, R = RANGE[ch] || 120;
    if (AI.mode === 'boss') {
      const L = G.map.arenaL != null ? G.map.arenaL + 30 : 30, Rr = G.map.arenaR != null ? G.map.arenaR - 30 : G.map.w - 30;
      const here = danger(p.x, 0.6);
      let best = p.x, bs = 1e9;
      for (let x = L; x <= Rr; x += 20) {
        const want = target.x + (p.x < target.x ? -R : R);
        const sc = danger(x, 0.6) * 1000 + Math.abs(x - p.x) * 0.05 + Math.abs(x - want) * 1;   // 안전한 곳 중 공격 거리에 가장 가까운 곳
        if (sc < bs) { bs = sc; best = x; }
      }
      if (here > 0 && Math.abs(best - p.x) > 12) { IN.down[best < p.x ? 'left' : 'right'] = true; }
      else if (here > 0) { if (p.cd.g <= 0) { IN.press.guard = true; AI.guards++; } }
      else if (Math.abs(best - p.x) > 40) { IN.down[best < p.x ? 'left' : 'right'] = true; }
      if (here === 0) {
        p.face = Math.sign(target.x - p.x) || p.face;
        if (Math.abs(target.x - p.x) < R + 60) attack(p, true);
      }
    } else {
      p.face = Math.sign(target.x - p.x) || 1; if (Math.abs(target.x - 70 * p.face - p.x) > 90) p.x = target.x - 70 * p.face;
      attack(p, AI.ult);
    }
  }
  const _uw = updateWorld;
  updateWorld = function (rdt) { try { aiTick(); } catch (e) { } return _uw(rdt); };
};

(async () => {
  const b = await chromium.launch();
  const out = [], file = OUTI >= 0 ? ARGS[OUTI + 1] : path.join(__dirname, 'bossai_261125.json');
  const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  async function one(n, ch) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:8765/test/index.html'); await p.waitForTimeout(1800);
    await p.evaluate(INJECT); if (SPEC) await p.evaluate(sp => { window.__spec = sp; }, SPEC); if (OVER) await p.evaluate(o => { window.__over = o; TUNE.dirtyLocal = true; tuneLoad = async () => { }; tuneApply(o); }, OVER);
    const info = await p.evaluate(([n, ch]) => {
      const { s, P } = hardSpec(n, ch);
      for (const k in TUT) s.flags['tut_' + k] = 1; s.seenCh = {}; for (let i = 1; i <= 30; i++) s.seenCh[i] = 1;
      for (let i = 1; i < n; i++) s.flags['boss_b' + i] = 1;
      startGame(s, false); if (window.__over) tuneApply(window.__over); const A = acctSeen(); if (A) for (const k in TUT) A['tut_' + k] = 1;
      refreshStats(); const st = G.stats;
      /* 반지(10·20장, 5% × 10번 ≈ 40%): 낀 경우와 안 낀 경우의 공격·전투력·체력 비율을 기록 → 결과에 40% 만큼 섞는다 */
      const rc = [10, 20].filter(c => c < n).pop(); let ring = null;
      if (rc && typeof makeRing === 'function') { const off = x => x.atk * (1 + Math.min(100, x.crit) / 100 * (CRIT_MULT - 1 + (x.critDmg || 0) / 100)) * (1 + (x.bossDmg || 0) / 100) * (1 + (x.pen || 0) / 300) * (1 + (x.aspd || 0) / 100);
        const s2 = JSON.parse(JSON.stringify(s)); s2.equip.acc1 = makeRing(rc, s2); s2.slotE.acc1 = { e: Math.min(15, (s.slotE.weapon || {}).e || 0), T: 0, gauge: 0 };
        const a = calcStats(s), b2 = calcStats(s2); ring = { ch: rc, off: off(b2) / off(a), cp: b2.cp / a.cp, hp: b2.hp / a.hp }; }
      if (window.__over) { tuneApply(window.__over); refreshStats(); }
      const st2 = G.stats;
      return { ring, pets: Object.keys(s.pets).length, lv: s.level, e: P.e, uniq: P.uniq, leg: P.leg, q3: P.q3, cp: Math.round(st2.cp), atk: Math.round(st2.atk), hp: Math.round(st2.hp), def: Math.round(st2.def), crit: st2.crit, critDmg: st2.critDmg };
    }, [n, ch]);
    // 1) 허수아비 (보스 방어력)
    const dummy = async (secs, ult) => {
      await p.evaluate(([n, ult]) => {
        const id = Object.keys(MAPS).find(k => MAPS[k].ch === Math.min(n, 30) && !MAPS[k].safe && !MAPS[k].boss && !MAPS[k].gate && !MAPS[k].sewer); loadMap(id);
        G.devNoSpawn = true; for (const m of G.mons) { m.st = 'die'; m.dead = 0; m.minion = true; }
        const p = G.player; p.cd = {}; dummySpawn(BOSSES['b' + n].def); p.x = DUMMY.e.x - 70; p.face = 1; G.devSpeed = 1;
        AI.mode = 'dummy'; AI.ult = ult; AI.on = true;
      }, [n, ult]);
      await p.waitForTimeout(300); await p.evaluate(s => { G.devSpeed = s; DUMMY.tot = 0; DUMMY.t0 = DUMMY.t1 = G.t; }, SPEED);
      const t0 = await p.evaluate(() => G.t);
      while ((await p.evaluate(() => G.t)) - t0 < secs) await p.waitForTimeout(400);
      const m = await p.evaluate(() => { AI.on = false; return { tot: DUMMY.tot, sec: Math.max(1, (DUMMY.t1 || G.t) - (DUMMY.t0 || G.t)) }; });
      return Math.round(m.tot / m.sec);
    };
    const dpsSus = await dummy(20, false);
    const dpsUlt = await dummy(30, true);
    // 2) 진짜 보스전
    await p.evaluate(n => {
      G.devNoSpawn = false; G.devSpeed = 1; if (typeof dummyClear === 'function') dummyClear();
      loadMap(Object.keys(MAPS).find(k => MAPS[k].boss === 'b' + n), 200);
      const p = G.player; p.cd = {}; p.hp = p.mhp;
    }, n);
    for (let i = 0; i < 80; i++) { if (await p.evaluate(() => G.boss && G.boss.st !== 'wait' && !G.cine && !G.ui.dialog)) break; await p.waitForTimeout(200); await p.evaluate(() => { if (G.ui.dialog && typeof dialogNext === 'function') dialogNext(); }); }
    const bstart = await p.evaluate(s => { AI.mode = 'boss'; AI.dmg = 0; AI.hits = 0; AI.guards = 0; AI.on = true; G.devSpeed = s; const b = G.boss; return { mhp: b.mhp, hp: b.hp, t: G.t }; }, SPEED);
    let res = null;
    for (;;) {
      await p.waitForTimeout(500);
      res = await p.evaluate(() => ({ t: G.t, hp: G.boss ? G.boss.hp : 0, st: G.boss ? G.boss.st : 'die', dead: !G.boss || G.boss.st === 'die' }));
      if (res.dead || res.t - bstart.t >= 60) break;
    }
    const fight = await p.evaluate(() => { AI.on = false; return { dmg: AI.dmg, hits: AI.hits, guards: AI.guards }; });
    const secs = Math.max(1, res.t - bstart.t), dealt = bstart.hp - Math.max(0, res.hp);
    const bossDps = Math.round(dealt / secs), dtps = Math.round(fight.dmg / secs);
    const row = Object.assign({ n, ch }, info, { dpsSus, dpsUlt, bossHp: bstart.mhp, bossDps, dtps, hits: fight.hits, guards: fight.guards, killed: !!res.dead, fightSec: Math.round(secs * 10) / 10,
      killSec: Math.round(bstart.mhp / Math.max(1, bossDps)), errs: errs.slice(0, 2) });
    console.log(JSON.stringify(row));
    await p.close();
    return row;
  }
  for (const n of LIST) {
    const rows = await Promise.all(CLASSES.map(ch => one(n, ch).catch(e => ({ n, ch, err: String(e.message).slice(0, 200) }))));
    out.push(...rows);
    const merged = prev.filter(r => !out.some(o => o.n === r.n && o.ch === r.ch)).concat(out).sort((a, b) => a.n - b.n || CLASSES.indexOf(a.ch) - CLASSES.indexOf(b.ch));
    fs.writeFileSync(file, JSON.stringify(merged, null, 1));
  }
  await b.close();
})();

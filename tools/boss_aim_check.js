/* 보스 스킬 '전조 자리 = 실제 공격 자리' 검사 (2026-11-26, 사용자: "전조는 점프한 공중에 떴는데 스킬은 바닥에 내려온 나한테 날아온다")
   실행: 저장소 루트에서 python3 -m http.server 8765 --bind 127.0.0.1 → node tools/boss_aim_check.js [b11 b12 ...]
   방법: 같은 난수로 같은 스킬을 세 번 쓴다. 전조가 뜰 때 캐릭터는 보스 옆 공중(A)에 고정.
         전조 60% 지점부터 A: 그대로 공중 · B: 같은 x 바닥 · C: 멀리 떨어진 바닥 으로 옮겨 고정.
         새로 생긴 공격(탄·장판·기둥·그림·몹)의 처음 상태가 A 와 B/C 에서 다르면 = 전조 뒤에 캐릭터 위치를 다시 읽은 것.
         (그때 새 전조도 같이 생겼으면 '새 전조와 같이' 로 따로 표시 — 그건 전조가 따라온 것이라 괜찮다) */
const { chromium } = require('playwright');
const ONLY = process.argv.slice(2);

const PAGE = () => {
  const SKIP = new Set(['parts', 'nums', 'fx', 'pfx', 'gfx', 'rfx', 'blood', 'mfx', 'drops', 'timers', 'allies', 'lights', 'nums2', 'trail', 'ghosts', 'afterimg']);
  const F = ['x', 'y', 'vx', 'vy', 'x0', 'y0', 'x1', 'y1', 'w', 'h', 'r', 'width', 'height', 'targetX', 'ang', 'tx', 'ty', 'rayLength', 'warn'];
  const snap = o => { const d = {}; for (const k of F) if (typeof o[k] === 'number' && isFinite(o[k])) d[k] = Math.round(o[k]); if (Array.isArray(o.angles)) d.angles = o.angles.map(a => Math.round(a * 100) / 100).join(','); if (o.conv) d.conv = Math.round(o.conv.x) + ',' + Math.round(o.conv.y); return d; };
  window.__enter = function (bid) {
    const id = Object.keys(MAPS).find(k => MAPS[k].boss === bid); loadMap(id, 200);
    for (let i = 0; i < 3000; i++) {
      const b = G.boss; if (b && b.st !== 'wait' && !G.cine && !G.ui.dialog && !G.ui.cut) break;
      if (G.ui.dialog && typeof dialogNext === 'function') dialogNext();
      if (G.cine && G.cine.kind === 'intro' && typeof introEnd === 'function' && i > 30) introEnd(G.cine);
      G.ui.tut = null; step();
    }
    return !!G.boss;
  };
  window.__run = function (bid, idx, mode) {
    if (!__enter(bid)) return { err: 'no boss' };
    const b = G.boss, p = G.player, L = G.map.arenaL, R = G.map.arenaR, old = typeof idx === 'string', s = old ? { name: idx, tel: 0 } : sk9(b)[idx];
    b.x = (L + R) / 2 - 150; b.face = 1;
    if (s.berserk || s.ph2) b.berserk9 = true;
    const side = 1, A = { x: b.x + side * 260, y: GROUND - 170 }, B = { x: A.x, y: GROUND }, C = { x: Math.min(R - 60, b.x + side * 560), y: GROUND };
    let pin = A; const tgt = { A, B, C }[mode];
    const pinIt = () => { p.x = pin.x; p.y = pin.y; p.vx = 0; p.vy = 0; p.inv = 99; p.hp = p.mhp; p.dead = 0; p.onGround = pin.y >= GROUND; };
    pinIt(); for (const q of G.projs || []) q.dead = true;
    const seen = new WeakSet(); for (const k of Object.keys(G)) if (Array.isArray(G[k])) for (const o of G[k]) if (o && typeof o === 'object') seen.add(o);
    Math.random = seeded(4242 + (old ? idx.length : idx));
    b.t2f = 1e9; let S;
    if (old) { b.st = 'idle'; b.tele = null; bossStartPat(b, idx); S = { k: 'tele', t: 0, tel: (b.tele && b.tele.dur) || 0.5, old: 1 }; }
    else { start9(b, idx); S = b.s9; }
    b.cd = 99;
    const rec = [], later = [];
    let moved = false;
    for (let st = 0; st < 360; st++) {
      if (!moved && S.k === 'tele' && S.t >= S.tel * 0.6) { pin = tgt; moved = true; }
      b.t2f = 1e9; pinIt(); step(); pinIt();
      if (S.old) { S.t += STEP; if (S.k === 'tele' && S.t >= S.tel) S.k = 'cast'; if (b.st === 'idle' && st > 10) { S.k = 'after'; } }
      const ph = S.old ? S.k : b.s9 === S ? S.k : 'after';
      const newTg = [];
      for (const k of Object.keys(G)) {
        if (SKIP.has(k) || !Array.isArray(G[k])) continue;
        for (const o of G[k]) {
          if (!o || typeof o !== 'object' || seen.has(o)) continue; seen.add(o);
          const r = { a: k, st, ph, moved, d: snap(o) }; rec.push(r); if (k === 'tg9' || k === 'aims' || k === 'marks') newTg.push(r);
          if (k === 'projs' || k === 'vfx9') later.push([o, r]);
        }
      }
      for (const [o, r] of later) if (st - r.st === 24) r.d30 = snap(o);   // 0.4초 뒤 (휘어 들어오는 탄)
      if ((S.old ? ph === 'after' : b.s9 !== S) && ph === 'after' && st > 30) { b.cd = 99; if (st > (S._end = S._end || st) + 60) break; }
      b.cd = Math.max(b.cd, 5);
    }
    return { name: s.name, tel: S.tel, rec };
  };
};

(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 960, height: 540 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('http://127.0.0.1:8765/test/index.html'); await pg.waitForTimeout(1500);
  await pg.evaluate(PAGE);
  const ids = await pg.evaluate(() => {
    const s = newSave('theron'); s.level = 60; for (const k in TUT) s.flags['tut_' + k] = 1; s.seenCh = {}; for (let i = 1; i <= 30; i++) s.seenCh[i] = 1;
    for (let i = 1; i <= 30; i++) s.flags['boss_b' + i] = 1;
    startGame(s, false); G.ui.intro = null; const Ac = acctSeen(); if (Ac) for (const k in TUT) Ac['tut_' + k] = 1;
    G.devSpeed = 0;
    const L = Object.keys(S9).sort((a, b) => +a.slice(1) - +b.slice(1)).map(id => [id, S9[id].skills.length]);
    for (let i = 1; i <= 10; i++) { const id = 'b' + i; if (S9[id]) continue; const d = BOSSES[id]; L.unshift([id, [...new Set([...(d.pats || []), ...(d.sig || []), ...(d.sig3 || [])])]]); }
    return L.sort((a, b) => +a[0].slice(1) - +b[0].slice(1));
  });
  const out = [];
  for (const [id, n] of ids) {
    if (ONLY.length && !ONLY.includes(id)) continue;
    const list = Array.isArray(n) ? n : Array.from({ length: n }, (_, i) => i);
    for (const i of list) {
      const R = {};
      if (i === list[0]) { await pg.evaluate(id => __enter(id), id); for (let w = 0; w < 40; w++) { if (await pg.evaluate(id => !IMG9[id] || IMG9[id].every(im => im.complete), id)) break; await pg.waitForTimeout(150); } }   // 스킬 그림이 다 읽힌 뒤에 (그림 크기로 판정을 맞추는 스킬이 있다)
      for (const m of ['A', 'B', 'C']) R[m] = await pg.evaluate(([id, i, m]) => { try { return __run(id, i, m); } catch (e) { return { err: String(e) }; } }, [id, i, m]);
      if (R.A.err) { out.push({ id, i, err: R.A.err }); continue; }
      const diffs = [];
      for (const m of ['B', 'C']) {
        const a = R.A.rec, b = R[m].rec, N = Math.max(a.length, b.length);
        for (let k = 0; k < N; k++) {
          const x = a[k], y = b[k];
          if (!x || !y) { diffs.push({ m, k, why: 'count', a: x && x.a, b: y && y.a, ph: (x || y).ph, st: (x || y).st }); break; }
          if (!x.moved) continue;
          const dj = JSON.stringify(x.d), ej = JSON.stringify(y.d), d3 = JSON.stringify(x.d30 || null), e3 = JSON.stringify(y.d30 || null);
          if (x.a !== y.a || dj !== ej || d3 !== e3) {
            const tgWith = b.some(z => z.st === y.st && (z.a === 'tg9' || z.a === 'aims' || z.a === 'marks')) || (y.d.warn >= 0.3);
            diffs.push({ m, k, arr: x.a + '/' + y.a, ph: x.ph, st: x.st, A: x.d, X: y.d, A30: x.d30, X30: y.d30, tgWith });
            break;
          }
        }
      }
      const r = { id, i, name: R.A.name, diffs };
      out.push(r);
      console.log(id, i, R.A.name, diffs.length ? 'DIFF ' + diffs.map(d => `${d.m}:${d.arr || d.why}@${d.ph}${d.tgWith ? '(새 전조와 같이)' : ''} ${JSON.stringify(d.A)} → ${JSON.stringify(d.X)}${d.A30 ? ' 0.4s ' + JSON.stringify(d.A30) + ' → ' + JSON.stringify(d.X30) : ''}`).join(' | ') : 'ok');
    }
  }
  require('fs').writeFileSync(process.env.OUT || '/tmp/boss_aim.json', JSON.stringify(out, null, 1));
  console.log('pageerrors', errs.length, errs.slice(0, 5));
  await br.close();
})();

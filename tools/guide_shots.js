/* 가이드 그림 찍기 — 가이드(TUT)마다 실제 게임 장면을 만들어 찍는다.
   실행: 저장소 루트에서 `python3 -m http.server 8765 --bind 127.0.0.1` 을 띄운 뒤
         node tools/guide_shots.js [가이드id ...]        (id 를 안 주면 전부)
   결과: assets/ui/guide/<id>.png (그다음 tools/guide_webp.py 가 webp 로 줄인다)
   새 가이드를 만들면 TUT 에 넣고 아래 SHOTS 에 장면 하나를 더한다 (CLAUDE.md 규칙). */
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'ui', 'guide');
const URL = 'http://127.0.0.1:8765/test/index.html';

/* 장면: setup(맵 들어가기 등, page 안에서) → 2.6초 기다림(맵 이름 띠·첫 대사가 사라지게) → act(그 순간의 동작) → wait(ms) → crop: 'full' | 'player' | 'panel' | {x,y,w,h}(게임 좌표 960×540) */
const SHOTS = {
  move: { settle: 6000, setup: () => { loadMap('ruins'); G.player.x = 700; }, act: () => { const p = G.player; p.y = GROUND - 140; p.vy = -260; p.onGround = false; p.face = 1; }, wait: 120, crop: 'player' },
  atk: { setup: () => { loadMap('ruins'); }, act: () => { const p = G.player, m = G.mons.find(x => x.st !== 'die'); if (m) { p.x = m.x - 70; p.face = 1; } window.__hold = 'KeyZ'; }, wait: 700, crop: 'player' },
  dodge: { setup: () => { G.devGod = true; const id = Object.keys(MAPS).find(k => MAPS[k].boss === 'b1'); loadMap(id); }, waitFor: () => (G.haz && G.haz.length) || (G.tg9 && G.tg9.length) || (G.boss && G.boss.tele), wait: 200, crop: 'full' },
  interact: { setup: () => { for (const q of QUEST_ORDER) { if (q === 'c2m4') break; G.save.quests[q].s = 3; } G.save.quests.c2m4.s = 1; G.save.flags.boss_b1 = 1; loadMap(QUESTS.c2m4.mapId || 'c2_b'); }, act: () => { const g = gatherSpotsHere().find(x => !x.done); if (g) { G.player.x = g.x - 6; G.player.y = GROUND; G.player.face = 1; } }, wait: 500, crop: 'player' },
  trait: { settle: 7000, setup: () => { loadMap('camp'); }, act: () => { G.save.tp = 12; document.querySelectorAll('.toast,#toast > *').forEach(e => e.remove()); openPanel('traits'); }, wait: 500, crop: 'full' },
  guard: { setup: () => { loadMap('ruins'); }, act: () => { const p = G.player, m = G.mons.find(x => x.st !== 'die'); if (m) { p.x = m.x - 60; p.face = 1; } p.guard = 0.25; hurtPlayer(20, p.x + 40, { src: m }); }, wait: 90, crop: 'player' },
  rope: { settle: 7000, setup: () => { const id = Object.keys(MAPS).find(k => (MAPS[k].gims || []).some(g => g.t === 'rope')); loadMap(id); G.save.seenCh = G.save.seenCh || {}; G.ui.intro = null; }, act: () => { const r = G.gims.find(g => g.t === 'rope'); const p = G.player; p.x = r.x; p.y = Math.min(GROUND - 60, (r.y0 + r.y1) / 2 + 60); p.rope = r; p.vx = p.vy = 0; p.onGround = false; }, wait: 300, crop: 'player' },
  shift: { setup: () => { G.save.flags.mobility = true; loadMap('ruins'); }, act: () => { const p = G.player; p.x = 600; p.face = 1; window.__hold = 'ShiftLeft'; window.__hold2 = 'ArrowRight'; }, wait: 260, crop: 'player' },
  pet: { setup: () => { G.save.flags.pet = true; G.save.pets = { b1: 1, b2: 1 }; G.save.pet = 'b1'; G.pet = null; loadMap('ruins'); G.player.x = 700; G.player.face = 1; }, wait: 1500, crop: 'player' },
  travel: { setup: () => { for (let n = 1; n <= 3; n++) G.save.flags['boss_b' + n] = 1; loadMap('camp'); toggleWorldMap(true); }, wait: 800, crop: 'full' },
  ult: { setup: () => { loadMap('ruins'); }, act: () => { const p = G.player, m = G.mons.find(x => x.st !== 'die'); if (m) { p.x = m.x - 120; p.face = 1; } p.cd.kv = 0; window.__press = 'KeyV'; }, wait: 450, crop: 'full' },
  wm: { setup: () => { loadMap('camp'); toggleWorldMap(true); }, wait: 800, crop: 'full' },
  pot: { setup: () => { loadMap('ruins'); }, act: () => { const p = G.player; p.x = 700; p.hp = Math.round(p.mhp * 0.4); p.cd.pot = 0; window.__press = 'Digit1'; }, wait: 350, crop: { x: 400, y: 225, w: 560, h: 315 } },
  boss: { setup: () => { G.devGod = true; const id = Object.keys(MAPS).find(k => MAPS[k].boss === 'b2'); loadMap(id); }, waitFor: () => G.boss && G.boss.st !== 'wait' && ((G.haz && G.haz.length) || G.boss.tele), wait: 250, crop: 'full' },
  /* 2026-11-25 묶음 10: 처음 하는 사람을 위한 가이드 16개 */
  gate: { setup: () => { G.save.flags.boss_b1 = 1; loadMap('c2_g1'); }, act: () => { G.player.x = G.map.w - 110; G.player.face = 1; }, wait: 600, crop: 'player' },
  bossexit: { settle: 3000, setup: () => { G.devGod = true; loadMap('tower', 300); }, act: () => { const b = G.boss; if (b) { b.hp = 0; bossDie(); } }, waitFor: () => !G.death && document.querySelector('#bRetry.on'), wait: 400, crop: { x: 400, y: 0, w: 560, h: 315 } },
  berserk: { settle: 3500, setup: () => { G.devGod = true; G.save.flags.boss_b21 = 1; loadMap(Object.keys(MAPS).find(k => MAPS[k].boss === 'b21'), 300); }, act: () => { const b = G.boss; b.hp = Math.round(b.mhp * 0.51); hitEntity(b, Math.round(b.mhp * 0.05), false, {}); }, wait: 700, crop: 'full' },
  power: { settle: 3500, setup: () => { G.devGod = true; G.save.flags.boss_b15 = 1; loadMap(Object.keys(MAPS).find(k => MAPS[k].boss === 'b15'), 300); }, waitFor: () => G.boss && G.boss.st !== 'wait' && document.querySelector('#bossbar.on'), wait: 300, crop: { x: 200, y: 0, w: 560, h: 315 } },
  eclipse: { settle: 3500, setup: () => { G.devGod = true; G.save.flags.boss_b29 = 1; loadMap(Object.keys(MAPS).find(k => MAPS[k].boss === 'b29'), 300); }, act: () => { G.moon = { t: MOON_FULL - 0.2, warn: 0 }; G.moonDarkS = 0.9; }, waitFor: () => G.moon && G.moon.warn > 0, wait: 150, crop: 'full' },
  blackhole: { settle: 3500, setup: () => { G.devGod = true; G.save.flags.boss_b25 = 1; loadMap(Object.keys(MAPS).find(k => MAPS[k].boss === 'b25'), 300); }, act: () => { const b = G.boss; b.cd = 99; b.s9 = null; start9(b, 6); }, waitFor: () => G.zeroG && G.zeroG.bh && G.zeroG.bh.cap, wait: 300, crop: 'full' },
  defend: { setup: () => { loadMap('c3_a'); G.player.x = 900; }, act: () => { fb5DefendHere(); }, wait: 5500, crop: 'full' },
  gear: { settle: 2000, setup: () => { loadMap('camp'); for (let g = 0; g < 4; g++) G.save.items.push(makeItem(SLOTS[g % SLOTS.length], G.save.char, g, 10)); openPanel('gear'); }, wait: 600, crop: 'full' },
  smith: { settle: 2000, setup: () => { loadMap('camp'); G.save.mats.qual = 20; G.save.mats.pot = 20; G.save.mats.inherit = 5; openPanel('smith'); }, wait: 600, crop: 'full' },
  dismantle: { settle: 2000, setup: () => { loadMap('camp'); for (let g = 0; g < 8; g++) G.save.items.push(makeItem('weapon', G.save.char, g % 4, 10)); G.ui.smithTab = 'dis'; openPanel('smith'); G.ui.smithTab = 'dis'; uiRefresh(); }, wait: 600, crop: 'full' },
  traitrank: { settle: 2000, setup: () => { loadMap('camp'); const L = TRAITS[G.save.char] || []; if (L[1]) G.save.traits[L[1].id] = 5; G.save.tp = 20; refreshStats(); openPanel('traits'); }, wait: 600, crop: 'full' },
  daily: { settle: 2000, setup: () => { loadMap('camp'); toggleQuestWin('daily'); }, wait: 1800, crop: 'full' },
  box: { setup: () => { loadMap('ruins'); G.player.x = 700; }, act: () => { const b = spawnBox(G.map); if (b) { b.x = G.player.x + 140; } if (typeof spawnShrine === 'function') { spawnShrine(G.map); const q = G.shrines[G.shrines.length - 1]; if (q) q.x = G.player.x - 160; } }, wait: 900, crop: 'player' },
  merchant: { setup: () => { G.devMerT = 900; G.devMerMap = 'ruins'; merSetHour(merHour()); loadMap('ruins'); }, act: () => { const n = typeof merNpc === 'function' ? merNpc() : null; if (n) { G.player.x = n.x - 70; G.player.face = 1; } }, wait: 600, crop: 'player' },
  storage: { settle: 2000, setup: () => { loadMap('camp'); for (let g = 0; g < 4; g++) G.save.items.push(makeItem('weapon', G.save.char, g, 10)); openPanel('storage'); }, wait: 600, crop: 'full' },
  party: { settle: 2000, setup: () => { loadMap('camp'); togglePanel('party'); }, wait: 1800, crop: 'full' },
};

(async () => {
  const want = process.argv.slice(2), b = await chromium.launch();
  for (const id of Object.keys(SHOTS)) {
    if (want.length && !want.includes(id)) continue;
    const S = SHOTS[id], p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL); await p.waitForTimeout(2200);
    await p.evaluate(() => { const s = newSave('theron'); s.level = 40; s.tp = 0; for (const k in TUT) s.flags['tut_' + k] = 1; const A = acctSeen(); if (A) for (const k in TUT) A['tut_' + k] = 1; startGame(s, false); G.devGod = true; });
    await p.waitForTimeout(800);
    await p.evaluate(`(${S.setup.toString()})()`);
    await p.waitForTimeout(S.settle || 2600);
    if (S.act) await p.evaluate(`(${S.act.toString()})()`);
    if (S.waitFor) { const fn = S.waitFor.toString(); for (let i = 0; i < 60; i++) { if (await p.evaluate(`!!((${fn})())`)) break; await p.waitForTimeout(250); } }
    const hold = await p.evaluate(() => [window.__hold, window.__hold2, window.__press]);
    if (hold[0]) await p.keyboard.down(hold[0]); if (hold[1]) await p.keyboard.down(hold[1]); if (hold[2]) await p.keyboard.press(hold[2]);
    await p.waitForTimeout(S.wait || 300);
    await p.evaluate(() => document.querySelectorAll('.toast,#toast > *,#toasts > *').forEach(e => e.remove()));   // 알림('새 일일 의뢰' 등)이 그림을 가리지 않게
    const g = await p.evaluate(() => { const r = document.querySelector('#game canvas, canvas').getBoundingClientRect(); const P = G.player; return { x: r.left, y: r.top, w: r.width, h: r.height, px: P.x - G.cam.x, py: P.y }; });
    const k = g.w / 960; let c;
    if (S.crop === 'full') c = { x: 0, y: 0, w: 960, h: 540 };
    else if (S.crop === 'player') { const w = 560, h = 315; c = { x: Math.max(0, Math.min(960 - w, g.px - w / 2)), y: Math.max(0, Math.min(540 - h, g.py - 230)), w, h }; }
    else c = S.crop;
    await p.screenshot({ path: path.join(OUT, id + '.png'), clip: { x: g.x + c.x * k, y: g.y + c.y * k, width: c.w * k, height: c.h * k } });
    for (const key of hold.slice(0, 2)) if (key) await p.keyboard.up(key);
    console.log(id, 'ok', errs.length ? 'errors: ' + errs.slice(0, 2).join(' | ') : '');
    await p.close();
  }
  await b.close();
})();

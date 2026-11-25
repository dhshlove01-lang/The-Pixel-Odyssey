/* bossai_<날짜>.json → 게임에 넣을 표(BOSSAI)로 줄인다. off(공격 기대값)는 같은 스펙을 게임에서 다시 만들어 계산한다.
   실행: node docs/balance/bossai_embed.js  (http.server 8765 필요) → docs/balance/bossai_table.json */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'bossai.js'), 'utf8');
const injSrc = src.slice(src.indexOf('const INJECT = () => {') + 'const INJECT = '.length, src.indexOf('\n};\n', src.indexOf('const INJECT')) + 2);
const IN = process.argv[2] || path.join(__dirname, 'bossai_261125.json'), PRE = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {};   // 입력 결과 · 그 결과를 잴 때 쓴 관리자 값
const rows = JSON.parse(fs.readFileSync(IN, 'utf8'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/test/index.html'); await p.waitForTimeout(1800);
  await p.evaluate(`(${injSrc})()`);
  const offs = await p.evaluate(rows => {
    const out = {};
    for (const r of rows) { if (r.err) continue; const { s } = hardSpec(r.n, r.ch); const st = calcStats(s);
      out[r.n + ':' + r.ch] = Math.round(st.atk * (1 + Math.min(100, st.crit) / 100 * (CRIT_MULT - 1 + (st.critDmg || 0) / 100)) * (1 + (st.bossDmg || 0) / 100) * (1 + (st.pen || 0) / 300) * (1 + (st.aspd || 0) / 100)); }
    out._old = {};   // 지금(바꾸기 전) 권장 전투력: 기준 스펙 SPEC9 의 전투력 × 2/3, 4직업 평균
    for (let n = 1; n <= 30; n++) { let t = 0; for (const c of ['theron', 'kallisto', 'lykos', 'mage']) t += calcStats(specSave(n, c)).cp * (2 / 3); out._old[n] = Math.round(t / 4); }
    return out;
  }, rows);
  const T = {};
  for (const r of rows) { if (r.err) continue; (T[r.n] = T[r.n] || {})[r.ch] = { cp: r.cp, hp: r.hp, off: Math.round(offs[r.n + ':' + r.ch] * (PRE['st:' + r.ch + ':atk'] || 1)), sus: r.dpsSus, ult: r.dpsUlt, bdps: r.bossDps, dtps: r.dtps, bhp: r.bossHp, hm: PRE['b:b' + r.n + ':hp'] || 1, am: PRE['st:' + r.ch + ':atk'] || 1 }; }
  fs.writeFileSync(path.join(__dirname, 'bossai_table.json'), JSON.stringify(T));
  fs.writeFileSync(path.join(__dirname, 'bossai_oldrec.json'), JSON.stringify(offs._old));
  console.log('chapters', Object.keys(T).length);
  await b.close();
})();

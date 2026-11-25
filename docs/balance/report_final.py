"""보스·직업·재화 밸런스 보고서 HTML (→ pdf.js 로 PDF)
입력: balance_261125.json · bossai_verify_261125.json · econ_plan.json · econ_261125.json · bossai_names.json · balance_preset.json
실행: python3 docs/balance/report_final.py → docs/balance/밸런스_보고서_261125.html"""
import json, os, math, statistics as st, html
D = os.path.dirname(os.path.abspath(__file__))
L = lambda f: json.load(open(os.path.join(D, f), encoding='utf-8'))
B = L('balance_261125.json'); V = [r for r in (json.load(open(os.environ['VERIFY'])) if os.environ.get('VERIFY') else L('bossai_verify_261125.json')) if not r.get('err')]
EP = L('econ_plan.json'); E0 = {r['n']: r for r in L('econ_261125.json')}; NAMES = L('bossai_names.json'); PRE = L('balance_preset.json')
RP = L('randpot_k.json')
CH = ['theron', 'kallisto', 'lykos', 'mage']; KO = {'theron': '전사', 'kallisto': '궁수', 'lykos': '도적', 'mage': '마법사'}
HD, HT = 0.7, 2.0
tgt = lambda n: 180 if n % 10 == 0 else 120 if n % 5 == 0 else 90
nf = lambda v: '-' if v is None else f'{round(v):,}'
esc = html.escape
VB = {}
for r in V: VB.setdefault(r['n'], {})[r['ch']] = r
def mixv(r, key):
    k = (r.get('ring') or {}).get('off', 1)
    return r[key] * (1 + 0.4 * (k - 1)) if key in ('dpsSus', 'dpsUlt', 'bossDps') else r[key]
def stuck(r): return not r.get('bossDps') or r['bossDps'] < 0.15 * max(1, r.get('dpsSus') or 0)
def need(r, n, hd, ht):
    bd = mixv(r, 'bossDps')
    if not bd: return None
    tk = r['bossHp'] / (bd * hd); heal = 0.35 / 8   # 치유 연고: 최대 체력 35% / 8초
    def ok(k):
        net = (r.get('dtps') or 0) * ht / k / r['hp'] - heal
        return net <= 0 or 1 / net >= tk / k
    lo, hi = 0.2, 20.0
    if ok(lo): hi = lo
    elif not ok(hi): lo = hi
    else:
        for _ in range(30):
            m = (lo + hi) / 2
            if ok(m): hi = m
            else: lo = m
    return r['cp'] * max(hi, tk / tgt(n), 0.2)
avg = lambda xs: (sum(x for x in xs if x) / max(1, len([x for x in xs if x]))) if any(xs) else 0
chB = {c['n']: c for c in B['chapters']}

# ---- 1) 직업 표 ----
ratio_after = {c: [] for c in CH}
for n, d in VB.items():
    if len(d) < 4: continue
    m = (mixv(d['theron'], 'dpsSus') + mixv(d['lykos'], 'dpsSus')) / 2
    for c in CH: ratio_after[c].append(mixv(d[c], 'dpsSus') / m)
cls_rows = ''.join(f"<tr><td class=l>{KO[c]}</td><td>{B['classMedianRatio'][c]:.2f}</td><td>{B['classTarget'][c]:.2f}</td><td><b>×{B['classMult'][c]:.2f}</b></td><td>{st.median(ratio_after[c]):.2f}</td></tr>" for c in CH)

# ---- 2) 보스 표 ----
boss_rows, summary_t = [], []
for n in range(1, 31):
    c = chB.get(n); d = VB.get(n, {})
    if not c: continue
    ok = [x for x in CH if x in d and not stuck(d[x])]
    times = {x: d[x]['bossHp'] / max(1, mixv(d[x], 'bossDps')) for x in CH if x in d}
    tv = st.mean(times[x] for x in ok) if ok else None
    summary_t.append((n, tgt(n), tv))
    rec = avg([need(d[x], n, HD, HT) for x in ok]); ai = avg([need(d[x], n, 1, 1) for x in ok])
    sus = avg([mixv(d[x], 'dpsSus') for x in CH if x in d]); ult = avg([mixv(d[x], 'dpsUlt') for x in CH if x in d]); bd = avg([mixv(d[x], 'bossDps') for x in ok])
    cp = avg([d[x]['cp'] for x in CH if x in d])
    tcls = ''.join(f"<td{' class=dim' if x not in ok else ''}>{round(times[x]) if x in times else '-'}</td>" for x in CH)
    off = '' if tv is None else ('ok' if abs(tv - tgt(n)) <= 0.2 * tgt(n) else 'bad')
    boss_rows.append(f"<tr><td class=c>{n}</td><td class=l>{esc(NAMES.get(str(n), ''))}</td><td>{tgt(n)}</td><td>{round(c['tNow'])}</td><td>×{c['hpMult']}</td><td>{nf(d['theron']['bossHp'] if 'theron' in d else c['newHp'])}</td>"
                     f"<td class='{off}'><b>{round(tv) if tv else '-'}</b></td>{tcls}<td>{nf(sus)}</td><td>{nf(ult)}</td><td>{nf(bd)}</td><td>{nf(cp)}</td><td>{nf(ai)}</td><td class=rec>{nf(rec)}</td></tr>")
within = sum(1 for _, t, v in summary_t if v and abs(v - t) <= 0.2 * t)

# ---- 3) 재화 표 ----
eco_rows = []
for x in EP['plan']:
    eco_rows.append(f"<tr><td class=c>{x['n']}</td><td>{nf(x['goldIn'])}</td><td>{nf(x['spend'])}</td><td>{nf(x['goldLeft'])}</td><td>{x['stonesIn']}</td><td>{nf(x['rrGold'])}</td><td>+{x['e']}</td><td>{x['q2']}</td><td>{x['q3']}</td><td>{sum(x['potLines'])}</td></tr>")

# ---- 4) 원래 '열심히' 스펙(최상급 3부위·잠재 3줄 맞춤)까지 필요한 추가 사냥 ----
kpm = EP['kpm']; spk = EP['stonePerKill']
farm_rows = []; cg = cs = cin = csin = 0
for n in range(1, 31):
    e = E0[n]; kills = e['qKills'] * 2
    cin += e['qGold'] + kills * e['gpk']; csin += kills * spk
    cg += e['enhGoldNeed'] + e['qualGold'] + e['potGold']; cs += e['qualStones'] + e['potStones']
    gpm = e['gpk'] * kpm; spm = spk * kpm
    mg = max(0, cg - cin) / gpm if gpm else 0; ms = max(0, cs - csin) / spm if spm else 0
    if n in (1, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30):
        farm_rows.append(f"<tr><td class=c>{n}</td><td>{nf(cg)}</td><td>{nf(cin)}</td><td>{nf(cs)}</td><td>{round(csin)}</td><td>{round(mg)}</td><td><b>{round(ms)}</b></td><td>{round(max(mg, ms) / 60, 1)}</td></tr>")

page = f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>보스·직업·재화 밸런스</title>
<style>
@page {{ size: A4 landscape; margin: 12mm 10mm; }}
:root {{ --fg:#1d1b22; --mute:#615c6c; --line:#d8d4de; --head:#ece8f2; --accent:#5b2f91; --ok:#2f7a4a; --bad:#b23a2e; --rec:#efe6fb; }}
body {{ font-family:'Noto Sans KR','Noto Sans CJK KR','Apple SD Gothic Neo','WenQuanYi Zen Hei',sans-serif; color:var(--fg); font-size:10.5px; line-height:1.5; margin:0; }}
h1 {{ font-size:22px; margin:0 0 4px; }} h2 {{ font-size:15px; margin:18px 0 6px; color:var(--accent); border-bottom:2px solid var(--accent); padding-bottom:2px; break-after:avoid; }}
h3 {{ font-size:12px; margin:10px 0 4px; }}
p, li {{ margin:2px 0; max-width:180mm; }} ul {{ margin:2px 0 6px; padding-left:16px; }}
.sub {{ color:var(--mute); }}
table {{ border-collapse:collapse; width:100%; font-variant-numeric:tabular-nums; margin:4px 0 8px; break-inside:auto; }}
tr {{ break-inside:avoid; }}
th, td {{ border:1px solid var(--line); padding:2px 5px; text-align:right; white-space:nowrap; }}
th {{ background:var(--head); font-weight:700; font-size:9.5px; }}
td.l, th.l {{ text-align:left; }} td.c {{ text-align:center; }} td.dim {{ color:#aaa; }}
td.rec {{ background:var(--rec); font-weight:700; color:var(--accent); }}
td.ok {{ color:var(--ok); }} td.bad {{ color:var(--bad); }}
.box {{ border:1px solid var(--line); background:#faf8fc; padding:6px 10px; margin:6px 0; }}
.pb {{ break-before:page; }}
.kv {{ display:grid; grid-template-columns: 52mm 1fr; gap:1px 8px; }}
</style></head><body>
<h1>보스·직업·재화 밸런스 보고서</h1>
<p class="sub">The Pixel Odyssey · test 서버 261125 · 2026-11-25 · AI 시뮬레이션 (30장 × 4직업 × 실제 보스전·허수아비) · 원자료 docs/balance/</p>

<h2>1. 요약</h2>
<ul>
<li><b>목표</b>: '열심히 한 플레이어'(재화로 가능한 스펙) 4직업 평균 AI 보스 처치 시간 — 보통 90초, 5·15·25장 120초, 10·20·30장 180초.</li>
<li><b>검증 결과</b>: 조정값을 넣고 다시 돌린 AI 보스전에서 30장 중 <b>{within}장</b>이 목표 ±20% 안(아래 표 '검증 평균').</li>
<li><b>직업</b>: 허수아비 DPS(근접=1) 궁수 {B['classMedianRatio']['kallisto']:.2f} · 마법사 {B['classMedianRatio']['mage']:.2f} → 스킬 피해 배율로 궁수 1.10(Shift 집중 포함) · 마법사 0.90 에 맞춤 (궁수 ×{B['classMult']['kallisto']}, 마법사 ×{B['classMult']['mage']}). 전투력 숫자는 그대로.</li>
<li><b>재화</b>: 결정(품질석·잠재석)은 그대로(사용자: 지금 양이 적당, 플레이 시간). 리롤 골드는 아이템 레벨에 따라 몹 골드와 같은 비율로, 강화 골드 +25%, 21~30장 퀘스트·몹 골드 ×{EP['K3']} → 30장까지 남는 골드 {round(EP['leftBefore'] / EP['incomeBefore'] * 100)}% → {round(EP['leftRatio'] * 100)}% (스펙은 그대로).</li>
<li><b>가장 큰 발견</b>: 지금 보스 체력은 '잠재 3줄을 좋은 옵션으로 다 맞춘 스펙'에 맞춰져 있는데, 결정 양으로는 보통 진행에서 잠재를 거의 맞출 수 없다. 그래서 목표 시간에 맞추면 12장 이후 보스 체력이 크게 내려간다(21~29장 약 ×0.10~0.15). 결정을 늘리거나 잠재 의존을 줄이면 이 배율은 다시 올라간다.</li>
<li><b>적용</b>: 모든 값은 test 서버에만 — 관리자 창 📊 DPS → 'AI 밸런스 값 적용 (test)'. 📜 내역에 남고 각 값의 되돌리기 버튼으로 되돌린다. 정식은 🚀 정식 적용 전까지 그대로.</li>
</ul>

<h2>2. 기준과 가정</h2>
<div class="kv">
<b>스펙 (열심히, 재화 안에서)</b><span>그 장 도착 레벨 · 특성 포인트 전부 · 3장부터 전 부위 유니크, 8장부터 레전드 1부위 · 강화·품질·잠재는 그 장까지 번 골드·결정으로 가능한 만큼(퀘스트 처치의 3배 사냥, 장비는 등급이 오르거나 3장마다 교체, 강화 → 품질 상급 → 잠재 순) · 장비의 무작위 잠재 포함 · 보스 트로피(앞 보스 초회·타임어택 전부 + 5장 이상 아래 노히트) · 쁘띠 도감 기대값(앞 보스마다 40%) · 반지 기대값(10·20장 반지 40%).</span>
<b>재화</b><span>수입 = 퀘스트 골드 + 사냥 골드(몹 1마리당 기대 골드 × 처치 수), 결정 = 사냥 장비 전부 분해. 분당 처치는 사냥 AI 측정 중앙값 {kpm}마리. 강화는 장인의 기운 포함 기대 시도 × 비용.</span>
<b>AI 보스전</b><span>진짜 보스방 60초(게임 시간). 0.6초 안에 터질 장판·전조·탄·그림 판정을 피해 움직이고 못 피하면 가드, 안전하면 보스 공격 거리에서 Z·X·C·A·S·D·V(궁수는 Shift 집중도). 맞은 피해는 기록하고 체력은 채워 끝까지. 보스전 DPS 가 허수아비의 15% 미만인 전투는 'AI 가 막힌 전투'로 그 장 평균에서 뺐다(표에서 회색).</span>
<b>허수아비</b><span>그 장 보스의 방어력. 지속 = 궁극기 없이 20초, 궁극기 포함 = 시작에 V + 30초.</span>
<b>권장 전투력(게임 표기, 보정 없음)</b><span>전투력을 k 배 하면 주는 피해 k 배 · 받는 피해 1/k 배라고 보고, 잡는 시간 ≤ 버티는 시간(체력 ÷ (초당 받은 피해 - 치유 연고 회복: 최대 체력 35%/8초)) 과 잡는 시간 ≤ 그 장 목표 시간 을 만족하는 가장 작은 k × 스펙 전투력. 사람 기준 = AI 보다 DPS {int(HD * 100)}%, 받는 피해 {HT}배 (관리자 창에서 조절, test 서버 실제 기록으로 맞춘다).</span>
</div>

<h2>3. 직업 피해</h2>
<table><tr><th class=l>직업</th><th>조정 전 (허수아비, 근접=1)</th><th>목표</th><th>스킬 피해 배율</th><th>검증 후</th></tr>{cls_rows}</table>
<p class="sub">마법사 배율이 ×{B['classMult']['mage']} 로 크다. 허수아비는 이동이 없는 측정이라 AI 조작 차이보다는 직업 수치 차이로 보인다. 마법사 Z(되돌아오는 탄) 구조 때문에 피해 빈도가 낮다.</p>

<h2 class="pb">4. 보스별 처치 시간 · 체력 · DPS · 권장 전투력</h2>
<table><tr><th>장</th><th class=l>보스</th><th>목표(초)</th><th>조정 전 AI(초)</th><th>체력 배율</th><th>새 체력</th><th>검증 평균(초)</th>{''.join(f'<th>{KO[c]}(초)</th>' for c in CH)}<th>허수아비 지속</th><th>궁극기 포함</th><th>AI 보스전 DPS</th><th>스펙 전투력</th><th>AI 필요</th><th>권장(사람)</th></tr>{''.join(boss_rows)}</table>
<p class="sub">DPS·전투력은 4직업 평균. 녹색 = 목표 ±20% 안, 빨강 = 밖. 회색 칸 = AI 가 막힌 전투(평균에서 뺌).</p>

<h2 class="pb">5. 재화 (조정 후)</h2>
<table><tr><th>장</th><th>골드 수입</th><th>지출</th><th>남은 골드(누적)</th><th>결정 수입</th><th>리롤 1회 골드</th><th>강화</th><th>상급 부위</th><th>최상급</th><th>맞춘 잠재 줄(6부위 합)</th></tr>{''.join(eco_rows)}</table>
<p class="sub">21~30장 골드 ×{EP['K3']} 적용 후. 결정이 품질 상급에 먼저 쓰여 잠재는 거의 맞추지 못한다 — 결정을 지금 양으로 두기로 한 결과(오래 모아야 하는 구조).</p>

<h3>원래 '열심히' 스펙(5장부터 최상급 3부위·잠재 3줄)까지 필요한 추가 사냥</h3>
<table><tr><th>장</th><th>누적 필요 골드</th><th>누적 골드 수입</th><th>누적 필요 결정</th><th>누적 결정 수입</th><th>골드 부족분 사냥(분)</th><th>결정 부족분 사냥(분)</th><th>더 긴 쪽(시간)</th></tr>{''.join(farm_rows)}</table>
<p class="sub">분당 처치 {kpm}마리 기준. 결정 부족분이 압도적이라 이 스펙은 보통 플레이로는 닿지 않는다 — 그래서 '재화로 가능한 스펙'으로 맞췄다.</p>

<h2>6. 한계</h2>
<ul>
<li>AI 는 사람과 다르다: 보스 기믹(예: 8장 석화 파동)에 막히는 전투가 있고, 반대로 판정 회피는 사람보다 정확할 수 있다. test 서버의 실제 보스전 기록(전투력·DPS·받은 피해·결과)이 쌓이면 관리자 창 📊 DPS 탭에서 AI 값과 비교해 '사람 DPS/AI', '사람 받는 피해/AI' 를 맞춘다.</li>
<li>보스 공격력(받는 피해)은 이번에 바꾸지 않았다. 체력을 크게 줄인 후반 보스는 전투가 짧아져 위험이 줄어든다.</li>
<li>한 번씩 측정한 값이라 장마다 ±10~20% 흔들림이 있다.</li>
</ul>

<h2>7. test 서버에 적용하는 법</h2>
<ol>
<li>test 서버에 관리자 아이디(admin0215 · admin2016 · admin2017)로 로그인 → F9.</li>
<li>📊 DPS 탭 → 'AI 밸런스 값 적용 (test)' → 확인. 직업 스킬 피해 · 보스 체력 30 · 리롤 골드 장 비례 · 21~30장 골드 · 강화 골드가 test 에만 들어간다.</li>
<li>⚔ 전투 · 👹 보스 · 💰 경제·강화 탭에서 값을 보고 고칠 수 있다. 되돌리기는 각 값의 되돌리기 버튼.</li>
<li>보스전에서는 왼쪽 아래 'DPS 창'(test 전용)에 지금 DPS · 내 장비 예상 DPS · AI 평균 · 권장 전투력이 뜨고, 전투가 끝날 때마다 기록이 저장된다.</li>
</ol>
</body></html>"""
out = os.path.join(D, '밸런스_보고서_261125.html')
open(out, 'w', encoding='utf-8').write(page)
print('wrote', out, 'within', within)

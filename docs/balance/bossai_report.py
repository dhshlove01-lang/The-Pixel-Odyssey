"""bossai_261125.json + bossai_table.json + bossai_oldrec.json → 보스 권장 전투력 보고서 HTML.
실행: python3 docs/balance/bossai_report.py [출력 경로]   (기본 docs/balance/보스_권장전투력_261125.html)
계산은 게임(test/index.html 묶음 11)과 같다: 사람 = AI DPS × HD, 받는 피해 × HT, 처치 목표 LIMIT 초."""
import json, math, os, sys, html
D = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(D, 'bossai_261125.json'), encoding='utf-8'))
T = json.load(open(os.path.join(D, 'bossai_table.json'), encoding='utf-8'))
OLD = json.load(open(os.path.join(D, 'bossai_oldrec.json'), encoding='utf-8'))
HD, HT, LIMIT = 0.7, 2.0, 90
CH = ['theron', 'kallisto', 'lykos', 'mage']
NAME = {'theron': '전사', 'kallisto': '궁수', 'lykos': '도적', 'mage': '마법사'}
BOSS = json.load(open(os.path.join(D, 'bossai_names.json'), encoding='utf-8')) if os.path.exists(os.path.join(D, 'bossai_names.json')) else {}

def need_k(r, hd, ht):
    if not r or not r.get('bdps'): return None
    tk = r['bhp'] / (r['bdps'] * hd)
    ts = r['hp'] / (r['dtps'] * ht) if r.get('dtps') else float('inf')
    return max(math.sqrt(tk / ts) if ts != float('inf') else 0, tk / LIMIT, 0.2)
def need(n, c, human):
    r = T.get(str(n), {}).get(c); k = need_k(r, HD if human else 1, HT if human else 1)
    return None if k is None else round(r['cp'] * k)
def avg(xs):
    xs = [x for x in xs if x]; return round(sum(xs) / len(xs)) if xs else 0
nf = lambda v: '-' if v in (None, 0) else f'{v:,}'
R = {(r['n'], r['ch']): r for r in rows if not r.get('err')}

body = []
for n in range(1, 31):
    if str(n) not in T: continue
    t = T[str(n)]
    cp = avg([t[c]['cp'] for c in CH if c in t])
    ai_need = avg([need(n, c, False) for c in CH])
    rec = avg([need(n, c, True) for c in CH])
    sus = [t[c]['sus'] if c in t else 0 for c in CH]
    ult = avg([t[c]['ult'] for c in CH if c in t])
    bd = [t[c]['bdps'] if c in t else 0 for c in CH]
    kill = avg([R[(n, c)]['killSec'] for c in CH if (n, c) in R])
    killed = sum(1 for c in CH if (n, c) in R and R[(n, c)]['killed'])
    dt = avg([t[c]['dtps'] for c in CH if c in t])
    lv = R[(n, 'theron')]['lv'] if (n, 'theron') in R else ''
    e = R[(n, 'theron')]['e'] if (n, 'theron') in R else ''
    old = OLD.get(str(n), 0)
    ratio = (rec / old) if old else 0
    tone = 'up' if ratio > 1.15 else 'down' if ratio and ratio < 0.85 else ''
    body.append(f"<tr><td class=c>{n}</td><td class=l>{html.escape(BOSS.get(str(n), ''))}</td><td>{lv}</td><td>+{e}</td><td>{nf(cp)}</td>"
                f"<td>{nf(ai_need)}</td><td class='rec'>{nf(rec)}</td><td class='{tone}'>{nf(old)}</td>"
                + ''.join(f'<td>{nf(v)}</td>' for v in sus) + f"<td class=avg>{nf(avg(sus))}</td><td>{nf(ult)}</td>"
                + ''.join(f'<td>{nf(v)}</td>' for v in bd) + f"<td class=avg>{nf(avg(bd))}</td><td>{nf(dt)}</td><td>{kill}s</td><td>{killed}/4</td></tr>")

head = ("<tr><th rowspan=2>장</th><th rowspan=2 class=l>보스</th><th rowspan=2>레벨</th><th rowspan=2>강화</th><th rowspan=2>AI 스펙<br>전투력</th>"
        "<th rowspan=2>AI 필요<br>전투력</th><th rowspan=2>권장 전투력<br>(사람 기준)</th><th rowspan=2>기존 권장</th>"
        "<th colspan=5>허수아비 지속 DPS (궁극기 없이)</th><th rowspan=2>궁극기<br>포함</th><th colspan=5>AI 보스전 실제 DPS</th><th rowspan=2>초당<br>받은 피해</th><th rowspan=2>AI 처치<br>시간</th><th rowspan=2>60초 안<br>처치</th></tr>"
        "<tr>" + ''.join(f'<th>{NAME[c]}</th>' for c in CH) + "<th>평균</th>" + ''.join(f'<th>{NAME[c]}</th>' for c in CH) + "<th>평균</th></tr>")

page = f"""<title>보스 권장 전투력</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
/* 장마다 한 줄 — 넓은 표는 가로 스크롤, 위 요약은 글로 */
:root {{ --bg:#f6f5f2; --fg:#1d1b22; --mute:#6b6676; --line:#dcd8e2; --head:#ece8f2; --accent:#6b3fa0; --up:#b23a2e; --down:#2f7a4a; --recbg:#efe6fb;
  --sans:'IBM Plex Sans KR',system-ui,sans-serif; --mono:'IBM Plex Mono',ui-monospace,monospace; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#141219; --fg:#ece8f2; --mute:#9a93a8; --line:#2e2a38; --head:#211d2a; --accent:#c4a0f0; --up:#f08a7c; --down:#7fd49a; --recbg:#2a2140; color-scheme:dark; }} }}
:root[data-theme="dark"] {{ --bg:#141219; --fg:#ece8f2; --mute:#9a93a8; --line:#2e2a38; --head:#211d2a; --accent:#c4a0f0; --up:#f08a7c; --down:#7fd49a; --recbg:#2a2140; color-scheme:dark; }}
body {{ background:var(--bg); color:var(--fg); font-family:var(--sans); }}
.wrap {{ padding-block:28px 48px; padding-left:max(16px, env(safe-area-inset-left,0px)); padding-right:max(16px, env(safe-area-inset-right,0px)); max-width:1500px; margin:0 auto; display:flex; flex-direction:column; gap:18px; }}
h1 {{ margin:0; font-size:1.6rem; text-wrap:balance; }}
p, li {{ max-width:70ch; line-height:1.6; margin:0; }}
.note {{ color:var(--mute); font-size:.92rem; }}
ul {{ margin:0; padding-left:1.2em; display:flex; flex-direction:column; gap:4px; }}
.tw {{ overflow-x:auto; border:1px solid var(--line); }}
table {{ border-collapse:collapse; font-size:12.5px; font-variant-numeric:tabular-nums; min-width:1300px; }}
th, td {{ border-bottom:1px solid var(--line); padding:5px 8px; text-align:right; white-space:nowrap; }}
th {{ background:var(--head); font-weight:600; font-size:11.5px; position:sticky; top:0; }}
td.l, th.l {{ text-align:left; }} td.c {{ text-align:center; font-family:var(--mono); }}
td.rec {{ background:var(--recbg); font-weight:700; color:var(--accent); }}
td.avg {{ font-weight:600; }}
td.up {{ color:var(--up); }} td.down {{ color:var(--down); }}
code {{ font-family:var(--mono); font-size:.9em; }}
</style>
<div class="wrap">
<h1>보스 권장 전투력 · 4직업 DPS</h1>
<p>장마다 '열심히 한 플레이어' 스펙으로 4직업(전사·궁수·도적·마법사)을 만들어, 그 장 보스의 방어력을 넣은 허수아비와 실제 보스전을 AI 가 직접 플레이한 결과다. 2026-11-25 · test 261125.</p>
<ul class="note">
<li>스펙: 그 장 도착 레벨, 특성 포인트 전부 사용, 3장부터 전 부위 유니크, 8장부터 레전드 1부위 이상, 강화는 기준 +2(최대 +15), 5장부터 최상급 품질 3부위, 잠재 굴림 1.2배 이상, 앞 보스 트로피(초회·타임어택 전부 + 5장 이상 아래 보스 노히트), 1장 보스 쁘띠.</li>
<li>허수아비 지속 DPS: 궁극기 없이 Z·X·C·A·S·D 를 재사용 대기마다 20초. 궁극기 포함: 시작에 V 한 번 + 30초 (4직업 평균).</li>
<li>AI 보스전 DPS: 진짜 보스방 60초. AI 는 0.6초 안에 터질 장판·전조·탄·그림 판정을 피해 움직이고, 피할 곳이 없으면 가드한다. 맞은 피해는 기록하고 체력은 다시 채운다.</li>
<li>AI 필요 전투력: 전투력을 k 배 하면 공격·생존이 k 배라고 보고, 잡는 시간 ≤ 버티는 시간(체력 ÷ 초당 받은 피해)과 잡는 시간 ≤ {LIMIT}초를 둘 다 만족하는 가장 작은 k × 스펙 전투력.</li>
<li>권장 전투력(사람 기준): 사람은 AI 보다 DPS {int(HD*100)}%, 받는 피해 {HT}배로 보고 같은 계산. 이 값이 게임 보스 이름 아래에 그대로(보정 없이) 뜬다. 가정은 관리자 창 👹 보스 '권장 전투력 (AI 시뮬레이션)' 에서 바꾸고, test 서버의 실제 보스전 기록(📊 DPS 탭)으로 맞춘다.</li>
<li>기존 권장: 바꾸기 전 값(기준 스펙 전투력 × 2/3). 새 값이 15% 넘게 높으면 빨강, 낮으면 초록.</li>
</ul>
<div class="tw"><table>{head}{''.join(body)}</table></div>
<p class="note">원자료: <code>docs/balance/bossai_261125.json</code> (장 × 직업 120줄) · 다시 돌리기: <code>node docs/balance/bossai.js</code> → <code>node docs/balance/bossai_embed.js</code> → <code>python3 docs/balance/bossai_report.py</code>.</p>
</div>
"""
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(D, '보스_권장전투력_261125.html')
open(out, 'w', encoding='utf-8').write(page)
print('wrote', out, len(body), 'chapters')

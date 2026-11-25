"""밸런스 원자료 전부를 엑셀 파일 하나로 (2026-11-25)
입력: report_final.py 와 같은 파일들 · 출력: docs/balance/밸런스_데이터_261125.xlsx
실행: python3 docs/balance/data_xlsx.py"""
import json, os, statistics as st
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

D = os.path.dirname(os.path.abspath(__file__))
L = lambda f: json.load(open(os.path.join(D, f), encoding='utf-8'))
B = L('balance_261125.json'); V = [r for r in L('bossai_final_261125.json') if not r.get('err')]
EP = L('econ_plan.json'); E0 = {r['n']: r for r in L('econ_261125.json')}; NAMES = L('bossai_names.json'); PRE = L('balance_preset.json')
OLD = L('bossai_oldrec.json')
CH = ['theron', 'kallisto', 'lykos', 'mage']; KO = {'theron': '전사', 'kallisto': '궁수', 'lykos': '도적', 'mage': '마법사'}
SKO = {'z': 'Z', 'x': 'X', 'c': 'C', 'move': '이동기', 'a': 'A', 's': 'S', 'd': 'D', 'v': 'V(궁극기)'}
HD, HT = 0.7, 2.0
tgt = lambda n: 180 if n % 10 == 0 else 120 if n % 5 == 0 else 90
VB = {}
for r in V: VB.setdefault(r['n'], {})[r['ch']] = r
chB = {c['n']: c for c in B['chapters']}

def mixv(r, key):
    k = (r.get('ring') or {}).get('off', 1)
    return r[key] * (1 + 0.4 * (k - 1)) if key in ('dpsSus', 'dpsUlt', 'bossDps') else r[key]
def stuck(r): return not r.get('bossDps') or r['bossDps'] < 0.15 * max(1, r.get('dpsSus') or 0)
def need(r, n, hd, ht):
    bd = mixv(r, 'bossDps')
    if not bd: return None
    tk = r['bossHp'] / (bd * hd); heal = 0.35 / 8
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
def avg(xs):
    xs = [x for x in xs if x]
    return sum(xs) / len(xs) if xs else None
rnd = lambda v, d=0: None if v is None else (round(v) if d == 0 else round(v, d))

# ---- 서식 ----
FONT = '맑은 고딕'
HF = Font(name=FONT, bold=True, color='FFFFFF'); HFILL = PatternFill('solid', fgColor='5B2F91')
BF = Font(name=FONT); BOLD = Font(name=FONT, bold=True); TITLE = Font(name=FONT, bold=True, size=14); NOTE = Font(name=FONT, color='615C6C', italic=True)
REC = PatternFill('solid', fgColor='EFE6FB'); DIM = Font(name=FONT, color='AAAAAA')
OK = Font(name=FONT, color='2F7A4A', bold=True); BAD = Font(name=FONT, color='B23A2E', bold=True)
TH = Side(style='thin', color='D8D4DE'); BOX = Border(left=TH, right=TH, top=TH, bottom=TH)

def sheet(wb, name, title, headers, rows, fmts=None, widths=None, notes=()):
    ws = wb.create_sheet(name)
    ws['A1'] = title; ws['A1'].font = TITLE
    r0 = 3
    for j, h in enumerate(headers, 1):
        c = ws.cell(r0, j, h); c.font = HF; c.fill = HFILL; c.border = BOX
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    ws.row_dimensions[r0].height = 32
    for i, row in enumerate(rows, r0 + 1):
        for j, v in enumerate(row, 1):
            c = ws.cell(i, j, v); c.font = BF; c.border = BOX
            if fmts and j - 1 < len(fmts) and fmts[j - 1]: c.number_format = fmts[j - 1]
    for k, t in enumerate(notes):
        c = ws.cell(r0 + len(rows) + 2 + k, 1, t); c.font = NOTE
    for j in range(1, len(headers) + 1):
        ws.column_dimensions[get_column_letter(j)].width = (widths[j - 1] if widths and j - 1 < len(widths) else 12)
    ws.freeze_panes = ws.cell(r0 + 1, 1)
    return ws, r0

wb = Workbook(); wb.remove(wb.active)
I0, I1, I2, P = '#,##0', '0.0', '0.00', '0.0%'

# ---- 1) 요약 ----
ws = wb.create_sheet('요약')
lines = [
    ('보스·직업·재화 밸런스 데이터 (test 261125-2200)', TITLE),
    ('2026-11-25 · AI 시뮬레이션 30장 × 4직업 · 원자료 docs/balance/ · 보고서 PDF: 밸런스_보고서_261125.pdf', NOTE),
    ('', None),
    ('시트 안내', BOLD),
    ('적용값 — 관리자 창 "AI 밸런스 값 적용 (test)" 이 넣는 65개 값 (조정 전 → 조정 후)', BF),
    ('직업 — 직업별 허수아비 DPS 비율과 스킬 피해 배율', BF),
    ('보스 — 장별 목표 시간 · 체력 · 처치 시간 · DPS · 권장 전투력 (4직업 평균)', BF),
    ('보스_직업별 — 120전투(30장 × 4직업) 원측정값: 스펙 · 스탯 · DPS · 받은 피해 · 처치 시간 · 권장 전투력', BF),
    ('재화 — 조정 후 장별 골드·결정 수입과 지출, 강화·품질·잠재 진행', BF),
    ('추가사냥 — 원래 "열심히" 스펙(최상급 3부위·잠재 3줄)에 닿으려면 더 필요한 사냥 시간', BF),
    ('재화_조정전 — 조정 전 장별 퀘스트 골드·몹 골드·필요 비용 원자료', BF),
    ('', None),
    ('기준', BOLD),
    ('목표 처치 시간: 보통 90초 · 5·15·25장 120초 · 10·20·30장 180초 (4직업 평균, 열심히 한 플레이어 = 재화로 가능한 스펙)', BF),
    ('직업 목표: 근접(전사·도적) = 1, 궁수 1.10 (Shift 집중 포함), 마법사 0.90', BF),
    (f'권장 전투력(사람): AI 보다 DPS {HD:.0%}, 받는 피해 {HT:.0f}배 · 치유 연고 최대 체력 35%/8초 포함 · 관리자 창 👹 보스 탭 bai_hd / bai_ht 로 조정', BF),
    ('반지 옵션은 기대값 40% 로 반영 · AI 가 막힌 전투(보스전 DPS < 허수아비 15%)는 장 평균에서 뺌', BF),
    ('', None),
    ('결과', BOLD),
    (f'직업: 조정 전 궁수 {B["classMedianRatio"]["kallisto"]:.2f} · 마법사 {B["classMedianRatio"]["mage"]:.2f} → 스킬 피해 배율 궁수 ×{B["classMult"]["kallisto"]} · 마법사 ×{B["classMult"]["mage"]} (마법사 차이가 큼)', BF),
    (f'재화: 리롤 골드 장 비례({EP["B"]}) · 강화 골드 +25% · 21~30장 골드 ×{EP["K3"]} → 30장까지 남는 골드 59% → {EP["leftRatio"]:.0%}. 품질석·잠재석은 그대로', BF),
    ('보스 체력: 지금 체력은 잠재 3줄 맞춘 스펙 기준이라 12장 이후 크게 내려감 (21~29장 ×0.08~0.15)', BF),
    ('', None),
    ('적용: test 서버 관리자 로그인 → F9 → 📊 DPS → "AI 밸런스 값 적용 (test)" → 확인. 정식은 그대로.', BOLD),
]
for i, (t, f) in enumerate(lines, 1):
    c = ws.cell(i, 1, t)
    if f: c.font = f
ws.column_dimensions['A'].width = 130

# ---- 2) 적용값 ----
rows = []
for k, v in PRE.items():
    p = k.split(':')
    if p[0] == 'sk': name, base = f'{KO[p[1]]} {SKO.get(p[2], p[2])} 스킬 피해 배율', 1
    elif p[0] == 'b': n = int(p[1][1:]); name, base = f'{n}장 보스 체력 배율 ({NAMES.get(str(n), "")})', 1
    elif k == 'rrGrow': name, base = '리롤 골드 장 비례 (0 = 200 고정)', 0
    elif k == 'gold3': name, base = '21~30장 골드 배율', 1
    elif k == 'enhGold': name, base = '강화 골드 비용 배율', 2.4
    else: name, base = k, None
    rows.append([k, name, base, v])
ws, r0 = sheet(wb, '적용값', '관리자 창 "AI 밸런스 값 적용 (test)" 이 넣는 값', ['키', '이름', '조정 전', '조정 후', '변화'], rows,
               [None, None, '0.000', '0.000', P], [24, 46, 10, 10, 10], ['변화 = 조정 후 ÷ 조정 전 - 1 (조정 전이 0 이면 빈칸)'])
for i in range(r0 + 1, r0 + 1 + len(rows)):
    c = ws.cell(i, 5, f'=IF(C{i}=0,"",D{i}/C{i}-1)'); c.number_format = P; c.font = BF; c.border = BOX

# ---- 3) 직업 ----
ratio_after = {c: [] for c in CH}
for n, d in VB.items():
    if len(d) < 4: continue
    m = (mixv(d['theron'], 'dpsSus') + mixv(d['lykos'], 'dpsSus')) / 2
    for c in CH: ratio_after[c].append(mixv(d[c], 'dpsSus') / m)
rows = [[KO[c], c, B['classMedianRatio'][c], B['classTarget'][c], B['classMult'][c], st.median(ratio_after[c])] for c in CH]
sheet(wb, '직업', '직업 피해 (허수아비 지속 DPS, 근접 평균 = 1, 장별 중앙값)', ['직업', '코드', '조정 전 비율', '목표', '스킬 피해 배율', '검증 후 비율'], rows,
      [None, None, I2, I2, I2, I2], [10, 10, 14, 10, 14, 14], ['스킬 피해 배율은 그 직업의 Z·X·C·이동기·A·S·D·V 전부에 같은 값으로 곱한다. 전투력은 그대로.'])

# ---- 4) 보스 ----
hdr = ['장', '보스', '목표(초)', '조정 전 AI(초)', '1차 검증(초)', '검증 보정', '최종 체력 배율', '최종 체력', '최종 예상(초)', '목표 대비'] + \
      [f'{KO[c]}(초)' for c in CH] + ['허수아비 지속 DPS', '궁극기 포함 DPS', '보스전 DPS', '스펙 전투력', 'AI 필요 전투력', '권장 전투력(사람)', '예전 권장 전투력', '뺀 전투(AI 막힘)']
rows, marks = [], []
for n in range(1, 31):
    c = chB.get(n); d = VB.get(n, {})
    if not c: continue
    ok = [x for x in CH if x in d and not stuck(d[x])]
    times = {x: d[x]['bossHp'] / max(1, mixv(d[x], 'bossDps')) for x in CH if x in d}
    tv = st.mean(times[x] for x in ok) if ok else None
    r0_ = next(iter(d.values())); tm = r0_.get('tMeas'); fx = r0_.get('hpFix', 1)
    rows.append([n, NAMES.get(str(n), ''), tgt(n), rnd(c['tNow'], 1), rnd(tm, 1), fx, PRE['b:b' + str(n) + ':hp'], r0_['bossHp'], rnd(tv, 1), None] +
                [rnd(times.get(x), 1) for x in CH] +
                [rnd(avg([mixv(d[x], 'dpsSus') for x in CH if x in d])), rnd(avg([mixv(d[x], 'dpsUlt') for x in CH if x in d])), rnd(avg([mixv(d[x], 'bossDps') for x in ok])),
                 rnd(avg([d[x]['cp'] for x in CH if x in d])), rnd(avg([need(d[x], n, 1, 1) for x in ok])), rnd(avg([need(d[x], n, HD, HT) for x in ok])), OLD.get(str(n)),
                 ', '.join(KO[x] for x in CH if x in d and x not in ok)])
    marks.append((tm is not None and abs(tm - tgt(n)) <= 0.1 * tgt(n), [x not in ok for x in CH]))
ws, r0 = sheet(wb, '보스', '보스별 처치 시간 · 체력 · DPS · 권장 전투력 (4직업 평균)', hdr, rows,
               [None, None, I0, I1, I1, '×0.000', '×0.000', I0, I1, P, I1, I1, I1, I1, I0, I0, I0, I0, I0, I0, I0, None],
               [5, 30, 8, 10, 10, 9, 10, 12, 10, 9, 9, 9, 9, 9, 11, 11, 11, 11, 11, 13, 13, 14],
               ['1차 검증: 녹색 = 목표 ±10% 안, 빨강 = 밖 → 그만큼 체력을 비례로 더 고침(검증 보정). 최종 예상 = 최종 체력 기준 직업별 시간 평균.',
                '직업별 시간: 회색 = AI 가 막힌 전투(평균에서 뺌). 목표 대비 = 최종 예상 ÷ 목표.',
                '예전 권장 전투력 = 지금 정식 게임에 표시되는 값. 권장 전투력(사람) = DPS 70% · 받는 피해 2배 가정.'])
for k, (good, st_) in enumerate(marks):
    i = r0 + 1 + k
    ws.cell(i, 5).font = OK if good else BAD
    c = ws.cell(i, 10, f'=IF(C{i}=0,"",I{i}/C{i})'); c.number_format = P; c.font = BF; c.border = BOX
    for j, s in enumerate(st_):
        if s: ws.cell(i, 11 + j).font = DIM
    ws.cell(i, 20).fill = REC; ws.cell(i, 20).font = BOLD

# ---- 5) 보스_직업별 ----
hdr = ['장', '직업', '레벨', '강화', '유니크', '레전드', '최상급', '펫', '반지', '반지 공격 배율', '전투력', '공격력', '체력', '방어력', '치명(%)', '치명 피해',
       '허수아비 지속 DPS', '궁극기 포함 DPS', '보스 체력(최종)', '보스전 DPS', '처치 시간(초)', '초당 받은 피해', '맞은 횟수', '가드', '처치', '전투(초)', 'AI 막힘', 'AI 필요 전투력', '권장 전투력(사람)']
rows = []
for r in sorted(V, key=lambda r: (r['n'], CH.index(r['ch']))):
    ring = r.get('ring') or {}
    rows.append([r['n'], KO[r['ch']], r['lv'], r['e'], r.get('uniq'), r.get('leg'), r.get('q3'), r.get('pets'), ring.get('ch') or '', ring.get('off', 1),
                 r['cp'], r['atk'], r['hp'], r['def'], r['crit'], r['critDmg'], rnd(mixv(r, 'dpsSus')), rnd(mixv(r, 'dpsUlt')), r['bossHp'], rnd(mixv(r, 'bossDps')),
                 None, r['dtps'], r['hits'], r['guards'], 'O' if r['killed'] else '', r['fightSec'], 'O' if stuck(r) else '', rnd(need(r, r['n'], 1, 1)), rnd(need(r, r['n'], HD, HT))])
ws, r0 = sheet(wb, '보스_직업별', '보스전 원측정값 (30장 × 4직업)', hdr, rows,
               [None, None, I0, I0, I0, I0, I0, I0, None, I2, I0, I0, I0, I0, I1, I0, I0, I0, I0, I0, I1, I0, I0, I0, None, I1, None, I0, I0],
               [5, 7, 6, 6, 7, 7, 7, 5, 9, 9, 9, 8, 8, 8, 8, 8, 10, 10, 11, 10, 10, 10, 8, 6, 6, 8, 7, 11, 12],
               ['DPS 는 반지 기대값 40% 반영. 처치 시간 = 보스 체력 ÷ 보스전 DPS. 처치 = 60초 측정 안에 실제로 잡음(못 잡은 전투는 DPS 로 시간 계산).',
                'AI 막힘 = 보스전 DPS 가 허수아비 지속 DPS 의 15% 미만(기믹에 막혀 거의 못 때림).'])
for i in range(r0 + 1, r0 + 1 + len(rows)):
    c = ws.cell(i, 21, f'=IF(T{i}>0,S{i}/T{i},"")'); c.number_format = I1; c.font = BF; c.border = BOX
    ws.cell(i, 29).fill = REC
ws.auto_filter.ref = f'A{r0}:{get_column_letter(len(hdr))}{r0 + len(rows)}'

# ---- 6) 재화 ----
hdr = ['장', '골드 수입', '지출', '남은 골드(누적)', '결정 수입', '남은 결정', '리롤 1회 골드', '강화', '강화 목표', '상급 부위', '최상급 부위', '맞춘 잠재 줄(6부위 합)', '분당 처치']
rows = [[x['n'], x['goldIn'], x['spend'], x['goldLeft'], x['stonesIn'], x.get('stonesLeft'), x['rrGold'], x['e'], x.get('eTarget'), x['q2'], x['q3'], sum(x['potLines']), x.get('kpm')] for x in EP['plan']]
sheet(wb, '재화', f'재화 (조정 후: 리롤 장 비례 {EP["B"]} · 강화 골드 ×{EP["EK"]} · 21~30장 골드 ×{EP["K3"]})', hdr, rows,
      [None, I0, I0, I0, I1, I1, I0, '+0', '+0', I0, I0, I0, I1], [5, 12, 12, 14, 10, 10, 12, 7, 9, 9, 10, 14, 9],
      [f'조정 전 30장까지 남는 골드 {EP["leftBefore"]:,} / 수입 {EP["incomeBefore"]:,} (59%) → 조정 후 {EP["leftRatio"]:.1%}.',
       f'결정 = 사냥 장비 전부 분해 (몹 1마리당 {EP["stonePerKill"]}개). 결정이 품질 상급에 먼저 쓰여 잠재는 거의 못 맞춘다.'])

# ---- 7) 추가사냥 ----
kpm = EP['kpm']; spk = EP['stonePerKill']
rows = []; cg = cs = cin = csin = 0
for n in range(1, 31):
    e = E0[n]; kills = e['qKills'] * 2
    cin += e['qGold'] + kills * e['gpk']; csin += kills * spk
    cg += e['enhGoldNeed'] + e['qualGold'] + e['potGold']; cs += e['qualStones'] + e['potStones']
    gpm = e['gpk'] * kpm; spm = spk * kpm
    mg = max(0, cg - cin) / gpm if gpm else 0; ms = max(0, cs - csin) / spm if spm else 0
    rows.append([n, round(cg), round(cin), round(cs), round(csin), round(mg), round(ms), round(max(mg, ms) / 60, 1)])
sheet(wb, '추가사냥', '원래 "열심히" 스펙(5장부터 최상급 3부위·잠재 3줄)까지 필요한 추가 사냥 (조정 전 골드 기준)',
      ['장', '누적 필요 골드', '누적 골드 수입', '누적 필요 결정', '누적 결정 수입', '골드 부족분 사냥(분)', '결정 부족분 사냥(분)', '더 긴 쪽(시간)'], rows,
      [None, I0, I0, I0, I0, I0, I0, I1], [5, 15, 15, 15, 15, 16, 16, 13],
      [f'분당 처치 {kpm}마리 기준. 결정 부족분이 압도적이라 이 스펙은 보통 플레이로는 닿지 않는다 → "재화로 가능한 스펙" 으로 보스를 맞춤.'])

# ---- 8) 재화_조정전 ----
hdr = ['장', '도착 레벨', '퀘스트 골드', '퀘스트 경험치', '퀘스트 처치 수', '몹 1마리 골드', '강화 목표', '최상급 부위', '유니크', '레전드', '강화 필요 골드', '품질 리롤 수', '품질 골드', '품질 결정', '잠재 리롤 수', '잠재 결정', '잠재 골드', '분당 처치']
rows = [[n, e['lv'], e['qGold'], e['qXp'], e['qKills'], e['gpk'], e['e'], e['q3'], e['uniq'], e['leg'], e['enhGoldNeed'], e['qualRerolls'], e['qualGold'], e['qualStones'], e['potRolls'], e['potStones'], e['potGold'], e['killsPerMin']]
        for n, e in sorted(E0.items())]
sheet(wb, '재화_조정전', '조정 전 장별 재화 원자료 (원래 "열심히" 스펙 기준 필요 비용)', hdr, rows, [None] + [I0] * 17, [5] + [11] * 17)

out = os.path.join(D, '밸런스_데이터_261125.xlsx')
wb.save(out); print('wrote', out)

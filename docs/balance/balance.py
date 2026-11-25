"""보스 처치 시간·직업 피해·재화 조정안 (2026-11-25, 사용자 요청)
입력: bossai_261125.json (기준 시뮬레이션) · econ_261125.json (재화)
출력: balance_preset.json (관리자 창 값 — test 에만 적용하는 버튼이 쓴다) · balance_261125.json (보고서용 계산 결과)
- 직업 피해: 허수아비 지속 DPS 의 직업 비율(장마다 4직업 평균 대비)을 중앙값으로 → 근접 두 직업(전사·도적) 평균에 맞추는 공격력 배율 st:<직업>:atk
- 보스 체력: 직업 보정 뒤 AI 보스전 DPS 로 4직업 평균 처치 시간 = 90초(보통) · 120초(5·15·25장) · 180초(10·20·30장) 이 되는 b:b<n>:hp 배율
- 재화: 그 장까지 들어온 골드(퀘스트 + 퀘스트에 필요한 사냥 × 2배) 와 나간 골드(강화·리롤) 누적 비교 → 모자라면 파밍 분, 남으면 몹 골드·퀘스트 골드를 줄이는 배율 제안
"""
import json, os, math, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
rows = [r for r in json.load(open(os.path.join(D, 'bossai_261125.json'), encoding='utf-8')) if not r.get('err')]
econ = {r['n']: r for r in json.load(open(os.path.join(D, 'econ_261125.json'), encoding='utf-8'))}
CH = ['theron', 'kallisto', 'lykos', 'mage']
by = {}
for r in rows: by.setdefault(r['n'], {})[r['ch']] = r

def mix(r, key):   # 반지 기대값 40% 섞기 (공격 쪽 값)
    k = (r.get('ring') or {}).get('off', 1)
    return r[key] * (1 + 0.4 * (k - 1))

# 1) 직업 비율 (허수아비 지속 DPS)
ratio = {c: [] for c in CH}
for n, d in by.items():
    if len(d) < 4 or any(not d[c]['dpsSus'] for c in CH): continue
    m = sum(mix(d[c], 'dpsSus') for c in CH) / 4
    for c in CH: ratio[c].append(mix(d[c], 'dpsSus') / m)
med = {c: st.median(ratio[c]) for c in CH}
target = (med['theron'] + med['lykos']) / 2
mult = {c: round(target / med[c], 2) for c in CH}

# 2) 보스 체력
def tgt(n): return 180 if n % 10 == 0 else 120 if n % 5 == 0 else 90
hp_mult, chapters = {}, []
for n in sorted(by):
    d = by[n]
    if len(d) < 4: continue
    bhp = d['theron']['bossHp']
    t_now = st.mean(bhp / max(1, mix(d[c], 'bossDps')) for c in CH)
    t_bal = st.mean(bhp / max(1, mix(d[c], 'bossDps') * mult[c]) for c in CH)
    k = tgt(n) / t_bal
    hp_mult[n] = round(k, 3)
    chapters.append({'n': n, 'target': tgt(n), 'bossHp': bhp, 'tNow': round(t_now, 1), 'tBalanced': round(t_bal, 1), 'hpMult': round(k, 3), 'newHp': round(bhp * k),
        'perClass': {c: {'sus': round(mix(d[c], 'dpsSus')), 'ult': round(mix(d[c], 'dpsUlt')), 'boss': round(mix(d[c], 'bossDps')), 'bossBal': round(mix(d[c], 'bossDps') * mult[c]),
                         'tNow': round(bhp / max(1, mix(d[c], 'bossDps')), 1), 'tNew': round(bhp * k / max(1, mix(d[c], 'bossDps') * mult[c]), 1), 'cp': d[c]['cp'], 'dtps': d[c]['dtps'], 'hp': d[c]['hp']} for c in CH},
        'lv': d['theron']['lv'], 'e': d['theron']['e'], 'pets': d['theron'].get('pets'), 'ring': (d['theron'].get('ring') or {}).get('ch')})

# 3) 재화 (누적)
eco, cumIn, cumOut, cumFarm = [], 0, 0, 0
for n in range(1, 31):
    e = econ.get(n)
    if not e: continue
    huntKills = e['qKills'] * 2   # 보통 진행: 퀘스트에 필요한 처치의 2배를 잡는다고 본다
    inc = e['qGold'] + huntKills * e['gpk']
    out = e['enhGoldNeed'] + e['qualGold'] + e['potGold']
    cumIn += inc; cumOut += out
    gpm = e['gpk'] * (e.get('killsPerMin') or 0)
    deficit = max(0, cumOut - cumIn - cumFarm * gpm) if gpm else 0
    farmMin = deficit / gpm if gpm else 0
    cumFarm += farmMin
    eco.append({'n': n, 'questGold': e['qGold'], 'huntKills': huntKills, 'goldPerKill': e['gpk'], 'killsPerMin': round(e.get('killsPerMin') or 0, 1), 'goldPerMin': round(gpm),
                'income': round(inc), 'spend': round(out), 'enh': e['enhGoldNeed'], 'qual': e['qualGold'], 'pot': e['potGold'], 'qualStones': e['qualStones'], 'potStones': e['potStones'],
                'cumIn': round(cumIn), 'cumOut': round(cumOut), 'farmMin': round(farmMin, 1), 'balance': round(cumIn + 0 - cumOut)})
surplus = [x for x in eco if x['balance'] > 0]
gold_k = None
if eco:
    tin, tout = eco[-1]['cumIn'], eco[-1]['cumOut']
    if tin > tout * 1.15: gold_k = round(max(0.3, tout * 1.05 / tin), 2)   # 수입이 지출보다 15% 넘게 많으면 수입을 지출의 105% 로 맞추는 배율

preset = {}
for c in CH: preset['st:' + c + ':atk'] = mult[c]
for n, k in hp_mult.items(): preset['b:b' + str(n) + ':hp'] = k
if gold_k: preset['goldDrop'] = round(0.5 * gold_k, 3)   # 기본 몹 골드 배율 0.5 × k
json.dump(preset, open(os.path.join(D, 'balance_preset.json'), 'w'), indent=1)
json.dump({'classMedianRatio': med, 'classMult': mult, 'chapters': chapters, 'economy': eco, 'goldK': gold_k}, open(os.path.join(D, 'balance_261125.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('class ratio', {c: round(v, 2) for c, v in med.items()}, 'mult', mult)
print('hp mult', hp_mult)
print('gold k', gold_k, 'final cumIn/out', eco[-1]['cumIn'] if eco else None, eco[-1]['cumOut'] if eco else None)

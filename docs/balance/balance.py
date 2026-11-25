"""보스 처치 시간·직업 피해·재화 조정안 (2026-11-25, 사용자 결정)
입력: bossai_aff_261125.json (재화로 가능한 스펙 + 궁수 집중 사용) · econ_plan.json
출력: balance_preset.json (관리자 창 'AI 밸런스 값 적용 (test)' 이 넣는 값) · balance_261125.json (보고서용)
- 직업 피해(스킬 피해 배율 sk:<직업>:<키>:dmg 전부 같은 값): 허수아비 지속 DPS 의 장별 비율 중앙값 → 근접(전사·도적) 평균을 1 로,
  궁수 1.10 (Shift 집중 포함), 마법사 0.90. 전투력은 그대로.
- 보스 체력(b:b<n>:hp): 직업 보정 뒤 AI 보스전 DPS 로 4직업 평균 처치 시간 = 90초(보통) · 120초(5·15·25장) · 180초(10·20·30장).
  AI 가 막혀 거의 못 때린 전투(보스전 DPS < 허수아비의 15%)는 그 장 평균에서 뺀다.
- 재화: rrGrow 1 · gold3 0.4 · enhGold 3.0 (econ_spec.py)
"""
import json, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(D, 'bossai_aff_261125.json')
rows = [r for r in json.load(open(SRC, encoding='utf-8')) if not r.get('err')]
econ = json.load(open(os.path.join(D, 'econ_plan.json'), encoding='utf-8'))
CH = ['theron', 'kallisto', 'lykos', 'mage']
TARGET = {'theron': 1.0, 'lykos': 1.0, 'kallisto': 1.10, 'mage': 0.90}
SKK = ['z', 'x', 'c', 'move', 'a', 's', 'd', 'v']
by = {}
for r in rows: by.setdefault(r['n'], {})[r['ch']] = r

RP = json.load(open(os.path.join(D, 'randpot_k.json'), encoding='utf-8'))   # 장비의 무작위 잠재(측정 때 빠져 있던 것)를 넣었을 때 공격 기대값 비율 — 공격 쪽 값에 곱한다
def mix(r, key):   # 반지 기대값 40% · 무작위 잠재 보정
    k = (r.get('ring') or {}).get('off', 1)
    rp = RP.get(str(r['n']) + ':' + r['ch'], {}).get('off', 1) if key in ('dpsSus', 'dpsUlt', 'bossDps') else 1
    return r[key] * (1 + 0.4 * (k - 1)) * rp
def stuck(r): return not r.get('bossDps') or r['bossDps'] < 0.15 * max(1, r.get('dpsSus') or 0)   # 원측정값끼리 비교

ratio = {c: [] for c in CH}
for n, d in by.items():
    if len(d) < 4 or any(not d[c].get('dpsSus') for c in CH): continue
    melee = (mix(d['theron'], 'dpsSus') + mix(d['lykos'], 'dpsSus')) / 2
    for c in CH: ratio[c].append(mix(d[c], 'dpsSus') / melee)
med = {c: st.median(ratio[c]) for c in CH}
mult = {c: round(TARGET[c] / med[c], 2) for c in CH}

def tgt(n): return 180 if n % 10 == 0 else 120 if n % 5 == 0 else 90
hp_mult, chapters = {}, []
for n in sorted(by):
    d = by[n]; bhp = next(iter(d.values()))['bossHp']
    ok = [c for c in CH if c in d and not stuck(d[c])]
    t_now = st.mean(bhp / mix(d[c], 'bossDps') for c in ok)
    t_bal = st.mean(bhp / (mix(d[c], 'bossDps') * mult[c]) for c in ok)
    k = tgt(n) / t_bal
    hp_mult[n] = round(k, 3)
    chapters.append({'n': n, 'target': tgt(n), 'bossHp': bhp, 'tNow': round(t_now, 1), 'tBalanced': round(t_bal, 1), 'hpMult': round(k, 3), 'newHp': round(bhp * k), 'excluded': [c for c in CH if c in d and c not in ok],
        'perClass': {c: {'sus': round(mix(d[c], 'dpsSus')), 'ult': round(mix(d[c], 'dpsUlt')), 'boss': round(mix(d[c], 'bossDps')), 'susBal': round(mix(d[c], 'dpsSus') * mult[c]), 'bossBal': round(mix(d[c], 'bossDps') * mult[c]),
                         'tNow': round(bhp / max(1, mix(d[c], 'bossDps')), 1), 'tNew': round(bhp * k / max(1, mix(d[c], 'bossDps') * mult[c]), 1), 'cp': d[c]['cp'], 'dtps': d[c]['dtps'], 'hp': d[c]['hp'], 'stuck': stuck(d[c])} for c in CH if c in d},
        'lv': d['theron']['lv'], 'e': d['theron']['e'], 'pets': d['theron'].get('pets'), 'ring': (d['theron'].get('ring') or {}).get('ch')})

preset = {}
for c in CH:
    for k in SKK: preset['sk:' + c + ':' + k + ':dmg'] = mult[c]
for n, k in hp_mult.items(): preset['b:b' + str(n) + ':hp'] = k
preset.update({'rrGrow': econ['B'], 'gold3': econ['K3'], 'enhGold': round(2.4 * econ['EK'], 2)})
json.dump(preset, open(os.path.join(D, 'balance_preset.json'), 'w'), indent=1)
json.dump({'classMedianRatio': med, 'classTarget': TARGET, 'classMult': mult, 'chapters': chapters, 'econ': econ}, open(os.path.join(D, 'balance_261125.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('class ratio (근접=1)', {c: round(v, 2) for c, v in med.items()}, '→ 스킬 피해 배율', mult)
print('hp mult', hp_mult)

"""검증 시뮬(bossai_verify_261125.json) 의 4직업 평균 처치 시간이 목표에서 10% 넘게 벗어난 장은 보스 체력 배율을 비례로 고친다 (처치 시간 ∝ 체력).
→ balance_preset.json 갱신 · bossai_final_261125.json (검증 행의 보스 체력을 고친 값으로, tMeas = 검증 때 측정한 평균 시간)"""
import json, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
V = [r for r in json.load(open(os.path.join(D, 'bossai_verify_261125.json'))) if not r.get('err')]
P = json.load(open(os.path.join(D, 'balance_preset.json')))
tgt = lambda n: 180 if n % 10 == 0 else 120 if n % 5 == 0 else 90
ringk = lambda x: 1 + 0.4 * (((x.get('ring') or {}).get('off', 1)) - 1)
by = {}
for r in V: by.setdefault(r['n'], {})[r['ch']] = r
fix = {}
for n, d in by.items():
    ok = [c for c in d if d[c]['bossDps'] >= 0.15 * max(1, d[c]['dpsSus'])]
    m = st.mean(d[c]['bossHp'] / max(1, d[c]['bossDps'] * ringk(d[c])) for c in ok)
    f = tgt(n) / m if abs(m / tgt(n) - 1) > 0.10 else 1.0
    fix[n] = f
    k = 'b:b' + str(n) + ':hp'; P[k] = round(P[k] * f, 3)
    for r in d.values(): r['tMeas'] = round(m, 1); r['hpFix'] = round(f, 3); r['bossHp'] = round(r['bossHp'] * f)
json.dump(P, open(os.path.join(D, 'balance_preset.json'), 'w'), indent=1)
json.dump(V, open(os.path.join(D, 'bossai_final_261125.json'), 'w'), indent=1)
print({n: round(f, 3) for n, f in fix.items() if f != 1})

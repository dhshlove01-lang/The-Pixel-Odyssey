"""재화로 가능한 스펙 (2026-11-25, 사용자 선택: "재화로 가능한 만큼만" · 결정은 그대로(지금 양이 적당, 플레이 시간) · 리롤 골드 장 비례 · 강화 +25% · 후반 골드 수입 줄이기)
입력 econ_261125.json → spec_aff.json (장마다 강화 e · 상급/최상급 부위 수 · 부위당 맞춘 잠재 줄 수) · econ_plan.json (보고서용)
가정
- 들어오는 것: 그 장 퀘스트 골드 + 퀘스트에 필요한 처치의 2배를 잡는 사냥 골드, 결정 = 그 처치에서 나온 장비를 전부 분해(일반 50%로 1개, 레어 1+1, 유니크 2+2, 레전드 15+15)
- 열심히 한 플레이어: 퀘스트에 필요한 처치의 3배를 사냥한다. 장비는 등급이 오르거나 3장마다 바꾼다(그때 그 부위 품질·잠재를 다시 맞춘다). 강화는 부위에 남는다.
- 쓰는 순서: 강화(목표 = 기준 스펙 +2, 최대 15) → 품질 상급(1회 30%) → 잠재(부위마다 1줄째 평균 6회, 2·3줄째 잠금 2·4배) → 남으면 최상급(0.5%).
- 강화 골드 = 지금 × EK(1.25), 리롤 골드 = 200 × 1.22^((아이템 레벨-1) × B), B = 1 (몹 골드와 같은 비율).
- 21~30장 퀘스트·몹 골드 × K3. K3 는 30장까지 남는 골드가 누적 수입의 10% 에 가장 가깝게.
"""
import json, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
E = {r['n']: r for r in json.load(open(os.path.join(D, 'econ_261125.json'), encoding='utf-8'))}
KPM = st.median([E[n]['killsPerMin'] for n in E if E[n].get('killsPerMin')])
GP = [0.08, 0.02, 0.004, 0.0005]
STONE_PK = GP[0] * 0.25 + GP[1] * 1 + GP[2] * 2 + GP[3] * 15
POT_LINES = [1, 1, 2, 3]
Q_ROLLS, P_ROLL = 1 / 0.30, 6
EK = 1.25   # 강화 골드 +25% (ENH_GOLD_X 2.4 → 3.0)

def grade(n, i, uniq, leg):
    return 3 if i < leg else 2 if i < uniq else (1 if n >= 2 else 0)

HUNT = 3

def plan(B, K3=1.0):
    gold = stones = 0.0; e = 0; out = []
    have = [{'g': -1, 'q': 0, 'lines': 0, 'since': 0} for _ in range(6)]   # 부위마다 지금 장비의 등급·품질(0 중급, 2 상급, 3 최상급)·맞춘 잠재 줄
    for n in range(1, 31):
        r = E[n]
        kills = r['qKills'] * HUNT
        k3 = K3 if n > 20 else 1.0
        gin = (r['qGold'] + kills * r['gpk']) * k3; sin = kills * STONE_PK
        gold += gin; stones += sin
        rr = 200 * (1.22 ** ((n - 1) * B))
        spend = 0
        def pay(cg, cs):
            nonlocal gold, stones, spend
            if gold < cg or stones < cs: return False
            gold -= cg; stones -= cs; spend += cg; return True
        target = r['e']; steps = max(1, target - (out[-1]['e'] if out else 0)); per_step = (r['enhGoldNeed'] * EK / steps) if r['enhGoldNeed'] else 0
        while e < target and (per_step == 0 or gold >= per_step):
            gold -= per_step; spend += per_step; e += 1
        if per_step == 0: e = max(e, min(target, 15))
        for i in range(6):   # 장비 바꾸기: 등급이 오르거나 3장마다
            g = grade(n, i, r['uniq'], r['leg']); H = have[i]
            if g > H['g'] or n - H['since'] >= 3: have[i] = {'g': g, 'q': 0, 'lines': 0, 'since': n}
        for i in range(6):   # 품질 상급
            if have[i]['q'] < 2 and pay(Q_ROLLS * rr, Q_ROLLS): have[i]['q'] = 2
        for i in range(6):   # 잠재 줄
            H = have[i]
            while H['lines'] < POT_LINES[H['g']]:
                m = 2 ** H['lines']
                if pay(P_ROLL * m * rr, P_ROLL * m): H['lines'] += 1
                else: break
        if all(H['lines'] >= POT_LINES[H['g']] and H['q'] >= 2 for H in have):   # 다 맞췄으면 최상급
            for H in have:
                if H['q'] < 3 and pay(200 * rr, 200): H['q'] = 3
        q2 = sum(1 for H in have if H['q'] == 2); q3 = sum(1 for H in have if H['q'] == 3)
        out.append({'n': n, 'goldIn': round(gin), 'stonesIn': round(sin, 1), 'spend': round(spend), 'goldLeft': round(gold), 'stonesLeft': round(stones, 1),
                    'rrGold': round(rr), 'e': e, 'eTarget': target, 'q2': q2, 'q3': q3, 'potLines': [H['lines'] for H in have], 'kpm': KPM})
    return out

B = 1.0
sig = lambda P: [(x['q2'], x['q3'], tuple(x['potLines']), x['e']) for x in P]
ref = plan(B, 1.0); best = (0, 1.0, 0)
for i in range(100, 4, -5):   # 스펙이 그대로인 가장 작은 K3 (줄여도 품질·잠재를 맞출 골드가 모자라지 않는 선)
    K3 = i / 100; o = plan(B, K3)
    if sig(o) != sig(ref): break
    best = (0, K3, o[-1]['goldLeft'] / sum(x['goldIn'] for x in o))
K3 = best[1]; P = plan(B, K3)
base = plan(B, 1.0)
json.dump({str(x['n']): {'e': x['e'], 'q2': x['q2'], 'q3': x['q3'], 'potLines': x['potLines']} for x in P}, open(os.path.join(D, 'spec_aff.json'), 'w'), indent=1)
json.dump({'B': B, 'EK': EK, 'K3': K3, 'leftRatio': round(best[2], 3), 'leftBefore': base[-1]['goldLeft'], 'incomeBefore': sum(x['goldIn'] for x in base), 'kpm': KPM, 'stonePerKill': STONE_PK, 'plan': P}, open(os.path.join(D, 'econ_plan.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('B', B, 'K3', K3, 'left/income', round(best[2], 3), 'income', sum(x['goldIn'] for x in P), 'left', P[-1]['goldLeft'], '| before K3: income', sum(x['goldIn'] for x in base), 'left', base[-1]['goldLeft'])
for x in P:
    if x['n'] in (1, 3, 5, 6, 8, 10, 12, 15, 18, 20, 21, 23, 25, 28, 30): print(x['n'], 'e', x['e'], '/', x['eTarget'], 'q2', x['q2'], 'q3', x['q3'], 'pot', x['potLines'], 'gold left', x['goldLeft'], 'stones left', x['stonesLeft'], 'reroll', x['rrGold'])

# 게임에서 안 쓰는 파일 (2026-11-25 조사)

**아직 지우지 않았다.** 사용자가 확인하면 정식·test 둘 다에서 지운다(test 사본 `test/assets/…` 포함).

## 조사 방법
- 실제 실행: 헤드리스 크로뮴으로 4캐릭터 × 맵 212곳 × 창 전부 × 스킬 키를 돌리며 게임이 요청한 파일 1,141개를 기록.
- 코드 대조: 파일 이름이 코드(주석 제외)에 있는지, `'skill_' + ch + …` 처럼 이름을 조합해 부르는 곳까지 확인.
- 두 쪽 다 '안 쓴다'이고, 코드를 직접 읽어 확인한 것만 아래에 올렸다.

## 지워도 되는 것 — 32개 · 약 52MB (test 사본 포함)

### ① 옛 보스 시트 1~10장 (48프레임 도트 시트 `bN_48f.png` 로 교체됨, 코드 어디에도 없음) — 9개 · 27.3MB

| 파일 | 크기 |
|---|---|
| `assets/boss/b1_lithos.png` | 1,982 KB |
| `assets/boss/b2_letheia.png` | 1,191 KB |
| `assets/boss/b3_gelos.png` | 1,437 KB |
| `assets/boss/b4_sarkos.png` | 2,021 KB |
| `assets/boss/b5_alope.png` | 1,573 KB |
| `assets/boss/b6_nykteris.png` | 940 KB |
| `assets/boss/b8_brontes.png` | 1,098 KB |
| `assets/boss/b9_oneira.png` | 1,995 KB |
| `assets/boss/b10_cheirurgos.png` | 1,111 KB |

### ② 옛 보스 시트 7장·21~30장 (코드에 '예비'로만 남음 — 새 시트 `file48` 이 항상 먼저라 실제로 안 불림) — 11개 · 23.4MB

| 파일 | 크기 |
|---|---|
| `assets/boss/b7_giant.png` | 1,921 KB |
| `assets/boss/21_Astral_Stalker.png` | 765 KB |
| `assets/boss/22_Rusted_Archangel.png` | 878 KB |
| `assets/boss/23_Mirror_Empress.png` | 917 KB |
| `assets/boss/24_Plague_Raven_Lord.png` | 887 KB |
| `assets/boss/25_Gravity_Colossus.png` | 903 KB |
| `assets/boss/26_Chrono_Archivist.png` | 1,012 KB |
| `assets/boss/27_Void_Leviathan.png` | 1,079 KB |
| `assets/boss/28_Silver_Deus.png` | 1,188 KB |
| `assets/boss/29_Blood_Eclipse_Knight.png` | 1,026 KB |
| `assets/boss/30_Astraon_Star_Devourer.png` | 861 KB |

### ③ 옛 전조 그림 (`assets/dot/` 도트판으로 교체, 코드 주석에 '예전 assets/vfx 는 쓰지 않는다') — 5개 · 0.1MB

| 파일 | 크기 |
|---|---|
| `assets/vfx/telegraph_aim_ray.png` | 3 KB |
| `assets/vfx/telegraph_ground_zone.png` | 6 KB |
| `assets/vfx/telegraph_warn_badge.png` | 2 KB |
| `assets/vfx/telegraph_dash_line.png` | 5 KB |
| `assets/vfx/telegraph_vertical_beam.png` | 13 KB |

### ④ 어디에도 안 쓰이는 그림 — 3개 · 1.1MB

| 파일 | 크기 |
|---|---|
| `assets/vfx/vfx_archer_backstep.png` | 176 KB |
| `assets/vfx/vfx_archer_rapid_barrage.png` | 185 KB |
| `assets/npc/wandering_merchant_sheet.png` | 170 KB |

### ⑤ 제작용 메모 파일 (게임이 안 읽음, 작음) — 4개 · 0.0MB

| 파일 | 크기 |
|---|---|
| `assets/maps/manifest.json` | 5 KB |
| `assets/maps/manifest_act3.json` | 6 KB |
| `assets/vfx/manifest.json` | 4 KB |
| `assets/ui/worldmap_act3_nodes.json` | 4 KB |

② 를 지울 때는 코드의 예비 경로도 같이 정리한다: `ACT3_BOSS` 의 `file:` 칸(21~30장), `S9.b7.sheet`('boss/b7_giant.png'). 지금은 새 시트가 항상 먼저라 안 불린다.

## 남겨야 하는 것 (이름이 코드에 안 보여도 쓰임)
- `assets/fonts/OFL.txt` — 폰트 라이선스 (법적으로 같이 배포해야 함)
- `assets/dot/ART_STYLE_REF_b17.png` — `ART_STYLE.md` 의 그림체 기준 그림
- `assets/skills/skill_common_*.png` — 무기 스킬 아이콘 (`'skill_common_' + 무기 스킬`)
- `assets/ui/ui_lock_open/closed.png` — 잠재 잠금 아이콘 (`ui_lock_${…}`)
- `assets/vfx/vfx_hit_*.png`, `vfx_boss_finisher.png` — 타격 이펙트 (`'vfx_' + 이름`)
- 궁극기 이펙트·상인 초상화·쁘띠 기본 그림 등 73개 — 코드에 있고 특정 상황(궁극기, 상인 등장 등)에만 불림

## 참고: 용량을 정말 줄이려면
- 파일을 지워도 **git 기록에는 남아** 저장소(`.git`, 약 300MB)는 바로 줄지 않는다. 받는 폴더 크기와 앞으로 쌓이는 양만 준다.
- 가장 큰 덩어리는 `test/assets/`(약 169MB) — `assets/` 와 거의 같은 사본이다. test 를 정식 `assets/` 를 같이 보게 바꾸면(새 그림만 test 에 두기) 사본이 사라진다. 구조 변경이라 따로 결정할 것.

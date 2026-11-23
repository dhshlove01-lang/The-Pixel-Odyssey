# 다른 PC에서 고친 내역 (원본 소스로 옮겨야 함)

이 저장소의 `index.html` / `test/index.html` 은 원래 원본 PC의 조각 파일(`10_data.js` … `59_fx.js`)을 `build.py` 로 합친 결과물이다.
원본 소스가 없는 PC에서는 결과물 html 을 **직접** 고쳤다. 아래 내역을 원본 소스에 옮기지 않고 `build.py` 를 다시 돌리면 **이 수정이 사라진다.**

## 원본 PC에서 할 일 (Claude 에게)
1. `git pull` 후 이 파일을 읽는다.
2. 아래 "옮길 것" 항목마다 커밋을 `git show <커밋>` 으로 보고, 같은 변경을 해당 조각 파일에 넣는다 (각 항목에 원래 파일명이 적혀 있다).
3. 새 그림·소리는 커밋에 들어 있는 `assets/` 경로 그대로 쓰면 된다 (art/ 원본이 따로 있으면 거기에도 넣는다).
4. `build.py` 로 다시 만든 `test/index.html` 과 지금 것을 비교해서 기능이 같은지 확인한다.
5. 옮긴 항목은 "옮김 완료"로 내리고 커밋한다.

## 옮길 것

### 261123-0901  3막(21~30장) 잡몹 40종 · 층 복도 맵 · 쁘띠 10종 · 실제 BGM 5트랙 · 장비 재료명   (대상: test/index.html)
지시서: `claude_code_act3_21_to_30_prompt.txt` (기준 ee159b2). 맵 그림 팩(maps_21_to_30_pack)은 아직 안 와서 **맵 그림·3막 월드맵 페이지는 미적용**.
- 새 파일: `test/assets/mobs/mob21_01.png`~`mob30_04.png`(40), `test/assets/pets/pet_petite_b21.png`~`b30.png`(10, b24 는 3눈 까마귀 재제작판),
  `test/assets/bgm/*.mp3`(5), `test/assets/js/act3_data.js`(생성물), `tools/gen_act3_data.ps1` + `tools/mobs_21_to_30_manifest.json`
  (지시서의 gen_act3_data.py 대신 PowerShell 판. 원본 PC에선 py 로 다시 만들어도 출력 형식 같음: ACT3_MOBS / ACT3_MOB_ROWS)
- head (build.py): pfx.js 바로 뒤 `<script src="assets/js/act3_data.js?v=…">`
- 10_data.js: `const CH_LAST = 30;` 을 CH_COUNT 바로 아래로 옮김 (56z_act3.js 의 선언은 지우고 주석만)
- 10c_mobs.js: MOB_REG 바로 아래 `for (const n in (window.ACT3_MOB_ROWS || {})) MOB_REG[n] = …`
- 10_data.js(아이템): MATERIAL 30칸으로 (11~20 '명성', 21~30 성좌·녹청·거울·역병·중력·태엽·공허·백은·월식·아스트라),
  itemName 의 `Math.min(10, ilvl)` → `Math.min(MATERIAL.length - 1, ilvl)` (11~20 은 이름 그대로). itemSell/Buy 의 min(10) 은 안 건드림
- 13_sprites.js: SPRITE_SRC 바로 아래 `registerAct3Mobs()` (512 시트 4x4, 첫 프레임만 src+sheet:1)
- 56g(맵 그림): map9Load 의 `n > CH_COUNT` → `n > CH_LAST`
- 56f 쁘띠: `PET_SOUL_RE = /^b(?:[1-9]|[12][0-9]|30)$/`
- 월드맵: wmZoneLock / wmDetail 의 `k === 3` → `k === Z.length - 1`, wmDetail 의 `zi < 3` → `zi < Z.length - 1`
- 56z_act3.js:
  - `ACT3_THEME` 추가, act3Maps 에서 층마다 `c{n}_field`(층 복도, w 2400, 몹 11마리: 01×4 02×3 03×3 04×1) 추가.
    캠프 포탈 `p_arena` → `p_field`(복도로). **p_up(아래층) 은 지시서와 달리 남김** — 지우면 계단참에서 걸어서 내려갈 길이 없어짐.
    보스방 p_back → 복도. CHAPTERS[n].a/b = 복도. wmZones(3막) = [캠프, 복도, 보스방]
  - map9Now/loadMap 오버라이드: 자기 그림(ch21_field.png …) 우선, **로드 실패하면 예전처럼 ACT3_ART 빌린 그림**, 둘 다 없으면 코드 그림.
    ACT3_ART 는 폴백용으로 남김. drawMap9 에 `ACT3_GROUND_FIX` (지면 세로 보정, 지금은 빈 표 — 그림 보고 한 장씩 채울 것)
  - `act3Mobs()`: MON[mob21_01…] 생성. grown:1 (growBodies 1.35배 건너뜀), h = suggest_h, w = R.w·h/(R.h·1.35)(지시서 식),
    근접 사거리만 손으로 ×1.35 (growBodies 가 1~20장 근접몹에 주던 것과 같게). 정예는 makeEliteDef 후 h 되돌리고 w×1.1
- 60_audio.js: setMusic 바로 아래 BGM 블록(BGM_FILES/bgmPick/bgmApply/bgmStop/bgmLoad/bgmPrefetch, setMusic 감쌈),
  applyMusic 끝 드론 음소거, startMusic 끝 `bgmApply(AU.want)`, musicTick 첫 줄 `if (BGM.on) { MUS.t = …; return; }`.
  1~20장으로 내려가거나 파일 실패 시 MUS.cur=null → applyMusic 으로 신스 복귀
- 검증(로컬 dev): 21~30 각 층 복도에 그 층 4종 11마리, 40시트 512 로드, 21장 근접 4,340/15,031 · 원거리 6,009/17,763 · 돌진 7,678/21,863 (지시서 표와 같음),
  정예는 표값×2.4 / ×1.5 (makeEliteDef), BGM tower/celestial/eclipse/astraon 전환, 20장 복귀 시 신스, 1~20장 회귀 이상 없음.
  밸런스 시뮬(win9h.js/bosssim)과 트로피 상한(35번)은 원본 PC 도구가 없어 못 함.
- 남은 것(맵 팩 오면): assets/maps/ch21~30_*.png, worldmap_act3_bg.png, 월드맵 2페이지(지시서 4-6, Q/E 키), 지면 보정

### 261123-0909  정식 배포 (test → 루트) + 새 소식 261123a
- 56f_news(새 소식): NEWS.id '261122a' → '261123a'. 성탑 항목 문구에서 "사냥터와 … 나중에" → "의뢰는 나중에",
  그 아래 3줄 추가(성탑 복도 · 성탑의 노래 · 성탑의 장비와 쁘띠). 기존 261122a 항목은 그대로 (정식 사용자는 아직 못 봤음)
- 루트 index.html = test/index.html 에서 `<meta name="robots" content="noindex">` 와 `<script>window.DEV_TOOLS = 1;</script>` 만 뺀 것
  (build.py 가 정식/테스트를 만들 때와 같은 차이). 루트 assets/ = test/assets/ 와 같게 맞춤.
  → 정식에 이전 테스트 전용이던 3막 보스 21~30(a489190)·아레나 소품 팩(ee159b2)도 함께 나감

### 261123-0930  3막 맵 그림 20장 + 월드맵 3막 페이지 + 튜토리얼·알림 아이디당 한 번   (대상: test/index.html)
- 새 파일: `test/assets/maps/ch21_field.png`~`ch30_boss.png`(20), `test/assets/maps/manifest_act3.json`(팩의 manifest.json —
  기존 1~20 manifest.json 을 덮지 않으려고 이름만 바꿈, 게임은 둘 다 안 읽음), `test/assets/ui/worldmap_act3_bg.png`, `worldmap_act3_nodes.json`
- 맵 그림: 코드 변경 없음 (261123-0901 의 "자기 그림 우선" 로더가 그대로 집어감). ACT3_GROUND_FIX 는 아직 빈 표
  (화면이 작아 눈으로 못 맞춤. 1~20장처럼 1:1). ground_y 가 480 과 먼 그림: 25·28 field 442, 30 boss 448, 27 boss 449, 28 boss 505
- 월드맵 (55x_worldmap 계열, 지시서 4-6):
  - WM.page 0/1, WM.img2 = ui/worldmap_act3_bg.png. wmDraw: 페이지별 배경·노드(page 1 = `WM_ACT3_XY`, 56z_act3.js 에 상수),
    page 1 은 머리띠와 범례 사이(위 12%~ 높이 79%)에 그림, 노드 반지름 max(9, h*0.028), 길은 층 사이 짧은 직선, 라벨은 왼쪽 우선(30장 오른쪽)
  - 막 배지: page 0 의 3막 배지(▶, 0.78/0.13)를 누르면 page 1, page 1 왼쪽 위 '◀ 1막 · 2막 지도' 로 돌아옴. WM.pageHit
  - 머리띠: small 에 id="wmSub"(페이지별 문구), 버튼 `1–20` / `21–30`(#wmPg0/#wmPg1). wmPageUi()/wmPage(p) 추가
  - 열 때 `WM.page = G.map.ch > CH_COUNT ? 1 : 0`
  - KEY_ACTIONS: `['메뉴','m_wm_prev','전체 맵 이전 페이지',['KeyQ']]`, `['메뉴','m_wm_next','전체 맵 다음 페이지',['KeyE']]`
    (지시서의 wm_prev/wm_next 대신 m_ 접두: m_ 이어야 전투 입력으로 안 들어감). 키 스위치에 WM.open 일 때만 페이지 넘김
  - 56z_act3.js: WM_ACTS 3막 색 '112,204,194', x 0.78. 오른쪽 끝 성탑 노드(WM_XY.push) 삭제, `WM_ACT3_XY` 추가
- 튜토리얼·알림 아이디당 한 번 (사용자 요청):
  - 56h_guide(STEP 4 GUIDE): `acctSeen()` 추가 — G.store.seen (아이디 저장소, 클라우드 동기화). 처음 만들 때 모든 슬롯의 flags tut_*/news_* 를 모음.
    tutSeen = 아이디 목록 또는 캐릭터 flag, tutMark = 둘 다 기록
  - 56f_news: newsShow 조건에 `acctSeen()['news_' + NEWS.id]`, 닫을 때 거기에도 기록
  - 장 도입 이야기(seenCh)는 캐릭터별 그대로

### 261123-0957  업데이트 확인을 더 빨리 + 정식 배포
- 56e(업데이트 강제 새로고침): `setTimeout(updCheck, 8000)` → `1500` (배포 직후 10분 캐시로 옛 html 을 받은 사람이 로그인 전에 넘어가게)
- 루트 = test 에서 noindex · DEV_TOOLS 두 줄만 뺀 것

### 261123-0932  정식 배포 (test → 루트, 위 0930 내용)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것, 루트 assets/ = test/assets/

<!-- 형식:
### yymmdd-hhmm  한 줄 제목   (커밋 abc1234, 대상: test/index.html)
- 원래 파일: 32_skills.js (배너 "SKILLS: awakening skills…")
- 바꾼 것: 무엇을 왜, 함수/상수 이름
- 새 파일: test/assets/…
-->

## 옮김 완료
(아직 없음)

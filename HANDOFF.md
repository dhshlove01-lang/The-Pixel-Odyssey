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

### 261123-1352  도적 이동 프레임 크기를 대기·공격과 맞춤   (대상: test/index.html, 정식 미배포)
- 도적 48f 시트의 이동 8-21 은 대기·공격보다 작은 배율로 그려져 있음 (머리 폭 35 vs 42~47, 두건·갑옷도 같은 비율)
- 새 상수 `HERO48_GROW = { lykos: { k: 1.2, f: 8..21 } }` (HERO48_MIRROR 아래), hero48Fix 에서 반전 다음·축 측정 전에
  그 칸을 발밑(셀 x 160, 지면 292) 기준 1.2배로 다시 그림 (부드럽게 확대, 셀 밖으로 안 나감 확인). 확대 후 머리 폭 41~43
- 대기는 쪼그린 자세라 키가 작게 남는 게 맞음 (달리기 약 182 vs 대기 140~152). **원본 PC에서 시트 그림을 다시 뽑으면 GROW 비우기**

### 261123-1345  정식 배포 (test → 루트: 1345 걷기 보정)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것. 새 그림 없음

### 261123-1345  주인공 48f 걷기 보정: 도적 좌우 뒤집힘 · 몸통 흔들림 · 다리 속도   (대상: test/index.html)
증상: 걸을 때 도적이 좌우를 번갈아 봄, 네 직업 모두 걷는 모양이 어색함. 원인과 고친 것 (48f 블록, hero48Load 아래):
- 도적 시트 이동 15-21 은 그림이 왼쪽을 봄 → `HERO48_MIRROR = { lykos: [15..21] }`, 새 `hero48Fix(ch, im)` 가 시트를 캔버스에 옮기며 그 칸만 좌우 반전.
  프레임 번호는 그대로라 다른 사람 화면(netF)도 같게 보임. **원본 PC에서 시트 그림 자체를 고쳐도 됨** (그러면 MIRROR 비우기)
- 대기·이동 0-21 의 몸통이 셀 안에서 프레임마다 다른 자리 → hero48Fix 가 셀 y 120-230 줄마다 가장 긴 불투명 구간의 가운데를 재서
  중앙값을 그 프레임 ax 로 (공격·사망 22-47 은 160 그대로). 캔버스 실패 시 원래 그림·축 160
- hero48Load: fr 의 img/ax 를 hero48Fix 결과로
- HERO48_ANIM runK 2.5(초당 30장, 다리가 미끄러질 만큼 빠름) → 보폭 실측으로 theron 1.7 · kallisto 1.55 · lykos 1.45 · mage 1.6 (초당 18~21장)
- HERO48_ANIM 에 `bob: 0`, heroPose(40_render 첫 정의) 걷기 줄: `A.bob === 0` 이면 sy=sx=1 (48f 는 그림에 들썩임이 있어 프레임마다 찌그러뜨리던 것 끔)

### 261123-1335  정식 배포 (test → 루트: 1321·1335 내용 — 3막 의뢰, 48프레임, 멀티 QA, 거래)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것, 루트 assets/ = test/assets/ (boss 48f 30장, heroes 48f 4장, ui 6개)
- Firebase 규칙: 사용자가 trade/tradereq (+dev_, local_) 게시함 (2026-11-23)

### 261123-1335  거래 실제 검증 후 고친 것 3가지   (대상: test/index.html, 정식 미배포)
Firebase 규칙에 trade/tradereq (dev_, local_ 포함) 게시 후 테스트 계정 둘로 실제 교환·취소·새로고침 확인. 그 과정에서 고침:
- TRADE_DONE 키에 아이디 포함 ('dr-trade-done:<id>:<tid>'): 한 PC 두 계정이 같은 저장소를 써서 한쪽 적용이 다른 쪽을 건너뛰게 했음
- 수락하면 에스크로에 ok:1, 에스크로에 side 저장. 시작 때 trEscrowRestore 대신 tradeRecover(): 서버에서 그 거래를 읽어
  양쪽 수락이면 상대 물건 받기, 아니면 내 칸 먼저 철회 후 되돌리기, 서버에 못 닿고 내가 수락했으면 에스크로 유지(다음 시작 때 재시도)
- tradeEnd: 서버에서 먼저 철회한 뒤 되돌리기, 요청자(a)는 거래 노드 통째로 삭제
- tradeNode: 상대 칸이 한 번 보였다가 사라지면 '○○님이 거래를 취소했다' 로 끝내고 되돌리기 (전엔 '상대를 기다리는 중' 에 멈춤)

### 261123-1321  3막 의뢰 · 주인공/보스 48프레임 · 멀티 QA 12항목   (대상: test/index.html, 정식 미배포)
지시서: claude_code_act3_worldmap_quests_48f_prompt.txt, claude_code_multi_qa_12_prompt.txt. 원본 PC에서는 각 조각 파일로 옮길 것.
- 3막 의뢰(56z_act3.js): 지시서 §2 블록(ACT3_W, ACT3_Q, buildAct3Story)을 그대로 'world map' 주석 앞에. 캠프에 hal(네스토르) 추가,
  복도 p_boss 문 req = chArenaOpen(n) || boss 플래그, lockT. wmGo 보스 규칙 = chArenaOpen 또는 이미 잡은 층. NEWS 문구 '의뢰는 나중에' → '층마다 네스토르의…'.
  **10_data/11_chapters: chMaps(n) 가 21~30장이면 CHAPTERS[n] 의 실제 맵(camp / c21_field / arena)을 돌려주게** (지시서 빌더가 chMaps 를 쓰는데 3막 복도는 c21_field)
- 주인공 48f: 지시서 §3-B 그대로 (HERO48 표·hero48Load 를 remRopeFrame 다음에, heroPose deadMs/idle%/runK, MAGE_SEQ 가드, startGame·drawHeroSprite 에서 로드).
  test/assets/heroes/hero_{theron,kallisto,lykos,mage}_48f.png. 무기 강화 빛은 사용자 동의로 꺼짐
- 보스 48f: 지시서 §3-A 그대로 (cutBossSheet 8x6, BOSS_SHEET_BASE 전부 240, BS48+gridIndex, moveN/idleN, cell9 CELL9_MAP, COL 래퍼, MUZZLE={},
  BOSS_SHEET_FILE b7·b11~b20, ACT3_BOSS.file48 + 등록 줄, 폴백 3곳, GIANT_CELLS 블록 삭제, newsIcon giant).
  test/assets/boss: b1~b10 같은 이름으로 덮어씀(옛 4x4 는 git 에), b11~b30_48f.png 새로
- QA P4: PARTY_XP_BONUS 0.15 (58_share gainXp 훅), bossDie 에 보스 처치 경험치(퀘스트 XP 절반, b._xpGiven, 변수 이름 qx — 함수 안 qid 와 겹쳐서)
- QA P6: 도적 Z dur [0.17,0.17,0.27] (실측 3.83 → 4.67회/초, 지시서 목표 4.9 미달 — 60fps 반올림)
- QA P7: onewayUnder(p) 추가, 점프 블록에서 ↓면 언제나 아래로 (p.drop 0.28, vy≥90)
- QA P8: POT_TIERS/potTier, potLine 색 (상 금 / 중 파 / 하 회)
- QA P9: **사용자 결정으로 안 함** (월드맵 야영지·보스 두 버튼 유지)
- QA P10: 궁수 S 덫 y = remGround, 래퍼에서 tr.x/y = 박스 발밑, drawSkillFx 옛 타원은 tr.rem 이면 건너뜀
- QA P11: sideFields p_side 가 기록석·다른 포탈과 90px 이상 (c13_b/c14_b 1950→1870, c15_b/c16_b 2000→2080)
- QA P12: AU.vol, VOL_KEY/loadVol/saveVol/applyVol, musGain·sfxBus 초기값, toggleMusic·musicHush 의 MUS_VOL → AU.vol.mus,
  'audio' 패널(audioHtml, #panel input 리스너), 키 설정 첫 줄 '소리 설정 열기', #bMus/#bMute 우클릭, 도움말 B/U/M 문구
- QA P3: NET_HZ 6/8/10, rec.vx(+s), 즉시 전송 조건(24px·방향·멈춤/출발·점프·캐스트), 수신 보간 지연 0.7step+40+지터×2 · 200ms 외삽
  (실측: 야영지 지연 ~670ms → ~390ms 중앙값, 끊김 프레임 77 → 16 / 164; 남은 ~200ms 는 서버 왕복)
- QA P5: netCast/NET_SKFX/netCastFx, startAct·castSkill(쿨다운 변화 시)·startUlt 래퍼, 수신은 netTick peers 루프 (연출만)
- QA P2: netBossDamage 호스트도 집계, fid 리셋 2곳, 게스트 d 에 n/c/l, 새 판에 r 지움, 게스트가 raid.r 보면 G.mvpPending, bossDie 래퍼 → netMvpHost, #mvp 팝업
- QA P1: netPlayerAt, #game contextmenu → #netmenu(거래 요청/파티 초대), 롱프레스, 거래(TR, tradereq/trade 노드, 잠금·에스크로·수락·복구).
  **지시서와 다름: 양쪽 다 수락해야 교환, 수락 뒤 잠금 해제 불가** (한쪽 수락 즉시 받으면 복사 틈이 생김).
  거래 요청은 전용 trReq/trGet (거부되면 거래만 막고 토스트 1번, 받은함 폴링 거부는 조용히). ptyReq 를 쓰면 파티·채팅이 통째로 꺼졌음
  (규칙 게시 후 실제 교환 검증 완료 — 아래 위쪽 항목 참고)
- test/assets/ui: ui_icon_trade/party/mvp_crown/bgm_note/sfx_speaker.png, ui_panel_dark_gold.png (9-slice 48)

### 261123-1104  정식 배포 (test → 루트: 1102·1104 가방 창 버튼)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것

### 261123-1104  자동 장착 버튼 한 줄   (대상: test/index.html)
- P15 invWin: 작은 줄을 '전투력 +N' 만 (몇 칸은 뺌, 툴팁에는 그대로). CSS .ubtn.auto: flex-direction row, gap 12, nowrap, 글씨 17/14
  (두 줄일 때 좁은 화면에서 위아래로 버튼 밖으로 나왔음)

### 261123-1102  가방 창 아래 버튼 3개(닫기·자동 장착·등급순)를 창 안으로   (대상: test/index.html)
- invWin(가방): 닫기 mp(744,691,860,727) · 등급순 mp(1196,691,1322,727), 클래스 `ubtn bagb`. 그림의 회색 받침 두 개가 아래 테두리를
  뚫고 그려져 있어서 `<i class="artfix bagstrip">` 2개로 덮음 — 같은 그림(UIART.inventory)의 x 900 / 1000 같은 줄을 배경으로 복사
  (mp(764,684,868,748), mp(1188,684,1292,748))
- 자동 장착(P15 invWin 감싸기): mp(868,691,1188,727), 글씨 16/12, 테두리 2. 끼워 넣는 정규식을 `class="ubtn[^"]*"` 로 (등급순 클래스가 바뀌어서)
- CSS: .bagstrip(배경 그림·크기), .ubtn.bagb(자동 장착과 같은 회색 면)

### 261123-1058  정식 배포 (test → 루트: 1043·1055·1058 내용)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것

### 261123-1058  재설정 탭: 품질·잠재 버튼 정렬, 200골드 표시   (대상: test/index.html)
- rerollWin: 두 버튼 `sgo half hl` / `sgo half hr`, 경계 x 353(가운데). CSS: hl 은 왼쪽, hr 은 오른쪽 안쪽 44 art px (빨간 버튼 양 끝 불꽃을 피해 글자가 대칭으로),
  hl 의 border-left 없앰. 작은 줄(.ten)을 영어 대신 1회 비용 `결정 N · 200골드`
- 오른쪽 아래 정보 칸: '필요 결정 5·10' → 동전 + REROLL_GOLD, 캡션 '1회 골드'(모자라면 빨간 글씨). 안내문: '1회에 품질은 결정 N개 + 200골드, 잠재는 …'

### 261123-1055  월드맵 비율·이름판 통일, 대장간 창 글씨·버튼, 재설정 200골드   (대상: test/index.html)
- 55x_worldmap (wmDraw):
  - 크기 하한 제거: 1~20장 동그라미 `max(6, h*0.024)`(예전 max(9,..)*1.5 → 좁은 화면에서 커 보였음), 라벨·배지 글씨 하한 9/8px → 6px.
    클릭 판정은 최소 반지름 12px 유지
  - 3막 이름판: 열 층 모두 같은 글씨·폭·높이(가장 긴 이름 + '◎ 현재 위치' 폭, 가장 낮은 층(21) 높이에 맞춤), 탑 가운데 정렬,
    제목 왼쪽·상태 오른쪽 끝, 한 줄(줄바꿈·잘림 없음). FS/PW/PH 를 프레임마다 한 번 계산
  - 머리띠: 한 줄 고정(#wmHead nowrap, 현재 위치는 넘치면 …), .wmx nowrap. 범례: 가운데·한 줄, 좁으면(@container ≤760px) 안내 문구 숨김
- 52_uiwin (픽셀 창 공통 CSS): 글씨 크기를 `--mf` 로. #uiwin 에 `--mf:var(--m)`(PC: 창 그림과 같은 비율),
  `.frame.touch #uiwin{--mf:max(var(--m),0.5714px)}`(터치: 모든 글씨에 같은 하한). 예전 `max(8px,calc(var(--m)*N))` 21곳과
  `calc(var(--m)*N)` 글씨 26곳을 모두 `calc(var(--mf)*N)` 로 — 좁은 화면에서 작은 글씨가 큰 글씨보다 커지고 칸을 넘치던 것 해결
- 대장간(smithWin / rerollWin / disWin):
  - 아래 골드 칸 `ubar flat` → `ubar flat c`(가운데)
  - 닫기·장비 창 버튼에 `bred` / `bblu` 클래스: 그림 속 버튼 가운데 남은 지운 글자 자국(색 다른 네모)을 버튼 색 면으로 덮음
    (CSS: padding 5/5/6 art px 안쪽, background-clip content-box, 빨강 #963f33→#702137 / 파랑 #3275a7→#294d88)
  - `<i class="artfix">` 2개: 그림에 남은 스크롤 화살표(▲, 강화 횟수 칸 위) 덮기
- 55_reroll: `REROLL_GOLD = 200`, rerollCost 의 gold 를 고정 200 으로(예전 120 × 장별 골드 곡선). 연금 결정 비용은 그대로

### 261123-1043  월드맵: 길 선 없앰, 호버 이동 버튼, 동그라미 1.5배, 성탑은 층이 버튼   (대상: test/index.html)
- 55x_worldmap: wmDraw 를 새로 씀 (예전 wmDraw 를 통째로 교체).
  - 노란 길(Catmull-Rom 선, 성탑 층 사이 선) 그리기 삭제
  - 1~20장: 동그라미 반지름 max(9, h*0.016) × 1.5. 호버 시 1.15배(부드럽게), 누르면 180ms 동안 살짝 들어갔다 나옴
  - 3막 페이지: 동그라미 없음. `WM_ACT3_FLOORS`(탑 안쪽 x 0.312~0.686, 층별 y 구간 — 그림에서 측정)로 층마다 버튼 영역,
    층 가운데에 'CH.nn · 제목' 이름판 + 상태(✓ 클리어 / ◎ 현재 위치 / 잠김). 호버 시 그 층 그림을 1.035배로 다시 그려 떠오르게, 누르면 들어갔다 나옴
  - 호버(터치는 첫 탭) → `#wmPop` 버튼 2개(야영지로 가기 / 보스로 가기). 동그라미·층을 클릭하면 야영지로 이동.
    이동 규칙 `wmGo(n, kind)`: 열린 장 + 야영지에 있을 때만, 보스는 1~20 chArenaOpen / 3막은 열린 층이면 됨. 안 되면 버튼 꺼짐(title 에 이유)
  - 새 함수: wmGo, wmHitAt, wmPopPlace, wmPopShow, wmPopHide, wmPopHideSoon, wmPress. WM.hov / WM.pop / WM.sc / WM.press
  - wmBuild: #wmPop 요소·CSS, 캔버스 click/mousemove/mouseleave 를 새 규칙으로 (지도에서 장 상세창 wmDetail 은 더 안 엶),
    범례를 선 모양 → 동그라미 상태로, toggleWorldMap 닫을 때·wmPage 에서 팝업 닫기

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

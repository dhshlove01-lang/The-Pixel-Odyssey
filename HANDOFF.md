# 작업 기록 (HANDOFF)

**2026-11-25 사용자 결정: 원본 PC 의 조각 파일(`10_data.js` … `61_patch1123.js`)과 `build.py` 는 은퇴했다.**
이제 이 저장소의 `test/index.html`(→ "정식 배포" 때 `index.html`)이 **진짜 원본**이다. 코드는 여기서 직접 고친다.
- **원본 PC 에서 `build.py` 를 다시 돌리지 말 것.** 돌리면 11/23 이후의 모든 수정(도트 리뉴얼·특성 창·마스터 콘솔·음향 …)이 옛 조각으로 덮여 사라진다.
- 아래 항목들은 이제 "옮길 것"이 아니라 **무엇을 왜 바꿨는지의 기록**이다. 새 작업도 맨 위에 같은 형식으로 쌓는다.
  각 항목의 "원래 파일: …js" 메모는 예전 조각 이름일 뿐, 지금 고칠 곳은 `test/index.html` 안의 같은 함수·블록이다.
- 작업 규칙은 `CLAUDE.md`.

## 작업 기록 (최근 것이 위)

### ▶ 지금 진행 중 (다른 계정·다른 Claude 가 이어받을 곳) — 2026-11-25
- 마스터 콘솔 1·2단계 끝. 2단계(261125-1330)는 **test 에만** — 사용자가 "정식 배포" 하면 `tools/deploy.py promote`.
- 정식 = **261125-1500**, test = **261125-1630** (1510 assets 공용 · 1530 관리자 같은 값·내역 · 1600/1630 사용자 피드백 9가지) (test 가 정식 assets/ 를 같이 쓰게 바꾼 것뿐 — 정식에 옮길 코드 없음).
- 원본 PC 조각·build.py **은퇴**(2026-11-25 사용자 결정) — 옮기기 작업 없음, 이 저장소 html 이 원본.
- git 기록 정리(.git 약 300MB)는 이제 해도 된다(옮길 일이 없으니 예전 커밋이 필요 없다). 단 main 을 force push 해야 하므로 사용자 확인 후에만.
- **밸런스 분석 (2026-11-25)**: `docs/balance/스펙_밸런스_261125.html` (공개 페이지 https://claude.ai/artifact/Jg16Sk7g2RFuAcsH6j1LEC, 소유자만 열림) + 원자료 json·측정 스크립트(`docs/balance/*.js`, 로컬 http 서버 8765 에서 node 로 실행). 핵심: 11장부터 보스 과다 단단함(기준 세팅 11장 8분·30장 97분), 장 난이도·권장 전투력이 레벨 239·계승 5회를 가정(실제 150·2회), 치명 확률 15장쯤 100% 로 넘침, Z 특성 압도, 전투력에 각성·보스 피해 거의 안 잡힘. 고칠 순서는 페이지 맨 아래. 사용자가 어떤 것부터 고칠지 정하면 test 에 먼저.
- 사용자가 나중에 하기로 한 것: 도트 그림체 남은 4가지(아래 8차 배치 "남은 것"), 새 소리 파일 추가. 정식 = test (test 전용 두 줄만 다름). 다음 작업은 사용자 지시 대기.
- 검증용 네트워크: 이 계정의 환경 `The-Pixel-Odyssey`(Firebase DB·로그인·github.io 허용)를 고르면 Claude 가 규칙·실사이트를 직접 확인할 수 있다. 관리자 쓰기 확인은 사용자가 직접(비밀번호는 Claude 가 모른다).
- 새 전투 기능을 만들면 `mcSkT`/`mcStT` 처럼 `tuneAdd` 로 등록하고 ⚔ 전투 탭(g: `combatSk`·`combatSt`·`combat`)에 뜨게 한다.
- 사용자 지시(계속 지킬 것): ①모든 새 기능을 마스터 콘솔에도(`CLAUDE.md`) ②UI 는 가장 쓰기 쉽게 ③수정은 test 먼저, "정식 배포" 때만 promote ④작업마다 커밋·푸시(main 직접 푸시 허락됨) ⑤비밀번호는 저장소에 적지 않는다.
- 관리자 = `admin0215`·`admin2016`·`admin2017` (2016·2017 은 261125-1410 에서 추가 — 사용자가 규칙 재게시 + 두 아이디 회원가입 필요). Firebase 규칙은 `tools/firebase-rules.json` 이 전체본(48경로) — 사용자가 2026-11-25 게시 완료. 로그인 없이 검증: 공개 읽기(tuning·notice·event) 200, 아무나 쓰기 7곳 401, tuning_log·mail 읽기 401, 기존 경로 그대로.

### 261125-1630  사용자 피드백 9가지 — 29장 달·검기 · 맵 리젠·보스 문 · 몹 몰림 · 창 밖 진행 · 1장 클리어 흐름 · 그림 가이드 · 쁘띠 · 특성 Lv1   (대상: `test/index.html` · 새 `assets/ui/guide/*.webp` 14장 · 새 `tools/guide_shots.js` · `tools/guide_webp.py`)
- **29장 달**: `drawMoon29` 가 `drawMap9` 과 같은 확대(MAP9_PAR)·패럴랙스로 배경 그림 속 달 자리(`MOON29_BG` = 960×540 에서 중심 485,113 · 반지름 74)를 계산해 항상 겹친다(배경 그림 없으면 예전 자리).
- **초승달 검기**: `drawPixb` 가 회전을 되돌려 그리므로 오른쪽을 향한 `pcres` 가 왼쪽으로 날 때도 그대로였다 → `PIXB_FACE`(pcres)는 날아가는 쪽으로 뒤집는다(29장 핏빛 초승달·15장·다른 초승달 전부).
- **몹 오른쪽 몰림**: `genField` 스폰 x 를 `total` 로 나눴는데 [S6-2] 잡몹 1.5배 뒤로 실제 마릿수는 1.5배 → 1/3 이 오른쪽 벽에 쌓였다. `order.length` 로 나눈다. B 맵 두 번째 정예 0.78 → 0.38.
- **보스 앞 방(gate) 리젠**: `updateSpawns` 의 `if (G.map.gate) return` → `G.gateMode !== 'regen'` 일 때만. 묶음 1 `loadMap` 래핑: 같은 장의 사냥터·앞 방에서 포탈로 걸어 들어왔고 이미 깬 방이면 'regen', 그 밖(이동 창·안 깬 방)은 'once'. 깬 방 다시 오면 비우던 P3 코드는 뺐다. **야영지의 보스 문(포탈 → gate/boss) 삭제.**
- **창 밖 진행**: 묶음 2 `bgRun` — 숨으면 Web Worker 타이머(50ms)로 깨어나 흐른 시간만큼 `step()`(최대 5초/300 step), 보이면 `frame` 이 이어받음. 숨을 때 `netLeave` 하던 리스너 제거(멀티 접속 유지). 소리는 숨으면 꺼진 채. Alt 조합 keydown/keyup preventDefault(입력칸·Alt+Tab·Alt+F4 제외).
- **1장 클리어 흐름**: 묶음 3 — [S6-4] 로 보스 퀘스트가 보고 전(s=2)이어도 다음 장으로 쳐서 네스토르(hal)가 다음 장 야영지에 섰다. `pendingBossCh()` 가 있으면 그 장 야영지에 남는다(`visibleNpcs` 재정의).
- **그림 가이드**: `TUT` 14개(새: interact ↑ 줍기·말 걸기, trait 특성, travel 깬 보스 순간이동 / pet 문구 바꿈), `TUT_FIRST` = 이동·공격·전조·↑·특성. 카드·가이드북에 `tutImg(id)` = `assets/ui/guide/<id>.webp`(카드 680u, 가이드북은 글 → 키 → 그림). 그림은 `tools/guide_shots.js`(로컬 http 8765 에서 장면을 만들어 찍음) → `tools/guide_webp.py`(폭 720 webp). **새 가이드는 SHOTS 에 장면을 더해 같은 방법으로.**
- **쁘띠**: 묶음 4 — 쁘띠 도감에 하나라도 있으면(1장 보스 첫 처치) `flags.pet` 을 켜고 쁘띠 가이드. 깬 보스가 있고 야영지에 있으면 travel 가이드. 2레벨 이상인데 특성 가이드를 못 본 캐릭터에게 특성 가이드.
- **특성 포인트 Lv1부터**: `newSave` tp 1·`tpL1`, 옛 저장은 한 번 +1(`tpL1` 없으면), `TR_BAL.tpMax` = 150, 관리자 레벨 설정 tp = L − 사용.
- 패치노트 `NEWS.id '261125g'` 카드 8항목. `GAME_VER '261125-1630'`, `test/version.json` 동기. 정식은 1500.
- 검증(로컬 헤드리스): 29장 달 카메라 왼끝·가운데·오른끝 모두 배경 달 위 · pcres 왼쪽/오른쪽 · 스폰 5등분 289/989/1013/1053/432(전엔 231/783/857/887/1018) · gate 안 깬 방 once·깬 방 걸어서 regen(24→0→23)·야영지에서 once · 5초 숨김 → 게임 시간 +5.02초·버프 −5.02초·몹 이동, 다시 보이면 두 번 안 돎 · 네스토르 1장 turnin · 새 캐릭 tp 1, 옛 캐릭 29→30(한 번만) · 첫 쁘띠 → 해금+가이드 · `pageerror 0`, 404 0.

### 261125-1530  관리자끼리 같은 test 수치 보기 + 📜 변경 내역 (누가·언제·무엇을·전→후)   (대상: `test/index.html` 마스터 콘솔 블록 · `tools/firebase-rules.json`)
지시: 사용자 2026-11-25 "test 계정에서 수정하면 다른 계정에서도 그 수정된 수치로 표기되고, 어떤 게 변경됐는지 누가 변경했는지 내역이 보여야 함".
- **같은 값**: test 에서 15초마다 `dev_tuning` 을 읽어 `at` 이 내 것보다 새로우면 적용(저장 대기 중이면 건너뜀) — 아래 줄에 "○○ 가 바꾼 값으로 맞췄다". `tuneLoad` 가 `savedAt`·`savedBy` 를 기억.
- **덮어쓰기 방지**: `tuneSaveSoon` 이 서버 최신 `dev_tuning` 을 먼저 읽고 **내가 바꾼 키(`TUNE.touchSave`)만** 덮어쓴다 → 두 관리자가 동시에 다른 항목을 바꿔도 둘 다 남는다. 남이 바꾼 값은 바로 내 화면에도 적용.
- **내역**: `mcLog(e)` → `admin_log`(dev_ 안 붙는 공용 경로, 관리자만) 에 `{at, by, kind, target, summary, changes:[{k,from,to}]}`.
  - test 수치: `mcTouch` 가 바꾸기 직전 값을 기억, 저장 뒤 4초 묶어서 한 건(`mcFlushLog`). 전부 기본값·정식 값 가져오기도 `mcTouchAll` 로 기록.
  - 정식 적용·되돌리기(`mcShipTo`), 공지 올림/내림, 이벤트 걸기/끝내기, 우편 보내기/취소(🛠 운영) 도 기록.
  - 📜 내역 탭(`mcLogHtml`, 10칸·창 580px): 최근 100건, 전체/test 수치/정식 적용/운영 거르기, 펼치면 항목별 "전 → 후"(이름·단위는 tuneShow), test 수치 건은 "이 변경 전 값으로 되돌리기". 아래 줄에 마지막 저장자·시각.
- 규칙: `admin_log`, `local_admin_log` 추가(50경로) — **사용자가 규칙을 다시 붙여넣어야 내역이 저장된다.**
- 검증(로컬 가짜 Firebase 서버 + 브라우저 두 개, admin0215 / admin2016): A 경험치 ×2 · B 거의 동시에 보스 ×1.5 → 둘 다 남음, B 는 저장 즉시·A 는 15초 안에 같은 값, 내역 4건(test 수치 2 · 정식 적용 1(전→후 2개) · 공지 1) 누가 했는지 포함, `pageerror 0`.
- `GAME_VER '261125-1530'`, `test/version.json` 동기. 정식은 1500.

### 261125-1510  test 가 정식 assets/ 를 같이 쓴다 — test/assets 사본(약 142MB, 1,237개) 삭제   (대상: `test/index.html` · `tools/deploy.py` · `CLAUDE.md` · `test/assets/` 삭제)
지시: 사용자 2026-11-25 "하면 좋은 작업 2번(저장소 용량 줄이기)".
- `test/assets/` 는 `assets/` 와 파일이 전부 같았다(assets 에만 `dot/ART_STYLE_REF_b17.png`). 지우고 test 페이지 머리에 `<base href="../">` 를 넣어 모든 상대 경로(그림·소리·assets/js·폰트)가 정식 `assets/` 를 가리키게 했다.
- `<base>` 때문에 test 의 업데이트 확인 `fetch('version.json…')` 은 `fetch('test/version.json…')` 로 (게임 안에서 assets 말고 상대 경로를 쓰는 곳은 이것 하나뿐이었다).
- `tools/deploy.py` 를 test 전용 줄 목록(`TEST_ONLY`: noindex+base · DEV_TOOLS · test/version.json) 방식으로 바꿨다. `to_main` 은 예전 test 모양도 알아본다. `promote` 는 이제 그림을 복사하지 않는다. `check` 는 `test/assets/` 가 다시 생기면 막는다.
- **새 규칙**: 새 그림·소리는 `assets/` 에 새 이름으로(정식 코드가 아직 안 부름). 정식이 쓰는 파일은 덮어쓰지 말고 `_v2` 같은 새 이름. (CLAUDE.md)
- (원본 PC 조각·build.py 는 이후 은퇴 — 바꿀 필요 없음.)
- 검증(로컬 헤드리스): `/test/` 에서 그림 요청 627개 전부 `/assets/…`, `/test/` 아래로 가는 요청은 페이지와 `test/version.json` 뿐, 보스방 7곳 시트 ok, 404 0, `pageerror 0`, `document.baseURI` = 루트.
- `GAME_VER '261125-1510'`(test 만, 열려 있던 test 페이지가 새로 고쳐지게), 정식은 1500 그대로.

### 261125-1500  마스터 콘솔 4단계 — 🔊 음향 탭: 효과음 69가지 크기·다른 소리로 바꾸기 + 장마다 사냥터·보스전 배경음 고르기   (대상: `test/index.html`)
지시: 사용자 2026-11-25 "각 모션·맵·이펙트·효과음 등 모든 음향을 바꿀 수 있게".
- **새 조각 (원본 PC: `59b_combat.js` 뒤 `59c_sound.js`)** — 맨 끝 `/* ============ 마스터 콘솔 4단계` 블록.
  - `MC_SFX_INFO`: 게임이 `sfx('이름')` 으로 부르는 69가지 전부에 [분류, 한국어 이름] (전투·움직임·스킬·보스·아이템·알림·화면). **새 효과음 이름을 만들면 여기 한 줄 더한다.**
  - 키 `sfx:<이름>:vol`(0 = 끔, 최대 3배) · `sfx:<이름>:src`(0 = 원래, k = `MC_SFX[k-1]` 소리로). `sfx` 를 맨 바깥에서 감싸고, 크기는 그 한 번만 지나가는 GainNode 를 `AU.sfxBus` 자리에 잠깐 끼운다(tone·noise·bellSound·playSample 이 부르는 순간 AU.sfxBus 를 읽음).
  - 키 `bgm:<장>:field|boss` — 0 원래 · 1~30 그 장의 음악 · 31~35 mp3(`MC_BGM_MP3`: tower·celestial·boss·eclipse·astraon). `setMusic` 래핑(보스전 = key fight/boss/boss1/tower), mp3 는 `bgmPick` 래핑으로 강제(`MCS.force`). 배경음 값이 바뀌면 `tuneApply` 래핑이 지금 음악을 다시 고른다.
  - `tuneShow` 가 `d.fmt` 를 쓰게 해 정식 적용 차이표에 "골드 줍기 소리로", "탑 사냥터 (mp3)" 처럼 이름으로 보인다.
  - UI `mcSound()`: 🔊 음향 탭(9칸, 창 540px) — 위 배경음(장 고르기 ●, 사냥터·야영지/보스전 고르기, ▶ 들어보기, ■ 지금 맵 음악으로), 아래 효과음 분류별(크기 슬라이더·▶ 듣기·↺·다른 소리 고르기), 찾기·바꾼 것만.
- 한계: 보스별 전용 합성음(`bossSfx`)은 `slam/beam/rock/erupt/whoosh/boom` 이름 단위로만 바뀐다. 새 소리 파일(mp3·wav)은 저장소에 넣어야 목록에 생긴다(사용자가 파일을 주면 Claude 가 `MC_BGM_MP3`/`SFX_FILES` 에 추가).
- 검증(로컬 헤드리스, tone 호출 감시): 점프(260Hz) → 골드 줍기 소리(1320·1780Hz) · 크기 2배 → 별도 Gain 2 · 0 → 소리 없음 · 되돌리면 원래 + 버스 원상복구 · 2장 사냥터 → 5장 음악(AU.want.ch 5) · 3장 보스전 → tower mp3 · 기본값이면 원래 · `pageerror 0`(정식·test).
- `GAME_VER '261125-1500'`, 정식 배포 완료(1430 과 함께).

### 261125-1430  마스터 콘솔: 스토리 건너뛰기에 이동기·쁘띠·반지 + 반지 받기 + 장비 품질·잠재 직접 고르기   (대상: `test/index.html` 마스터 콘솔 블록)
지시: 사용자 2026-11-25 "스토리 넘기면 test 에서 이동기 못 배우고, 반지도 따로 먹어야 함. 잠재도 장비마다 품질이랑 선택 가능하게".
- 원인: 관리자 창 "이 장까지 이야기 진행"(`devAct('story')`)은 퀘스트를 끝낸 것으로만 찍고, 퀘스트를 보고할 때 붙는 `Q.unlock`(4장 `mobility` = Shift 이동기, 3장 `pet` = 쁘띠)을 실행하지 않았다.
- `devAct` 래핑 → `mcUnlocks(true)`: 끝난 퀘스트의 unlock 을 적용 + 건너뛴 장의 보스 반지(10·20·30장, 없을 때만 가방에) + `buildSkills()`. 진행도 칸에 "이동기·쁘띠 바로 열기" 버튼.
- 내 캐릭터 탭: 반지 칸(10·20·30장 받기 / 바로 끼기, `makeRing`·`equipItem`), **장비 품질·잠재** 칸 `mcGearHtml` — 끼고 있는 7칸(6부위 + 반지)마다 품질(하급~최상급 `it.q`)·잠재 줄마다 옵션(그 칸의 `POT_BY_SLOT` 풀)·수치(최대 = 범위 끝 ×(1+등급×0.25)) + "잠재 전부 최대치", 위에 "한 번에" (품질 + 잠재 옵션 → 모든 장비). 바꾸면 `refreshStats`·`writeSave`.
- 검증(로컬): 25장까지 건너뛰기 → 이동기 질주·쁘띠·10/20장 반지 · 30장 반지 바로 끼기 · 한 번에 최상급+공격력 → 7칸 전부 q3·공격력 14×3 · 무기 1줄 치명타 피해 28, 투구 하급 · `pageerror 0`.
- `GAME_VER '261125-1430'`, `test/version.json` 동기. 정식은 1410.

### 261125-1410  보스 클리어 창 404 정리 + 관리자 2명 추가   (대상: `test/index.html` · `tools/firebase-rules.json` · `tools/firebase-admin.md`)
- **보스 클리어 창** (원래 파일: 보스 처치 연출 조각, `CLEAR_IMG` / `drawClearPop`): 없는 그림 `assets/ui/boss_clear_screen.png` 를 매번 요청해 404 가 나던 것 → `const CLEAR_IMG = { bad: true }` 로 요청을 없애고, 이미 있던 코드로 그린 도트 창(금테·BOSS CLEAR·이름·처치 시간·다음 안내)을 정식 디자인으로 쓴다. 사용자 확인: "1번(요청만 지우기)".
- **관리자 3명**: `MC_ADMIN_IDS = ['admin0215', 'admin2016', 'admin2017']`, 규칙의 관리자 조건을 세 계정 중 하나(`acct/<id>/uid` OR, local_ 도 같게) 19곳. 서버 확인 시 admin2016·2017 은 아직 미가입.
- 검증(로컬): 보스방 7곳 404 **0**(전에는 boss_clear_screen 1개), `pageerror 0`, 규칙 JSON 유효.
- `GAME_VER '261125-1410'`, 정식 배포까지 완료(2026-11-25, `tools/deploy.py promote`). 사용자가 3인 관리자 규칙 게시 완료.

### 261125-1400 정식 배포 (마스터 콘솔 2·3단계 — 운영 탭 받는 쪽 + 전투 수치)   (대상: `index.html` · `version.json`)
- `tools/deploy.py promote` — 정식 = test 1400. 정식에는 관리자 창이 없고(IS_DEV_BUILD false), 공지·이벤트·우편 받기(`notice`·`event`·`mail/{id}`)와 전투 수치(`tuning`)만 돈다.
- 검증(로컬 헤드리스): 정식 dev=false·관리자 창 없음·정식 세이브 키, 1·7·10·17·21·25·30장 보스 시트·체력 test 와 같음, 특성 창 넘침 0, `pageerror 0`.

### 261125-1400  마스터 콘솔 3단계 — ⚔ 전투 탭: 스킬별 피해·재사용 대기·지속 시간 · 캐릭터 능력치 · 가드·피격 · 물약·주문서 · 몹 난이도 · 특성 효과·비용 · 궁극기 연출   (대상: `test/index.html`)
지시: 사용자 2026-11-25 "스킬 데미지·쿨타임·지속 시간 등 전투 관련, 더 추가할 건 물어보고" → 답: 스킬마다 따로 + 기본 능력치 · 가드·회피 · 물약·주문서 · 몹 난이도 · 특성 단계 효과 · 특성 포인트 비용 · 궁극기 연출 시간.
- **새 조각 (원본 PC: `59_ops.js` 뒤 `59b_combat.js`)** — `test/index.html` 맨 끝 `/* ============ 마스터 콘솔 3단계` 블록. 등록 286개(전투 154개 추가).
  - 스킬(캐릭터 4 × Z·X·C·Shift·A·S·D·V): 키 `sk:<char>:<key>:dmg|cd|dur`. 지금 스킬은 `startAct`(z·x·c·shift)·`castSkill`(a·s·d·v) 래핑으로 `MCB.cur` 에 기억.
    - 피해: `dealDamage` 래핑 — `p.act.skill` 또는 `p.act.id`(z·x·c), 없으면 5초 안에 마지막으로 쓴 스킬(화살·장판).
    - 재사용 대기: `updatePlayer` 앞뒤로 `p.cd` 를 비교해 새로 찬 칸(x·c·s=Shift·ka·ks·kd·kv)에 배율, `cdMax` 는 그 값으로(HUD 비율용, 누적 곱셈 없음).
    - 지속 시간: 스킬 쓰기 전·후 `atkBuff·critBuff·haste·focus·stealth·shieldT·ambushT` 가 늘어난 만큼 × 배율, A·S·D·V 로 새로 생긴 `G.traps[].life` ×.
  - 능력치(캐릭터별 `st:<char>:atk|hp|def|crit|aspd|spd|jump`): `calcStats` 래핑. crit 은 %p 더하기, aspd·spd·jump 는 (100+값)×배율−100. 수치가 바뀌면 `tuneApply` 래핑이 `refreshStats()`.
  - 가드·피격: `GUARD_WIN·GUARD_CD·GUARD_STUN` let 으로(+`G.player.cdMax.g`), 맞은 뒤 무적 `hurtInv`(hurtPlayer 래핑, 기본 0.9초일 때 건드리지 않음).
  - 물약·주문서: `POTION_HEAL·POTION_CD·POTION_MAX·SCROLL_MAX·SCROLL_CAST` let 으로.
  - 몹(보스 제외): 체력 `makeMon` 래핑, 피해 `hurtPlayer` 래핑(보스전 중엔 안 곱함, 1e8 이상 즉사 명령 제외), 행동 속도 `updateMon(m, dt×k)`, 엘리트 체력·피해·골드 추가 배율(엘리트는 맵에 정해진 자리 — 무작위 등장률 없음). **1단계의 `eliteLoot`(ELITE_MUL.loot) 은 게임 시작 때만 읽혀 효과가 없어 지웠다.**
  - 특성: `tDmg`·`tCd` let 으로 바꾸고 `TRT` 값으로 재정의, `freshMul`·`freshCd`·`traitTotals`(특성 창 누적 숫자) 재정의. 비용 `trC1~3`(바꾸면 모든 특성 ranks[].cost 를 1~5/6~10/11~15 칸 단위로, 기본값이면 원래 비용 복원 + `TR_BAL` 다시 계산), 레벨업당 포인트 `tpLv`(gainXp 래핑, 앞으로 오르는 레벨부터).
  - 궁극기: `ULT9`/`ULT12` 표의 `invul` ×, `ms`·`hits[].at` × (원래 값을 저장해 두고 곱한다).
  - UI: `MC_TABS` 에 ⚔ 전투(8칸, 창 500px) — `mcCombat()`: 캐릭터 고르기(● 바꾼 캐릭터) → 능력치·궁극기 → 스킬 8개 → 공통(가드·물약·몹·특성).
- 검증(로컬 헤드리스): X 피해 ×3 → 평균 2.98배, Z 는 1.00배 그대로 · A 재사용 ×0.5 → 8초가 4초 · S 지속 ×2 → 전장의 함성 8→16초 · 공격력 ×2/체력 ×1.5 → G.stats 그대로 반영 · 몹 체력 ×2 · 특성 4단계 +50% → 5단계 누적 30%→65% · 궁극기 연출 ×2 → ms 2배 · 전부 기본값으로 되돌리면 원래 값 · `pageerror 0`.
- `GAME_VER '261125-1400'`, `test/version.json` 동기. 정식은 1300 그대로.

### 261125-1330  마스터 콘솔 2단계 — 🛠 운영 탭(전체 공지 · 기간 이벤트 · 유저 우편 지급/회수 + 개인 공지 · 접속자/파티) + 허수아비 DPS   (대상: `test/index.html` · `tools/firebase-rules.json`)
- **새 조각 (원본 PC: `58_master.js` 뒤 `59_ops.js`)** — `test/index.html` 맨 끝 `/* ============ 마스터 콘솔 2단계` 블록.
  - 받는 쪽(정식·test 둘 다): `OPS` · `opsPoll()`(시작 1.5초 뒤 + 기본 60초마다, 간격은 tuneAdd `opsPoll`) → `notice`·`event` 읽기(누구나), 로그인했으면 `mail/{myId()}` 읽기 → 안 받은 우편은 **먼저 `…/done` 에 시각을 PUT 해서 성공해야** `opsApplyMail` 로 지금 캐릭터에 적용(두 번 받기 방지, `s.mailDone` 에도 id 기록) → `opsPop` 팝업(제목·안내문·＋/－ 목록).
  - 화면 맨 위 `#opsBar`: 공지 띠(✕로 닫기) + 이벤트 띠(배율·남은 시간).
  - 이벤트 배율: `evK('xp'|'gold'|'drop')` — `gainXp` ×, `dropLoot` 동안 `GOLD_DROP_X` ×, `rollGrade(r / k)` 로 장비 드롭 확률 ×k. 시작~끝 시각은 `srvNow()` 기준.
  - 우편 내용: `give`/`take` 에 골드·품질석·잠재석·계승석·무료 변경권·연고·주문서·특성 포인트, `give.gear=[{grade,n,ilvl}]`(makeItem, 레전드는 q3), `take.gear={grade:n}`(가방에서, 장착·잠금 제외). 회수는 가진 만큼만.
  - 허수아비: `dummySpawn(def)`(G.gimT 에 `dummy:true` 표적, 방어력 0 또는 N장 보스와 같게), `hitEntity` 래핑으로 총 피해·타수·치명·최고 한 방·첫 타~마지막 타 시간 → `#dpsBox` 에 DPS. 그림은 `drawBoxes` 래핑(월드 좌표). 맵 옮기면 치움. `G.devNoSpawn` 이면 `spawnMon` 이 몹을 안 낸다(훈련장).
  - 보내는 쪽(`IS_DEV_BUILD`): `window.mcOps`/`window.opsAct` — 마스터 콘솔 `MC_TABS` 에 🛠 운영 탭, `masterAct` 가 `ops:` 로 넘긴다. 보낼 서버 정식/test 토글(`dbUrlRaw` / `dbUrl`), 모든 전송은 확인 창. 우편은 받는 아이디를 `acct/` 로 먼저 확인, 보낸 우편 20개·받음/대기·취소.
  - 빠른 도구 탭에 허수아비 칸(방어력 고르기 · 세우기 · 치우기 · 몹 안 나오게).
- 규칙(`tools/firebase-rules.json`, 48경로): `notice`/`event`(읽기 누구나, 쓰기 admin0215), `mail/$id`(읽기 본인·관리자, 쓰기 관리자, `$mid/done` 만 본인) × 정식·dev_·local_.
- 검증(로컬 헤드리스): 로드 `pageerror 0`(정식·test) · 이벤트 경험치 ×2 → gainXp(10)=20, 드롭 ×4 → 레전드 20만 번 중 72.5→약 300 · 공지·이벤트 띠 표시 · 우편 적용(골드 +5000, 품질석 +3, 특성 +2, 레전드 2개, 잠재석 -10→가진 5만) 팝업 · 허수아비 21타 4,895 피해 722 DPS 치명 10% · 몹 안 나오게. **실서버(공지·이벤트·우편 전송, 접속자 목록)는 이 환경에서 Firebase 에 못 붙어 미검증.**
- `GAME_VER '261125-1330'`, `test/version.json` 동기. 정식은 1300 그대로.

### 261125-1300 정식 배포 + 관리자 admin0215 + 안 쓰는 파일 64개 삭제   (대상: `index.html` · `version.json` · `test/index.html` · `assets/` · `test/assets/` · 새 `tools/firebase-rules.json`)
- **정식 배포**: `tools/deploy.py promote` — 정식 = test 1300 (특성 창 남은 포인트 + 마스터 콘솔 코드). 정식은 `IS_DEV_BUILD` 가 false 라 관리자 창 없음, `tuning` 만 읽는다.
- **관리자 판정 바꿈** (마스터 콘솔 블록 `mcCheckAdmin`): `admins/{uid}` 대신 `MC_ADMIN_IDS = ['admin0215']` + 서버 `acct/admin0215` 의 uid 가 로그인 uid 와 같은지. 규칙도 같은 식(`tools/firebase-rules.json`: 사용자가 준 기존 34경로 그대로 + `tuning`·`dev_tuning`·`local_tuning`·`tuning_log`·`local_tuning_log`).
- **삭제** (`tools/unused_assets.md` 의 32개 × 정식·test = 64개, 약 52MB): 옛 보스 시트 `assets/boss/b{1-6,8-10}_이름.png`·`b7_giant.png`·`21_Astral_Stalker.png`~`30_Astraon_Star_Devourer.png`, 옛 전조 `assets/vfx/telegraph_*.png` 5개, `vfx_archer_backstep/rapid_barrage.png`, `npc/wandering_merchant_sheet.png`, 메모 json 4개.
  - 코드에서 예비 경로도 뺐다(원본 PC 조각에도 옮길 것): `ACT3_BOSS` 21~30 의 `file: 'NN_….png'` 칸 삭제 + `BOSS_SHEET_FILE[id] = 'boss/' + A.file48`, `S9.b7` 의 `sheet: 'boss/b7_giant.png'` 삭제.
- 검증(정식·test 각각, 헤드리스 크로뮴): 1·7·10·17·21·25·30장 보스방 시트 로드 ok, 보스 체력 두 페이지 같음, 특성 창 넘침 0, 정식 dev=false·관리자 창 없음·정식 세이브 키, test dev=true·관리자 창 열림, `pageerror 0`. 404 는 예전부터 없던 `ui/boss_clear_screen.png` 하나뿐.

### 261125-1300  마스터 콘솔 1단계 — 수치 조절(TUNE) · 새 관리자 창 UI · test 저장 · 정식 적용 · 기록/되돌리기 · 테스트 도구   (대상: `test/index.html` · 새 `tools/firebase-admin.md` · `CLAUDE.md`)
지시: 사용자 2026-11-25 "test 서버 전용 권한으로 보스 데미지·스킬 속도, 랜덤 오브젝트 소환, 모든 랜덤 확률까지 설정 → 저장 → 정식에 적용 버튼", "가장 쓰기 쉬운 UI", "앞으로 추가되는 기능도 계속 마스터 권한에".

- **새 조각 (원본 PC: `57_dev.js` 뒤, 맨 끝에 새 조각 `58_master.js` 로 두면 된다)** — `test/index.html` 맨 끝 `/* ============ 마스터 콘솔 (2026-11-25, user)` 블록 전체.
  - `TUNE` + `tuneAdd(def)` 등록부(132개): 경제·강화(경험치·몹 골드·상점·떠돌이 상인 가격, 강화 골드·장인의 기운·+0~+14 성공률, 치명타 배율), 확률·드롭(일반~레전드 드롭률, 반지, 엘리트 보상, 상자 확률·대기·4등급 비중, 제단 확률·대기, 이름 없는 자 확률·대기·제한 시간), 보스(전체 배율·10장 단위 배율·행동 속도 + 30보스 각각 체력·피해·행동 속도).
  - 거는 곳: `gainXp`·`potionPrice`·`scrollPrice`·`MER_GOODS[].p` 래핑, `applyBossBalance` 재정의(보스별 hp/atk 배율 곱), `updateBoss` 래핑(dt × 행동 속도), `merTick` 래핑(소환 상인 15분), `startGame` 래핑(들어올 때 tuning 다시 읽기).
  - 서버: `dbUrlRaw()`(dev_ 안 붙는 경로) · `tuneLoad()`(test=`dev_tuning`, 정식=`tuning`, 정식은 5분마다) · 바꾸면 0.7초 뒤 `dev_tuning` 자동 저장 · 정식 적용 = `tuning` PUT + `tuning_log` POST {before, after} · 기록에서 "이 적용 전으로" = before 를 다시 PUT · 관리자 = `admins/{AUTH.fuid}` === true. fetch 8초 타임아웃.
  - UI(`IS_DEV_BUILD` 에서만): `devHtml`/`devRender` 재정의 — 460px 창, 탭 6개(⚡빠른 도구 · 🧑내 캐릭터 · 👹보스 · 🎲확률·드롭 · 💰경제·강화 · 🚀정식 적용), 수치 탭은 찾기칸·"바꾼 것만"·슬라이더+숫자칸·기본값·↺, 바꾼 줄은 금색 테두리, 아래 줄에 저장 상태·바꾼 수 · 전부 기본값. 정식 적용 탭은 test↔정식 차이 표, 확인 창, 적용 기록 20개.
  - 빠른 도구: 이동(장·맵·보스방), 소환(상자 무작위/등급별, 축복의 제단, 떠돌이 상인 15분, 이름 없는 자, 장별 몹 1/5/10, 몹 전부 없애기), 게임 속도 0.25~3배(`G.devSpeed` — `G.timeScale` 은 게임 슬로 모션이 매 프레임 덮어써서 따로 둠), 전투 토글(무적·한 방·쿨 없음·히트박스·디버그).
  - 내 캐릭터: 레벨·재화·장비(기존 버튼), 세이브 스냅샷 3칸(이 기기 `pxo-dev-snap:N`), 진행도(이 장까지 이야기·보스 처치 기록 지우기·일일 의뢰 새로·튜토리얼 다시).
- **기존 코드 바꾼 곳** (원래 파일 → 바꾼 것):
  - `const` → `let`: `CRIT_MULT`, `GAUGE_RATE`, `ENH_GOLD_X`, `GOLD_DROP_X`, `potionPrice`, `scrollPrice`(10_data/11_balance 쪽), `ANON_CHANCE, ANON_GAP, ANON_TIME`(이름 없는 자 블록), `BOX_CHANCE, BOX_CD, SHRINE_CHANCE, SHRINE_CD`(상자·제단 블록).
  - `frame()`: `acc += dt` → `acc += dt * (G.devSpeed || 1)`.
  - 떠돌이 상인 블록: `merOn` 에 `G.devMerT > 0 ||`, `merLeftMin` 에 devMerT 분기, `merSetHour` 의 `MER.map = G.devMerT > 0 && G.devMerMap ? G.devMerMap : g.map`.
  - `57_dev.js` 1초 다시 그리기: 빠른 도구·내 캐릭터 탭에서만 (`DEV.tab` 조건).
- **검증(헤드리스 크로뮴, 로컬)**: 로드 `pageerror 0` · 경험치 2배 → gainXp(10) 이 20 · 강화 +0 성공률 50 · "강화" 찾기 17줄 · 1장 보스 체력 2배 → 보스방 mhp 3740→7480 · 기본값일 때 정식과 보스 수치 동일(3740, atkMul 1.463) · 사냥터에서 신화 상자·무작위 상자·제단·상인(merHere true)·몹 5마리·이름 없는 자 소환 · 속도 2배 · 스냅샷 저장→골드 바꿈→불러오기로 복구. 서버 저장·정식 적용은 이 환경에서 Firebase 에 못 붙어 **실서버 미검증** (사용자 확인 필요).
- `GAME_VER '261125-1300'`, `test/version.json` 동기. 패치노트 카드는 없음(관리자 기능이라 유저에게 안 보임). 정식 `index.html` 은 그대로 1200.

### 261125-1230  test 서버 관리자 권한 복구 + test 먼저 배포 규칙 + 특성 창 남은 포인트 위로   (대상: `test/index.html` · `test/version.json` · 새 `tools/deploy.py` · 새 `CLAUDE.md`. **정식 `index.html` 은 그대로 261125-1200**)
지시: 사용자 2026-11-25 "test 서버 들어가도 기존 서버랑 똑같다 — 테스트 전용 권한·테스트 캐릭터가 사라짐", "특성창 남은 포인트가 스크롤 내려야 보임".

- **test 권한이 사라진 원인** — 6차 배치(`3aaf661`)부터 `cp index.html test/index.html` 로 test 를 정식과 바이트 동일하게 만들면서, test 에만 있던 두 줄이 지워졌다:
  `<meta name="robots" content="noindex">`(머리) · `<script>window.DEV_TOOLS = 1;</script>`(`<body>` 바로 뒤). 이 플래그가 `IS_DEV_BUILD` 를 켜야 F9 관리자 창, 서버 `dev_` 경로(`dbPath`), 로컬 `dev-` 세이브 키(`DEVK`)가 동작한다. 그래서 test 에 들어가도 정식 세이브가 보이고 관리자 창이 없었다. 두 줄을 복구했다(test 캐릭터는 `dev_` 데이터에 그대로 남아 있으므로 다시 보인다).
  - 원본 PC 의 `build.py` 는 dev.html 을 만들 때 이 두 줄을 넣는다(5차 이전 test 와 같은 모양). **원본 소스에는 옮길 코드 없음** — 규칙만 지키면 된다.
- **배포 규칙 바꿈** — 수정은 test 에만 → 사용자가 test 에서 확인 → "정식 배포" 할 때만 `python3 tools/deploy.py promote`(두 줄 빼고 `index.html`·`version.json`·바뀐 `test/assets` 를 정식으로). `check` 는 두 줄 유무·test 가 앞서 있는지·정식에 안 간 그림 수를 보고. 규칙은 `CLAUDE.md` 에도 적었다.
- **특성 창 남은 포인트** (원래 파일: 특성 창 6카드판 `traitsHtml` 재정의 — 배너 "특성 창: 여섯 카드 + 카드마다 \"누적\" 줄", 같은 블록의 `<style>`)
  - 맨 아래 `.tfoot`(남은 포인트 · 특성 초기화)를 없애고 합계 줄 `.tsum` 을 `.tsum.tsum6` flex 로: 왼쪽 `.tsl` 합계, 오른쪽 `.tsr` 「남은 포인트 **N**」+ `특성 초기화 (무료)` 버튼(`data-reset` 그대로, 위임 핸들러 13456 그대로 동작). 안 쓰게 된 `const total` 삭제.
  - 같은 `<style>` 끝에 여백 축소: `#pBox:has(.t6c) .tsum6` margin, `.tcols.t6c` gap 8u, `.tcard.t6` padding 6u/10u, `.rks .rk` padding 1u, `max-height:440px` 에서 더 줄임.
  - 측정(헤드리스 크로뮴): 고치기 전 1280×720 에서 `#pBox` 가 50px 넘쳐 남은 포인트가 화면 밖(아래 729px). 고친 뒤 4캐릭터(테론·칼리스토·리코스·마법사) × 1280×720 / 844×390 모두 넘침 0, 남은 포인트 y≈185(PC)/72(휴대폰). 올리기·초기화 클릭 정상, `pageerror 0`.
  - `GAME_VER '261125-1230'`, `NEWS.id '261125f'` + `versions[0]` 카드 1항목, `test/version.json` = `{"v": "261125-1230"}`. 정식은 1200 그대로(사용자가 "정식 배포" 하면 promote).

### 261125-1200  8차(최종) 배치 · 3막(21~30장) 스킬 VFX 60장 도트화 + 벡터 탄·안내 라벨 도트화   (대상: `assets/vfx/boss_21~30` 60장 · `index.html` / `test/index.html` 의 `dotLabel`·`PROJ_DRAW` 8종·`drawProjs` 기본탄 분기·`PIXB` 신규 5종+`orbPixelCanvas`·`drawPixb` 옵션)   
지시서: 2026-11-25 10:29 예약 배치 "8차(최종) 배치: 3막 VFX 60장·남은 탄환 도트화·배포·메일 발송".

- **3막 스킬 VFX 60장(21~30장 × 6종) 도트체 리뉴얼** — `assets/vfx/boss_21/b21_s1_starlight_dagger_fan.png` … `boss_30/b30_s6_final_supernova.png` (같은 파일명 덮어쓰기, `test/assets/vfx/` 사본 동일).
  - 원본은 `downloads/vfx_4frames_pack_21_30/boss_21~30`(4프레임 가로 스트립, 파일 해시가 저장소 HEAD 와 일치함을 `git hash-object` 로 확인).
  - 파이프라인은 6·7차와 같다: `work/dot8/vfx_dot8.py`(6차 `vfx_dot.py` 복사, SRC/OUT/장 범위만 변경) — 4프레임 분할 → 알파 4×4 베이어 디더 이진화(0/255) → 블록 4px 다운스케일 → **프레임 4장 공용 16색 팔레트** → NEAREST ×4.
  - 검증(`work/dot8/verify8.py` → `work/dot8/report_verify.json`): 전 60장 **알파 0/255**, 프레임 네 칸 모두 가장자리 접촉 0(잘림 없음), 픽셀 면적 보존 1.003~1.034배, 색 16 이하.
  - 다시 만들 때: `python3 work/dot8/vfx_dot8.py` → `work/dot8/out/boss_NN/` → 복사. 장별 전/후는 `work/dot8/prev/boss_NN.png`, 통합본 `downloads/batch8_vfx_preview.png`.
- **벡터 탄 → 도트 탄 (#16)** — `PROJ_DRAW` 의 손그림 8종을 `drawPixb` 맵으로 교체: `knife`→`pknife`(회전), `wisp`→`pwispG`(녹색 신규), `spit`→`pacid`, `syringe`→`psyr`, `boulder`→`prock`(sc6), `batp`→`pbat`, `heart`→`pheart`(박동 스케일), `tag`→`ptag`. 모양·색·크기는 원래 탄과 같게 맞췄다.
- **기본탄 → 도트 탄 (#17)** — `drawProjs` 의 `bolt`→`pboltA`, `pbolt`→`pboltB`(sc = q.w/13, 2~6), `fire`→`pfire`(sc4+glow), `arrow`→`parrow`, `dagger`→`pknife`(spin 24, 독은 픽셀 점 3개), `orb`→`orbPixelCanvas(q.col)`(색마다 캔버스 1회 생성, 9×9 맵), `shock`→`pshockA`. 판정·피해·수명은 그대로(그리기만 교체).
- **`drawPixb` 확장(다른 탄에 영향 없음)** — `q.cv`(직접 만든 캔버스), `q.flipX`(진행 방향으로 뒤집기), `q.cv` 일 때 기본 배율 3.
- **안내 라벨 → Galmuri 13px + 다크 배지 (#11)** — 새 `dotLabel(c, text, x, y, col)` 하나로 통일: 1px 모서리를 자른 어두운 판(테두리 1px 회색) + `700 13px Galmuri`. 적용한 곳은 `TELE_DRAW.bell`("충격파 세 번"), `TELE_DRAW.chainLo/chainHi`("낮은/높은 사슬…"), `drawBossExtras` 박쥐 띠("낮은/높은 박쥐 떼…"), `drawTelegraphs` gaze 2곳("뛰어오르거나 발판 위로!"). 예전 `Noto Sans KR 14px` 텍스트는 이 배지로 바뀌었다.
- **#18 `PIXB` 코드 픽셀탄 32종은 그대로** — 이미 도트맵이므로 손대지 않았다(색도 보스 색과 맞춰져 있음). 감사 보고서의 "색만 통일 검토"는 이번에 하지 않음.
- `GAME_VER '261125-1200'`, `NEWS.id '261125e'` + `versions[0]` 카드(4항목), `version.json` / `test/version.json` = `{"v": "261125-1200"}`, `test/index.html` 은 `index.html` 과 **바이트 동일**(`cp`).
- **검증(헤드리스 크로뮴 1280×720 · deviceScaleFactor 2)**: 로컬 http 에서 21~30장 보스방마다 스트립 6종 로드(`naturalWidth>0`)·스킬 6종씩 60회 캐스트, `pageerror 0`. 도트 탄 15종·라벨 배지는 게임 함수(`drawProjs`·`dotLabel`)를 그대로 불러 캔버스에 그려 4·6배 확대 확인. 증거 `handoffs/🎨-8차-최종-배치-3막-vfx-60장-남은-탄환-도트화-배포-메일-발송/evidence/`.
- **메모**: 이 PC 의 체크아웃은 sparse 라 `assets/vfx/boss_21~30` 이 처음엔 작업 트리에 없었다(저장소에는 있음, 7차 메모와 같은 상황). `git status` 에 `M` 으로 60장이 잡히면 정상. `git sparse-checkout add` 는 sparse 밖에 만든 tracked 파일을 지울 수 있으니 **reapply 하지 말 것**. 로컬 QA 에 Galmuri 폰트가 필요하면 `git sparse-checkout add assets/fonts`.
- **남은 것**: ①`telegraph_box`·`dash_line` 내부 패턴 ②`retburst`·`ultslash` 등 `G.fx` 종류 ③`MARK_DRAW.knife`(이름 없는 자 낙석 표식)는 아직 벡터 단검 ④`tide16` 벡터 물벽.

### 261125-1100  7차 배치 · 2막(11~20장) 스킬 VFX 60장 도트화 + 전조 장판·기둥 내부 패턴 교정   (대상: `assets/vfx/boss_11~20` 60장 · `assets/dot/telegraph_{ground_zone,vertical_beam,hatch}.png` · `index.html` / `test/index.html` 의 GAME_VER·NEWS·tgspShape `vertical_beam` 코어)
지시서: 2026-11-25 예약 배치 "7차 배치: 2막(11~20장) 보스 VFX 60장 도트화·배포 + 전조 격자 디더 다듬기".

- **2막 스킬 VFX 60장(11~20장 × 6종) 도트체 리뉴얼** — `assets/vfx/boss_11/b11_s1_gear_saw.png` … `boss_20/b20_s6_apocalypse_eclipse.png` (같은 파일명 덮어쓰기, `test/assets/vfx/` 사본 동일).
  - 원본은 2026-11-20에 만든 `downloads/vfx_4frames_pack/boss_11~20`(4프레임 가로 스트립). 파이프라인은 6차와 같다: `work/dot7/vfx_dot7.py` — 4프레임 분할 → 알파 4×4 베이어 디더 이진화(0/255) → 블록(3~4px, 셀 폭/4가 100~190) 다운스케일 → **프레임 4장 공용 16색 팔레트**(median cut) → NEAREST ×블록. 그림의 모양·색·구도 유지.
  - 검증: 전 60장 **알파 0/255**, 가장자리 접촉 0, 셀 폭 원본 대비 0~4px 차(예 2740→2736, 3000→2992 — 잘라낸 오른쪽 열에 내용 0), 픽셀 면적 보존 1.01~1.03배.
  - 다시 만들 때: `python3 work/dot7/vfx_dot7.py` → `work/dot7/out/boss_NN/` → 복사(`work/dot7/report_vfx.json` 에 60장 수치).
- **전조 장판·기둥 내부 패턴 교정** (6차 보고의 "큰 장판·기둥에서 내부 디더가 격자로 보임") — 생성기 `work/dot7/tg7.py` → `work/dot7/tg/`, 규격(셀·잉크·9-slice 캡)은 그대로:
  - `telegraph_hatch.png` 32×32 4프레임: 45도 **직선 빗금 → 칸마다 자리를 비껴 놓은 짧은 45도 눈금(안개)**(프레임 0→3 으로 밀도 52→84%). 색은 회색조(게임이 위험색을 곱한다), 32 주기라 이음매 없음.
  - `telegraph_ground_zone.png` 256×128 4프레임: 위험 테이프 주기를 12→**8도트**(32도트 타일의 약수)로 바꿔 타일 경계에서 위상이 끊기지 않게, 안쪽 눈금도 32도트 주기 고정. 내부는 투명(채움은 안개 타일).
  - `telegraph_vertical_beam.png` 128×320 4프레임: 가장자리 32px 캡에 단면 디테일(1:1, 안 늘어남), **가운데는 한 가지 톤만 두어 폭이 늘어나도 무늬가 뭉개지지 않게(가로 띠는 64px 주기로 반복). 아래 캡의 삼각 장식은 9-slice 모서리(1:1)로 옮김.
  - 코드: `tgspShape` 의 `vertical_beam` 분기에서 스프라이트를 그린 뒤 **코어를 4px(가운데 HOT)+좌우 4px 광으로 직접 그린다**. 코어가 폭에 비례해 납작하게 퍼지던 것을 막는다(좁은 기둥은 스프라이트와 겹쳐도 같은 색).
  - `GAME_VER '261125-1100'`, `NEWS.id '261125d'` + `versions[0]` 카드, `version.json` / `test/version.json` 동기, `test/index.html` 동일.
- **검증(헤드리스 크로뮴 1280×720 · deviceScaleFactor 2)**: 로컬 http + GitHub Pages 라이브에서 11~20장 보스방마다 스트립 6종 로드(`naturalWidth>0`), 스킬 6종씩 총 60회 캐스트 스샷, 전조 6종·TGD 8종 로드, `pageerror 0`. 스샷은 `handoffs/🎨-7차-배치-2막-11-20장-보스-vfx-60장-도트화-배포/evidence/`, 정리본 `downloads/batch7_vfx_preview.png`.
- **메모**: 이 PC 의 체크아웃은 sparse(화이트리스트)라 `assets/vfx/boss_11~20` 이 로컬에 없어 보인다(저장소에는 있음). `git status` 에도 안 보이므로, 2막 VFX 를 만질 때는 `git ls-tree -r --name-only HEAD -- assets/vfx` 로 확인할 것.
- **남은 것(다음 배치)**: ①21~30장 스킬 VFX 120장은 아직 원본(부드러운 붓) ②`telegraph_box`·`telegraph_dash_line` 내부는 이번에 손대지 않음 ③`retburst`·`ultslash` 등 다른 `G.fx` 종류와 구형 텍스트 라벨(#11)·탄(#16·#17)은 그대로.

### 261125-1000  6차 배치 · 1막 스킬 VFX 42장 도트화 + 남은 코드 도형(해치·장판·링·웅덩이·박쥐 띠·종 아치)   (대상: `assets/dot` 8종 신규 · `assets/vfx/boss_01~10` 42장 · `index.html` / `test/index.html` 의 GAME_VER·NEWS·TGD 블록·drawHaz·tgspShape·drawBossExtras·TELE_DRAW.bell·drawFx ring·drawProjs)
지시서: 2026-11-25 예약 배치 "6차 배치: 부실 이펙트·남은 도형 연출·1막 VFX 44장 도트화".

- **1막 스킬 VFX 42장(1~6·8~10장 각 4종 + 7장 6종) 도트체 리뉴얼** — `assets/vfx/boss_01/b01_s1_bell_slam.png` … `boss_10/b10_s4_surgical_cross_slash.png` (같은 파일명 덮어쓰기, `test/assets/vfx/` 사본 동일).
  - 파이프라인 `work/dot6/vfx_dot.py`: 원본을 4프레임으로 자름 → 알파를 4×4 베이어 디더로 이진화(0/255) → 블록(3~4px, 셀 폭/4가 100~190이 되게) 다운스케일 → **프레임 4장 공용 16색 팔레트**(median cut) → NEAREST ×블록 업스케일. 그림의 모양·색·구도는 원본 그대로, 부드러운 붓·반투명 뭉개짐만 픽셀로 바뀐다.
  - 셀 크기가 원본과 1~4px 다르다(예 492×405 → 492×404, 618×508 → 616×508). 게임은 `naturalWidth / 4` 로 자르고 `w` 로 그리므로 무해. 전 42장 알파 0/255, 가장자리 접촉 0(잘림 없음).
  - 다시 만들 때: `python3 work/dot6/vfx_dot.py` → `work/dot6/out/boss_NN/` → 복사.
- **새 도트 그림 8종** (`assets/dot/`, 생성기 `work/dot6/gen6.py`, 전부 4프레임 가로 스트립 · 알파 0/255):
  - `telegraph_hatch.png` 32×32 — 위험 대기 빗금 타일(회색조, 게임에서 위험색 곱)
  - `telegraph_dotfill.png` 32×32 — 위험 대기 안개 점 타일
  - `haz_fill.png` 32×32 — 발동 중 장판 채움 점 타일
  - `haz_box.png` 128×64 — 발동 중 장판 테두리 9-slice(모서리 16px, 가운데는 타일)
  - `haz_ring.png` 32×32 — 충격파 띠 조각(원주에 이어 붙임)
  - `pool_glow.png` 128×48 — 바닥 웅덩이(끓는 점·잔물결)
  - `lane_bats.png` 256×64 — 6장 박쥐 떼 가로 띠(가로 타일)
  - `bell_arc.png` 256×96 — 1장 종울림 지면 아치 4겹
- **코드** — `TGSP`/`beamDot` 뒤에 **TGD 블록** 추가: `tgdImg`(프리로드) · `tgdCanvas`(프레임·색별 틴트 캐시, getImageData 로 회색조×위험색, file:// 는 source-atop 폴백) · `tgdPat` · `tgdFill` · `tgdBox`(9-slice) · `ringDot`(원주에 띠 조각 타일) · `tgEdge`(차오르는 2px 점선).
  - `drawHaz`: warm = 안개+빗금+`haz_box`(0.55), active = `haz_fill`(0.7)+`haz_box`(1.0), ring = `ringDot`(웜은 점선 링). 셋 다 그림이 없으면 예전 캔버스 연출로 폴백. ※웜 장판은 `_drawHaz9`(15186)가 `tg9Shape` 로 먼저 그리므로 실제 화면은 tg9 그림 + 이 채움이다.
  - `tgspShape`: **평면 반투명 `fillRect` 전부 제거**. `ground_zone`·`box` 는 `telegraph_hatch` 도트 빗금(0.18+0.12p)만 깔고 차오르는 경계는 `tgEdge` 점선, `vertical_beam`·`dash_line`·`aim_ray` 는 면 채움 없이 점선 경계만. (8장 응시·12장 가스처럼 화면 절반을 덮던 반투명 사각형이 사라진 원인)
  - `drawBossExtras`: pool 타원+보케 → `pool_glow`, lane 띠+텍스트 → `lane_bats`(가로 타일). 텍스트는 Galmuri 13px 로.
  - `TELE_DRAW.bell`: 동심 타원 3개 → `bell_arc`(512px 폭, 아래 기준).
  - `drawFx` `k:'ring'`(분노 링·종울림 파동): arc 한 줄 → `ringDot`(band 16, alpha 1-pr).
  - `drawProjs`: `pskull`(13장 원혼 해골) 뒤에 도트 꼬리 4점.
  - `tgspShape` aim_ray: 선 위에 2px 도트(1px 그림자 포함)를 10px 간격으로 얹어 옅은 점선을 또렷하게(13장 해골 조준선 포함 전 장).
  - `hatchPat()` 은 이름만 유지하고 도트 타일 패턴을 돌려준다(현재 호출부는 drawHaz warm 하나).
  - 프리로드: `for (const k in TGD.files) tgdImg(k)` — 시작 시 8종.
- **검증(헤드리스 크로뮴 1280×720, 로컬 http + GitHub Pages 라이브)**: 42장 로드·`pageerror 0`, 1~10장 보스방 패턴 캐스트(각 2패턴), 11·12·14·15·16·18장 스킬 6종씩 캐스트, 손으로 만든 장면(웜/발동 장판·링·웅덩이·박쥐 띠·종 아치·응시) 스샷. `downloads/batch6_vfx_preview.png` 에 42장+8종+인게임 4컷 정리.
- **남은 것 / 다음 배치 메모**: ①`telegraph_ground_zone`·`vertical_beam` 스프라이트 **내부 디더**가 큰 장판·기둥에서 격자로 보인다(2차 배치 그림 자체, 필요하면 내부 디더 레벨을 낮춰 재생성) ②16장 촉수 3연쇄의 tentacle 스트립 정렬은 2막 VFX 가 로컬 sparse 체크아웃에 없어 라이브 스샷으로만 확인 가능 ③`G.fx 'ring'` 은 이제 도트 띠지만 `retburst`·`ultslash` 등 다른 fx 종류는 그대로 ④11~30장 스킬 VFX 120장은 여전히 원본(부드러운 붓)이다.

### 261125-0700  5차 배치 · 1막 보스 10종(1~10장) 48f 도트체   (대상: assets/boss 10장 + index.html / test/index.html 의 GAME_VER·NEWS·BOSS_SHEET_FILE·BOSS_ART·BOSS_SIZE10)
지시서: 2026-11-25 예약 배치 "5차 배치: 1막 보스 10종(b1~b10) 48프레임 도트체 제작·검증·main 배포".
그림체는 `ART_STYLE.md` 그대로(스프라이트 밀도 ~110px, NEAREST ×2, 알파 0/255, 1px 외곽선, 발끝 y=240, 공격 행 VFX 금지).

- **새 그림 10장** — `assets/boss/b1_48f.png` ~ `b10_48f.png` (각 2048×1536, 8×6=48프레임, 셀 256, 발끝 240. `test/assets/boss/` 에 같은 사본). 옛 8×6 시트(`b1_lithos.png` … `b10_cheirurgos.png`)의 0프레임 포즈·무기·복장을 그대로 유지:
  - 1 리토스(돌 거인·가슴 균열·청동 종), 2 레테이아(수녀 복·검은 긴 머리·부적·물자락), 3 겔로스(광대·해골 가면·외발자전거·곡도), 4 사르코스(썩은 거체·갈비뼈·사슬), 5 알로페(흰 여우 아홉 꼬리·기모노·꼬리 끝 불꽃), 6 니크테리스(흑혈 외투·긴 망토·발톱), 7 폭주 거인(용암 근육·검은 수염·쇠 팔찌), 8 브론테스(외눈·철퇴·가죽 앞치마), 9 오네이라(박쥐 날개·보랏빛 구슬·연기 치마), 10 키루르고스(역병 의사·부리 가면·거대 주입기·메스).
  - **프레임별 몸높이(사망 행 제외)**: b1 222(공격 행 194~222) · b2 222~228 · b3 204~226(이동 행 204, rowK 1.04) · b4 218~228 · b5 206~224 · b6 202~224(이동 행 202, rowK 1.07) · b7 202~226 · b8 212~228 · b9 222 · b10 220~228. 잘림 0, 알파 0/255.
  - 파이프라인: 옛 시트 0프레임을 초록 배경으로(`dot/base10.py` → `base_b1_raw.png`~`base_b10_raw.png`, b5·b10 은 좌우 반전해 오른쪽 보기로) → `dot/spec10.py` SPEC 10종(11스트립) → `gen10.py`(= `gen.py` + SPEC10) → `sheet.py`. 4차의 `norm_frames()` 그대로. boost 기본 (0.86,1.06,1.08), b6 만 검은 외투라 (0.62,1.12,1.10)으로 올림.
  - 다시 뽑은 스트립: b1 atk_c, b2 atk_b, b6 move_c(파란 검·웅크림), b8 move_c(무릎), b9 move_b, b10 atk_b — 프롬프트에 "standing tall … no kneeling, no sword" 를 넣어 몸높이를 맞췄다.
- **코드 변경** — 1~10장도 다른 막과 같은 방식으로 연결:
  - `BOSS_SHEET_FILE` b1~b10 → `boss/bN_48f.png` (옛 파일은 폴백/비교용으로 저장소에 그대로 둠).
  - `BOSS_ART` b1~b10 → `[-1, h]` (자기 48f 시트를 쓴다는 표시, 높이는 그대로 215/168/172/160/182/186/228/220/176/186).
  - 새 블록 `BOSS_SIZE10` + 루프: `sizeBossesFromArt()` 가 `-1` 인 보스를 건너뛰므로 몸 크기(h/w)를 옛 그림에서 잰 값 그대로 고정(b1 215×150 · b2 168×81 · b3 172×84 · b4 160×68 · b5 182×77 · b6 186×135 · b7 228×136 · b8 220×111 · b9 176×86 · b10 186×84). `BOSS_SHEETS` b1~b10 은 walk/act 폴백과 모션 옵션(step·dust·float·ghost·trail)을 그대로 둔다.
  - `GAME_VER '261125-0700'`, `NEWS.id '261125b'` + `versions[0]` 카드, `version.json` / `test/version.json` 동기.
- **발사점(MZREL)** — 1~10장 스킬 패턴(`golem_a`·`miko_a`… `surg_a`)은 `muzzle()` 을 쓰지 않고 `b.x + b.face*거리`, `GROUND` 기준으로 이펙트를 만든다. 그래서 새 시트로 바뀌어도 발사점이 어긋나지 않는다(스샷으로 확인). `MZREL` 추가 없음. 바닥 장판은 그대로 `GROUND(480)` 에 붙는다.
- **부실 이펙트 목록(다음 VFX 162장 배치용, 1~10장)** — 인게임 캐스트 스샷에서 눈에 띈 것:
  1. 8장 브론테스 붉은 눈 광선(`cyc_b`) — 화면 절반을 덮는 **반투명 주황 사각형**(`drawHaz` 활성 박스). 도트 빔 그림 필요.
  2. 1장 리토스 종울림(`golem_a`) — 하늘을 가로지르는 **매끈한 파란 곡선 아크** + 붉은 세로 사각형. 도트 링/빔으로 교체 필요.
  3. 3장 겔로스 단검·분신(`jest_a/b`) — 자홍색 **반투명 판**과 보라 사각형이 그대로 보인다.
  4. 5장 알로페 여우불(`fox_a/b`) — 보라 사각형 판이 어색하다.
  5. 6장 니크테리스 흡혈(`vamp_a`) — 효과가 붉은 안개뿐이라 허전하다(보스가 yOff -320 으로 떠오르는 연출은 정상).
  6. 10장 키루르고스(`surg_a/b`) — 금색·붉은 반투명 사각형(약통/장판)이 도형 그대로다.
  7. 2장 레테이아 기둥(`miko_a/b`)은 세로 빔이 깔끔하지만 색이 네온에 가깝고, 9장 오네이라(`succ_a/b`)는 보라 도넛 링 두 개뿐이라 밋밋하다 — 우선순위 낮음.
  (위 1~6은 `progress.md` 3번 표의 warm 해치 채움·원형 링·활성 박스·pool 연출 항목과 같은 원인이다.)
- **검증(헤드리스 크로뮴 1280×720, 로컬 서버 + GitHub Pages 라이브)**:
  - 10개 보스방(1장 `tower`, 2~10장 `cN_arena`) 스폰: `SPR[id]` 48프레임, `pageerror 0`. `bossSheetScale` b1 0.968 · b2 0.757 · b3 0.768 · b4 0.714 · b5 0.820 · b6 0.830 · b7 1.027 · b8 0.991 · b9 0.793 · b10 0.838, rowK 전부 1.00~1.07.
  - 스킬 캐스트 2종씩 스샷(19장) + 보스방 10곳 스샷. 증거 폴더: `handoffs/🎨-5차-배치-1막-보스-10종-b1-10-48f-도트체-제작-배포/evidence/` (spawn_*.png · cast_*.png · report.json).
  - 비교 이미지 `downloads/batch5_old_vs_new.png` · 인게임 라인업 `downloads/batch5_ingame_lineup.png`.
- **남은 것**: 보스 스킬 VFX 162장 도트 통일, 1~10장 낙석·응시 연출, `drawHaz` 원형 링·warm 해치·활성 박스·pool/lane. 이 배치로 **1~30장 보스 30종 48f 도트화가 완결**됐다. 진행표는 `work_master/progress.md`.
- 원본 PC에서 할 일: `assets/boss/b{1..10}_48f.png` 를 `art/` 원본에도 같은 이름으로 넣고, ① `GAME_VER` ② `NEWS.id` + `versions[0]` 카드 ③ `BOSS_SHEET_FILE` b1~b10 경로 ④ `BOSS_ART` b1~b10 `[-1, h]` ⑤ `BOSS_SIZE10` 블록을 조각 파일에 같은 내용으로 옮긴다.

### 261125-0600  4차 배치 · 2막 보스 9종(11~16·18~20장) 48f 도트체   (대상: assets/boss 9장 + index.html / test/index.html 의 GAME_VER·NEWS)
지시서: 2026-11-24 예약 배치 "2막(11~20장) 잔여 보스 9종(b11, b12, b13, b14, b15, b16, b18, b19, b20) 48프레임 도트체 제작·검증·main 배포" (`b17`은 1차 완료).
그림체는 `ART_STYLE.md` 그대로(스프라이트 밀도 ~110px, NEAREST ×2, 알파 0/255, 1px 외곽선, 발끝 y=240, 공격 행 VFX 금지).

- **새 그림 9장** — `assets/boss/b11_48f.png` · `b12` · `b13` · `b14` · `b15` · `b16` · `b18` · `b19` · `b20` (각 2048×1536, 8×6=48프레임, 셀 256, 발끝 240. `test/assets/boss/` 에 같은 사본). 기존 디자인 유지:
  - 11 시계태엽 골렘(놋쇠+철판·어깨 톱니·호박색 동력핵), 12 플라스크 닥터 & 키메라(가스마스크·보라/초록 플라스크·오른쪽 갈기 짐승), 13 자칼 군주(아누비스 머리·금 장식·앙크 지팡이), 14 스카라베 엠프레스(황금 판금·네 날개·태양 원반 관), 15 유령 해적선장(삼각모·해골 문양·커틀러스·푸른 불꽃), 16 거대 크라켄(보랏빛 망토·촉수), 18 청동 장군(녹청 판금·투구 깃·언월도·둥근 방패·낡은 군기), 19 서리 마녀 & 얼음 늑대(마녀 왼쪽·늑대 오른쪽 구성 그대로), 20 쌍검 기사 이그니스(은빛 판금·불 날개/얼음 날개·쌍검).
  - **프레임별 몸높이(bodyH, 사망 행 제외)**: b11 216~222 · b12 178~202(두 캐릭터라 폭이 먼저 차서 190 기준) · b13 222 · b14 198~228 · b15 212~228 · b16 154~200(촉수가 넓어 폭 226 고정, 망토만 오르내림) · b18 222 · b19 196~222 · b20 192~222. 이동·공격에서 몸이 납작해지던 프레임은 다시 뽑았다(b14 move_a, b16 move_b·move_c·atk_a·atk_b).
  - 파이프라인: 옛 시트 0프레임을 초록 배경으로(`dot/base_b*_raw.png`) → `gen.py` SPEC 에 9종 추가(11스트립) → `sheet.py`. **새 기능 `norm_frames()`**: 스트립 안에서 몸높이가 중앙값의 6%를 넘게 벗어난 프레임은 발끝 기준으로 다시 맞춰, 한 스트립 안의 크기 튐을 없앤다(사망 스트립은 제외). 9종 boost 는 (0.92,1.04,1.04), b18 만 어두워서 (0.62,1.18,1.06).
- **코드 변경** — 파일 이름·크기·칸 배치가 같아 보스 등록(`BOSS_SHEET_FILE`, `BOSS_ART`, `BOSS_SHEETS`)은 **그대로**다. 바뀐 것은 `GAME_VER '261125-0600'` 과 `NEWS.id '261125a'`(+버전 카드) 뿐.
- **발사점(MZREL)** — 3차에서 넣은 몸 비율표를 새 그림에 그대로 쓴다. 19장 늑대 브레스는 새 그림에서도 늑대 입(`[0.67,-0.44]`)에서 시작하는 것을 스샷으로 확인했다(`evidence/mz/ch19_s1_*.png`). 나머지 8종도 캐스트 스샷으로 몸·입·무기 끝에서 나가는 것을 확인(`evidence/cast_*.png`).
- **검증(헤드리스 크로뮴 1280×720, 로컬 서버)**:
  - 9개 보스방(c11~c16·c18~c20 `_arena`) 스폰: `SPR[id]` 48프레임, `pageerror 0`. `bossSheetScale` b11 0.991 · b12 0.905 · b13 0.901 · b14 0.829 · b15 0.856 · b16 1.452 · b18 0.964 · b19 0.792 · b20 0.919.
  - 스킬 캐스트 2종씩 스샷, 발사점 실측: b12 (941,384) · b14 (956,359) · b15 (946,385) · b16 (873,388) · b18 (927,437) · b19 (917,406/마녀 발밑 1027,477) · b20 (940,370). 전부 몸 박스(y 480, h 168~270) 안.
  - 증거 폴더: `handoffs/🎨-4차-배치-2막-보스-9종-b11-16-18-20-48f-도트체-제작/evidence/` (spawn_*.png · cast_*.png · mz/ · report.json), 비교 이미지 `downloads/batch4_old_vs_new.png` · `downloads/batch4_ingame_lineup.png`.
- **남은 것**: 1막 보스 10종(`b1`~`b10`) 시트(5차 배치), 보스 스킬 VFX 162장, 1~10장 낙석·응시 연출, `drawHaz` 원형 링·warm 해치·pool/lane. 진행표는 `work_master/progress.md`.
- 원본 PC에서 할 일: `assets/boss/b{11,12,13,14,15,16,18,19,20}_48f.png` 를 `art/` 원본에도 같은 이름으로 넣고, ① `GAME_VER` ② `NEWS.id` + `versions[0]` 카드 를 조각 파일에 같은 내용으로 옮긴다. (보스 코드는 손대지 않았다.)

### 261124-2310  3차 배치 · 21·23·24·25·27·30장 보스 48f + 브레스·발사점 정리   (대상: index.html / test/index.html + assets)
지시서: 2026-11-24 사용자 "19장 브레스가 허공에서 나가는 것 고치고, 21~30장 남은 6종 마저 만들어줘" · "모션마다 크기가 달라 들쭉날쭉하니까 크기 동일하게" · "이펙트 나가는 위치도 잘 조정해줘".
그림체는 `ART_STYLE.md` 그대로(스프라이트 밀도 ~110px, NEAREST ×2, 알파 0/255, 1px 외곽선, 발끝 y=240, 공격 행 VFX 금지).

- **새 그림 6장** — `assets/boss/b21_48f.png` · `b23_48f.png` · `b24_48f.png` · `b25_48f.png` · `b27_48f.png` · `b30_48f.png` (각 2048×1536, 8×6=48프레임, 셀 256, 발끝 240). 기존 디자인 유지:
  - 21 성운 추적자(별무늬 로브·성운 망토·쌍 곡도), 23 거울의 여왕(수정 왕관·거울 파편·유리 드레스), 24 역병 까마귀 군주(해골 부리·깃·발톱), 25 중력의 거인(석주 몸통·보랏빛 핵·부유 주먹), 27 공허의 레비아탄(별 박힌 뱀 몸·S자 코일), 30 아스트라온(성운 로브·황금 왕관·여러 팔).
  - **프레임별 몸높이(bodyH)**: b21 200~222 · b23 220~222 · b24 156~222(까마귀는 고개를 숙이는 포즈라 편차가 크고, 행 중앙값 보정으로 1.10/1.10/0.95) · b25 222(사망 행 제외) · b27 188~226 · b30 222(사망 행 제외). 이동·공격 행에서 몸이 줄던 문제(옛 b21·b27) 해결.
  - `test/assets/boss/` 에 같은 파일 사본. 파일 이름·크기·칸 배치가 같아 보스 등록 코드는 그대로다(이미 `ACT3_BOSS[*].file48`).
- **(1) 19장 늑대 브레스** — `MUZZLE.b19` 의 옛 4×4 시트 픽셀 좌표가 8×6 시트에서 한 줄(256px) 아래로 어긋나 빔이 바닥 아래 허공에서 시작했다. 이제 `MZREL.b19[10] = [0.67, -0.44]`(늑대 입)에서 시작하고, 새 함수 `fr19aim(b, m)` 이 입에서 앞으로 **±0.42rad(거의 수평)** 로 조준한다. 캐스트 중 `castTick` 도 같은 함수를 써서 늑대가 고개를 돌리면 따라간다. 빔 끝은 `GROUND-6` 으로 클램프해 바닥을 뚫지 않는다.
- **(2) 발사점을 시트 픽셀표 → 몸 비율로** — `MZREL` 표와 `mzRel(b, idx)` 를 추가하고 `muzzle(b, idx)` 가 **MUZZLE 픽셀표보다 먼저** MZREL 을 본다. 값은 `[앞 거리, 높이]` (둘 다 b.h 비율, 높이는 발끝에서 위로 음수).
  - 등록: b12 0.60/-0.62 · b14 0.40/-0.66 · b15 0.44/-0.50 · b16 0.58/-0.34 · b17 0.46/-0.52 · b18 0.48/-0.20 · b19(마녀 발밑 8 = 0.02/-0.02, 늑대 입 = 0.67/-0.44) · b20 0.44/-0.54 · b21 0.46/-0.62 · b23 0.40/-0.62 · b24 0.56/-0.62 · b25 0.48/-0.40 · b26 0.42/-0.62 · b27 0.42/-0.76 · b30 0.40/-0.50.
  - 적용 스킬: 12장 키메라 레이저(beam9), 14장 라 태양광선(fan/aim_ray), 15장 먹물, 16장 크라켄, 17장 비검, 18장 창, 19장 브레스·영창, 20장 검기, 21장 일식 연사·천상의 사격, 23장 프리즘 굴절, 24장 까마귀 떼, 26장 역설의 광선, 27장 심연 브레스, 30장 삼켜진 별의 광선. 25장은 muzzle 을 쓰지 않는다(바닥 기준).
  - 27장 심연 브레스는 경고선·판정을 입에서 바닥 쪽으로 비스듬히(`o.x,o.y → x1, GROUND-56`) 다시 그어 입과 빔이 붙는다.
  - 20장 홍련의 화염검기 발사점을 `b.x+50 / 0.45h` → `b.x+62 / 0.55h` 로 검끝 쪽으로 올렸다.
- **(3) 얼음 전조 톤** — `TGSP_TONES.ice` 의 AMBER/GOLD/GOLD_HI 를 `0x5CD0FF/0x9BE4FF/0xD6F4FF` → `0x36A8DC/0x63C6F0/0xA8E4FA` 로 한 단계 내렸다(19장 전조가 옅어 보이던 것). 판정·크기 변화 없음.
- **검증(헤드리스 크로뮴 1280×720, 로컬 서버)**:
  - 19장 브레스: 강제 발동 3회, 빔 좌표 `x0 917 y0 406 → x1 504 y1 474` (입 높이에서 시작, 바닥 위 6px 에서 끝), 스샷 `b19_breath_0_3/0_4/1_4.png`. `pageerror 0`.
  - 21·23·24·25·27·30장: 보스방 스폰 스샷 `spawn_b*.png`, 스킬 캐스트 스샷 `focus_b*_s*_{0,1,2}.png`. `SPR[id]` 48프레임, b21 rowK [1,1,1,1] · b24 [1,1.103,1.103,0.95] · 나머지 [1,1,1,1].
  - muzzle 좌표 실측: b21 (917,361) · b23 (194,354) · b24 (885,349) · b25 (877,375) · b27 (892,281) · b30 (892,345) — 전부 몸 박스(y 480, h 192~270) 안, 발끝 위 105~199px.
  - 증거 폴더: `handoffs/🎨-3차-배치-19장-브레스-수정-21-30장-잔여-6종-b21-23-2/evidence/`.
- **남은 것**: 보스 5·7·11~16·18~20장 시트(11종), 보스 스킬 VFX 162장, 1~10장 낙석·응시 연출, 분노 링·pool·lane 연출. 진행표는 `work_master/progress.md`.
- 원본 PC에서 할 일: ① `MZREL`/`mzRel` 블록과 `muzzle` 첫 줄 ② `fr19aim` + 19장 브레스 tele/cast/castTick ③ 27장 심연 브레스 tele ④ 20장 화염검기 tele 의 좌표 ⑤ `TGSP_TONES.ice` ⑥ `assets/boss/b2{1,3,4,5,7,0}_48f.png` 를 조각 파일/`art/` 에 같은 이름으로 옮긴다.

### 261124-2240  2차 배치 · 22·26·28장 보스 48f + 코드 빔 4종 + 공용 전조 6종   (대상: index.html / test/index.html + assets)
지시서: 2026-11-24 사용자 "아까 말한거 다 진행해줘 보스 모션, 보스 스킬 이펙트, 보스 전조 이펙트" · "절대 그림체 바뀌지 않도록 깃허브에 올려줘".
그림체는 `ART_STYLE.md` 그대로(주인공 도트 밀도, NEAREST ×2, 알파 0/255, 1px 외곽선, 발끝 240, 공격 행 VFX 금지).

- **새 그림**
  - `assets/boss/b22_48f.png` · `b26_48f.png` · `b28_48f.png` (각 2048×1536, 48프레임). 기존 디자인·포즈·무기 유지(녹슨 창 / 모래시계·시계 후광 / 은빛 판금·포신 4문·황금 고리). 뒤에 깔려 있던 남색 판과 날개 사이 남색 구멍 제거. 프레임별 몸높이: b22 198~222, b26 220~228, b28 222(사망 행 제외).
  - `assets/dot/telegraph_ground_zone.png`(1024×128) · `telegraph_dash_line.png`(1024×128) · `telegraph_vertical_beam.png`(512×320) · `telegraph_aim_ray.png`(1024×64) · `telegraph_box.png`(1024×128) · `telegraph_warn_badge.png`(256×64) — 전부 4프레임 가로 스트립, 1도트 = 2px, **TGSP_BASE 11색만** 사용(게임이 톤별로 팔레트 스왑).
  - `assets/dot/beam_chimera.png` · `beam_solar.png` · `beam_frost.png` · `beam_slash.png` (각 1024×64 = 256×64 셀 4프레임).
  - `test/assets/` 에 위 전부 사본.
- **(1) 보스 시트 교체** — 파일 이름·크기·칸 배치가 같아 코드 변경 없음. `bossSheetScale` b22 1.107 / b26 0.964 / b28 1.18, `bossRowK` 0.93~1.06.
- **(2) 전조 6종** — `TGSP` 의 `dir` 을 `assets/vfx/` → `assets/dot/` 로 바꾸고 `box` 를 목록·셀·캡에 추가했다. 이제 `tg9Shape` 의 다섯 갈래 + box 가 전부 그림으로 그려진다(예전 `assets/vfx/telegraph_*.png` 는 쓰지 않는다).
  - `tgspShape` 의 `box` 갈래는 `tgspDraw(c,'box',...)` 를 먼저 시도하고 실패하면 `ground_zone` 으로 떨어진다.
  - `aim_ray` 에서 폭이 24보다 큰(굵은 통로) 경우, 예전에는 `vertical_beam` 그림을 가로로 늘여 깔았는데 캡이 뭉개져서 **반투명 채움 + 조준선 그림**으로 되돌렸다.
  - 그림 로드 실패 시 예전 캔버스 연출로 그대로 돌아간다(폴백 유지).
- **(3) 코드 빔 4종** — `BEAM_SPR`/`BEAM_IMG`/`beamImg()`/`beamDot()` 를 전조 블록 뒤에 추가.
  - 그리는 법: 256×64 셀을 빔 길이 방향으로 **타일**로 깔고 진행 방향으로 회전. 두께 = `th × 1.0`(참격만 0.8), 최소 14px. 프레임 = `floor(G.t*14) % 4`. 늘여 그리지 않아 도트가 살아 있다.
  - 연결: `beam9(...,{spr:'chimera'})` 처럼 `spr` 을 넘기면 `beam9` 가 haz 에 실어 보낸다. 14장·19장은 `addHaz({... spr:'solar'/'frost' ...})` 로 직접 붙였다. 20장 X자는 두 빔에 `haz:{sprSeed:0/2}` 로 프레임 위상을 어긋나게 했다.
  - **중요**: 이 스킬들의 빔은 `own: true` 라서 `drawHaz` 4차 패치(12241행)의 'own 빔' 캔버스 연출이 따로 그린다. 그 블록 맨 앞에 `if (h.spr && beamDot(...)) continue;` 를 넣어 그림이 있으면 그림으로, 없으면 예전 빛 연출로 그린다.
  - 시작 시 `for (const k in BEAM_SPR) beamImg(k)` 로 4장(합 3KB)을 미리 받는다(첫 빔이 예전 연출로 뜨지 않게).
- **검증(헤드리스 크로뮴 1280×720, 로컬 서버)**: 22·26·28장 보스방 스폰·이동 스샷, 전조 6종 단독 스샷(`tg_*.png`), 빔 4종 스샷(`pc_beam_*.png`), 실제 보스전에서 네 스킬이 빔을 쏘는 순간 스샷(`pc_skill_*_act.png`). `pageerror 0`. `SPR.b22/b26/b28` 48프레임 확인.
  증거: `handoffs/🎨-2차-배치-b22-b26-b28-코드-빔-4종-전조-3종-제작-배포/evidence/`.
- **남은 것**: 나머지 보스 25종 시트(5·7·11~16·18~21·23~25·27·30), 보스 스킬 VFX 162장, 1~10장 낙석·응시 연출, 분노 링·pool·lane 연출. 진행표는 `work_master/progress.md`.
- 원본 PC에서 할 일: `assets/boss`·`assets/dot` PNG 를 `art/` 원본에도 같은 이름으로 넣고, ① `TGSP` 정의/`tgspShape` 의 box 갈래 ② `BEAM_SPR`~`beamDot` 블록 ③ `drawHaz` 4차 패치의 own 빔 블록 ④ `beam9` 의 `spr:` 전달 ⑤ 네 스킬의 `spr` 인자 를 조각 파일에 같은 내용으로 옮긴다.

### 261124-2100  도트체 확정 · 17장·29장 보스 새 시트 + 전조/달 픽셀아트   (대상: index.html / test/index.html + assets)
지시서: 2026-11-24 사용자 확정 "지금 이 그림체가 300배 나음 → 보스 모션·보스 스킬 이펙트·보스 전조 전부 이 그림체로".
**그림체는 이제 `ART_STYLE.md`(저장소 루트) 규격으로 고정한다** — 기준 컷 `assets/dot/ART_STYLE_REF_b17.png`.

- **새 그림**
  - `assets/boss/b17_48f.png` (2048×1536, 48프레임) — 17장 검선 청운. 6자루 부유검 유지, 공격 행에 이펙트 없음, 발끝 240.
  - `assets/boss/b29_48f.png` (2048×1536) — 29장 핏빛 월식 기사. 기존 포즈·복장 유지, 뒤에 깔려 있던 남색 판 제거.
  - `assets/dot/telegraph_dash_line.png` · `assets/dot/telegraph_vertical_beam.png` (96×96, 9-slice 32px 테두리, 회색조 → 런타임에 톤 색으로 곱함).
  - `assets/dot/moon_eclipse_8f.png` (128×128 × 8프레임) — 29장 개기월식 달.
  - `test/assets/` 에 위 6장 사본.
- **(1) 보스 시트 교체** — 파일 이름·크기·칸 배치가 같아 코드 변경 없음. 두 파일 다 알파가 0/255 뿐이고, 프레임별 몸높이 편차는 b17 218~228 / b29 222~228(사망 행 제외).
- **(2) 전조 그림** — `TG_DOT`·`tgDotBox()` 를 4차 패치 구역(STAGE 9 전조)에 추가하고 `tg9Shape()` 의 `dash_line`·`vertical_beam` 갈래를 그림으로 바꿨다.
  - `dash_line`: 보스→도착점 띠 전체(알파 0.34) + 차오르는 부분(0.55+0.45p)을 9-slice로. 왼쪽으로 돌진하면 그림을 좌우 반전. 그림 로드 실패 시에만 예전 캔버스 연출로 돌아간다.
  - `vertical_beam`: 바깥 폭(0.26) + 실제 폭으로 벌어지는 코어(0.55+0.45p). 폭·높이가 32px 미만이면 그림을 그 크기로 늘려 그린다.
  - 톤 색(보통·위험·얼음·독·모래)은 텍스처를 `multiply` 로 칠해 유지한다(`tgDotTint`, 캐시).
  - `ground_zone`·`aim_ray`·`box` 는 **아직 예전 캔버스 연출**이다(이번 배치 범위 밖, 다음 배치에서 같은 9-slice로 교체 예정).
- **(3) 29장 달** — `drawMoon29()` 의 벡터 원판·원형 그림자·크레이터·코로나 링을 없애고 `moon_eclipse_8f.png` 한 장으로 바꿨다(프레임 = `round(e*7)`).
  달무리 빛(radial halo)과 바닥 경고 띠는 빛 연출이라 그대로 남겼다.
- **검증(헤드리스 크롬 1280×720, 로컬 서버)**: 17장·29장 보스방 스폰 스샷, 29장 달 3단계(보름/반/개기) 스샷, 전조 4종(돌진 2 + 기둥 2) 스샷. `pageerror 0`. 시트 로드 48프레임 확인(`SPR.b17[0].bodyH 222`), `bossSheetScale('b17')` 0.779 · `bossRowK` [1, 1.018, 1].
  증거: `handoffs/🎨-1차-배치-도트체-확정-b17-b29-달-전조-제작-및-배포/evidence/`.
- **남은 것**: 나머지 28종 보스 시트(그림체 통일), 보스 스킬 VFX 162장, `ground_zone`·`aim_ray`·`box` 전조, 1~10장 낙석·응시 연출. 진행표는 `work_master/progress.md`.
- 원본 PC에서 할 일: `assets/boss`·`assets/dot` PNG를 `art/` 원본에도 같은 이름으로 덮어쓰고, 위 3개 함수 블록(`tgDotImg/tgDotTint/tgDotBox`, `tg9Shape` 의 두 갈래, `drawMoon29` 의 달 부분)을 조각 파일 쪽에도 같은 내용으로 옮긴다.

### 261124-1930  궁수 S 덫 지면 밀착   (대상: index.html / test/index.html)
지시서: 2026-11-24 사용자 제보(스크린샷) — 궁수 S 덫 룬 고리가 캐릭터 발끝보다 위 공중에 떠 있음.

- **원인**: `assets/vfx/vfx_archer_s_trap.png`(1024×256, 칸 256×256)는 칸 **아래 16px가 투명 여백**이고 실제 룬 바닥 픽셀은 238~239행(칸 기준)이다. 그런데 `trapFxBox()` 가 칸 아래끝(256)을 지면(`b.y + b.h`)에 맞춰 그려서, 보이는 룬 바닥이 지면보다 **16~18px 위**에 떴다.
- **수정**(코드 2곳): `REM_SK.kallisto.sTrap` 에 `gpad: 17` 추가, `trapFxBox()` 를 `y = round(gy - chh + (st.gpad || 0))` 로. 놓인 덫(`drawTrapArt`)과 발동 3프레임(`remFx(... box: trapFxBox(box) ...)`)이 **같은 함수**를 쓰므로 네 프레임이 함께 내려간다.
  판정 상자(`REM_SK.kallisto.s` 86×116)·피해 300%·기절 1.5초·무장 0.4초·유지 8초·쿨다운은 그대로(그림만 이동).
- **검증**(헤드리스 크롬 1280×720, 로컬 서버): 캠프·사냥터(`ruins`)에서 덫을 놓고 픽셀로 측정 — 룬의 진한 바닥 행이 수정 전 `world y 467.8` → 수정 후 `479.0`(지면 `GROUND` = 480, 발끝과 같은 선). 발동 1·2·3프레임도 같은 박스로 내려가 사슬 고리가 지면에 닿는 것을 스크린샷으로 확인. 페이지 오류 0.

### 261124-1900  19장 빙판 바닥 · 음소거 아이콘 · 궁수 S 덫 그림   (대상: index.html / test/index.html)
지시서: 2026-11-24 사용자 작업 지시 "음소거·19장빙판·궁수S 에셋 3종 적용 및 푸시".
같은 팩(`work/fx_4pack/manifest.json`)에서 **귀환 이펙트(`vfx_return_scroll.png`)는 사용자가 빼 달라고 해서 적용하지 않았다** — 코드의 기존 귀환 연출(1800) 그대로다.
index.html 을 직접 고쳤고 test/index.html 은 1·3행만 다르게 다시 만들었다(둘 다 같은 줄 수).
새 그림 3장: `assets/ui/btn_audio_muted.png`(64×64) · `assets/ui/floor_ch19_ice.png`(512×128) · `assets/vfx/vfx_archer_s_trap.png`(1024×256, 칸 256×256, 지면 여백 16) (+ `test/assets/` 사본 3장).

- **(1) 음소거 아이콘** — CSS `#bMute.off .hico{opacity:.22;filter:grayscale(1)}` 와 `#bMute.off::before`(붉은 사선)를 없앴다(각각 `opacity:1;filter:none` / `content:none`). 꺼짐 그림 자체가 빨간 X 를 들고 있어 덮어쓰면 지저분해진다.
  붉은 바탕(`#bMute.off`)과 `::after` "꺼짐" 배지는 그대로 — 2026-11-24 사용자가 "한눈에 보이게" 요청한 표시다(1710 패치).
  스크립트: `MUTE_ICON = { on: ASSET9+'ui/btn_audio_icon.png', off: ASSET9+'ui/btn_audio_muted.png' }`, `syncAudioBtn()` 이 `#bMute img.hico` 의 `src` 를 바꿔 끼운다(같으면 건드리지 않음).
  첫 토글에 깜빡이지 않게 꺼짐 그림을 미리 `new Image()` 로 받아 둔다. 음향 설정 창의 글자 버튼(`data-amute`)은 그림이 아니라 손대지 않았다.
- **(2) 19장 빙판 바닥** — `FLOOR19_ICE`(Image, `?v=GAME_VER`) 를 `drawFloorExtras23` 의 `m.theme === 'glacier'` 갈래에서 `GROUND`(480) 기준 512px 씩 반복해 그린다(`imageSmoothingEnabled=false`, 클립은 기존 `GROUND-4 ~ H`).
  타일이 이미 윗면 광택·서리 띠·균열·기포를 갖고 있어, 덮던 세로 그라디언트 알파를 .34/.26/.14/.06 → .14/.12/.09/.05 로 낮추고, 반짝임 줄 20→12(알파 .16→.10), 중복이던 균열 선 12개는 지웠다. 흰 윗면 선(`GROUND-2`)은 그대로.
  `glacier` 테마는 19장 두 곳(사냥터 `c19_a`·보스방 `c19_arena`)뿐이라 다른 장은 영향 없다(17장 보스방 돌바닥 그대로 확인).
- **(3) 궁수 S 덫** — `REM_SK.kallisto.sTrap = { file:'vfx/vfx_archer_s_trap.png', cell:[256,256], w:256, h:256, align:'bottom', ms:[110,120,120,220] }` 추가.
  **판정·피해는 기존 `REM_SK.kallisto.s`(86×116) 그대로** — 그림만 새 스트립으로 바꿨다. 놓인 덫은 1프레임(룬 씨앗)을 계속 그리고, 발동하면 `remFx(..., seq:[[1,120],[2,120],[3,220]])` 로 사슬→점화→포획을 0.46초 재생한다.
  그리는 자리는 `trapFxBox(b)` — 덫 판정 상자의 바닥 가운데를 256 칸의 가운데·아래에 맞춘다.
  놓인 덫은 `drawTrapArt()` 로 **일반 합성 한 겹 + 빛 합성 반 겹** — 빛 합성만 하면 밝은 빙판에서 초록이 하얗게 날아간다(예전에 덧그리던 경계 고리도 그림에 룬 고리가 있어 뺐다). 바닥 빛무리는 가시성용으로 남기고 알파만 낮췄다(.30/.16 → .24/.13).
- **검증(헤드리스 크롬, 로컬 서버)**: 음소거 켜짐/꺼짐 `src` 전환 · 사선 `none` · 아이콘 opacity 1 · 꺼짐 배지 유지, 19장 보스방·사냥터 바닥 픽셀(푸른빛)과 스크린샷, 덫 2개 무장 → 발동(새 스트립 재생 + 피해), 패치 노트 새 카드 3항목·가로 넘침 0, PC·휴대폰 pageerror 0, 자산 404 없음.
  증거 그림: `handoffs/🚀-음소거-19장빙판-궁수s-에셋-3종-적용-및-푸시/evidence/`(`final2_pc_ch19_arena.png`, `final2_pc_trap_frame2.png`, `final2_pc_mute_off.png` 등).

### 261124-1830  보스 1~30장 누끼 정밀 보수   (대상: assets/boss/*.png + test/assets/boss/*.png, 코드 변경 없음)
작업: 2026-11-24 사용자 제보(7장 폭주 거인 흰 조각, 17장 검선 청운 몸통 파먹힘)에 따라 1~30장 보스 48프레임 시트 30종(1,440프레임)을 전수 검수.

- **7장 b7_giant**: 주먹·사슬·불티·발가락 사이에 갇힌 순백(255) 배경 조각 제거(11프레임 280px).
- **17장 b17_48f**: 옷자락 밑단·소매·옆선에 붙어 있던 흰 테두리(배경 잔여물) 제거(23프레임 800px). 밝은 배경에서 몸통이 파먹힌 것처럼 보이던 원인.
- 그 외 19종에서 소량(6~772px) 제거, 9종은 이상 없음 → 총 21종 3,133px.
- 원래 흰 부위(눈·이빨·은갑옷 하이라이트·불꽃 심지·흰 깃털(b5)·흰 드레스(b2))는 보존.
- 인게임(헤드리스 크롬) 1~30장 보스방 30곳 렌더 확인, pageerror 0. 시트 규격(8×6·256셀·발 기준선 240)·경로·프레임 수 변경 없음 → 코드 수정 필요 없음.

원본 PC에서 할 일: 이 커밋의 assets/boss·test/assets/boss PNG를 art/ 원본에도 같은 이름으로 덮어쓰기만 하면 된다(코드·빌드 변경 없음).

### 261124-1815  세계지도 1·2·3막 3페이지 · 장 이름을 그림과 같게 · 접힘 스킬 탭 구석으로   (대상: index.html / test/index.html)
지시서: 2026-11-24 사용자 메시지 "그림 이름으로 맞춰야함"(장 이름표를 그림 이름으로) + 같은 날 "이대로 … 적용해서 배포할까요"에 대한 승인,
그리고 이번 작업 지시 "3페이지 세계지도 적용·장제목 통일 및 푸시". 같은 커밋에 접힘 스킬 탭 위치 수정 1줄("우측 하단 구석으로")을 함께 넣었다.
index.html 을 직접 고쳤고 test/index.html 은 1·3행만 다르게 다시 만들었다(둘 다 24,929행).
새 그림 2장: `assets/ui/worldmap_act1_bg.png`, `assets/ui/worldmap_act2_bg.png` (+ `test/assets/ui/` 사본). 둘 다 1672×941, 글자·노드 없음.

- **(1) 장 제목을 그림 이름으로 통일** — ⚠️ 표시 제목은 세 곳에서 온다. `CHAPTERS[n].title` 은 `CH_DEFS`/`CH20` 값이지만
  `rebuildQuests()` 안의 `C.title = S.title || C.title` 이 **`STORY[n].title` 로 덮어쓴다**(1~20장). 그래서 `STORY` 쪽도 같이 고쳐야 지도에 반영된다.
  바꾼 값(옛 → 그림 이름): 3 웃음이 핀 들판→광대의 유희장 · 4 썩은 미궁→청동 미궁 · 5 여우불 정원→고르곤의 정원 · 6 검은 강의 저택→스틱스의 나루 ·
  7 사슬 절벽→지하 감옥 투기장 · 8 외눈의 대장간→타르타로스의 대장간 · 9 (STORY는 이미 일치) · 10 이름 없는 수술실→이름 없는 왕좌 ·
  11 태엽 시계탑/거대 시계탑→시계태엽 탑 · 12 붉은 화로 공방/연금술 공방→연금술사의 실험실 · 13 모래 속 피라미드/피라미드 석실→사막 신전 ·
  14 태양의 보물고/황금 보물고→황금 풍뎅이 묘실 · 15 폭풍 속 유령선/유령선→유령 해적선 · 16 가라앉은 신전→심해 난파선 ·
  17 구름 위의 도장/구름 위 도장→구름 위 신선봉 · 18 황제의 지하릉/지하 황릉→고대 황궁 성벽 · 19 얼어붙은 호수→만년설 늑대 숲 · 20 균열의 제단→화산 심연.
  21~30장은 이미 `STORY50[n].t` 를 그대로 쓰므로 손대지 않았다. **맵 ID·퀘스트·세이브는 그대로**이고, 맵 이름(`S.names`, 예: 11장 야영지 '균열 너머의 불')도 그대로다.
  (16장은 적용 메모 5절 표에는 '이름이 같다'고 적혀 있지만 실제 `CH20[16].title` 은 '가라앉은 신전'이었고 그림·`STORY50` 은 '심해 난파선'이라 같이 맞췄다.)
  클리어 화면의 `다음 · N장 <이름>` 도 같은 이름이 되도록 스토리 `end.next` 문자열 16곳을 같이 바꿨다(퀘스트·세이브·맵 ID 아님).
- **(2) 막(Act) = 페이지 구조** — `WM_ACTS` 를 페이지 정의 표로 바꿨다. 한 줄이 한 페이지:
  `{ name:'1막 · 가라앉은 왕국', a:1, b:10, col:'150,176,212', bg:'worldmap_act1_bg.png', xy:WM_XY_ACT1 }` / 2막(11–20, `worldmap_act2_bg.png`, `WM_XY_ACT2`) /
  3막(21–30, `worldmap_act3_bg.png`, `floors`). 옛 `WM_XY`(20쌍)와 4장 단위 배지 5개짜리 표, 뒤에 있던 `WM_ACTS.splice(...)`, `WM_ACT3_FLOORS` 상수는 없앴다(성탑 층 좌표는 3막 행의 `floors` 로 이사).
  `wmBg(p)` 가 페이지 그림을 한 번만 만들고, `wmActPage(ch)` 가 장→페이지를 찾는다.
- **(3) wmDraw** — `PG` 대신 `ACT = WM_ACTS[PG]`, `N0=ACT.a`, `N1=Math.min(ACT.b, CH_LAST)`, `tw=!!ACT.floors`(성탑식 층 버튼).
  원형 노드는 `ACT.xy`(그 막 10장)만 쓰고, 좌표가 없는 장은 건너뛴다. 배지는 **페이지마다 그 막 하나만** 왼쪽 위(머리띠 아래 y=0.135, 성탑은 0.02)에 그린다.
  예전 '배지를 누르면 페이지 넘김'(`WM.pageHit`·`pageAt`)은 지웠다 — 페이지는 좌우 화살표와 Q·E 로만 넘긴다.
- **(4) 열 때 페이지** — `WM.page = wmActPage(G.map.ch)` (12장→2막, 24장→3막). `wmPage`/`wmTurn` 클램프는 `WM_ACTS.length-1`, 화살표 `disabled` 도 첫/끝 페이지 기준.
- **(5) 첫 열기 프리로드** — `toggleWorldMap` 을 감싼 프리로드가 `worldmap_bg.png`·`worldmap_act3_bg.png` 두 장만 기다리던 것을 `WM_ACTS.map(A => ASSET9 + 'ui/' + A.bg)` 로 바꿨다(막이 늘어도 자동).
- **(6) 접힘 스킬 탭을 우측 하단 구석으로 (같은 커밋, 사용자 1줄 요청)** — 1800 의 `#skills.fold{left:auto;top:50%;bottom:auto;right:calc(var(--u)*5);transform:translateY(-50%)}` 를
  `#skills.fold{left:auto;top:auto;bottom:calc(var(--u)*10);right:calc(var(--u)*10);transform:none}` 로 바꿨다(탭 크기·금테는 1800 그대로).
  1800 에서 스킬창 드래그를 없애 인라인 left/top 이 남지 않으므로 CSS 한 줄이면 된다. 실측 1280×720: 접힘 탭 21×75px 가 (1166,610)~(1187,684),
  프레임(80,67)~(1200,697) 기준 우측·아래 13px — 세로 가운데(≈382)가 아니라 아래 구석. 펴면 스킬칸 12개가 제자리로 돌아온다.
- **(7) 버전·패치노트** — `GAME_VER '261124-1815'`, `version.json`·`test/version.json` 같은 값, `NEWS.id '261124h'` + 새 버전 블록 5항목(cur), 이전 1745 블록은 cur:0.

**검증(헤드리스 크로미움, 1280×720 · 844×390)** — 전부 통과, `pageerror 0`:
- 페이지 3장 × 노드 10개 = 30개, 노드 중심과 `worldmap_act{1,2}_nodes.json` 좌표 최대 오차 **0.06px(PC)/0.48px(모바일)**.
- 이름표 겹침 **0**, 그림 밖 0, 머리띠(y<11.5%)에 걸림 0 (각 페이지).
- 장→페이지 자동 오픈 1·7·10→1막 / 11·15·20→2막 / 21·25·30→3막. 화살표 1→2→3→(막힘)→2→1→(막힘), Q·E 동일.
- 노드 11을 실제 마우스로 눌러 12장 캠프→11장 캠프 이동(4직업 전부), 24장에서 3막 층 10개, 필드 60fps.
- 4막을 표에 한 줄 추가하는 시험(런타임 주입): 4페이지가 열리고 위쪽 이름·오른쪽 화살표 막힘이 따라옴(31장은 아직 없는 장이라 노드는 안 그려짐).
- 인게임 패치노트: PC·모바일 모두 `261124-1815` 블록 5항목 표시.
- 남은 404는 예전부터 있던 `assets/ui/boss_clear_screen.png` 하나뿐. 401은 Firebase 인증이 없는 검증 서버 환경 때문(코드 아님).

**4막·5막 붙이는 법** — ① `WM_ACTS` 에 한 줄 추가(`{ name, a, b, col, bg, xy }`, 성탑식이면 `floors` 도) ② 그림을 `assets/ui/` 에 같은 이름으로 넣기
③ 장 데이터(`CH_DEFS`/`CH20`/`STORY50`)와 `CH_LAST` 를 그 막까지 늘리기. 페이지·좌우 화살표·상단 막 이름·장 범위·자동 오픈·프리로드는 표에서 자동으로 따라온다.

### 261124-1800  스킬창 제자리 고정 · 우측 열기 탭 · 귀환 이펙트 보강   (대상: index.html / test/index.html)
지시서: 2026-11-24 사용자 지시 "스킬창 고정 · 우측 열기탭 및 귀환 이펙트 보강" 3항목.
index.html 을 직접 고쳤고 test/index.html 을 같은 내용으로 다시 만들었다(1·3행만 다르고 4행부터 같음, 둘 다 24,916행).
새 그림·소리 파일은 넣지 않았다(모두 캔버스 그리기 + CSS + 기존 신스 사운드).

- **(1) PC 스킬창 드래그 제거 (원래 자리 고정)** — 1745 의 `skillBarDrag23()` IIFE 를 통째로 삭제했다
  (`pointerdown/pointermove/pointerup/pointercancel/blur/resize` 핸들러, `place()/fit()`, `window.placeSkillBar23`,
  `window.fitSkillBar23`), `buildSkills()` 끝의 `placeSkillBar23()` 호출, 접기 토글의 `fitSkillBar23()` 호출,
  주입 스타일의 `.frame:not(.touch) #skills{cursor:grab}` 까지. `localStorage['dr-skillpos']` 는 이제 읽지도 쓰지도 않으므로
  예전 값이 남아 있어도 무시된다(지우지도 않는다 — 사용자 데이터).
  실측(1280×720, 프레임 1120×630): `{"fx":.85,"fy":.85}` 를 미리 넣고 부팅 → `#skills` 인라인 style 없음, 기본 자리 left 845/top 572.
  마우스로 (스킬칸 → 200,120 → 화면 밖) 끌어도 845,572 그대로, 이후 마우스를 움직여도 따라오지 않음.
- **(2) 접었을 때 여는 탭 = 화면 오른쪽 끝 세로 가운데** — CSS 만으로: `#skills.fold{left:auto;top:50%;bottom:auto;right:calc(var(--u)*5);transform:translateY(-50%)}`,
  `#skills.fold .sktog` = 18u×64u, 금테 1px `rgba(232,176,72,.8)`, 금빛 세로 그라데이션 바탕 + 안쪽 금빛 그림자, hover 시 더 밝게, 화살표 `◀` + 세로 '스킬'.
  펼치면 fold 규칙이 빠져 원래 `right:10u;bottom:10u` 로 돌아간다(JS 로 자리를 계산하지 않는다).
  실측: 접힘 탭 21×75px, 프레임 오른쪽 끝(1200)에서 7px, 세로 중심 382px = 프레임 중심(67+630/2)과 일치.
  다시 누르면 845,572 의 338×113 스킬창이 열리고, 접기/펴기 3회 반복해도 같은 자리. 휴대폰(`.frame.touch`)은 `#skills{display:none}` 그대로(원형 버튼).
- **(3) 귀환 시전 이펙트 보강** — `playerFig()` 의 `p.cast > 0` 블록 재작성. 발밑 금빛 원반(방사형 그라데이션) + 세 겹 룬 고리(안/바깥 반대 회전) +
  룬 눈금 12개 + 높이 200~270px 빛기둥(위로 갈수록 옅어지고 좌우로 부드럽게 번지는 14단 + 가운데 심지 10px) + 올라가는 띠 5줄 +
  몸으로 빨려드는 불티 10개 + 진행 고리(바탕 5px → 금빛 6.5px → 흰 3px, 반지름 36, 캐릭터 머리 높이, 끝에 빛 알갱이).
  이전(1745): 40×150 기둥 + 얇은 타원 2개 + 6개 점 + 2.2px 호. 실측: 시전 1.45 → 0.87(0.56초 뒤), 화면 캡처 `.work/po/p24_cast0..3.png`.
- **(4) 귀환 도착 섬광이 야영지에서 터진다** — `tickCast()` 가 `scrollBurst23(p)`(떠나는 순간의 작은 섬광) 뒤에 `G.retFlag23 = 1` 을 남기고 `travel()` 호출.
  `travel()` 은 `loadMap()` **뒤** 260ms 에 `returnArrive23()` 을 부른다(예전엔 loadMap 이 `G.fx`/`G.parts` 를 비워 새 화면에서 아무것도 안 보였다).
  `returnArrive23()` = 새 fx `retburst`(금빛 고리 3겹 + 광선 8개 + 사그라드는 빛기둥 + 흰 중심) + `ring` 2개 + spark 48 + 불티 28 + 떠오르는 불티 16 +
  `flashW .5` + `shake(4)` + `sfx('ret')`(523·784·1047 + 종). `drawFx()` 에 `retburst` 그리기, `sfx()` 에 `ret` 케이스 추가.
  `travel()` 이 이미 이동 중이면(`G.ui.travel`) `retFlag23` 을 지워 다른 포탈 이동에 섬광이 묻지 않게 했다.
  실측: c1_a(외곽) x=400 에서 사용 → 1.6초 시전 → 0.48초 페이드 → `camp` x=760 도착, 그 프레임 fx `retburst,ring,ring`, 파티클 97~108, flashW 0.46, 주문서 -1.
  같은 시점의 1745 빌드는 fx 0·파티클 19(도착 섬광 없음).
- 버전: `GAME_VER '261124-1800'`, `version.json`(루트·test), `NEWS.id '261124h'`, 카드 8장(1800 + 1745·1710·1420·1310·1135·1040·0915), 1800 카드 4항목.
- 검증(헤드리스 Chromium 1280×720, index.html·test/index.html 둘 다, pageerror 0): 위 실측값 ①~④ + 패치노트 모달(새 카드 4항목)
  + 가방·퀘스트·특성·설정 창 열림 + 휴대폰 844×390(터치): 스킬창 숨김·터치 버튼 14개 화면 밖 0·오류 0.
  스크린샷: `.work/po/p24_2_fold_right.png`(우측 끝 접힘 탭), `p24_cast1_c.png`(시전), `p24_6_retburst_early_c.png`(도착 섬광),
  `p24_news.png`(패치노트), `p24_mobile.png`. 이전 빌드 비교: `p24_before_cast_c.png`, `p24_before_fold_full.png`, `p24_before_arr.png`.
  QA 스크립트: `.work/po/qa24_skillbar.py` (+ `qa24_visual.py`, `qa24_smoke.py`, `qa24_mobile.py`), 로그 `qa24_final.log`.

### 261124-1745  17장 보스방 폭 확장 · 양끝 구름 제거 · 스킬창 사라짐 수정   (대상: index.html / test/index.html)
지시서: 2026-11-24 사용자 메시지 "방 폭 늘려주고 저기 양끝에 있는 구름 사진 제거해줘"(17장 보스방 스크린샷 첨부) +
"그리고 스킬창 닫으면 아예 사라지는 버그 발생함 수정해줘".
index.html 을 직접 고쳤고 test/index.html 을 같은 내용으로 다시 만들었다(1·3행만 다르고 4행부터 같음, 둘 다 24,852행).
새 그림·소리 파일은 넣지 않았다(그리기만 걷어냄 + CSS).

- **(1) 17장 보스방 폭** — `setupArenas4()` 의 `Object.assign(MAPS[CHAPTERS[17].arena], { arenaL: 180, arenaR: 1100 })`
  → `{ arenaL: 40, arenaR: 1240 }` (다른 보스방과 같은 값, 맵 1280). 좌우 금빛 경계/외곽 어둠을 그리는 `drawFloorExtras23()` 은
  `m.arenaL/arenaR` 을 그대로 읽으므로 자동으로 넓힌 자리에 그린다(수정 없음).
  실측: 왼쪽으로 걸어가면 x 40(+반폭)에서 벽에 막히고, 오른쪽은 1240(-반폭)에서 막힌다. 낙하·피해 0.
- **(2) 17장 옥 바닥도 방 끝까지** — `ARENAS[17]` 의 `{ t: 'cliff', x0: 170, x1: 1110 }` → `{ t: 'cliff', x0: 40, x1: 1240 }`.
  방을 넓히면 예전 170/1110 밖은 구름뿐이라 바닥이 끊겨 보이므로 같이 넓혔다. `gimTick` 의 낙하 판정(`p.x < cliff.x0-10`)은
  아레나 클램프(arenaL+반폭+6) 안쪽이라 이제 발동하지 않는다(다른 보스방처럼 벽에 막힘).
- **(3) 양끝 네모난 구름 제거** — `drawCliff()` 첫 줄에 `if (g.x0 <= 64 && G.map.w - g.x1 <= 64) return;` 추가.
  바닥이 방 끝까지 이어져 밖으로 나가는 자리가 없으면 `prop_cloud_bank`/`prop_cloud_mist` 타일과 `prop_cliff_edge` 를 그리지 않는다
  (바닥이 다시 좁아지면 예전처럼 그린다). 17장 외 다른 맵은 'cliff' gim 을 쓰지 않아 영향 없음.
- **(4) 스킬창 접기 손잡이 가시성** — `.sktog` 를 14u→17u 로 넓히고 세로 '스킬' 라벨(`.sklb`) + 금테(접힘 상태 `.sktog` border/shadow,
  높이 40u→72u). `buildSkills()` 의 손잡이 마크업에 `<b class="ska">▶</b><i class="sklb">스킬</i>`,
  토글 핸들러는 `b.textContent=` 대신 `.ska` 만 바꾼다(라벨이 지워지던 문제).
- **(5) 스킬창이 화면 밖으로 날아가던 것** — `skillBarDrag23()` 재작성.
  저장 형식을 `{x%,y%}` → `{fx,fy}`(프레임 안 남는 여백 대비 0~1 비율)로 바꿔 창 크기가 달라져도 화면 안에 남고,
  예전 `{x,y}` 값도 `x/88` 로 이어받는다. 끄는 동안(`pointermove`)과 놓을 때(`pointerup`) 모두 프레임 안으로 클램프,
  `pointercancel`·`blur` 에서도 끌기 해제(창 밖에서 놓쳐도 안 붙잡힘), `resize` 에서 저장된 자리로 재배치,
  접기 손잡이(`.sktog`)에서는 끌기를 시작하지 않는다(누르면 접기/펴기만).
  `window.placeSkillBar23` 은 `buildSkills()` 가 칸을 다시 그린 뒤, `window.fitSkillBar23` 은 접기/펴기 뒤 부른다.
  실측(1280×720, 프레임 1120×630): 접힘 → 손잡이 20×84px 가 오른쪽 아래에 남고, 다시 눌러 펼쳐짐.
  오른쪽 아래로 끌고 놓으면 `left/top` 이 `freeX/freeY` 안으로 들어와 338×113 칸이 프레임 안에 완전히 들어옴(이전엔 88%/88% 로 203px 잘림).
  화면 밖(2000,2000)에서 놓아도 88%/88% 안으로 되돌아오고, 그 뒤 마우스를 움직여도 스킬창이 따라오지 않음.

### 261124-1710  23개 항목 정밀 수정 — 전투 · 맵 · UI · 설정   (대상: index.html / test/index.html)
지시서: 2026-11-24 사용자 지시 24개 목록(그중 미니맵 가시성은 1040 패치에서 이미 처리) → 07:43 메시지의 23개 항목.
index.html 을 직접 고쳤고 test/index.html 을 같은 내용으로 다시 만들었다(1·3행만 다르고 4행부터 같음, 둘 다 24,817행).
새 그림·소리 파일은 넣지 않았다(모두 기존 자산 + 캔버스 그리기).

- **(1) 필드몹 스폰이 벽에 박히던 것** — `genField()` 의 스폰 x 를 `360 + (w-600)·k` → `420 + (w-840)·k` 로(양 끝 420px 여백),
  `spawnMon()` 에서 `clamp(sp.x, 60+w/2, map.w-60-w/2)` 로 한 번 더 다듬는다. 실측 스폰 x 최소/최대:
  c10_a 444·3323 (w 3400), c17_a 528·3823 (3900), c20_b 531·4123 (4200) — 벽에 닿는 몹 0.
- **(2) 이펙트 투명도 설정** — `FXA()`(10~100%, `G.save.opt.fxa`), 설정(O) '화면·연출' 에 슬라이더(`data-fxa`)와 `#fxaV`.
  `renderWorld()` 에서 `drawProjs/drawFx/drawSkillFx`, `drawPfx/drawVfxStrips`, `drawParts` 를 `globalAlpha = FXA()` 로 감싸고
  `drawVfxStrips` 의 `c.globalAlpha = a` 도 `a*FXA()`. **전조·위험 장판(drawTelegraphs/drawHaz/drawAims)은 일부러 제외**(판단에 필요).
  실측: 같은 파티클 120개에서 화면 밝기 27.61 → 17.85 (30%).
- **(3) 음소거 아이콘** — `.hbtn.off` 위에 `#bMute.off` 전용 CSS(붉은 바탕 + 2.2u 굵은 사선 + "꺼짐" 배지 + 아이콘 회색). 다른 `.off` 버튼은 그대로.
- **(4) 아이템 줍기 지점 ↔ 석판/기둥 겹침** — `spotsFor()` 의 자리 조건에 배경 물건(`m.props`, 폭/2+50px)·기록 석판(`m.lore`, 90px)·NPC(90px) 회피 추가.
  전 맵 gather 퀘스트 201지점 검사 → 겹침 0.
- **(5) 10장 보스 클리어 후 퇴장 포탈** — `getPortals()` 의 `p_camp` 조건에 `|| G.boss.hp <= 0` 추가(연출·상태 리셋과 무관하게 보스가 쓰러졌으면 열림).
  실측: b10 처치 → `p_camp` 생성, x=640 에서 `↑` → c10_camp.
- **(6) 보스맵 퇴장 = 직전 자리** — `loadMap()` 진입 시 보스맵이 아니면 `G.save.prevPos = {id, x}` 기록, `bossExitGo()` 가 그 맵·좌표로 이동(없으면 기존 마을).
  실측: c10_a x1234 → 아레나 → 퇴장 → c10_a x1234.
- **(7) 보스방 좌우 끝 경계** — `drawFloorExtras23()`(drawGround 래퍼) 추가: `arenaL/arenaR` 바깥 110px 어두운 띠 + 세로로 솟는 금빛 경계선(260px, 위로 흐르는 눈금) + 바닥 경계 금.
  17장은 원래 `arenaL 180 / arenaR 1100`(맵 1280)로 좁게 잡혀 있어(설계) 그 좌표에 그린다. 19장 등 다른 보스방에도 같은 표시.
- **(8) 19장 빙판** — 같은 함수에서 theme `glacier` 일 때 바닥(GROUND~H)에 유리 광택 그라데이션 + 흐르는 반짝임 20줄 + 균열 + 지면 하이라이트.
  (물리 `slipK` 0.12 는 그대로, 보이는 결만 강화.)
- **(9) 퍼펙트 가드 쿨초 누락** — 가드 시작 시각 `p.guardAt = G.t` 를 남기고 `PERFECT_GUARD_WIN` 판정을 '남은 시간'이 아니라 '누른 뒤 경과'로 바꿨다
  (60Hz 스텝에서 남은 시간이 먼저 줄어 0.1초 경계가 최대 1프레임 일찍 닫히던 것). 안쪽 래퍼(24059행)와 새 바깥 래퍼 모두 같은 식.
  퍼펙트 직후 0.18초(`p.pgFree`)에는 다시 눌러도 쿨타임이 되살아나지 않는다. 실측: 0·60·99ms → cd 0, 120·200ms → cd 3, 퍼펙트 직후 재입력 → cd 0.
- **(10) 도적 독단검 귀환** — `REM_TICK.lykos` 의 C 투사체에 `home: k2>=3, pick: 30` 추가(예전엔 방향만 뒤집혀 시전 자리로 돌아갔다).
  실측: 단검 5자루 home=1, 캐릭터를 780으로 옮겨도 그 자리에서 회수.
- **(11) 드랍 2분 + 맵별 유지** — `DROP_LIFE = 120`, `DROP_STORE23`(맵→{at, drops}) + `loadMap` 래퍼가 나갈 때 저장/들어올 때 경과 시간만큼 `life` 차감.
  실측: 맵 이동 2초 뒤 복귀 life 117.1 그대로 남음, 130초 지난 뒤 복귀 → 사라짐.
- **(12) 품질 최상급 리롤 확인** — `#sureAsk` 모달 + `sureAsk()`, `uwClick` 의 `data-rq` 앞에서 `qualityOf(it) >= 3` 이면 확인.
  문구 "품질이 이미 최상급입니다. 돌리시겠습니까?" + 부제(0.5% · 품질석 1개와 골드). 그만두기 → 소모 0, 돌리기 → 품질석 -1.
- **(13) 보스 체력 %** — `#bossbar .bar` 안에 `#bossPct`, `updateBossBar()` 가 `Math.ceil(hp/mhp*100)+'%'` (100% → 38% 확인).
- **(14) 보스 HP 1.5배(6장~)** — `BOSS_HP_K(n) = n>=6 ? 1.5 : 1` 를 `bossHp9()` 에 곱한다(모든 보스 HP 의 단일 계산 지점, 숨은 보스·21~30장 포함).
  1~30장 전부 공식 대조 검증.
- **(15) 궁수 Shift(집중)** — HUD: `updateHud()` 의 스킬창·터치 쿨타임 계산이 궁수 's' 칸에서 `p.focusCd/FOCUS_CD` 를 쓰게 했다(왼쪽 `#focusChip` 은 집중 중에만 표시,
  `#focusChip.on{display:flex}`). `CHARS.kallisto.move` 설명을 활공 → 집중(10초 피해 2배, 재사용 25초)으로 수정.
  실측: 시전 직후 스킬창 S(이동기) 칸 25 → 24초 카운트, 왼쪽 표시는 집중 중에만.
- **(16) 궁수 S 가시성** — `remFxDraw()` 의 덫: 바닥 빛무리(가중 방사형) + 경계 고리 + 덫 그림 alpha 0.9(장전 전 0.6).
- **(17) 도적 S = 암습** — `castSkill` 래퍼에서 lykos 's' 를 직접 처리: `nearestTarget(420)` → 그 적의 반대편 `e.w/2+16` 뒤로 이동(아레나 클램프),
  `p.face = -side`(착지 후 상대를 봄), 무적 0.5초, `p.act = sk_s`, `G.execs.push({e, t:0, dur:0.06, rem:1})` 로 단타 배후 타격
  (기존 배후 타격 400%·25% 이하 즉사 로직 그대로 재사용). 적이 없으면 발동·쿨타임 소모 없음. 이름/특성 이름 정리:
  `TR_NEW.lykos.s = ['ly_s','그림자 습격','S 암습','암습']`, `SKILLS.lykos.s.desc` 도 암습 설명으로.
  실측: 적 오른쪽 200 → 도적이 46px 뒤(오른쪽)로 이동해 왼쪽을 봄, 400% 피해, 쿨 14초 / 적 없음 → 쿨 0·act 없음.
- **(18) 캐릭별 키세팅** — 저장 키를 `devil-renown-keys:<char>` 로. 처음 한 번은 예전 전역 키를 이어받고, `startGame` 래퍼에서 `loadBinds()` 재적용.
  실측: lykos 에서 jump=KeyQ → theron 은 기본값 → lykos 로 돌아오면 KeyQ.
- **(19) 스킬창 드래그(PC 전용)** — `#skills` 를 마우스로 끌어 이동, 위치를 `#game` 기준 %로 `localStorage['dr-skillpos']` 에 저장.
  터치(`IS_TOUCH`)면 동작하지 않는다(휴대폰은 원형 버튼). 실측: 338×112 바를 220,130 끌어 49.11% / 59.68% 저장.
- **(20) B 키** — `KEY_ACTIONS` 의 `m_music` 기본 단축키를 `[]` 로, 저장된 설정에 KeyB 가 있으면 한 번 지운다. 음악은 소리 설정 창에서.
  실측: B 입력 후 `AU.musicOn` 그대로 true.
- **(21) 궁수 idle 위아래** — `heroPose()` 의 숨쉬기 배율에 궁수만 `bk = 0.45`(sy ±1.8% → ±0.81%).
- **(22) 마법사 Z 직선 귀환** — `boomerTick()`: 바깥으로 `OUT_DIST(150)` 만큼 직선 → 곧바로 `ret` 으로 바꾸고 **매 프레임 현재 캐릭터 위치를 다시 조준**(`q.bA = atan2`),
  곡선 이징·유도 각속도 제거. 실측: 캐릭터를 300으로 옮긴 뒤 `q.bA` 와 `atan2(캐릭터-구체)` 차 0.000.
- **(23) 귀환 이펙트** — 시전 중: 발밑 회전 룬 2겹 + 룬 조각 6개 + 위로 오르는 빛기둥 + 남은 시간 고리(`playerFig`), 완료 순간 `scrollBurst23()`
  (섬광 파티클 30 + 금빛 링 + 화면 번쩍임). 실측: c10_a 에서 사용 → 1.6초 뒤 c10_camp 도착, 주문서 -1.
- 버전: `GAME_VER '261124-1710'`, `version.json`(루트·test), `NEWS.id '261124f'`, 카드 6장(1710 = 12항목 + 아래 1420·1310·1135·1040·0915).
- 검증(헤드리스 Chromium, 최종 파일, pageerror 0):
  ① 위 항목별 실측(각 항목에 적은 수치) ② 4직업 Z/X/C/A/S/D 3초씩 + 궁극기 → 오류 0, 몹 23마리 정상 ③ 가방·상점·퀘스트·특성·설정 창 열림
  ④ 휴대폰 844×390(터치): 터치 버튼 14개 겹침 0·화면 밖 0, 설정의 투명도 슬라이더 폭 104px 로 화면 안 ⑤ test/index.html(개발 빌드) 부팅·버전 일치.
  스크린샷: `.work/po/shot_settings_fxa.png`(설정 슬라이더 45%), `shot_news2.png`(패치노트), `shot_trap.png`(궁수 덫·집중 쿨),
  `t17_right_on/off.png`+`crop_right_on/off.png`(17장 경계 on/off), `cmp19_on/off.png`(19장 빙판), `shot_mobile_keys.png`, `shot_mute.png`.

### 261124-1420  원형 부채꼴 기술 버튼 + 랜덤 상자 가시성·타격감 4종 + 도적 이단 도약·X 스택 / 마법사 Z 사거리·HUD   (대상: index.html / test/index.html)
지시서: 2026-11-24 사용자 지시(모바일 원형 2열 호 기술 배치 · 도적 더블점프 거리 1/3 감소 · 클리어 후 맵 이동 시 도적 X 스택 2 버그 · 마법사 Z 가로 사거리 절반 + 쿨타임 숫자) + 같은 날 추가 지시(랜덤 상자 가시성·타격감 4가지, 상자 그림·판정 1.3배).
그림·소리 자산은 새로 넣지 않았다(기존 `assets/ui/btn_mob_*.png`·`assets/skills/*`·`assets/obj/random_chest_*` 그대로).

- **(A) 휴대폰 기술 버튼 = 동그란 금테 + 부채꼴 호** — CSS 와 `buildTouch()` 만. 컴퓨터 화면은 그대로.
  - CSS(위 1310 블록 끝): `.tb.rnd`(테두리 `calc(var(--u)*2.6) solid #c9a253`, `border-radius:50%`, 바깥 2겹 금빛 그림자) +
    `.tb.rnd .tbi`(아이콘을 원에 꽉 차게 `object-fit:cover; border-radius:50%; transform:scale(1.2)` — 아이콘의 네모 금테가 원 밖으로 나간다) +
    `.tb.rnd.big`(Z 전용 두꺼운 테), `.tb.rnd.ult/.leg`(그림자에 보라·금빛 유지), `.tb.rnd .kb`(키 배지 작게), `.tb.rnd .cdv`(아래를 둥글게).
  - `buildTouch()`: `ARC(R,a)`·`ring(R,s,list)` 도우미로 좌표를 계산한다. 중심은 큰 `z`(900,486, 76u),
    안쪽 호 r=112 · 58u — `kv`96° · `c`141° · `x`186°, 바깥 호 r=198 · 58u — `kf`95° · `kd`119° · `ks`143° · `ka`167°,
    최외곽 호 r=270 · 52u — `jump`91° · `guard`106° · `shift`121° · `up`136°(동작 버튼은 목업처럼 네모 그림 그대로).
    **data-k 는 기본 기술이 `z`·`x`·`c`** 여야 한다(`kx`/`kc` 로 두면 `pressKey` 가 먹지 않고 `.lyq` 배지도 붙지 않는다 — 한 번 잘못 넣었다가 고쳤다).
  - 검증: 844×390·932×430 아이폰 가로에서 조이스틱 포함 15칸 **BoundingBox 겹침 0**, 화면 밖 0, 원형 8칸. X·C·V·A·S·D 누름 → 각자 쿨타임(예 ka 6.74·kd 10.35·kv 89.5초), 가드 2.52초, Shift 는 누르는 동안 `IN.down.shift`.
- **(B) 랜덤 상자 가시성·타격감**
  - `BOX_W/BOX_H = 78/58`(그림 60×45 → 1.3배), `spawnBox()` 의 판정 `w/h 57/52`(44×40 에서 1.3배), 스폰 시각 `spawnT`·타격 시각 `hitAt`·`half` 추가.
  - `boxHit()`: `-1` / 5타마다 `N HIT!` 팝업(상자 위 96px 에서 띄고 좌우로 흩어진다 — 예전 25타마다 `n / need` 숫자는 뺐다), 티어 색 파편 4개,
    50% 순간 `sfx('boxbreak')`(새 합성음: bandpass 노이즈 + 짧은 하강음) + `shake(3.2)` + '반파!' 팝업.
  - `drawBoxes()`: 스폰 직후 2.6초 동안 후광이 더 크게 번지는 `fresh` 값 + 바닥에 깔리는 타원 빛, 그림 크기 `BOX_W/BOX_H`.
  - `drawBoxesTop(c, cam)` **새 함수**: 스킬·파티클 레이어 다음(`drawParts` 래퍼)에 그려 이펙트(`lighter`)에 절대 가려지지 않는다.
    티어 색 얇은 글로우 윤곽선(roundRect 2겹) + 상자 위 남은 타수 게이지·`hits / need` 숫자.
  - `#boxbar`(새 DOM, `BOX_BAR_CSS` + `boxHud()`): 화면 상단 중앙(보스 HP바 자리)에 `[황금 상자 95 / 180타]` 티어 색 게이지,
    마지막 타격 후 2.6초까지 표시, 타수(`el.dataset.hits`)가 바뀔 때 `bbwob` 애니메이션으로 출렁인다. `updateHud` 래퍼에서 호출.
- **(C) 도적 이단 도약 거리 2/3** — `DJ_XK = 1.15 * 0.80`(30° 비율 `DJ_TAN` 그대로).
  기존 보고 기준 484px(속도 769px/s) → 약 323px(속도 615px/s). 헤드리스 실측(정점에서 2단): 423px → 304px.
- **(D) 도적 X(그림자 걸음) 스택이 맵 이동 후 2로 되살아나던 버그**
  - 원인 1: `lyCh()` 가 `G.lyCh.save !== G.save` 면 상태를 **새로 만들어 q=2** 로 돌렸다 → 세이브를 다시 읽는 순간(화면 재로딩·`startGame`)
    남은 스택·충전 타이머가 사라지고 2로 보였다. 이제 `G.save.lyCh`(`lyChSave()` 가 매 틱 기록)를 이어받고, 세이브가 바뀌어도 직전 값을 들고 간다.
  - 원인 2: 맵을 넘어온 뒤 `p.cd`·HUD 배지(`.lyq`)·터치 쿨타임 글이 이전 값을 들고 있어 실제 스택과 어긋났다. `lyChSync()`(값 0~2·타이머 0~full 로 다듬고 `lyChApply`·배지 강제 갱신)를
    `loadMap` 과 `startGame` 래퍼에서 부른다(`HUDC.lyq = -1`). 배지는 예전에 `#touch .tb[data-k="x"]` 를 찾는데 버튼 키가 `kx` 로 잘못 들어가 **아예 안 붙던 것도 함께 고쳤다**.
  - 검증(844×390): X 한 번(q2→1, t 3.7) → `loadMap` c3_camp → c3_arena → c4_camp 거쳐도 q=1 유지·배지 1, 세이브에 `1/2.4` 기록.
    같은 세이브로 `startGame` 재시작(=화면 다시 열기) → q=1 (예전 빌드는 q=2, 세이브에 lyCh 없음).
- **(E) 마법사 Z 부메랑**
  - `OUT_DIST 400 → 150`: 화면에서 보이는 나가는 최대 거리 503px → 253px(절반). 死코드인 예전 `maxDist: 420` 자리도 210 으로 맞춰 두고 주석에 "실제는 OUT_DIST" 를 적었다.
  - `mageBoltLeft(q)` 새 함수 + `updateHud` 래퍼: Z 칸의 `'회전'/'복귀'` 글자를 **남은 예상 시간(초)** 으로 바꿨다(나갈 때 `(OUT_DIST-dist)/bSp`, 돌아올 때 거리/1.4배 속도).
    휴대폰 Z 버튼의 쿨타임 글·어둠 높이도 같이 갱신하고, 탄이 사라지면 비운다. `HUDC.mzt/mzbv/mzbt` 로 바뀜을 감시.
- 버전: `GAME_VER '261124-1420'`, `version.json`(루트·test), `NEWS.id '261124e'`, 카드 5장(1420 = 5항목 + 아래 1310·1135·1040·0915).
- 검증(헤드리스 Chromium, 최종 파일): 모바일 844×390·932×430 겹침 0·화면 밖 0·pageerror 0, 기술 발동(X 쿨 3.1·C 5.98·V 궁극 89.5초),
  상자 스폰 후 3타 → 상단 게이지 `신화 상자 3 / 260타`·폭 1.2%, 팝업 `-1`, 50%에서 `half=1`·`반파!`, 130/260 에서 폭 50%,
  큰 이펙트 위에서도 윤곽선·게이지 유지, 컴퓨터 1280×720 은 터치 숨김·기술 줄 flex 그대로.
  스크린샷: `downloads/mobile_arc_844x390.png`(원형 부채꼴), `.work/p13/arc_932x430.png`, `.work/p13/box_hit_m.png`,
  `.work/p13/box_vfx_m.png`(이펙트 위 윤곽선), `.work/p13/box_aura_m.png`, `.work/p13/news_1420.png`.

### 261124-1310  휴대폰 전용 UI/UX(원형 조이스틱 · 두 줄 기술 · ≡ 접이식 메뉴) + 세계 지도 화살표만 + 떠돌이 상인 아이콘·특가·구매 오류 구분   (대상: index.html / test/index.html + assets/ui + assets/items)
지시서: 2026-11-24 사용자 지시(휴대폰 전용 조작 전면 교체 → 이어서 세계 지도 배지/화살표, 떠돌이 상인 아이콘·가격, 상인 구매 버그 3건).
index.html 을 직접 고쳤고 test/index.html 을 같은 내용으로 다시 만들었다(1·3행만 다르고 4행부터 같음, 둘 다 24,318행).

- **새 그림(그림이라 조각 파일과 무관)** — `assets/ui/` + `test/assets/ui/`: `joy_base.png`(192×192) `joy_knob.png`(96×96)
  `btn_mobile_menu.png` `btn_mob_jump/guard/shift/interact/potion/scroll.png`(각 64×64), 출처 `downloads/mobile_ui_assets_pack/assets/ui/`.
  `assets/items/` + `test/assets/items/`: `item_inherit_stone.png`(64×64, 계승석 — 없던 그림이라 새로 만들었다: 금테 + 금빛 돌 + 위 화살표·맞물린 고리).
- **(A) 휴대폰 전용 UI/UX** — `IS_TOUCH` 일 때만. 컴퓨터 화면(`.frame` 에 `touch` 클래스가 없을 때)은 CSS·DOM·동작 모두 그대로다.
  - CSS: `#touch{display:none}` 아래 **`.frame.touch …` 블록 전체**를 새로 썼다(`.frame.touch .tb` 부터 `#mobMenu` 까지).
    `.tb` 는 원형 → 아이콘이 들어가는 둥근 사각 칸(58~74u)으로, 안에 `<img class="tbi">`+키 배지(`.kb`)+수량(`small`)+쿨타임(`.cdv`/`.cdt`)이 들어간다.
    위치는 buildTouch 가 인라인 `left/top/width/height`(calc(var(--u)*n)) 로 넣는다.
  - `buildTouch()` 전면 교체: 좌하단 `#joy`(joy_base + `#joyKnob` joy_knob, 176u) + 그 위 연고·귀환 퀵슬롯,
    우하단 두 열 — 안쪽 Z·X·C·궁극기(V), 바깥 각성 A·S·D·무기 기술(F) —, 그 위 한 줄에 ↑상호작용·Shift·가드·점프.
    손가락 방향/거리로 left·right·up·down 을 누르고(`pressKey`/`releaseKey`), 손을 떼면 노브가 가운데로 돌아오며 입력이 모두 풀린다.
    버튼 그림은 기술 칸과 같은 `assets/skills/*`(=`skillIconSrc`), 동작 버튼만 새 모바일 그림(`MOB_BTN_ART`).
    한 번 쓰는 기술은 손을 뗄 때 나가고 350ms 누르면 설명이 뜨는 규칙, 대화 중에는 넘기기 — 예전 그대로.
  - `buildMobMenu()` 추가(초기화에서 `buildTouch()` 다음에 호출): 상단 오른쪽 `전체맵·가방·≡` 세 개만 남기고
    나머지 9개(특성·미니맵·음향·파티·채팅·온라인·트로피·설정·가이드)를 `#mobMenu` 드로어로 옮긴다(3×3, `#hud` 안).
    드로어가 열리면 `#game` 에 `mob-menu` 클래스가 붙어 터치 조작이 흐려지고 눌리지 않는다. 바깥을 누르면 닫힌다.
  - `chipHost(id)` 추가: 버프(`#blessChip`)·집중(`#focusChip`) 칩을 휴대폰에서는 `.hud-tl` 의 경험치 줄 뒤로 넣어 왼쪽 위 정보 줄에 붙인다(컴퓨터는 예전처럼 `#game` 에 absolute).
  - `buildSkills()` 의 터치 칸 갱신 줄: 이름 글자 대신 키 배지(`shortKey(BINDS[k])`)만 갱신하고, 아직 못 쓰는 기술은 숨기지 않고 `off`(흐림)로 둔다 — 두 열 자리가 밀리지 않게.
  - `updateHud()` 의 퀵슬롯 수량 문구를 `연고 3` → `×3` 로(칸 아래 배지).
- **(B) 세계 지도** — `wmDraw()` 의 `badges`: 3막 페이지의 `◀ 1막 · 2막 지도` 배지와 1막 페이지의 `3막 ▶` 배지를 없앴다(이제 글자 이름표뿐, `go` 없음 → `WM.pageHit` 0).
  페이지는 좌우 화살표(`#wmPrev`/`#wmNext`)로만 넘긴다. `.wmArrow` 크기 64u → **32u**(절반), `title`/`aria-label` 에 Q·E 힌트.
- **(C) 떠돌이 상인** — `MER_GOODS`: 계승석을 `<span class="mer-gl">계</span>` 에서 `item_inherit_stone.png` 로, 연고·귀환은 `pimg()` 대신 `pixIcon()` 을 `mer-ic` 로.
  `.mer-i` 를 36×36 칸(테두리·배경)으로, `.mer-ic` 를 32×32 로 고정(다섯 줄 모두 같은 크기), `.mer-row` 첫 칸 40u → 44u.
  값: `merPrice()`(5골드 단위 반올림) + 연고·귀환 = 일반 상점가 × 0.7, 품질석 ×1.0·잠재석 ×1.3·계승석 ×3·무료 잠재 변경권 ×8 (예전 1.6·2·5·12배 → 특가).
- **(D) 상인 구매 버그** — `merClaim()` 이 `true/false` 대신 `'ok'|'sold'|'conflict'|'local'` 을 돌려준다. `merReadOne()` 추가(ETag 헤더를 붙여 보고, 브라우저 CORS·서버가 거절하면 조건 없이 한 번 더 — `MER.noEtag`).
  `merBuy()` 는 `sold` → 품절, `conflict`(진짜 412 세 번) → 방금 다른 사람이 사 갔다, `local`(연결 실패·401/403·그 밖) → 이 기기에서만 수량을 세고 물건을 준다. `merDenied()` 문구도 로그인 없음/규칙 막힘을 나눈다.
  → 아무도 사지 않았는데 '다른 사람이 사 갔다'로 막히고 물건을 못 받던 문제가 없어진다.
- 버전: `GAME_VER '261124-1310'`, `version.json`(루트·test), `NEWS.id '261124d'`, 카드 4장(1310 = 8항목, 그 아래 1135·1040·0915).
- 검증(헤드리스 Chromium, 최종 파일): 모바일 844×390·932×430 (겹침 0 — 컨트롤+상단 버튼 전부 BoundingBox 비교, 화면 밖 0,
  조이스틱 좌/우 이동 ±124, 위로 밀면 대화 열림·손 떼면 복귀, X 쿨타임 3.1초 표시, Z 누르는 동안 공격, F 흐림 유지,
  ≡ 드로어 9개·특성 창 열림·바깥 클릭 닫힘, 수량 ×3/×1) + 컴퓨터 1280×720(터치 숨김·기술 줄 flex·상단 버튼 11개·≡ 없음)
  + 세계 지도(화살표 37px=32u, 페이지 배지 0, 화살표로 1↔3 페이지) + 상인(아이콘 칸 42px·그림 37px 동일, 계승석 새 그림,
  연고 105/귀환 950 = 상점가 0.7배, 돌 4종 예전보다 70%↓, 정상 구매 → 서버에 left 기록, 412 1회 → 재시도 성공, 계속 412 → 안내만,
  연결 실패 → 물건 지급·안내 없음, 401 → 안내 + 지급) + test 빌드 동일 + pageerror 0 + 새 그림 404 0.
  스크린샷: `.work/po/mobile_applied_844x390.png`, `mobile_drawer_open.png`, `mobile_932x430.png`, `mobile_buffchip.png`,
  `pc_1280_720.png`, `wm_page1.png`, `wm_page2.png`, `merchant_panel.png`.

### 261124-1135  랜덤 상자 3프레임 교체 + 인게임 패치노트 새 UI   (대상: index.html / test/index.html + assets/obj)
지시서: `claude_code_8_traits_guard_shrine_prompt.txt` 5-3절(상자 3프레임) + 2026-11-24 사용자 지시(패치노트 UI 전면 교체).
바로 아래 261124-1130 커밋(5adeb1f·2cd7091)의 마무리다. index.html 을 직접 고쳤고 test/index.html 에 같은 내용을 넣었다
(1·3행만 다르고 4행부터 완전히 같음, 둘 다 24,199행). 원본 조각으로 옮길 때의 대상:

- **상자 3프레임 자산 교체** (`assets/obj/` + `test/assets/obj/`, 그림이라 조각 파일과 무관):
  `random_chest_{wood,silver,gold,mythic}.png` 128×128 한 장 → **384×128 3프레임 스트립**(셀 128×128, 0=닫힘 / 1=반쯤 열림·빛줄기 /
  2=갈라져 부서짐)로 교체. 출처 `downloads/steam_polish_assets_pack/assets/obj/`. 코드는 이미 폭으로 판별한다
  (`naturalWidth>=380 ? 3프레임 : 한 장`) — 그림만 갈아 끼웠고, 보이지 않게 `?v=GAME_VER` 로 캐시를 갱신했다.
- **(A) 인게임 패치노트 UI 전면 교체** `56f_news.js`(추정): `const NEWS` 부터 `newsShow()` 끝까지 통째로 교체.
  - 데이터 구조: `NEWS = { id, title, sub, versions: [{ ver, date, name, cur?, items: [{ t, h, p, q }] }] }`
    (`t`=분류 배지 전투/성장/월드/보상/UI/시스템, `h`=제목, `p`=본문, `q`=작은 팁).
    카드 3장 — **1135**(9항목): 특성 15단계·누적 수치·마법사 X·겹침 580곳·퍼펙트 가드·랜덤 상자·축복의 제단·Z 부메랑·상자 3프레임 /
    **1040**(13항목): 도약 30도·보스 소개 즉시·권장 전투력 2/3·골드 키패드·빈 방 가드·9장 오네이라·29장 개기일식·보스 0.8배속·궁수 집중·
    거래 UI·세계지도 화살표·프리로드·보스 세 종 다리 / **0915**(9항목): 이름 없는 자 골드·2장 레테이아·배경 패럴럭스·떠돌이 상인·
    방어구 직업 제한·거래 스크롤·도적 거리·아이템 40초(변경 없음)·상인 문구.
  - 화면: `document.body` 에 붙는 `position:fixed` 모달. 게임 화면 배율(`--u`·`.frame`) **밖**이라 화면 픽셀로 그린다.
    픽셀 폰트(Galmuri) 대신 시스템 한글 폰트 + 안티앨리어싱 + `image-rendering:auto` (도트 느낌 제거, 사용자 지시).
    구성 = 머리(제목·부제) / 스크롤 본문(`.nsc` flex:1) / 바닥(안내 + `모험 계속`) + **우측 상단 ✕(`.nx`, aria-label="닫기")**.
  - 아코디언 2단: 버전 카드(`.nvh`, 최신 카드만 열린 상태로 시작) → 항목(`.nih`, 누르면 `.nid` 의 본문·팁이 펼쳐지고 `+`가 `×`로 돈다).
    **닫는 길 4가지** — ✕ / Esc / 바깥 어두운 곳 클릭 / `모험 계속`. 넷 다 같은 close() 로 `s.flags['news_'+id]`·계정 기록·`localStorage`·`writeSave()`.
  - 띄우는 조건·한 번 보기 규칙은 그대로: `s.time>60`, `s.flags`·계정 기록·`NEWS_KEY(devil-renown-news:)` 셋 중 하나라도 있으면 안 뜬다.
  - 창이 떠 있는 동안 `window` keydown 캐데트로 게임 입력 차단(Esc 만 닫기). 스타일은 `newsStyle()` 이 `#newsStyle` 로 1회만 주입.
  - **글쓰기 규칙(사용자 지시)**: 함수·변수·파일 이름 금지. 게임에서 실제로 달라지는 것과 확률·수치만 적는다.
- 버전: `GAME_VER '261124-1135'`, `version.json`(루트·test) 같은 값, `NEWS.id '261124c'` (GAME_VER 과 함께 올린다).
- 검증(헤드리스 Chromium, 최종 파일): 상자 11항목 = 정지 F0(sx 0) / Z 실제 공격 F1(sx 128) / 50% 미만 복귀 F0 /
  50% 이상 F1 유지 / 파괴 F2(sx 256) / 0.62초 제거 / 보상 지급 / 4티어 F2 / 3프레임 384×128 로드 / 404 0 / pageerror 0.
  패치노트 23항목 = PC 1280×720(최신 카드만 열림·다른 카드 클릭 펼침·항목 상세 펼침·본문 868px 스크롤·✕/Esc/바깥클릭/버튼 닫기·
  글꼴 antialiased·image-rendering auto) + MO 390×844(전체 화면·✕ 터치·카드 터치 펼침·항목 터치 펼침·695px 스크롤·✕ 터치 닫기) +
  test 빌드 동일. 스모크 7항목 = 4직업 필드 10초 60fps·pageerror 0, 창이 떠 있으면 이동키 차단(dx 0)·닫은 뒤 dx 174.
  스크린샷: `.work/po/news_ui_pc_{1,2,3}.png`, `news_ui_mo_{1,2,3}.png`, `shot_chest_f2.png`.

### 261124-1130  8개 항목: 특성 15단계 연출·누적 수치 · 마법사 X 전용 이펙트 · 전맵 포탈/가로등 겹침 · 퍼펙트 가드 · 랜덤 상자·축복의 제단 · Z 귀환/HUD   (대상: index.html / test/index.html + assets)
지시서: `claude_code_8_traits_guard_shrine_prompt.txt` (기준 cec0a79). index.html 을 직접 고쳤고
test/index.html 에 같은 자리로 넣었다(1·3행만 다르고 4행부터 같음, 둘 다 24,041행). 원본 조각으로 옮길 때의 대상:

- **(1) 특성 15단계 밸런스·연출** `55_growth.js`(추정) + `50_ui.js`:
  `TR_BAL`(tpMax 149 · 특성당 30 · 여섯 180 · 누적 피해 5/10/11~14/15단계 = 30/75/81~99/124%) 상수로 감사표를 남김.
  `traitTotals/traitSumText` 추가(tDmg·tCd·traitRank 를 그대로 따라 계산, ka1 공속·mg1 방어막·th_s 지속 예외),
  `traitsHtml` 새 판 — 카드마다 `<div class="tsum1">누적 · …</div>`, 위 합계 줄은 여섯 특성 합 + 포인트 한도,
  초기화 버튼 유지. CSS `.tsum1`·`.tcard.t6` 여백/행높이/#pBox 패딩(창이 스크롤 없이 들어오게).
  `pfx` 래퍼: `TIER_FX` 표(5 금빛 / 10 보라+진홍 / 15 금백+이중 고리+플래시)로 단계별 색·층 분리('impacts/' 통과),
  `topTraitTier`+`TRAIT_AURA` 로 발밑 단계 고리. 실측: rank0/5/10/15 → 고리 0/255,206,120/176,80,240/255,244,205,
  스파크 0/14/27/38, TIER_SC 1/1.1/1.2/1.3.
- **(2) 마법사 X 전용 이펙트** `56j_mage.js`: `MAGE_VFX.x_bolt`(1024×256, 셀 256, sc 1/4, ms 60/70/80/120),
  `mageVoidBolt` 래퍼의 pierce 경로를 `kind:'voidx'`(w 56 h 40, pierceN, fx2)로, updateProjs 래퍼가 0→1→2 프레임·
  3관통 폭발·F4 잔광, drawProjs 래퍼가 궤적 줄기+잔상, startGame 에서 `mageImg('x_bolt')` 예열.
- **(3) 전맵 겹침** `56g_maps.js`/`56q_props.js` 끝: `MAP_PROP_SIZE`·`mapOverlaps`/`mapAuditAll`/`fixMapLayout`,
  시작 시 전 맵 1회 + `loadMap` 래퍼마다 `getPortals()` 로 재점검. 발판은 옮기고(폭 유지 → 최소 90px 축소),
  소품은 가까운 빈 자리로 옮기고 자리가 없으면 뺀다. 포탈은 옮기지 않는다.
  실측 580건(portal-plat 85 · prop-portal 67 · prop-plat 428, 159개 맵) → 0건. 소품 466 이동 · 발판 26 · 소품 35 제거, 158개 맵 변화.
- **(4) 퍼펙트 가드** `30_combat.js`+`50_ui.js`: `PERFECT_GUARD_WIN = 0.1`, `parry` 래퍼에서
  `p.guard >= GUARD_WIN - 0.1` 이면 `p.cd.g = 0`·`pgCount++`·PERFECT GUARD! 팝·금빛 4프레임·`sfx('pguard')`,
  기본 청록 hit_guard 스트립은 큐에서 제거. `skillTip('guard')` 에 0.25초/0.1초 문구. GUARD_WIN 0.25 는 그대로.
  실측: 0.02/0.05/0.099/0.1초 → cd 0, 0.101/0.15/0.2초 → cd 3, 연속 2회 성공.
- **(5) 랜덤 상자·축복의 제단** 새 조각 `63_box_shrine.js`(권장): `BOX_TIERS`(나무 1~50 / 은 51~120 / 황금 121~220 /
  신화 221~300, 가중 55/28/13/4), `BOX_CHANCE .25`·`BOX_CD 900`, `SHRINE_CHANCE .35`·`SHRINE_CD 600`,
  `G.save.boxCd/shrineCd`(플레이어별 로컬 — live/party 기록에 싣지 않는다), `spawnBox`(gimT 에 **`rbox`** 로 등록),
  `boxHit`(bounce/flash/게이지), `boxOpen`(0.34초 뒤 보상, 0.62초 뒤 제거), `drawBoxes`(obj/random_chest_*, 60×45,
  3프레임 384×128 판별), `spawnShrine`/`shrineUse`/`blessTick`/`blessHud`(`#blessChip`), `updateInteract`·`interact`
  래퍼(제단 ↑), `dealDamage`·`gainXp` 래퍼 + updatePlayer 이동·공격속도 두 줄에 `blessSpd()/blessAs()`.
  실측: 400회 진입 → 상자 30.8%·제단 33.8%, 15분 쿨 차단, 4티어 보상, 0.34초 지연 지급, 파티 2클라이언트 독립.
- **(6) Z 귀환 궤적·HUD** `56j_mage.js`+`50_ui.js`: 부메랑을 `bph out/turn/ret` 로 직접 굽는다(400px 에서 0.16초
  smoothstep 각도·속도 이징, 470→658, `rate = 7 + 20×min(1,|da|/1.1)`, 26px 회수). `updateHud` 래퍼가 `#sk0` 에
  '회전/복귀' + 남은 비율. 실측: 최대 프레임 각도 변화 0.45rad(이전 즉시 π 반전), 왕복 1.6초, HUD 100→4% / 100→13%.
- 새 자산(assets/ 와 test/assets/ 같은 경로): `vfx/mage_x_bolt.png`(1024×256) `vfx/perfect_guard_fx.png`(1024×256)
  `obj/random_chest_{wood,silver,gold,mythic}.png`(128×128, 3프레임 스트립으로 교체 예정) `obj/blessing_shrine.png`(128×160)
  — 출처 `downloads/steam_polish_assets_pack/`.
- 버전: GAME_VER '261124-1130', version.json(루트·test) 동일. → 마무리 커밋에서 **'261124-1135' 로 올라갔다**(위 1135 항목 참고).

### 261124-1040  12개 개선 + 궁수 집중 + 29장 개기일식 + 프리로드 + 보스 다리 복구   (대상: index.html / test/index.html + assets)
지시서: `claude_code_12_polish_eclipse_prompt.txt` (기준 bc0ca55). index.html 을 직접 고쳤고
test/index.html 에 같은 자리로 넣었다(1~3행만 다르고 4행부터 완전히 같음, 둘 다 23,420행).
헤드리스 크롬으로 12+2항목을 항목별로 재서 전부 통과(아래 "검증 수치"). 원본 조각으로 옮길 때의 대상(식별자로 찾는다):

- **(1) 도적 이단 도약 30도** `30_combat.js`: `LY_DJ_X`(0.6) 삭제 → `const DJ_TAN = Math.tan(Math.PI/6), DJ_XK = 1.15;`
  updatePlayer 의 도적 2단 점프 블록: `p.vx = fd*V*DJ_XK; p.vy = -p.vx*DJ_TAN; p.ljT = 0.55;`
  실측 56.5°(상승 112·이동 215) → 30.0°(상승 48·이동 484).
- **(2) 보스 소개 즉시** `30_combat.js`(updateBoss `case 'wait'`): `wakeNow = !!G.map.boss || p.x>wakeX || netWake()`
  → 보스방 loadMap 직후 컷신. 1·30장 x=120/140에서 확인.
- **(3) 권장 전투력 2/3** (recCp 덮어쓰기 — 보스 밸런스 조각, 추정 `55_boss9.js`): `Math.round(calcStats(specSave(n)).cp * (2/3))`.
  실측 10장 32,276 → 21,517.
- **(4) 거래 골드 키패드** `60_trade.js`: 입력칸 `type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done"`,
  `trGoldSet`(숫자만·클램프), focusin/out 로 `G.ui.trTyping`(재렌더 금지 1.2초), 전역 keydown 첫 줄에
  INPUT/TEXTAREA/SELECT/contenteditable 가드(30_combat 키 처리 + 퀘스트/트로피 좌우키 capture 2곳).
- **(5) 1~30장 빈 사냥방 점검+가드** 새 코드 `auditRooms()`(12번과 같은 새 조각): A/B/문턱 111방을 훑어
  MON 있는 스폰이 0이면 그 장의 잡몹 15+정예1로 채우고 `console.warn('[rooms] …')`.
  ※ bc0ca55 실측: 빈 방 0(방당 12~32마리). 사용자가 본 "30장 보스 직전 방"은 재현되지 않음 — 안전장치만 넣음.
- **(6) 9장 = 몽마 오네이라** `10_data.js`(CH_DEFS 9장 이름·boss·wake) + `16_story`(STORY50[9]) +
  `56z_act3.js`(STORY50_RENAME): 크리오스→오네이라 쌍 삭제, 반대 방향 `['거신 크리오스','몽마 오네이라'], ['크리오스','오네이라']` 추가.
  맵: 갈비뼈 아래의 불 / 눈 내리는 무덤 / 꿈의 회랑 / **몽마의 침실**, 퀘스트 obj '몽마의 침실에서 오네이라 처치'.
- **(7) 29장 개기일식** (달·월식 조각, 추정 `56z2_boss30.js`): `moonImg`/`MOON_IMG`/moon_phases_29.png 제거.
  `MOON_FULL=42`, `moonK()`, 코드로 그리는 보름달+검은 원(오른쪽에서 슬라이드)+코로나, `#moonWarn`(화면 테두리+3·2·1·가드 카운트다운+바닥 띠),
  즉사는 그대로 가드만 통과(pure 102%). 달은 `cx = cam.x + W*0.78, cy = 176` 화면 고정.
- **(8) 보스 0.8배속** `30_combat.js`+`56z`+`56z2`: `BOSS_PACE=0.8, BOSS_INV=1.25`.
  updateBoss(wrapper) 첫 줄 `dt *= BOSS_PACE`, `b.tele.dur *= BOSS_INV`(1회), tg9.dur·addHaz(warn/act, src.isBoss)·vfx9Tick·walk9Tick·a3cloneTick·
  moonTick·b22/b29 오라, bossAnimTick·proj(보스 투사체) wrapper. 실측 전조 0.85→1.067s, 시전 0.9→1.133s, 투사체 400→320.
- **(9) 궁수 집중** `30_combat.js`+`40_render.js`+`50_ui.js`: 활공은 마법사만, 궁수 Shift → `FOCUS_T=10/FOCUS_CD=25`,
  dealDamage `* (focus>0 ? 2 : 1)`, `drawFocusAura`(발밑 링+등 뒤 빛), 화살 pfx gold + 금빛 잔상, `#focusChip` HUD(남은 시간/쿨/Shift),
  `focus_ping` 합성음, newPlayer 에 `focus/focusCd`. 실측 데미지 466→932.
- **(10) 거래 UI** `60_trade.js`: tradeHtml 새 2단(내 제안 | 상대 제안 + 가방 7열) + `.tr-frame` 9-slice(ui_trade_frame.png 64 fill)
  + 배지(잠금/수락) + 골드 빠른 입력(data-tradd) + `.tr-bag` `repeat(7,minmax(0,1fr))`(가로 잘림 0), CSS 전면 교체.
- **(11) 세계지도 화살표** `55x_worldmap.js`+`60_audio.js`: 머리줄 `wmPg0/wmPg1` 삭제 → `#wmPrev/#wmNext`(.wmArrow, btn_wm_prev/next.png, 좌우 1.1%),
  `wmTurn()`, wmPageUi 비활성, `wmPage` 에서 `sfx('wm_turn')`, `SFX_FILES.wm_turn='wm_page_turn.wav'` + 합성 폴백 case.
- **(12) 프리로드** 새 조각(맨 끝, `63_polish1124.js` 권장): `PRE_IMG/preImg/preAll/preRace/mapArtUrls/bossPreUrls/mapVeil`,
  loadMap(70ms 여유+1.2s 안전 해제 veil, 보스 시트·스트립 예열), travel(프리로드 후 이동), toggleWorldMap(배경 2장),
  showTitle(제목 배경), startGame(맵·스킬 아이콘 예열, 동기 유지), 장비 아이콘 72장 백그라운드.
- **(13) 보스 다리 복구 자산**: `assets/boss/b11_48f.png · b19_48f.png · b20_48f.png` (+ test/ 같은 경로) 교체.
  b20 은 대기 8프레임 중 7프레임에서 무릎 아래가 잘려 있었고, 나머지 29종은 정상(1,440프레임 전수).
  `bossSheetLoad` 의 `im.src` 에 `?v=GAME_VER` 추가(같은 파일명 캐시 회피).
- **(14) 인게임 패치노트** `56f_news.js`: `NEWS.id '261123c' → '261124b'`, items 12줄(3페이지)로 교체.
  **GAME_VER을 올릴 때 NEWS.id도 함께 올린다**(같으면 다시 안 뜬다).

새 자산(모두 assets/ 와 test/assets/ 같은 경로):
`ui/ui_trade_frame.png`(480×300) `ui/btn_wm_prev.png` `ui/btn_wm_next.png` `ui/ui_trade_gold.png` `ui/ui_trade_lock.png` `ui/ui_trade_check.png`(각 64×64)
`sfx/wm_page_turn.wav`(44.1k 모노 16bit, 0.62초, 피크 -1.0dBFS, 클리핑 0)
삭제: `vfx/moon_phases_29.png` (+ test/ 사본)
버전: GAME_VER '261124-1040', version.json(루트·test) 동일.

검증 수치(헤드리스 크롬, bc0ca55 → 이 커밋): 1번 30.0°/48/484 · 2번 x=120 컷신 · 3번 ×2/3(10장 21,517) · 4번 1500 입력/클램프 ·
5번 111방 빈 방 0/가드 16마리 · 6번 크리오스 0건 · 7번 휘도 240→5·경고 1.6s·가드 생존 · 8번 ×1.25 전조·시전/투사체 ×0.8 ·
9번 ×2.000·10s/25s·HUD · 10번 7열·잘림 0·패널 685px · 11번 좌우 12px·wm_turn 1회·wav 0.62s · 12번 map9Now 즉시·maps 404 0 ·
13번 b20 2048²·하단 잉크 y239~240 · 14번 새 소식 뜨고 3페이지·닫힘 플래그. 4직업 회귀(필드 10초+보스 15초) pageerror 0.

### 261124-0915  8개 개선(P1~P8) + 떠돌이 상인 + 방어구 직업 제한   (커밋 이 커밋, 대상: index.html / test/index.html)
지시서: `claude_code_wandering_merchant_8_prompt.txt` (기준 737fc12). index.html 을 직접 고쳤고 test/index.html 에 같은 자리로 넣었다
(1~3행만 다르고 4행부터 완전히 같음). 원본 조각으로 옮길 때의 대상(식별자로 찾는다):
- P1 `30_combat.js`(추정): `ANON_CHANCE` 줄 아래 `ANON_GOLD` 추가, `anonDefeated` 의 `const gold = …` 한 줄을 `ANON_GOLD(n)` 으로.
  보상 곡선 1장 1,000 ~ 30장 300,000 (2장 1,220 · 10장 5,870 · 20장 41,970). 장비 드랍·8% 무료권·파티클은 그대로.
- P2 `56z_act3.js`/스토리 조각(추정): `STORY50[2].boss` 를 `'망각의 무녀 레테이아'` 로, `STORY50_RENAME` 의 레테이아→무녀 세 쌍 삭제.
- P3 `56g_maps.js`: `MAP9_PAR = 1.15` + `drawMap9` 본문(cam.x 진행도로 dx, GROUND 축으로 dy). 화면 반전·tint9 래퍼는 그대로.
- P5 새 조각 `62_merchant1124.js`(60_audio.js/61_patch1123.js 뒤, 70_main.js 앞) 권장: `const MER …` ~ `merSetHour(merHour());` 블록 전체
  (index.html 22837~23165행, window.__G 바로 앞). build.py 에 `62_merchant1124.js` 순서 추가. `window.__G` 끝에 `MER, merMake, merHour, merOn, merTick` 추가,
  `visibleNpcs` 를 `const` → `let` 로. 그림은 `NPC_ART_FILES`(assets/npcs/npc_wandering_merchant.png), 소리는 `SFX_FILES.wander`(assets/sfx/wandering_merchant_alert.wav).
- P6 `60_trade.js`(추정): `renderPanel` 거래 래퍼를 지문(trSig)+스크롤 복원으로 교체, `openPanel` 에 `if (n === 'trade') G.ui.trDrawn = '';`,
  `tradeHtml` 의 `.tr-bag`/`.tr-list` 두 곳에 `data-tscroll`, CSS `.tr-cols`/`.tr-col`/`.tr-bag`/`.tr-cell`/`.tr-it` + `#pBox:has(.tr-cols)`.
- P7 `10_data.js`+`50_ui.js`: `canWear/clsName/cantWearMsg` 추가, `makeItem` 의 cls 를 `SLOTS.includes(slot)` 전체로(무기+방어구 6부위, 반지는 makeRing 그대로),
  `equipItem` 안내 토스트, `calcStats` 세 루프에 `canWear`, `fixSave` 에 (a) 옛 방어구 cls 채우기 (b) 다른 직업 장비 가방行 + `clsFix` 카운터,
  `startGame` 래퍼에서 `clsFix` 토스트, `autoPlan`/`autoEquipApply` 에 `canWear`.
- P8 `30_combat.js`: `LY_DJ_X = 0.6` + `p.vx = fd * V * LY_DJ_X`, `LY_TP.dist` 180 → 240 (주석의 180px 도 함께).
- **Firebase Realtime Database 규칙: 사용자가 콘솔(devil-renown-default-rtdb)에서 `merchant` / `dev_merchant` / `local_merchant`
  규칙을 이미 넣고 게시했다** (`auth != null` 읽기, `st/$i` 쓰기는 `left` 가 -1~99 숫자일 때만). 코드는 `dbUrl` 을 거치므로
  실제 게임은 `merchant/`, dev 빌드는 `dev_merchant/`, localhost 는 `local_merchant/` 를 쓴다 — 셋 다 규칙이 있어야 한다(지금 완료).
- 이번에 함께 고친 것(지시서 밖, 1줄): 상인 구매 토스트의 조사를 `josa()` 로 계산 (`품질석를` → `품질석을`).
- 새 파일: `assets/npc/wandering_merchant_sheet.png`, `assets/npc/wandering_merchant_portrait.png`,
  `assets/npcs/npc_wandering_merchant.png`, `assets/ui/npc_portrait_wandering_merchant.png`,
  `assets/sfx/wandering_merchant_alert.wav` + `.mp3` (test/assets 에도 같은 경로로 복사).
- 확인: 헤드리스 Chromium 으로 P1~P8 54개 항목 전부 통과(골드 1,000/5,870/41,970/300,000 · 2장 보스 이름 · 배경 1.15배 패럴랙스 ·
  드랍 수명 40초 유지 · 상인 :04 등장/구매/두 탭 재고/동시 구매 1명 성공/:16 퇴장/오프라인 · 거래 스크롤·가로 잘림 · 직업 제한 4경로 ·
  이단 도약 160.5px/그림자 걸음 240px), pageerror 0, 새 자산 404 0 (기존 `assets/ui/boss_clear_screen.png` 누락만 남아 있음).

<!-- 형식:
### yymmdd-hhmm  한 줄 제목   (커밋 abc1234, 대상: test/index.html)
- 원래 파일: 32_skills.js (배너 "SKILLS: awakening skills…")
- 바꾼 것: 무엇을 왜, 함수/상수 이름
- 새 파일: test/assets/…
-->

## 예전 기록 — 원본 PC 로 옮겼던 것 (조각 은퇴 전)
### 261123-1815  원본 PC로 옮김 (아래 항목 전부, 기준 ee159b2 → 6f23daf/ee703d6)
- 방법: ee159b2 의 test/index.html 줄마다 원래 조각 파일·줄을 맞춘 뒤(20,153/20,162줄, 나머지 9줄은 build.py 틀),
  지금 test/index.html 과의 차이 189덩어리를 그 자리에 넣음 (devil-renown/tools_handoff_map.py). 조각 33개 + 새 조각 `61_patch1123.js`
  (60_audio.js 와 70_main.js 사이에 들어온 689줄: 멀티 QA P5/P2/P1, 도적·전사·궁수 블록들). build.py: 61_patch1123.js 순서,
  `<script src="assets/js/act3_data.js?v=…">` 를 pfx.js 다음에, art/handoff1123/assets → assets 복사. 새 그림·소리 119개는
  art/handoff1123/assets/ 에 같은 경로로, b1~b10 48f 는 art/boss10/assets/boss/ 도 덮어씀. tools/ 두 파일은 devil-renown/tools/ 에도.
- 확인: build.py 로 다시 만든 test/index.html 이 이 저장소의 것과 버전 표시 3곳(GAME_VER, pfx·act3_data ?v=)만 다르고 나머지 같음.
  test/assets 는 바뀐 파일 없음. 다시 만든 페이지로 1·7·20·21·30장 맵, 3막 복도 몹 11마리, 보스 b21·b30, 거래·BGM·48f 함수 확인, 에러 없음.
- 그림 쪽 남은 것: HERO48_MIRROR / HERO48_GROW / HERO48_ERASE 는 시트 그림을 고치면 비울 것(위 항목 메모 그대로).

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

### 261123-1522  정식 배포 (test → 루트: 새 소식 테론 X 문구)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것

### 261123-1522  새 소식 테론 X 문구 고침   (대상: test/index.html)
- NEWS '테론 · 상향 일섬 (X)' 문구: 공중 2단 점프·피해 감소 → '불꽃이 칼날을 따라 붙고, 처음부터 불꽃 파동이 앞으로 날아간다. 특성을 올리면 더 멀리, 각성하면 세 갈래로 퍼진다.' (id 261123b 그대로: 이미 본 사람에게 다시 안 뜸)

### 261123-1519  정식 배포 (test → 루트: 전사 X 점프 없앰, 불꽃 파동 1렙부터)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것. 새 그림 없음. 새 소식 문구(테론 X 공중 점프)는 그대로

### 261123-1519  전사 X 점프 없앰 + 불꽃 파동 1렙부터   (대상: test/index.html)
- 30_combat startAct theron x: `if (p.onGround) { p.vy = -300; p.onGround = false; }` (땅에서 살짝 뜨던 것) 삭제
- 전사 X 공중 2단 점프 블록: `TH_XJUMP = false` 로 끔 (1425 의 startAct 래퍼는 남김, true 면 되살아남)
- 불꽃 파동: `if (k1 >= 3)` 조건 삭제 → 특성 없어도 가운데 1개 (각성 tAwake('th1') = 10랭크부터 3갈래 그대로). REM_TICK·옛 tickAct 둘 다.
  th1 3랭크 [변경] 문구 '불꽃 파동을 함께 날린다' → '불꽃 파동이 1.3배 멀리 날아간다', maxDist 3랭크 이상 360 → 470

### 261123-1451  정식 배포 (test → 루트: 새 소식 261123b)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것. 새 그림 없음

### 261123-1451  새 소식 261123b (오늘 바뀐 것)   (대상: test/index.html)
- NEWS (새 소식 창, 56f_news.js): id '261123a' → '261123b', sub '그림자와 불꽃이 새로 깨어났다', 항목 9개(2쪽):
  리코스 X·D·A·이단 도약·특성 / 테론 X·A와 C 15단계 / 각성기 V(칼리스토·리코스) / 움직임 다듬기. 아이콘은 기존 종류(hero, warn, road, gold, ult)

### 261123-1444  정식 배포 (test → 루트: 1444 도적 V 화면 전체, 전사 C 15랭크)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것. 새 그림 없음

### 261123-1444  도적 V 이펙트 화면 전체 / 전사 C 특성 15랭크 누르고 있기   (대상: test/index.html)
- **도적 V** 새 블록 '도적 V 이펙트가 화면 전체를 덮는다' (MAIN LOOP 위): ult9Draw 래퍼, ult_lykos_12f 매 장면을 셀 폭 772 → 화면 폭+80 으로
  가로세로 같은 비율(약 1.35, 원래 0.72)로 키워 화면 가운데·주인공 바닥선에. over(밝은 장면 겹치기)도 같은 크기. 피해 범위는 그대로
- **전사 C 회전참 th2 15랭크** 새 블록 (MAIN LOOP 위): tickAct 래퍼 — C 를 누르고 있으면(떼기 전, 3초 전) nHits 를 hitStep 마다 늘리고 dur 연장,
  a.chargeK = 1 + 0.5 × (t/3). 옛 tickAct 의 `R = 80 × (th2 2랭크 1.3)` 에 × chargeK, pfx 등급 래퍼의 sc 에 × G.fxK (impacts 제외, 래퍼가 tickAct 동안만 세팅).
  th2 15랭크 문구에 '· C 를 누르고 있으면 최대 3초까지 계속 돌며 최대 1.5배로 커진다' 추가

### 261123-1441  정식 배포 (test → 루트: 1404~1441 — 도적 X·D·A·더블 점프, 전사 A·X, 궁수 V)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것. 새 그림 없음

### 261123-1441  도적 D 설치 장판 · A 은신 · 더블 점프 45° · X 보라 연결 / 전사 공중 X 판정 수정   (대상: test/index.html)
새 블록 '도적 D 그림자 감옥 = 바닥 설치 장판 / A 그림자 은신' (MAIN LOOP 배너 바로 위, 전사 X 블록 다음. 원본 PC: 32_skills·56n_remaster 쪽)
- **D 그림자 감옥**: castSkill 래퍼에서 도적 D 는 원래 코드(가까운 적 뒤로 순간이동 + 6연타)를 부르지 않고 `lyZonePlace`:
  remGround(p) 의 바닥에 `G.lyZone` (폭 240, 높이 130, 30초). 재사용 대기 = SKILLS.lykos.d.cd × freshCd('d') × (1-쿨감). 0.25초 시전 자세(hits 6 이라 옛 찌르기 안 돎)
  - `lyZoneTick` (updateSkills 래퍼): 0.55초마다 pfx 'shadow/shadow-tendrils' 2~3개, 1초(15랭크 0.7초)마다 안의 적에게 dealDamage 40% × freshMul('d'), 10랭크면 slowT 1.2
  - `lyZoneDraw` (playerFig 래퍼, 주인공보다 먼저): 바닥 보라 타원 + 테두리, 끝 2초 동안 흐려짐. 맵이 바뀌거나 30초면 사라짐
  - skillInput 래퍼: 장판이 있을 때 D 를 누르면 걷힘 (재사용 대기 중에도), 그 입력은 소비
- **A 그림자 은신**: 도적 A 는 원래 코드(그림자 난무 4연타)를 부르지 않고 `lyStealthOn`: p.stealth = 1, 재사용 대기 8 × freshCd('a') × (1-쿨감)
  - drawHeroSprite 래퍼: 내 캐릭터(o.pose 없음)는 alpha × 0.35
  - updateMon 래퍼: 은신이면 chase/wind 상태를 patrol 로 돌리고, 그 몹이 도는 동안 G.player = 가짜(몹 위치, y-100만, dead 1) → 아무도 안 보임.
    끝나고 몹 좌표가 ±10만을 넘으면 되돌림
  - updateBoss 래퍼: 은신이면 b.cd ≥ 0.3 (새 기술 없음), G.player = 가짜(보스 x, y-100만). 보스 좌표 같은 보호
  - 풀림: castSkill(다른 키)·startAct(Z X C)·startUlt·castLegend 래퍼에서 `lyStealthOff`. 죽거나 다른 직업이면 꺼짐
  - 기습: 풀릴 때 ly_a 랭크가 있으면 p.ambushT = 1초(+0.5 tier1, +1 tier3), dealDamage 래퍼가 그동안 × freshMul('a'). 10랭크는 숨는 순간 체력 5%
- SKILLS.lykos.a = '그림자 은신', d = '그림자 감옥' 설명 교체. 특성 ly_a '숨죽인 발'(기습), ly_d '그림자 감옥'(5 범위+20%, 10 느려짐, 15 0.7초) 문구 교체
- **도적 더블 점프** (30_combat updatePlayer): 위로(vy -0.88 V) → 45° 앞으로 (vx = 방향 × V, vy = -V, V = JUMP×√(1+점프력%)×0.88).
  누른 방향(없으면 보는 쪽). p.ljT 0.4초 동안 가로 속도 유지(반대로 누르면 해제), 착지 시 0
- **도적 X 연결**: lyShadeDraw 에서 그림자와 본체 사이에 REM_SK.lykos.x (vfx_rogue_shadow_step) 1·2번 장면을 늘려 그림 (높이 36, 0.32초 뒤 흐려짐)
- **전사 공중 X**: 판정을 X 시작 전 상태(air)로. 원래 X 가 땅에서 살짝 띄워서 땅에서 써도 2단 점프가 되던 것 수정

### 261123-1425  궁수 V 화살비 = 한 장 크게 / 전사 X: 올려 드는 그림·칼날 따라 불꽃·공중 2단 점프·피해 160%   (대상: test/index.html)
**궁수 V** (바로 아래 1419 의 ult9Draw 래퍼를 바꿈. 사용자: 잘림이 보인다 → 사진 한 장으로 화면 전체를)
- 화살비 장면(4~7)에서는 원래 가운데 그림을 그리지 않고, 그 장면의 그려진 부분(셀 x 56~552, `rainSrc`)을 가로세로 같은 비율로
  화면 폭+80px 까지 키워 화면 가운데·주인공 바닥선에 한 장만 그림 (rainStep·조각·흐림 마스크·KA_RAIN_OFF 삭제)
**전사 X 상향 일섬**
- HERO48_ANIM.theron.x: { w: 23, s: 29, f: 34 } → { w: 23, s: 25, f: 26 } (칼을 올려 드는 그림. 전엔 내려치는 그림이라 불꽃과 각도가 반대)
- REM_SK.theron.x: w 120×156 → 80×104, `tip: [64,-66], piv: [0.25,0.95], rot: 0.44` (remBox: tip 이 있으면 piv 점을 검 끝에.
  remDrawBox: rot 이 있으면 piv 점 기준 회전, 왼쪽이면 반대). 이 상자는 판정·다른 사람 화면(netCastFx)에만 쓰임
- 내 화면 이펙트: REM_TICK 의 remFx 삭제 → 새 `thBladeFx` (playerFig 래퍼): `TH_BLADE` 프레임별 칼날 선 23 [152,223,245,261] /
  25 [203,183,288,156] / 26 [146,118,54,142] 의 손잡이 → 검 끝+20% 에, 이펙트 1번 장면의 불꽃 줄기(`TH_STREAK` 밑동 113,558 → 끝 420,235)를
  늘려 맞춤 (굵기 2.4배). 25 는 진하게, 26 은 칼 각도를 따라가며 0.2초 뒤부터 사라짐
- 판정: remReach(상자) 의 높이를 불꽃 위 ~ 바닥(p.y+4)으로 → 앞 -8~124px, 위 165px 까지
- 피해 230% → 160% (REM_TICK 과 옛 tickAct 둘 다, 특성 th1 배율 그대로)
- 공중 X: 새 블록 '전사 X 상향 일섬 = 공중에서 쓰면 한 번 더 뛰어오른다' (startAct 래퍼): 공중이고 p.thXJ 없으면
  vy = -JUMP×√(1+점프력%), act.mv 0.85, 소리·불티. 착지하면 thXJ = 0 (updateSkills 래퍼)

### 261123-1419  궁수 V 화살비 복사본마다 다르게   (대상: test/index.html)
바로 아래 1417 의 ult9Draw 래퍼를 바꿈 (사용자: 양쪽으로 복사 붙여넣기 같다). rainStep 400 → 260
- 칸 k 마다 고정 난수 hr(k, n) (sin 해시, 깜빡임 없음): 시작 0~120ms 늦게(4→7 장면을 그 칸의 시간으로), 크기 0.8~1.08배,
  그림의 다른 가로 조각(그려진 부분 x 56~552 중 50~80% 폭), 위치 ±70px, 진하기 0.7~1. 장면 끝나면 160ms 동안 사라짐

### 261123-1417  궁수 V 화살비: 선 화살 대신 원래 그림을 화면 전체에   (대상: test/index.html)
바로 아래 1415 의 그림 부분을 바꿈 (사용자: 선 화살 어색, 가운데 원래 화살이 맵 전체를 덮게). 판정(all: true)은 그대로
- kaRainWave / kaRainTick / kaRainDraw 와 그 tickUlt·updateSkills·playerFig 래퍼 삭제
- ULT12.kallisto.rainF = [4,5,6,7] (12장 중 화살비 장면), rainStep = 400. ult9Draw 래퍼: 그 장면일 때 원래 그림을 같은 크기·같은 바닥선으로
  가운데(원래 위치) 기준 400px 간격으로 화면 양끝까지 더 그림 (늘리지 않음, 'lighter')

### 261123-1415  궁수 V 화살 폭풍이 맵 전체를 맞힘   (대상: test/index.html)
새 블록 '궁수 V 화살 폭풍이 맵 전체를 맞힌다' (MAIN LOOP 배너 바로 위, 도적 X 블록 다음. 원본 PC: 56h_ult12 쪽)
- ULT12.kallisto.waves 중 at 0.40~0.75 (화살 폭풍 6번, 공격력 90%씩)에 `all: true`. ult12Box 래퍼: all 이면 맵 전체 상자 → 화면 밖·등 뒤·위아래 층 적 모두
  (전엔 앞쪽 0~3칸에서 2.5~8.5칸, 칸=64px). 마지막 유성 4번은 그대로
- 그림: tickUlt 래퍼가 all 웨이브마다 `kaRainWave` — 화면 폭에 별화살 14발 + 화면 안 적마다 1발 (G.kaRain, 0.16~0.26초에 떨어져 불꽃 4개).
  updateSkills 래퍼에서 진행, playerFig 래퍼에서 'lighter' 로 그림. 피해와는 무관(그림만)

### 261123-1412  전사 A(돌진 베기) 스킬 이펙트 없앰   (대상: test/index.html)
- REM_SKILL.theron.a: remFx 호출 삭제 (돌진·무적·소리·피해 260% 그대로)
- REM_SK.theron.a: off 104 → 34 (원래 값, 판정 -32~100px), `nofx: 1` 추가
- netCastFx: `sk.nofx` 면 다른 사람 화면에도 아무것도 안 그림

### 261123-1410  전사 28~30 흰 칼 궤적 제거 + X 붉은 이펙트 1.5배, A·X 검 끝에서   (대상: test/index.html)
바로 아래 1404 의 전사 부분을 덮어씀 (사용자: 궤적을 지우고 검 끝에서 나가게, 붉은 이펙트 1.5배)
- 새 상수 `HERO48_ERASE.theron` (HERO48_GROW 아래): 프레임 28/29/30 의 칼날 선 [손잡이 x,y, 검 끝 x,y, 최소 y, 바닥줄 y, 바닥줄 x]
  = [211,232,281,291] / [214,219,289,291] / [213,248,251,277 (+ y≥236, y≥279 이면 x≥150)].
  hero48Fix 에서 GROW 다음에: 선에서 3px 넘게 떨어진(또는 검 끝 너머) 흰색(min>140, 채도<70)과 옅은 테두리(alpha<128, 손에서 14px 이상)를 지우고,
  선 위에 은색(226,230,240) 2.2px 칼날을 그림 (원래 28~30 칼날은 가는 회색 선뿐, 31번은 굵은 은색이라 이어지게).
  **원본 PC에서 시트 그림을 고치면 ERASE 비우기**
- REM_SK.theron.x: w 80 → 120, h 104 → 156 (1.5배), off 80 → 112 (불꽃이 검 끝 ~63px 에서 시작)
- REM_SK.theron.a: off 112 → 104 (빛줄기 그림이 칸의 35% 지점부터라 검 끝에 붙게). 판정(remReach): X -8~172, A -8~170

### 261123-1404  도적 X 순간이동·그림자·섬광·2회 충전 / 전사 A·X 이펙트를 칼 궤적 끝으로   (대상: test/index.html)
**도적 X 그림자 걸음** (새 블록 '도적 X 그림자 걸음 = 순간이동 + 그림자 추격', MAIN LOOP 배너 바로 위. 원본 PC: 35_net 끝 또는 새 조각 파일)
- startAct 래퍼: 도적 X 가 시작되면 `lyTeleport`: 돌진(900x0.2 = 180px) 대신 즉시 순간이동. `lyTpTarget` 이 6px씩 앞으로 보며
  solid 벽(plats[0] 제외)·arenaL/R 에 닿기 직전에서 멈춤. 공중이면 vy 를 0 이하로(잠깐 멈칫). act 는 dur 0.22, done=1 (끝 베기 없음)
- `G.lyShade`: 떠난 자리의 그림자가 0.5초(smoothstep) 동안 도적의 현재 위치로 따라옴. 매 틱 지나간 구간에 닿은 적은 한 번씩
  dealDamage (210% x ly1 1랭크 1.3 x tDmg, 넉백 90). ly1 2랭크 치명 버프는 순간이동 때. 잔상(3랭크 0.4초·각성 0.7초)은 그림자 도착 후 지나온 구간 전체에 60%.
  그림: drawHeroSprite 를 filter brightness(0.12) 로 검게, 달리기 프레임, 잔상 2개. playerFig 래퍼로 주인공 뒤에 그림
- `G.lyFlash`: 순간이동 순간 도적 본인 화면만 흰 섬광 (0.15초, alpha 0.9 x k²). renderWorld 래퍼에서 setTransform 초기화 후 캔버스 전체
- 2회 충전: `G.lyCh` {q, t, full, gap}. 한 칸 = 그 시전 때 게임이 정한 X 쿨(특성·쿨감 포함). 남은 칸이 있으면 0.2초 뒤 다시 사용.
  updateSkills 래퍼에서 매 틱 p.cd.x / cdMax.x 를 이 값으로 맞춤 (X 입력 판정은 그대로 cd.x <= 0). devNoCd 면 가득. HUD #sk1·터치 X 버튼 오른쪽 위에 남은 횟수 숫자(.lyq)
- 다른 사람 화면: 위치가 바로 바뀌고 원래 X 효과(netCast)만. 그림자·섬광은 본인만
**전사 A·X** (48f 공격 28~30(31) 프레임에 흰 칼 궤적이 그려져 있고 끝이 주인공 앞 62~67px. 이펙트가 그 위에 겹쳐 나오던 것)
- REM_SK.theron.x off 24 → 80, REM_SK.theron.a off 34 → 112 (이펙트가 칼 궤적 끝에서 시작)
- 이펙트 시작: X `hitAt: 0, delay: 0.09`, A `hitAt: 0, delay: 0.11` (전엔 hitAt 2 라 시전 직후부터 미리 나옴) → 궤적 프레임이 보일 때 첫 장면
- 새 `remReach(p, box)` (remHit 위): 판정 = 주인공 뒤 8px ~ 이펙트 끝. X·A 의 remHit 에 사용. **사거리 늘어남**: X 64 → 120px, A 100 → 178px
- X 3랭크 불꽃 파동 발사 위치 p.x+22 → +66 (칼 끝)

### 261123-1352  정식 배포 (test → 루트: 1352 도적 이동 크기)
- 루트 index.html = test/index.html 에서 noindex · DEV_TOOLS 두 줄만 뺀 것. 새 그림 없음

### 261123-1352  도적 이동 프레임 크기를 대기·공격과 맞춤   (대상: test/index.html)
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

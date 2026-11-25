# The Pixel Odyssey — Claude 작업 규칙

먼저 `HANDOFF.md`(맨 위 "지금 진행 중" 과 최근 기록)와 `ART_STYLE.md` 를 읽는다.

## 서버 두 개
- **정식**: `index.html` · `version.json` · `assets/` — 실제 유저가 하는 게임.
- **test**: `test/index.html` · `test/version.json` — 사용자가 먼저 확인하는 곳. **그림·소리는 정식과 같은 `assets/` 를 쓴다**(`<base href="../">`, 2026-11-25 `test/assets/` 사본 삭제).
  - test 페이지에만 있는 줄(`tools/deploy.py` 의 `TEST_ONLY`): `<meta name="robots" content="noindex">` · `<base href="../">` · `<script>window.DEV_TOOLS = 1;</script>`(관리자 창 F9 + test 전용 세이브: 서버 `dev_` 경로, 로컬 `dev-` 키) · `fetch('test/version.json…')`.
  - **`cp index.html test/index.html` 금지.** 이 줄들이 지워져 test 권한·캐릭터가 사라진다(2026-11-25 6차 배치에서 실제로 생긴 사고). 정식을 test 로 가져와야 하면 `deploy.py pull-main`.

## 수정 → 배포 순서 (2026-11-25 사용자 지시)
1. 코드 수정은 **test 에만** 한다 (`test/index.html`). `GAME_VER` · `NEWS` 카드 · `test/version.json` 을 올린다.
   - 새 그림·소리는 **`assets/` 에 새 이름으로** 넣는다(정식 코드가 아직 안 부르니 정식엔 영향 없음). 정식이 쓰는 파일을 바꿀 땐 **덮어쓰지 말고** `…_v2.png` 같은 새 이름 + test 코드가 새 이름을 부르게. `test/assets/` 는 만들지 않는다(`deploy.py check` 가 막는다).
2. 헤드리스 크로뮴으로 test 페이지 확인 (`pageerror 0`, 404 0).
3. `python3 tools/deploy.py check` → 커밋 → 푸시. 사용자가 test 에서 확인한다.
4. 사용자가 **"정식 배포"** 라고 할 때만 `python3 tools/deploy.py promote` (test 전용 줄 빼고 정식으로 복사) → 커밋 → 푸시.

## 마스터 콘솔 (관리자 창, test 서버 F9) — 새 기능은 반드시 여기에도 (2026-11-25 사용자 지시)
- 코드: `test/index.html` 맨 끝 "마스터 콘솔" 블록. 수치는 `tuneAdd({ k, g, sec, n, help, get, set, min, max, step, u | pct })` 한 줄로 등록한다.
  등록하면 관리자 창 탭(g: `econ` 경제·강화 · `drop` 확률·드롭 · `boss` 보스 · `combat`/`combatSk`/`combatSt` ⚔ 전투)에 자동으로 뜨고, test 저장(`dev_tuning`)·정식 적용(`tuning`)·기록(`tuning_log`)·되돌리기가 같이 된다.
- **새 기능을 만들 때마다** 그 기능의 확률·배율·시간·가격 같은 숫자는 `tuneAdd` 로 등록하고(숫자를 `const` 로 박지 말고 `let` 이나 객체 값으로), 테스트에 필요한 소환·지급 버튼은 `mcQuick` / `mcMe` 에 넣는다.
- 새 효과음 이름(`sfx('…')`)을 만들면 `MC_SFX_INFO` 에 [분류, 한국어 이름] 한 줄, 새 배경음 mp3 는 `BGM_FILES` + `MC_BGM_MP3`/`MC_BGM_MP3_NAME` 에 더한다(🔊 음향 탭).
- 관리자가 서버 값을 바꾸는 새 기능을 만들면 `mcLog({ kind, target, summary, changes })` 로 📜 내역에 남긴다(누가·언제·무엇을·전→후).
- UI 는 "가장 쓰기 쉽게": 한국어 이름 + 한 줄 설명(help) + 슬라이더·숫자칸 + 기본값 표시. 정식 서버에 영향 주는 버튼은 확인 창을 띄운다.
- 관리자 아이디 `admin0215` · `admin2016` · `admin2017` (`MC_ADMIN_IDS`, 규칙도 이 셋). 서버 규칙 전체: `tools/firebase-rules.json`, 설정 순서: `tools/firebase-admin.md`. 비밀번호는 저장소에 절대 적지 않는다.

## 가이드 (2026-11-25 사용자 지시: 글만 있는 가이드 금지)
- 가이드는 `TUT` 에 등록하고 **반드시 실제 게임 그림**을 붙인다: `tools/guide_shots.js` 의 `SHOTS` 에 장면을 더해 `node tools/guide_shots.js <id>` → `python3 tools/guide_webp.py` → `assets/ui/guide/<id>.webp`.
- 글은 짧게, 키는 `keys` 로. 처음 그 상황이 올 때 한 번 뜨고(`tutPlay`), ? 가이드북에 남는다.
- 띄우는 조건은 `GUIDE_WHEN` 에 한 줄(`[id, save => 조건]`). 새 가이드 글은 마스터 콘솔 📖 가이드 탭에 자동으로 뜬다(`TUT_ORDER` 에 넣으면 `gd:<id>:t/b` 로 편집·정식 적용 가능).

## 그 밖에
- **이 저장소의 `test/index.html` 이 원본이다.** 원본 PC 의 조각 파일·`build.py` 는 2026-11-25 은퇴했다 — 쓰지도, 돌리지도 않는다(돌리면 옛 코드로 덮인다).
- 고친 내역은 `HANDOFF.md` "작업 기록" 맨 위에 적는다(무엇을·왜·어디(함수/블록)·검증).
- 작업이 끝날 때마다 커밋하고 GitHub 에 푸시한다. 다른 Claude 가 이어서 작업한다.

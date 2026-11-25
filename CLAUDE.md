# The Pixel Odyssey — Claude 작업 규칙

먼저 `HANDOFF.md`("옮길 것" 맨 위 항목부터)와 `ART_STYLE.md` 를 읽는다.

## 서버 두 개
- **정식**: `index.html` · `version.json` · `assets/` — 실제 유저가 하는 게임.
- **test**: `test/index.html` · `test/version.json` · `test/assets/` — 사용자가 먼저 확인하는 곳.
  - test 페이지에만 있는 두 줄이 **관리자 창(F9)** 과 **test 전용 세이브**(서버 `dev_` 경로, 로컬 `dev-` 키)를 켠다:
    `<meta name="robots" content="noindex">` · `<script>window.DEV_TOOLS = 1;</script>`
  - **`cp index.html test/index.html` 금지.** 이 두 줄이 지워져 test 권한·캐릭터가 사라진다(2026-11-25 6차 배치에서 실제로 생긴 사고).

## 수정 → 배포 순서 (2026-11-25 사용자 지시)
1. 수정은 **test 에만** 한다 (`test/index.html`, 새 그림은 `test/assets/`). `GAME_VER` · `NEWS` 카드 · `test/version.json` 을 올린다.
2. 헤드리스 크로뮴으로 test 페이지 확인 (`pageerror 0`).
3. `python3 tools/deploy.py check` → 커밋 → 푸시. 사용자가 test 에서 확인한다.
4. 사용자가 **"정식 배포"** 라고 할 때만 `python3 tools/deploy.py promote` (두 줄 빼고 정식으로 복사) → 커밋 → 푸시.

## 그 밖에
- 결과물 html 을 직접 고치므로, 고친 내역은 `HANDOFF.md` "옮길 것" 맨 위에 적는다(원본 PC 의 조각 파일로 옮기기 위함).
- 작업이 끝날 때마다 커밋하고 GitHub 에 푸시한다. 다른 Claude 가 이어서 작업한다.

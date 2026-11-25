# 원본 PC Claude 에게 줄 프롬프트

> 원본 소스(조각 파일 `10_data.js` … `61_patch1123.js` + `build.py`)가 있는 PC 에서, Claude Code 에 아래 **"프롬프트"** 칸을 통째로 붙여넣는다.
> (2026-11-25 작성 · 저장소 `dhshlove01-lang/The-Pixel-Odyssey` · 정식 = test = 261125-1500, test 는 1510)

---

## 프롬프트

```
너는 "The Pixel Odyssey" 원본 소스가 있는 PC 에서 일한다. 원본 = 조각 파일(10_data.js … 61_patch1123.js) + build.py,
결과물 = GitHub 저장소 dhshlove01-lang/The-Pixel-Odyssey 의 index.html(정식) / test/index.html(test).

2026-11-23 18:15 이후, 원본 소스가 없는 곳에서 결과물 html 을 직접 고쳐 왔다(32건). 원본에 옮기지 않고 build.py 를 돌리면
그 수정이 전부 사라진다. 이번 일은 그 수정을 전부 원본 조각에 옮겨서, build.py 로 다시 만든 결과가 지금 저장소의 것과 같아지게 하는 것이다.

## 0. 준비 (먼저 읽기)
1. 저장소를 최신으로 받는다: git pull (main).
2. 저장소의 CLAUDE.md, HANDOFF.md("## 옮길 것" 전체 + "## 옮김 완료" 의 261123-1815 항목), tools/deploy.py, ART_STYLE.md 를 읽는다.
3. 지난번(261123-1815)에 옮긴 방법을 확인한다: 기준 커밋 ee159b2 → 6f23daf/ee703d6, 도구 devil-renown/tools_handoff_map.py
   (결과 html 줄마다 원래 조각 파일·줄을 맞춘 뒤, 기준 → 지금 html 의 차이 덩어리를 그 자리에 넣는 방식).
4. **git 기록을 고쳐 쓰지 말 것**(squash·filter-repo·force push 금지). HANDOFF 의 각 항목은 커밋 해시로 git show 해서 옮긴다.

## 1. 옮기는 방법 (권장: 지난번과 같은 "차이 덩어리" 방식)
- 기준 = 지난번 옮긴 직후의 결과 html (6f23daf/ee703d6 의 test/index.html). 목표 = 지금 HEAD 의 **index.html**(정식 모양).
  - test/index.html 은 정식과 test 전용 줄(TEST_ONLY)만 다르다. 비교는 정식 모양으로 한다:
    python3 -c "import sys; sys.path.insert(0,'tools'); import deploy; print(deploy.to_main(open('test/index.html',encoding='utf-8').read()), end='')" > /tmp/target.html
- tools_handoff_map.py 로 기준 html 의 줄 → 조각 파일·줄 지도를 만들고, 기준 → 목표 차이 덩어리를 각 조각의 같은 자리에 넣는다.
- HANDOFF "옮길 것" 은 **아래(오래된 것)부터 위로** 확인하며, 각 항목의 "원래 파일" 메모와 실제로 들어간 위치가 맞는지 본다.

## 2. 새 조각 파일 (결과 html 맨 끝에 통째로 붙은 블록 — 잘라서 새 조각으로)
맨 끝 </script> 바로 앞에 아래 블록들이 순서대로 붙어 있다. 시작 표시 줄부터 다음 블록 시작 전까지 그대로 잘라 새 조각으로 만들고,
build.py 의 조각 순서에서 **맨 마지막**(지금의 마지막 조각 뒤)에 이 순서로 넣는다.
  1) 58_master.js   ← "/* ============ 마스터 콘솔 (2026-11-25, user): 수치 조절(TUNE)…"   (관리자 창·수치 등록 tuneAdd·정식 적용·기록)
  2) 59_ops.js      ← "/* ============ 마스터 콘솔 2단계 (2026-11-25, user): 운영…"        (공지·이벤트·우편 받기 + 허수아비 + 🛠 운영 탭)
  3) 59b_combat.js  ← "/* ============ 마스터 콘솔 3단계 (2026-11-25, user): ⚔ 전투 수치…"
  4) 59c_sound.js   ← "/* ============ 마스터 콘솔 4단계 (2026-11-25, user): 🔊 음향…"
이 블록들은 앞 조각의 함수들을 감싸서(wrapper) 동작하므로 반드시 다른 모든 조각 **뒤**에 와야 한다.

## 3. 블록 밖에서 바뀐 곳 (차이 덩어리 방식이면 저절로 들어가지만, 빠지지 않았는지 확인)
- const → let: CRIT_MULT, GAUGE_RATE, ENH_GOLD_X, GOLD_DROP_X, potionPrice, scrollPrice, POTION_HEAL·POTION_CD·POTION_MAX·SCROLL_MAX·SCROLL_CAST,
  GUARD_WIN·GUARD_CD·GUARD_STUN, tDmg, tCd, ANON_CHANCE·ANON_GAP·ANON_TIME, BOX_CHANCE·BOX_CD·SHRINE_CHANCE·SHRINE_CD
- frame(): acc += dt * (G.devSpeed || 1)
- 떠돌이 상인: merOn 에 G.devMerT, merLeftMin, merSetHour 의 MER.map (G.devMerMap)
- 57_dev.js: 1초 다시 그리기를 빠른 도구·내 캐릭터 탭에서만
- ACT3_BOSS 21~30 의 file: '…png' 칸 삭제 + BOSS_SHEET_FILE[id] = 'boss/' + A.file48, S9.b7 의 sheet: 'boss/b7_giant.png' 삭제
- 보스 클리어 창: const CLEAR_IMG = { bad: true }
- 특성 창(traitsHtml 6카드판): 남은 포인트·초기화를 합계 줄(.tsum6)로, 아래 .tfoot 삭제, 여백 CSS
- 그 밖에 11/24~25 의 도트 리뉴얼 배치들(보스 48f, 스킬 VFX 162장, 전조·탄·라벨 도트화 등) — HANDOFF 각 항목 참고

## 4. build.py 바꿀 곳
- 그림·소리: **test/assets/ 는 없어졌다**(2026-11-25). test 페이지는 <base href="../"> 로 정식 assets/ 를 쓴다.
  build.py 가 art/… → test/assets/… 로 복사하던 부분은 assets/ 로 바꾸거나 없앤다. 새 그림은 assets/ 에 새 이름으로.
- 결과물 쓰는 법: build.py 는 **정식 모양** html 을 만든 뒤, test 쪽은 tools/deploy.py 의 to_test 로 만든다(직접 test 전용 줄을 박지 말 것):
    import sys; sys.path.insert(0, 'tools'); import deploy
    open('test/index.html','w',encoding='utf-8',newline='').write(deploy.to_test(정식_html))
  정식 index.html 은 build.py 가 직접 쓰지 않는다. 정식 배포는 사용자가 "정식 배포" 라고 할 때만 python3 tools/deploy.py promote.
- 버전: GAME_VER 와 script ?v= 는 지금 저장소 값(261125-1510 / test)과 맞추거나 한 칸 올린다. test/version.json 도 같이.

## 5. 확인
1. build.py → 새 test/index.html 과 저장소 HEAD 의 test/index.html 을 diff: **버전 문자열(GAME_VER, ?v=) 말고는 같아야** 한다.
2. python3 tools/deploy.py check → [OK] 2개.
3. 헤드리스 크로뮴(로컬 http 서버)으로 /test/ 와 / 를 열어 pageerror 0, 404 0. 1·7·10·17·21·25·30장 보스방, F9 관리자 창 9개 탭이 열리는지.
4. 다르면 어느 조각이 빠졌는지 찾아 고친다. 추측으로 메우지 말 것.

## 6. 끝내기
- HANDOFF.md: "## 옮길 것" 의 옮긴 항목을 전부 "## 옮김 완료" 로 내리고, 맨 위에 "2026-11-?? 원본 PC 로 옮김 (기준 … → …)" 항목을 쓴다(방법·확인 결과).
- 새 조각 파일과 build.py 변경은 원본 소스 쪽에 커밋, 결과물은 이 저장소에 커밋·푸시(main). 비밀번호·토큰은 어디에도 쓰지 않는다.
- 끝나면 사용자에게 알린다: "원본에 다 옮겼다. 이제 git 기록 정리(저장소 용량 줄이기)를 해도 된다 — 원하면 따로 말해 달라."
```

---

## 참고 (사람용)
- 이 일을 끝내기 전에는 **원본 PC 에서 build.py 를 돌려 결과물을 덮어쓰지 말 것** — 지금까지의 수정이 사라진다.
- git 기록 정리(저장소 약 300MB → 줄이기)는 이 일이 끝난 **뒤에** 한다. 옮길 때 예전 커밋을 git show 로 봐야 하기 때문.

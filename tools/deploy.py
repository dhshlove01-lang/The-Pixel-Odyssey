#!/usr/bin/env python3
"""test 서버 → 정식 서버 배포 도구.

규칙 (2026-11-25, 사용자 지시):
  - 모든 코드 수정은 test/ 에 먼저 넣는다 (test/index.html · test/version.json).
  - 사용자가 "정식 배포" 를 말할 때만 `python3 tools/deploy.py promote` 로 루트(정식)에 복사한다.
  - test/index.html 은 정식과 아래 TEST_ONLY 의 몇 군데만 다르다. `cp index.html test/index.html` 은 이것들을 지운다 — 쓰지 말 것.
      1) <meta name="robots" content="noindex">          검색 노출 막기
      2) <base href="../">                               test 페이지도 정식 assets/ 를 같이 쓴다 (2026-11-25: test/assets 사본 169MB 삭제)
      3) <script>window.DEV_TOOLS = 1;</script>          IS_DEV_BUILD → 관리자 창(F9) · test 전용 세이브(dev_ 서버 경로, dev- 로컬 키)
      4) fetch('test/version.json…')                    <base> 때문에 test 의 업데이트 확인은 test/version.json 을 직접 가리킨다

그림·소리 (2026-11-25 부터):
  - test/assets/ 는 없다. 새 그림·소리는 바로 assets/ 에 넣는다 — 정식 코드가 아직 그 이름을 부르지 않으므로 정식에는 영향이 없다.
  - 이미 정식이 쓰는 파일을 바꿀 때는 **덮어쓰지 말고 새 이름**(예: b1_48f_v2.png)으로 넣고 test 코드가 새 이름을 부르게 한다.
    "정식 배포" 뒤 옛 파일은 tools/unused_assets.md 식으로 정리한다.

명령:
  python3 tools/deploy.py check       test 전용 줄이 다 있는지, 정식에 없는지, test 가 정식보다 앞서 있는지 보고
  python3 tools/deploy.py promote     test → 정식 (test 전용 줄을 빼고 index.html, version.json 복사)
  python3 tools/deploy.py fix-test    test/index.html 의 test 전용 줄을 지금 규칙대로 맞춘다 (빠졌거나 옛 모양일 때)
  python3 tools/deploy.py pull-main   (드묾) 정식 index.html 을 test 로 가져온다 — test 전용 줄을 붙여서. 정식에 직접 핫픽스한 뒤에만.
"""
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAIN_HTML = os.path.join(ROOT, 'index.html')
TEST_HTML = os.path.join(ROOT, 'test', 'index.html')
MAIN_VER = os.path.join(ROOT, 'version.json')
TEST_VER = os.path.join(ROOT, 'test', 'version.json')

# (정식 모양, test 모양) — 순서대로 바꾼다
TEST_ONLY = [
    ('<meta charset="utf-8"><link rel="icon"',
     '<meta charset="utf-8"><meta name="robots" content="noindex">\n<base href="../">\n<link rel="icon"'),
    ('<body><title>',
     '<body><script>window.DEV_TOOLS = 1;</script>\n<title>'),
    ("fetch('version.json?t='",
     "fetch('test/version.json?t='"),
]
# 예전 test 모양(지금은 안 쓰지만 to_main 이 알아보고 정식 모양으로 되돌린다)
OLD_TEST = [
    ('<meta charset="utf-8"><link rel="icon"',
     '<meta charset="utf-8"><meta name="robots" content="noindex">\n<link rel="icon"'),
]


def read(p):
    with open(p, encoding='utf-8', newline='') as f:
        return f.read()


def write(p, s):
    with open(p, 'w', encoding='utf-8', newline='') as f:
        f.write(s)


def to_main(src):
    """test 모양(지금 것이든 예전 것이든)을 정식 모양으로."""
    s = src
    for main_v, test_v in TEST_ONLY + OLD_TEST:
        s = s.replace(test_v, main_v, 1)
    return s


def to_test(src):
    s = to_main(src)
    for main_v, test_v in TEST_ONLY:
        if s.count(main_v) != 1:
            sys.exit('정식 index.html 에서 test 전용 줄 자리를 못 찾았다: ' + main_v)
        s = s.replace(main_v, test_v, 1)
    return s


def test_ok(t):
    return all(test_v in t for _, test_v in TEST_ONLY)


def check():
    t, m = read(TEST_HTML), read(MAIN_HTML)
    ok = True
    if test_ok(t):
        print('[OK] test/index.html: test 전용 줄 ' + str(len(TEST_ONLY)) + '군데 모두 있음 (noindex · base ../ · 관리자 창 · test/version.json)')
    else:
        ok = False
        print('[문제] test/index.html: test 전용 줄이 빠졌거나 옛 모양 → python3 tools/deploy.py fix-test')
    if any(test_v in m for _, test_v in TEST_ONLY + OLD_TEST) or 'name="robots"' in m or '<base ' in m:
        ok = False
        print('[문제] index.html(정식)에 test 전용 줄이 들어 있다')
    else:
        print('[OK] index.html(정식): test 전용 줄 없음')
    print('[정보] 정식과 test 코드: ' + ('같음 (배포할 것 없음)' if to_main(t) == m else 'test 가 다름 (아직 정식 배포 안 된 수정이 있다)'))
    print('[정보] 버전  정식 ' + read(MAIN_VER).strip() + '  ·  test ' + read(TEST_VER).strip())
    if os.path.isdir(os.path.join(ROOT, 'test', 'assets')):
        ok = False
        print('[문제] test/assets/ 가 다시 생겼다 — test 는 <base href="../"> 로 정식 assets/ 를 쓴다. 파일은 assets/ 로 옮길 것')
    return ok


def promote():
    t = read(TEST_HTML)
    if not test_ok(t):
        sys.exit('test/index.html 의 test 전용 줄이 맞지 않다. 먼저 `fix-test` 후 확인할 것.')
    write(MAIN_HTML, to_main(t))
    shutil.copyfile(TEST_VER, MAIN_VER)
    print('정식 배포 준비 완료: index.html · version.json (' + read(MAIN_VER).strip() + ')')
    print('이제 커밋하고 main 에 올리면 정식 서버에 나간다.')


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'check'
    if cmd == 'check':
        sys.exit(0 if check() else 1)
    elif cmd == 'promote':
        promote()
    elif cmd == 'fix-test':
        write(TEST_HTML, to_test(read(TEST_HTML)))
        print('test/index.html 의 test 전용 줄을 맞췄다')
    elif cmd == 'pull-main':
        write(TEST_HTML, to_test(read(MAIN_HTML)))
        print('정식 index.html 을 test 로 가져왔다 (test 전용 줄 포함)')
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()

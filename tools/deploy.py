#!/usr/bin/env python3
"""test 서버 → 정식 서버 배포 도구.

규칙 (2026-11-25, 사용자 지시):
  - 모든 수정은 test/ 에 먼저 넣는다 (test/index.html · test/version.json · test/assets/).
  - 사용자가 "정식 배포" 를 말할 때만 `python3 tools/deploy.py promote` 로 루트(정식)에 복사한다.
  - test/index.html 은 정식과 딱 두 줄이 다르다. 이 두 줄이 test 전용 권한(F9 관리자 창)과
    test 전용 세이브(dev_ 서버 경로, dev- 로컬 키)를 켠다. `cp index.html test/index.html` 은 이 두 줄을 지운다 — 쓰지 말 것.
      1) <meta name="robots" content="noindex">          (검색 노출 막기)
      2) <script>window.DEV_TOOLS = 1;</script>          (IS_DEV_BUILD → 관리자 창 · dev_ 데이터)

명령:
  python3 tools/deploy.py check       test 에 두 줄이 있는지, 정식에 없는지, test 가 정식보다 앞서 있는지 보고
  python3 tools/deploy.py promote     test → 정식 (두 줄 빼고 index.html, version.json, 바뀐 assets 복사)
  python3 tools/deploy.py fix-test    test/index.html 에 두 줄이 빠졌으면 다시 넣는다
  python3 tools/deploy.py pull-main   (드묾) 정식 index.html 을 test 로 가져온다 — 두 줄은 붙여서. 정식에 직접 핫픽스한 뒤에만.
"""
import filecmp
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAIN_HTML = os.path.join(ROOT, 'index.html')
TEST_HTML = os.path.join(ROOT, 'test', 'index.html')
MAIN_VER = os.path.join(ROOT, 'version.json')
TEST_VER = os.path.join(ROOT, 'test', 'version.json')
MAIN_ASSETS = os.path.join(ROOT, 'assets')
TEST_ASSETS = os.path.join(ROOT, 'test', 'assets')

NOINDEX_OLD = '<meta charset="utf-8"><link rel="icon"'
NOINDEX_NEW = '<meta charset="utf-8"><meta name="robots" content="noindex">\n<link rel="icon"'
DEV_OLD = '<body><title>'
DEV_NEW = '<body><script>window.DEV_TOOLS = 1;</script>\n<title>'


def read(p):
    with open(p, encoding='utf-8', newline='') as f:
        return f.read()


def write(p, s):
    with open(p, 'w', encoding='utf-8', newline='') as f:
        f.write(s)


def to_main(test_src):
    if DEV_NEW not in test_src or NOINDEX_NEW not in test_src:
        sys.exit('test/index.html 에 test 전용 두 줄이 없다. 먼저 `fix-test` 로 고친 뒤 확인할 것.')
    return test_src.replace(DEV_NEW, DEV_OLD, 1).replace(NOINDEX_NEW, NOINDEX_OLD, 1)


def to_test(main_src):
    s = main_src
    if NOINDEX_NEW not in s:
        if NOINDEX_OLD not in s:
            sys.exit('index.html 머리 모양이 예상과 다르다 (noindex 자리를 못 찾음).')
        s = s.replace(NOINDEX_OLD, NOINDEX_NEW, 1)
    if DEV_NEW not in s:
        if DEV_OLD not in s:
            sys.exit('index.html 본문 시작 모양이 예상과 다르다 (DEV_TOOLS 자리를 못 찾음).')
        s = s.replace(DEV_OLD, DEV_NEW, 1)
    return s


def asset_diff():
    """test/assets 에만 있거나 내용이 다른 파일 (정식으로 복사할 것)."""
    out = []
    for dp, _, fs in os.walk(TEST_ASSETS):
        for f in fs:
            src = os.path.join(dp, f)
            rel = os.path.relpath(src, TEST_ASSETS)
            dst = os.path.join(MAIN_ASSETS, rel)
            if not os.path.exists(dst) or not filecmp.cmp(src, dst, shallow=False):
                out.append(rel)
    return sorted(out)


def check():
    t, m = read(TEST_HTML), read(MAIN_HTML)
    ok = True
    if DEV_NEW in t and NOINDEX_NEW in t:
        print('[OK] test/index.html: test 전용 두 줄 있음 (관리자 창 · test 전용 세이브)')
    else:
        ok = False
        print('[문제] test/index.html: test 전용 줄이 빠졌다 → python3 tools/deploy.py fix-test')
    if 'window.DEV_TOOLS = 1;</script>' in m or 'name="robots"' in m:
        ok = False
        print('[문제] index.html(정식)에 test 전용 줄이 들어 있다')
    else:
        print('[OK] index.html(정식): test 전용 줄 없음')
    if DEV_NEW in t and NOINDEX_NEW in t:
        same = to_main(t) == m
        print('[정보] 정식과 test 코드: ' + ('같음 (배포할 것 없음)' if same else 'test 가 다름 (아직 정식 배포 안 된 수정이 있다)'))
    print('[정보] 버전  정식 ' + read(MAIN_VER).strip() + '  ·  test ' + read(TEST_VER).strip())
    d = asset_diff()
    print('[정보] 정식에 아직 안 간 그림·소리: ' + (str(len(d)) + '개' if d else '없음'))
    for r in d[:20]:
        print('        ' + r)
    return ok


def promote():
    write(MAIN_HTML, to_main(read(TEST_HTML)))
    shutil.copyfile(TEST_VER, MAIN_VER)
    d = asset_diff()
    for rel in d:
        dst = os.path.join(MAIN_ASSETS, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(os.path.join(TEST_ASSETS, rel), dst)
    print('정식 배포 준비 완료: index.html · version.json (' + read(MAIN_VER).strip() + ') · 그림·소리 ' + str(len(d)) + '개')
    print('이제 커밋하고 main 에 올리면 정식 서버에 나간다.')


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'check'
    if cmd == 'check':
        sys.exit(0 if check() else 1)
    elif cmd == 'promote':
        promote()
    elif cmd == 'fix-test':
        write(TEST_HTML, to_test(read(TEST_HTML)))
        print('test/index.html 에 test 전용 두 줄을 넣었다')
    elif cmd == 'pull-main':
        write(TEST_HTML, to_test(read(MAIN_HTML)))
        print('정식 index.html 을 test 로 가져왔다 (test 전용 두 줄 포함)')
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()

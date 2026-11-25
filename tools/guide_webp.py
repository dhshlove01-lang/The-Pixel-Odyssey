#!/usr/bin/env python3
"""tools/guide_shots.js 가 찍은 assets/ui/guide/*.png 를 가이드용 webp 로 줄이고 png 는 지운다 (폭 720, 품질 82)."""
import glob, os
from PIL import Image
for p in sorted(glob.glob(os.path.join(os.path.dirname(__file__), '..', 'assets', 'ui', 'guide', '*.png'))):
    im = Image.open(p).convert('RGB')
    if im.width > 720: im = im.resize((720, round(im.height * 720 / im.width)), Image.LANCZOS)
    out = p[:-4] + '.webp'; im.save(out, 'WEBP', quality=82, method=6); os.remove(p)
    print(os.path.basename(out), os.path.getsize(out) // 1024, 'KB')

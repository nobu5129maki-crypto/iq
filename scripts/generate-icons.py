#!/usr/bin/env python3
"""app-icon.png から 192/512 と maskable 512 を作る。"""

from pathlib import Path

from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
source = Image.open(root / "public" / "app-icon.png").convert("RGBA")
icons = root / "public" / "icons"
icons.mkdir(parents=True, exist_ok=True)

any_512 = source.resize((512, 512), Image.Resampling.LANCZOS)
any_512.save(icons / "icon-512.png", "PNG")
any_512.resize((192, 192), Image.Resampling.LANCZOS).save(icons / "icon-192.png", "PNG")

maskable = Image.new("RGBA", (512, 512))
draw = ImageDraw.Draw(maskable)
for y in range(512):
    t = y / 511
    r = int(37 + (124 - 37) * t)
    g = int(99 + (58 - 99) * t)
    b = int(235 + (237 - 235) * t)
    draw.line([(0, y), (511, y)], fill=(r, g, b, 255))

safe = source.resize((410, 410), Image.Resampling.LANCZOS)
maskable.paste(safe, (51, 51), safe)
maskable.save(icons / "icon-maskable-512.png", "PNG")

for name in ("icon-192.png", "icon-512.png", "icon-maskable-512.png"):
    im = Image.open(icons / name)
    print(name, im.size, im.mode)

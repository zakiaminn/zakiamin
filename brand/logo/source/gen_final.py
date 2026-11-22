"""Final artwork for the Zaki One line mark. Writes masters, colour variants and web icons into OUT."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from geom import orient, offset_polyline, clip, d_of, fmt, bbox  # noqa: E402
from oneline import one_line, C60, S60, COT60  # noqa: E402

OUT = sys.argv[1]
M, W_, I_ = (os.path.join(OUT, d) for d in ("master", "web", "variants"))
for d in (M, W_, I_):
    os.makedirs(d, exist_ok=True)

INK, NIGHT, SULFUR, CHALK = "#16160E", "#0B0B08", "#DCEC3A", "#EDEDE0"
TITLE = "Zaki Amin Ahmad"


def doc(w, h, body, title=TITLE):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w)} {fmt(h)}" width="{fmt(w)}" '
            f'height="{fmt(h)}" role="img" aria-labelledby="t"><title id="t">{title}</title>{body}</svg>\n')


def path(polys, fill):
    return f'<path fill="{fill}" d="{d_of(polys)}"/>'


def place(polys, box_w, box_h, target_w=None, target_h=None, dx=0.0, dy=0.0, cx=None, cy=None):
    """Scale polys to target width (or height) and centre them in the box (+dx, dy nudges)."""
    x0, y0, x1, y1 = bbox(polys)
    s = (target_w / (x1 - x0)) if target_w else (target_h / (y1 - y0))
    w, h = (x1 - x0) * s, (y1 - y0) * s
    ox = (box_w - w) / 2 if cx is None else cx - w / 2
    oy = (box_h - h) / 2 if cy is None else cy - h / 2
    return [[((x - x0) * s + ox + dx, (y - y0) * s + oy + dy) for x, y in p] for p in polys], s


def write(rel, text):
    with open(os.path.join(OUT, rel), "w") as fh:
        fh.write(text)


# ---------------------------------------------------------------------------------------------- geometry
SYMBOL = [orient(one_line(td=38, Hc=150, ov=3, hb_ratio=0.92))]
REVERSED = [orient(one_line(td=36, Hc=150, ov=3, hb_ratio=0.92))]   # light-on-dark: ~5 % thinner (irradiation)
SMALL = [orient(one_line(td=2.0, Hc=6, ov=0, hb_ratio=1.0, g=1.0))]  # 16 px cut, in pixels: bars exactly 2 px


# wordmark ZΛKI: the symbol's stroke logic at text size, plus K and I
def W_K(x, H, td, join=0.8, branch=0.42):
    stem = [(x, 0), (x + td, 0), (x + td, H), (x, H)]
    hd = td / 2
    j = (x + hd, H * join)
    ext = 40
    k = (H * join) / S60 + ext
    top = (j[0] + k * C60, j[1] - k * S60)
    arm = offset_polyline([(j[0] - 30 * C60, j[1] + 30 * S60), top], td)
    arm = clip(arm, 0, -1, 0)
    arm = clip(arm, -1, 0, -x)
    arm = clip(arm, 0, 1, H)
    b = (j[0] + (H * join) * COT60 * branch, j[1] - H * join * branch)
    kl = (H - b[1]) / S60 + ext
    leg = offset_polyline([b, (b[0] + kl * C60, b[1] + kl * S60)], td * 1.04)
    leg = clip(leg, 0, 1, H)
    return [orient(stem), orient(arm), orient(leg)], max(p[0] for p in arm + leg)


def wordmark(H=100, td=22, gap_k=0.55, gap_i=0.95):
    hb = td * 0.92 / 2
    zl = one_line(td=td, Hc=H - 2 * hb, ov=3, hb_ratio=0.92)
    mx = min(p[0] for p in zl)
    zl = [(x - mx, y + hb) for x, y in zl]
    xr = max(p[0] for p in zl)
    k, xk = W_K(xr + gap_k * td, H, td)
    i = [(xk + gap_i * td, 0), (xk + gap_i * td + td, 0), (xk + gap_i * td + td, H), (xk + gap_i * td, H)]
    return [orient(zl)] + k + [orient(i)]


WORD = wordmark()

# ---------------------------------------------------------------------------------------------- masters
sym256, _ = place(SYMBOL, 256, 256, target_w=212, dy=-2)
write("master/zaki-symbol.svg", doc(256, 256, path(sym256, INK)))

x0, y0, x1, y1 = bbox(SYMBOL)
tight = [[(x - x0, y - y0) for x, y in p] for p in SYMBOL]
write("master/zaki-symbol-tight.svg", doc(x1 - x0, y1 - y0, path(tight, INK)))

rev256, _ = place(REVERSED, 256, 256, target_w=212 * (1 - 0.0), dy=-2)
write("master/zaki-symbol-reversed.svg", doc(256, 256, path(rev256, "#FFFFFF")))

small16, _ = place(SMALL, 16, 16, target_w=None, target_h=8, dx=0, dy=0)
# snap: Z's left vertical end to x = 1, bars on whole rows (top bar rows 4-6, bottom 10-12)
sx0, sy0, _, _ = bbox(small16)
small16 = [[(x - sx0 + 1.0, y - sy0 + 4.0) for x, y in p] for p in small16]
write("master/zaki-symbol-small.svg", doc(16, 16, path(small16, INK), TITLE + " (16 px cut)"))

wx0, wy0, wx1, wy1 = bbox(WORD)
word_t = [[(x - wx0, y - wy0) for x, y in p] for p in WORD]
ww, wh = wx1 - wx0, wy1 - wy0
pad = wh * 0.5
word_p = [[(x + pad, y + pad) for x, y in p] for p in word_t]
write("master/zaki-wordmark.svg", doc(ww + 2 * pad, wh + 2 * pad, path(word_p, INK)))

# ---------------------------------------------------------------------------------------------- variants
write("variants/zaki-symbol-black.svg", doc(256, 256, path(sym256, "#000000")))
write("variants/zaki-symbol-white.svg", doc(256, 256, path(rev256, "#FFFFFF")))
write("variants/zaki-symbol-chalk.svg", doc(256, 256, path(rev256, CHALK)))
write("variants/zaki-symbol-sulfur.svg", doc(256, 256, path(rev256, SULFUR)))
write("variants/zaki-wordmark-black.svg", doc(ww + 2 * pad, wh + 2 * pad, path(word_p, "#000000")))
write("variants/zaki-wordmark-white.svg", doc(ww + 2 * pad, wh + 2 * pad, path(word_p, "#FFFFFF")))

# tiles (square, unrounded: platforms apply their own mask)
night_tile, _ = place(REVERSED, 256, 256, target_w=176, dy=-3)
write("variants/zaki-tile-night.svg",
      doc(256, 256, f'<rect width="256" height="256" fill="{NIGHT}"/>' + path(night_tile, SULFUR)))
sulfur_tile, _ = place(SYMBOL, 256, 256, target_w=176, dy=-3)
write("variants/zaki-tile-sulfur.svg",
      doc(256, 256, f'<rect width="256" height="256" fill="{SULFUR}"/>' + path(sulfur_tile, INK)))
# dark wordmark lockup for social headers
night_word = [[(x, y) for x, y in p] for p in word_p]
write("variants/zaki-wordmark-night.svg",
      doc(ww + 2 * pad, wh + 2 * pad,
          f'<rect width="{fmt(ww + 2 * pad)}" height="{fmt(wh + 2 * pad)}" fill="{NIGHT}"/>' + path(night_word, SULFUR)))

# ---------------------------------------------------------------------------------------------- web icons
write("web/favicon.svg",
      doc(16, 16, f'<rect width="16" height="16" fill="{NIGHT}"/>' + path(small16, SULFUR), TITLE))
apple, _ = place(REVERSED, 180, 180, target_w=124, dy=-2)
write("web/apple-touch-icon.svg",
      doc(180, 180, f'<rect width="180" height="180" fill="{NIGHT}"/>' + path(apple, SULFUR), TITLE))

# nav path for the React component: tight viewBox, rounded to 2 decimals
print("TIGHT_VIEWBOX", f"0 0 {fmt(x1 - x0)} {fmt(y1 - y0)}")
print("TIGHT_D", d_of(tight))
print("written", OUT)

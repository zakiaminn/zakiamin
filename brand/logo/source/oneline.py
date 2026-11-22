"""Final One line geometry: ZΛ as one stroke, every diagonal at 60°.
one_line(td, Hc, ov, hb_ratio, g) -> polygon (y down). Centreline: top bar y=0, bottom bar y=Hc.
td = diagonal thickness (perpendicular); bars are td*hb_ratio tall; g widens the gap between the
Z's diagonal and the A's left leg (extends the bottom bar) for small sizes."""
import math
C60, S60 = math.cos(math.radians(60)), math.sin(math.radians(60))
COT60 = C60 / S60


def _x(l1, l2):
    (p1, d1), (p2, d2) = l1, l2
    den = d1[0] * d2[1] - d1[1] * d2[0]
    t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den
    return (p1[0] + t * d1[0], p1[1] + t * d1[1])


def _h(y):
    return ((0, y), (1, 0))


def _par(line, off):
    (px, py), (dx, dy) = line
    return ((px - dy * off, py + dx * off), (dx, dy))


def one_line(td=38, Hc=150, ov=3, hb_ratio=0.92, g=0.0):
    hd, hb = td / 2, td * hb_ratio / 2
    run = Hc * COT60
    zd = ((run, 0), (-C60, S60))
    al = ((run + g, Hc), (C60, -S60))
    ar = ((2 * run + g, 0), (C60, S60))
    def sides(line):
        a, b = _par(line, hd), _par(line, -hd)
        # return (left, right) by x at mid height
        return (a, b) if _x(a, _h(Hc / 2))[0] < _x(b, _h(Hc / 2))[0] else (b, a)
    zd_l, zd_r = sides(zd)
    al_l, al_r = sides(al)
    ar_l, ar_r = sides(ar)
    top_b, bot_t, bot_b = _h(hb), _h(Hc - hb), _h(Hc + hb)
    cut = _h(-hb - ov)
    xr = _x(zd_r, top_b)[0]
    xl = _x(zd_l, bot_t)[0]
    return [
        (xl, -hb), (xr, -hb), (xr, hb), _x(zd_r, bot_t), _x(al_l, bot_t),
        _x(al_l, cut), _x(ar_r, cut), _x(ar_r, bot_b), _x(ar_l, bot_b), _x(al_r, ar_l), _x(al_r, bot_b),
        (xl, Hc + hb), (xl, Hc - hb), _x(zd_l, top_b), (xl, hb),
    ]


def measure(td, Hc, hb_ratio=0.92, g=0.0, ov=0):
    """Return (width, height, notch_gap, a_counter_at_base) in the same units."""
    P = one_line(td, Hc, ov, hb_ratio, g)
    xs = [p[0] for p in P]; ys = [p[1] for p in P]
    hd = td / 2
    run = Hc * COT60
    notch = (run + g) * S60 - td          # perpendicular gap between Z diagonal and A left leg
    counter = P[8][0] - P[10][0]          # A inner opening at the baseline
    return max(xs) - min(xs), max(ys) - min(ys), notch, counter

"""Small polygon helpers for constructing logo geometry exactly (no dependencies)."""
import math


def fmt(v):
    v = round(v, 2)
    if abs(v - round(v)) < 1e-9:
        return str(int(round(v)))
    return f"{v:.2f}".rstrip("0").rstrip(".")


def d_of(polys):
    out = []
    for p in polys:
        if not p:
            continue
        out.append("M" + " ".join(f"{fmt(x)} {fmt(y)}" for x, y in p) + "Z")
    return "".join(out)


def svg(polys, w=256, h=256, title="logo", fill="#111", evenodd=False, bg=None):
    rule = ' fill-rule="evenodd"' if evenodd else ""
    bgr = f'<rect width="{fmt(w)}" height="{fmt(h)}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w)} {fmt(h)}" width="{fmt(w)}" '
            f'height="{fmt(h)}" role="img" aria-labelledby="t"><title id="t">{title}</title>{bgr}'
            f'<path fill="{fill}"{rule} d="{d_of(polys)}"/></svg>\n')


def area(p):
    a = 0
    for i in range(len(p)):
        x1, y1 = p[i]
        x2, y2 = p[(i + 1) % len(p)]
        a += x1 * y2 - x2 * y1
    return a / 2


def orient(p, cw=True):
    """Return polygon wound clockwise in SVG's y-down space (positive shoelace area) when cw=True."""
    a = area(p)
    if (a > 0) != cw:
        return list(reversed(p))
    return list(p)


def move(p, dx, dy):
    return [(x + dx, y + dy) for x, y in p]


def scale(p, s, cx=0, cy=0):
    return [((x - cx) * s + cx, (y - cy) * s + cy) for x, y in p]


def bbox(polys):
    xs = [x for p in polys for x, _ in p]
    ys = [y for p in polys for _, y in p]
    return min(xs), min(ys), max(xs), max(ys)


def fit(polys, w, h, pad_x, pad_y=None, lift=0):
    """Scale uniformly and centre polys inside w x h with padding; lift moves up (optical centring)."""
    pad_y = pad_x if pad_y is None else pad_y
    x0, y0, x1, y1 = bbox(polys)
    s = min((w - 2 * pad_x) / (x1 - x0), (h - 2 * pad_y) / (y1 - y0))
    out = []
    for p in polys:
        q = [((x - x0) * s, (y - y0) * s) for x, y in p]
        out.append(q)
    bw, bh = (x1 - x0) * s, (y1 - y0) * s
    dx, dy = (w - bw) / 2, (h - bh) / 2 - lift
    return [move(p, dx, dy) for p in out], s


def intersect(p1, d1, p2, d2):
    """Intersection of lines p1 + t*d1 and p2 + u*d2."""
    den = d1[0] * d2[1] - d1[1] * d2[0]
    if abs(den) < 1e-12:
        return None
    t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den
    return (p1[0] + t * d1[0], p1[1] + t * d1[1])


def offset_polyline(pts, t):
    """Outline of a polyline with stroke t, mitre joins, butt caps. Returns one polygon."""
    h = t / 2
    n = len(pts)
    dirs, norms = [], []
    for i in range(n - 1):
        dx, dy = pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]
        L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        dirs.append((ux, uy))
        norms.append((-uy, ux))  # left normal in y-down space is (uy,-ux); pick one side consistently
    left, right = [], []
    for side, acc in ((1, left), (-1, right)):
        for i in range(n):
            if i == 0:
                nx, ny = norms[0]
                acc.append((pts[0][0] + side * h * nx, pts[0][1] + side * h * ny))
            elif i == n - 1:
                nx, ny = norms[-1]
                acc.append((pts[-1][0] + side * h * nx, pts[-1][1] + side * h * ny))
            else:
                n1, n2 = norms[i - 1], norms[i]
                a = (pts[i][0] + side * h * n1[0], pts[i][1] + side * h * n1[1])
                b = (pts[i][0] + side * h * n2[0], pts[i][1] + side * h * n2[1])
                m = intersect(a, dirs[i - 1], b, dirs[i])
                acc.append(m if m else a)
    return left + list(reversed(right))


def clip(poly, a, b, c):
    """Keep the part of poly where a*x + b*y <= c (Sutherland-Hodgman against one half-plane)."""
    out = []
    n = len(poly)
    for i in range(n):
        P, Q = poly[i], poly[(i + 1) % n]
        fp, fq = a * P[0] + b * P[1] - c, a * Q[0] + b * Q[1] - c
        if fp <= 0:
            out.append(P)
        if (fp < 0 < fq) or (fq < 0 < fp):
            s = fp / (fp - fq)
            out.append((P[0] + s * (Q[0] - P[0]), P[1] + s * (Q[1] - P[1])))
    # drop consecutive duplicates
    clean = []
    for p in out:
        if not clean or math.hypot(p[0] - clean[-1][0], p[1] - clean[-1][1]) > 1e-6:
            clean.append(p)
    if len(clean) > 1 and math.hypot(clean[0][0] - clean[-1][0], clean[0][1] - clean[-1][1]) < 1e-6:
        clean.pop()
    return clean


# ---- letter builders (cap height H, top at y, left at x) -------------------------------------------

def solve_diag(P, Q, thick):
    """Direction u (unit, pointing from upper-right to lower-left) of two parallel edges, one through P
    and one through Q, spaced `thick` apart (perpendicular)."""
    D = (Q[0] - P[0], Q[1] - P[1])
    lo, hi = math.radians(90.5), math.atan2(D[1], D[0])  # steeper than the corner-to-corner line
    def f(phi):
        ux, uy = math.cos(phi), math.sin(phi)
        return abs(D[0] * uy - D[1] * ux) - thick
    # bisection on |cross| which grows as the edges get further apart
    for _ in range(80):
        mid = (lo + hi) / 2
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    phi = (lo + hi) / 2
    return (math.cos(phi), math.sin(phi))


def letter_Z(x, y, w, H, bar, diag):
    """Z with horizontal bars `bar` tall and a diagonal `diag` thick (perpendicular)."""
    top_in = y + bar
    bot_in = y + H - bar
    P = (x + w, top_in)        # right edge of diagonal starts here
    Q = (x, bot_in)            # left edge of diagonal ends here
    u = solve_diag(P, Q, diag)
    pr = intersect(P, u, (0, bot_in), (1, 0))   # right edge meets bottom bar top
    ql = intersect(Q, u, (0, top_in), (1, 0))   # left edge meets top bar bottom
    return [[(x, y), (x + w, y), P, pr, (x + w, bot_in), (x + w, y + H), (x, y + H), Q, ql, (x, top_in)]]


def letter_A(x, y, w, H, stem, bar, bar_y, apex_w=0, overshoot=0):
    """A with legs `stem` thick (perpendicular), crossbar `bar` tall whose top sits at bar_y (from top),
    flat apex of width apex_w (0 = pointed with overshoot)."""
    cx = x + w / 2
    top = y - (overshoot if apex_w == 0 else 0)
    base = y + H
    # outer edges
    Lb, Rb = (x, base), (x + w, base)
    La, Ra = (cx - apex_w / 2, top), (cx + apex_w / 2, top)
    dl = (La[0] - Lb[0], La[1] - Lb[1])
    dr = (Ra[0] - Rb[0], Ra[1] - Rb[1])
    def unit(v):
        L = math.hypot(*v)
        return (v[0] / L, v[1] / L)
    ul, ur = unit(dl), unit(dr)
    # inner edges: offset inward by stem (perpendicular)
    nl = (ul[1], -ul[0])   # points right-ish for left leg going up
    if nl[0] < 0:
        nl = (-nl[0], -nl[1])
    nr = (ur[1], -ur[0])
    if nr[0] > 0:
        nr = (-nr[0], -nr[1])
    Li = (Lb[0] + nl[0] * stem, Lb[1] + nl[1] * stem)
    Ri = (Rb[0] + nr[0] * stem, Rb[1] + nr[1] * stem)
    inner_apex = intersect(Li, ul, Ri, ur)
    y_bt, y_bb = y + bar_y, y + bar_y + bar
    li_foot = intersect(Li, ul, (0, base), (1, 0))
    ri_foot = intersect(Ri, ur, (0, base), (1, 0))
    li_bt = intersect(Li, ul, (0, y_bt), (1, 0))
    ri_bt = intersect(Ri, ur, (0, y_bt), (1, 0))
    li_bb = intersect(Li, ul, (0, y_bb), (1, 0))
    ri_bb = intersect(Ri, ur, (0, y_bb), (1, 0))
    outer = [Lb, La] + ([Ra] if apex_w else []) + [Rb, ri_foot, ri_bb, li_bb, li_foot]
    counter = [inner_apex, ri_bt, li_bt]
    return [outer, counter]  # use evenodd


def letter_K(x, y, w, H, stem, arm, leg, join_y, branch=0.45):
    """K: stem; arm (perpendicular thickness `arm`) from the stem at join_y up to the top-right corner;
    leg (thickness `leg`) from the arm down to the bottom-right corner. Horizontal end cuts.
    Parts overlap; they are wound the same way so the default nonzero rule unites them."""
    s = [(x, y), (x + stem, y), (x + stem, y + H), (x, y + H)]
    J = (x + stem * 0.5, y + join_y)
    T = (x + w, y)
    dx, dy = T[0] - J[0], T[1] - J[1]
    L = math.hypot(dx, dy)
    u = (dx / L, dy / L)                      # up-right
    sin_t = abs(u[1])
    aw = arm / sin_t                          # horizontal width of the arm at the top cut
    up_pt, lo_pt = (x + w - aw, y), (x + w, y)
    up_end = intersect(up_pt, u, (x + stem * 0.5, 0), (0, 1))
    lo_end = intersect(lo_pt, u, (x + stem * 0.5, 0), (0, 1))
    arm_poly = [up_end, up_pt, lo_pt, lo_end]
    # arm centreline point where the leg branches
    c0 = ((up_end[0] + lo_end[0]) / 2, (up_end[1] + lo_end[1]) / 2)
    c1 = ((up_pt[0] + lo_pt[0]) / 2, y)
    B = (c0[0] + (c1[0] - c0[0]) * branch, c0[1] + (c1[1] - c0[1]) * branch)
    F = (x + w, y + H)
    dx, dy = F[0] - B[0], F[1] - B[1]
    L = math.hypot(dx, dy)
    v = (dx / L, dy / L)                      # down-right
    lw = leg / abs(v[1])
    r_pt, l_pt = F, (x + w - lw, y + H)
    cdir = (c1[0] - c0[0], c1[1] - c0[1])
    r_end = intersect(r_pt, v, c0, cdir)
    l_end = intersect(l_pt, v, c0, cdir)
    leg_poly = [l_end, r_end, r_pt, l_pt]
    return [orient(s), orient(arm_poly), orient(leg_poly)]


def letter_I(x, y, H, stem):
    return [[(x, y), (x + stem, y), (x + stem, y + H), (x, y + H)]]

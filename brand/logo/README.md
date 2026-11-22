# Zaki: logo guidelines

## 1. The logo
- **Idea**: Z and A drawn as one unbroken stroke. Every diagonal sits at 60°, so the Z's diagonal and the A's left leg run parallel. The wordmark "ZΛKI" carries the same stroke into K and I.
- **Versions**: symbol (ZΛ) for icons, the nav and avatars · wordmark (ZΛKI) where there is room for the name. The wordmark already contains the symbol, so never set the two side by side.
- **Replaces**: Masthead ZA (2026-09-27 to 2026-11-22), archived in `brand/archive/masthead-za/`.

## 2. Files
| File | Use |
|---|---|
| `master/zaki-symbol.svg` | Symbol on a 256 canvas, Ink. The master. |
| `master/zaki-symbol-tight.svg` | Same drawing cropped to the artwork (the nav's `Mark.jsx` uses this path). |
| `master/zaki-symbol-small.svg` | 16 px cut on a 16 grid: bars exactly 2 px, wider Z-to-A gap. Use it below 24 px. |
| `master/zaki-symbol-reversed.svg` | 5 % thinner, for light marks on dark grounds. |
| `master/zaki-wordmark.svg` | ZΛKI, Ink. |
| `variants/` | Black, white, Chalk and Sulfur symbols; black, white and Sulfur wordmarks; Night and Sulfur tiles; 1024 px PNGs. |
| `web/` | `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180). Copies live in `public/`. |
| `board/` | Presentation board (`board.html`, slide PNGs) with the mark in use. |

## 3. Clear space
Keep a clear zone of **2 × B** on every side, where B is the height of the Z's top bar. It scales with the logo.

## 4. Minimum size
| Version | Screen | Print |
|---|---|---|
| Symbol | 16 px tall tile with the 16 px cut; 24 px wide with the master | 6 mm wide |
| Wordmark | 64 px wide | 20 mm wide |

## 5. Colour
| Name | HEX | RGB | CMYK | Pantone (approx.) |
|---|---|---|---|---|
| Sulfur | `#DCEC3A` | 220 236 58 | 7 0 75 7 | 380 C |
| Night | `#0B0B08` | 11 11 8 | 60 40 40 100 (rich black) | Black 6 C |
| Ink | `#16160E` | 22 22 14 | 0 0 36 91 | Black 6 C |
| Chalk | `#EDEDE0` | 237 237 224 | 0 0 5 7 | Warm Gray 1 C |

CMYK is a straight conversion and the Pantone matches are approximations: check them against a printed swatch guide before ordering print.

**Approved pairs**: Ink on Chalk or white · Chalk or white on Night (use the reversed file) · Sulfur on Night (the tile, about 15:1 contrast) · Ink on a Sulfur tile. On the site the nav mark is `currentColor`, so it follows the page's light and dark modes.

**Never**: Sulfur on a light ground (about 1.2:1 against white, it disappears).

## 6. Typography
The logo letters are drawn, not typed: there is no font to install and no licence to check. On the site, everything people read is Bricolage Grotesque and numbers are Spline Sans Mono (house kit). Write the name as "Zaki Amin Ahmad" in running text.

## 7. Don'ts
Don't stretch, rotate or outline it · don't add a crossbar to the Λ · don't put back the gap the 16 px cut widens at large sizes, or use the master below 24 px · don't recolour outside the palette · don't add shadows, glows or gradients · don't retype "ZAKI" in a font in place of the wordmark · don't place it on a busy photo without the Night tile.

## 8. Checks run
Skill audit 99 to 100/100 on every master (no live text, rasters, filters or near-miss angles). Tested at 16 to 256 px, in one colour, reversed, with a 2 px blur, mirrored and rotated, in tab, header, avatar and app-icon contexts, and on a shelf with Zendesk, Zorin, ZenHub, npm and Kotlin. Trademark clearance has not been checked.

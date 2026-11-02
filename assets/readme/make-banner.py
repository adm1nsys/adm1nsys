#!/usr/bin/env python3
"""README banner for a project repo, in the same style as this profile's banner.

    python3 make-banner.py <repo dir> "EYEBROW · TAGS" "Title" "Subtitle line"

Writes <repo dir>/.github/readme/banner-dark.svg and banner-light.svg. The background is
taken from this folder's banners, so every repo gets the same backdrop. In the README:

    <picture>
      <source media="(prefers-color-scheme: light)" srcset=".github/readme/banner-light.svg">
      <img src=".github/readme/banner-dark.svg" alt="Title — Subtitle line" width="100%">
    </picture>
"""
import html
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
THEMES = {
    "dark": {"bg": "#070707", "chip": "rgba(0,0,0,0.5)", "text": "#f9f9f9", "muted": "#949494"},
    "light": {"bg": "#f9f9f9", "chip": "rgba(255,255,255,0.6)", "text": "#070707", "muted": "#5e5e5e"},
}
TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 349" width="1280" height="349" role="img" aria-label="{label}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="{bg}" stop-opacity="0.85"/>
      <stop offset="0.55" stop-color="{bg}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="{bg}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="r"><rect width="1280" height="349" rx="16"/></clipPath>
  </defs>
  <g clip-path="url(#r)">
    <image href="{image}" width="1280" height="349" preserveAspectRatio="xMidYMid slice"/>
    <rect width="1280" height="349" fill="url(#fade)"/>
  </g>
  <g font-family="'Roboto Mono', 'SF Mono', ui-monospace, Menlo, Consolas, monospace">
    <rect x="56" y="40" width="104" height="30" rx="6" fill="{chip}"/>
    <text x="108" y="60" font-size="14" font-weight="500" fill="{text}" text-anchor="middle">adm1nsys</text>
    <text x="56" y="160" font-size="14" letter-spacing="1.6" fill="{muted}">{eyebrow}</text>
    <text x="54" y="232" font-size="64" font-weight="500" letter-spacing="-2" fill="{text}">{title}</text>
    <text x="56" y="284" font-size="16" fill="{muted}">{subtitle}</text>
  </g>
</svg>
"""


def main():
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    repo, eyebrow, title, subtitle = sys.argv[1:]
    # Monospace at 64px with -2 spacing ≈ 36.5px per character; the banner has room for ~31
    if len(title) > 31:
        sys.exit(f"Title is too long for the banner ({len(title)} > 31 characters)")
    out = pathlib.Path(repo) / ".github" / "readme"
    out.mkdir(parents=True, exist_ok=True)
    for theme, colors in THEMES.items():
        source = (HERE / f"banner-{theme}.svg").read_text()
        image = re.search(r'href="(data:image/[^"]+)"', source).group(1)
        svg = TEMPLATE.format(
            label=html.escape(f"{title} — {subtitle}"), image=image,
            eyebrow=html.escape(eyebrow.upper()), title=html.escape(title), subtitle=html.escape(subtitle),
            **colors)
        (out / f"banner-{theme}.svg").write_text(svg)
        print(out / f"banner-{theme}.svg")


if __name__ == "__main__":
    main()

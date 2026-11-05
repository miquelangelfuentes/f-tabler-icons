#!/usr/bin/env python3
"""Genera favicons dedicats a les pestanyes (16/32/48 px) i accessos mòbils.

Els símbols quadrats deriven de la geometria de Tabler Icons layout-grid;
optimitzats per conservar el contrast a 16 píxels.
"""
from pathlib import Path
import cairosvg
from PIL import Image

DOCS=Path(__file__).resolve().parents[1]/"docs"
PALETTES={"blau":"#244A73","coral":"#D86F57"}
OUTPUT_SIZES=(16,32,48,180)

def make_svg(ink):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="31" fill="{ink}"/>
<g transform="translate(9 9) scale(1.92)" fill="none" stroke="#FFFFFF"
 stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
<rect x="4" y="4" width="6" height="6" rx="1.1"/>
<rect x="14" y="4" width="6" height="6" rx="1.1"/>
<rect x="4" y="14" width="6" height="6" rx="1.1"/>
<rect x="14" y="14" width="6" height="6" rx="1.1"/>
</g></svg>'''

def main():
    blue_images=[]
    for variant, ink in PALETTES.items():
        svg=make_svg(ink)
        (DOCS/f"favicon-{variant}.svg").write_text(svg,encoding="utf-8")
        for size in OUTPUT_SIZES:
            path=DOCS/f"favicon-{variant}-{size}.png"
            high=cairosvg.svg2png(bytestring=svg.encode(),output_width=size*4,output_height=size*4)
            from io import BytesIO
            image=Image.open(BytesIO(high)).convert("RGBA")
            image.resize((size,size),Image.Resampling.LANCZOS).save(path)
            if variant=="blau" and size in (16,32,48):
                blue_images.append(Image.open(path).convert("RGBA"))
    blue_images[-1].save(DOCS/"favicon.ico",format="ICO",
                         sizes=[(16,16),(32,32),(48,48)])
    for variant in PALETTES:
        for size in OUTPUT_SIZES:
            with Image.open(DOCS/f"favicon-{variant}-{size}.png") as image:
                assert image.size==(size,size) and image.mode=="RGBA"
                assert image.getpixel((size//2,size//2))[3]>0
    assert (DOCS/"favicon.ico").stat().st_size>200
    print("Favicons generats: SVG, PNG 16/32/48/180, i ICO de reserva.")

if __name__=="__main__":
    main()

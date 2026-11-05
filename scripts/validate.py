#!/usr/bin/env python3
"""Valida que la biblioteca és íntegra abans de publicar-la."""
from pathlib import Path
from PIL import Image
from xml.etree import ElementTree as ET
import json
root=Path(__file__).resolve().parents[1]
cat=json.loads((root/"docs/data/catalog.json").read_text(encoding="utf-8"))
icons=[i["name"] for i in cat["icons"]]
assert len(icons)==1000 and len(set(icons))==1000 and cat["total"]==1000
assert sum(x["count"] for x in cat["categories"])==1000
for category in cat["categories"]:
    assert sum(i["category"]==category["id"] for i in cat["icons"])==category["count"]
original=json.loads((root/"config/original-800.json").read_text(encoding="utf-8"))
assert len(original)==800
assert {(i["name"],i["category"]) for i in original}.issubset(
    {(i["name"],i["category"]) for i in cat["icons"]}
), "Cal conservar totes les icones originals a les categories corresponents"
assert len(set(i["category"] for i in cat["icons"]))>=8
for color in ("blau","coral"):
    for ext in ("png","svg"):
        folder=root/"docs/assets"/color/ext
        have={p.stem for p in folder.glob("*."+ext)}
        assert have==set(icons),(color,ext,len(have))
    for name in icons:
        png=root/"docs/assets"/color/"png"/(name+".png")
        with Image.open(png) as im:
            assert im.size==(256,256) and im.mode=="RGBA",png
            assert im.getpixel((0,0))[3]==0,(name,"Fons extern opac")
            assert im.getpixel((128,8))[3]>0,(name,"Cercle absent")
        svg=ET.parse(root/"docs/assets"/color/"svg"/(name+".svg")).getroot()
        assert svg.attrib.get("viewBox")=="0 0 256 256"
        assert len(svg.findall("{http://www.w3.org/2000/svg}circle"))==1
print("VALIDAT: 1000 icones en 2 colors i 2 formats = 4000 fitxers.")

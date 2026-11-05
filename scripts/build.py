#!/usr/bin/env python3
"""Biblioteca d'icones circulars FIC Modular (Tabler outline 3.50.0)."""
from __future__ import annotations
from pathlib import Path
from xml.etree import ElementTree as ET
import copy, json, re, shutil, unicodedata
from collections import Counter
import cairosvg

ROOT=Path(__file__).resolve().parents[1]
THEME=json.loads((ROOT/"config/theme.json").read_text(encoding="utf-8"))
CONFIG=json.loads((ROOT/"config/selection.json").read_text(encoding="utf-8"))
SOURCE=ROOT/"node_modules/@tabler/icons/icons/outline"
ASSETS=ROOT/"docs/assets"
NS="http://www.w3.org/2000/svg"
ET.register_namespace("",NS)

def allowed(name, priorities):
    if name in priorities: return True
    if name.startswith(tuple(CONFIG["exclude_starts"])): return False
    if name.endswith(tuple(CONFIG["exclude_ends"])): return False
    if any(part in name for part in CONFIG["exclude_contains"]): return False
    if re.search(r"-(?:\d+|a|b|c|d)$",name): return False
    return True

def score(name, cat):
    priority=cat["priority"]
    if name in priority: return 20000-120*priority.index(name)
    matching=[p for p in cat["prefixes"] if name==p or name.startswith(p+"-")]
    if not matching: return -100000
    tokens=name.split("-")
    modifiers=tokens[1:]
    good={"check","plus","search","heart","question","edit","code","lock","shield","share",
          "upload","download","open","info","sparkle","star","text","list","clock",
          "settings","user","users","analytics","chart","data","eye","ai","school"}
    avoid={"bolt","cancel","exclamation","cog","pause","pin","up","down","x","minus",
           "off","decimal","dashed","gradient","square","circle","filled","ribbon","hexagon"}
    return (700+min(12,len(max(matching,key=len)))*5
            +30*sum(x in good for x in modifiers)-38*sum(x in avoid for x in modifiers)
            -max(0,len(tokens)-2)*55-max(0,len(name)-22)*5+(180 if len(tokens)==1 else 0)
            +(80 if name.endswith("-ai") else 0))

def pick(names):
    priorities={n for c in CONFIG["categories"] for n in c["priority"]}
    available={n for n in names if allowed(n,priorities)}
    selected=[]
    used=set()
    for cat in CONFIG["categories"]:
        candidates=sorted((n for n in available-used if score(n,cat)>0),
                          key=lambda n:(-score(n,cat),len(n),n))
        for name in candidates[:cat["count"]]:
            selected.append({"name":name,"category":cat["id"],"category_label":cat["label"]})
            used.add(name)
    while len(selected)<CONFIG["total"]:
        remaining=sorted(available-used,key=lambda n:(len(n.split("-")),len(n),n))
        if not remaining: raise RuntimeError("No hi ha suficients icones elegibles.")
        name=remaining[0]
        selected.append({"name":name,"category":"altres","category_label":"Altres"})
        used.add(name)
    if len(selected)!=600 or len(used)!=600: raise RuntimeError("La selecció no és de 600 icones úniques.")
    return selected

def svg_bytes(name,pal):
    source=SOURCE/(name+".svg")
    if not source.exists(): raise FileNotFoundError(source)
    raw=ET.parse(source).getroot()
    if raw.tag!="{%s}svg"%NS: raise ValueError(name)
    size=THEME["canvas_px"]
    outer=THEME["outer_circle"]
    glyph=THEME["glyph"]
    svg=ET.Element("{%s}svg"%NS,{"width":str(size),"height":str(size),
         "viewBox":"0 0 %s %s"%(size,size),"role":"img",
         "aria-label":name.replace("-"," "),"data-icon":name,
         "data-source":"Tabler Icons "+THEME["tabler_version"]})
    ET.SubElement(svg,"{%s}circle"%NS,{"cx":str(outer["cx"]),"cy":str(outer["cy"]),
                  "r":str(outer["radius"]),"fill":pal["background"]})
    g=ET.SubElement(svg,"{%s}g"%NS,{"transform":"translate(%s %s) scale(%.9f)"%(
        glyph["x"],glyph["y"],glyph["size"]/24),
        "stroke":pal["foreground"],"stroke-width":str(glyph["stroke_width"]),
        "stroke-linecap":"round","stroke-linejoin":"round","fill":"none"})
    for child in raw:
        new=copy.deepcopy(child)
        for node in new.iter():
            for k,v in list(node.attrib.items()):
                if "currentColor" in v:node.set(k,v.replace("currentColor",pal["foreground"]))
        g.append(new)
    return ET.tostring(svg,encoding="utf-8",xml_declaration=True)

def main():
    if not SOURCE.is_dir():raise SystemExit("Instal·leu Tabler: npm install")
    names=sorted(p.stem for p in SOURCE.glob("*.svg"))
    if len(names)<4000:raise RuntimeError("Paquet Tabler incomplet.")
    selected=pick(names)
    if ASSETS.exists():shutil.rmtree(ASSETS)
    for color,palette in THEME["palettes"].items():
        vdir=ASSETS/color/"svg"
        pdir=ASSETS/color/"png"
        vdir.mkdir(parents=True)
        pdir.mkdir(parents=True)
        for i,item in enumerate(selected,1):
            name=item["name"]
            svg=svg_bytes(name,palette)
            (vdir/(name+".svg")).write_bytes(svg)
            cairosvg.svg2png(bytestring=svg,write_to=str(pdir/(name+".png")),
                             output_width=THEME["canvas_px"],output_height=THEME["canvas_px"])
            if i%100==0:print(color,i,"/600",flush=True)
    docs=ROOT/"docs/data"
    docs.mkdir(exist_ok=True,parents=True)
    metadata={"project":"Biblioteca d'icones FIC Modular","source":"Tabler Icons",
      "source_version":THEME["tabler_version"],"total":600,
      "palettes":THEME["palettes"],
      "categories":[{k:c[k] for k in ("id","label","count")} for c in CONFIG["categories"]],
      "icons":selected}
    (docs/"catalog.json").write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    (ROOT/"config/selected-icons.txt").write_text("\n".join(x["name"] for x in selected)+"\n",encoding="utf-8")
    print("OK: 600 icones / 1200 SVG / 1200 PNG",dict(Counter(x["category"] for x in selected)))
if __name__=="__main__":main()

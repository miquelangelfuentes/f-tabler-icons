# Biblioteca d’icones Tabler

Biblioteca visual per a presentacions i altres materials: **600 icones Tabler** en **blau tinta i coral**, cadascuna disponible en **SVG i PNG**.

Les icones tenen **un únic cercle integrat** amb el símbol centrat. Així es poden inserir a Google Slides com una sola imatge, evitant els dobles cercles i els desplaçaments de les presentacions originals.

- **Blau:** `#244A73` (icona), `#E8F0F6` (cercle).
- **Coral:** `#D86F57` (icona), `#FBE9E4` (cercle).
- **PNG:** 256 × 256 px, transparència fora del cercle.
- **SVG:** mateix disseny vectorial.
- **Font:** Tabler Icons *outline*, versió 3.50.0.

El procés automatitzat genera **2.400 fitxers**: 600 icones × 2 colors × 2 formats.

## Catàleg
El cercador web es publica a `https://miquelangelfuentes.github.io/f-tabler-icons/` un cop activat GitHub Pages.

## Ús
Descarregueu el PNG o l'SVG del catàleg i inseriu-lo a Google Slides. Per a les targetes, podeu utilitzar una mida uniforme de 42 × 42. **No afegiu cap cercle addicional.**

## Generació
La GitHub Action compila els fitxers a `docs/assets/{blau,coral}/{svg,png}/` a partir de `@tabler/icons@3.50.0`, valida el resultat i el publica.

També es pot generar localment:
```bash
npm install --ignore-scripts --no-audit --no-fund
python -m pip install -r requirements.txt
python scripts/build.py
python scripts/validate.py
```

## Autoria i llicència
Les icones originals són de **Paweł Kuna i col·laboradors**, publicades amb **llicència MIT**. Vegeu `LICENSE-TABLER.txt` i https://github.com/tabler/tabler-icons. El codi propi també utilitza MIT.

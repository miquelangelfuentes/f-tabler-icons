# Biblioteca d’icones Tabler

Biblioteca visual per a presentacions i materials gràfics: **1.000 icones Tabler** en variants **blau tinta i coral**, cadascuna disponible en **SVG i PNG**.

Totes les icones tenen **un únic cercle integrat** amb el símbol centrat. Així es poden inserir en eines de disseny i presentacions (com ara Google Slides) com una sola imatge, evitant haver d'afegir cercles manuals de fons o patir desplaçaments i desalineacions entre capes.

- **Blau tinta:** `#244A73` (símbol), `#E8F0F6` (cercle).
- **Coral:** `#D86F57` (símbol), `#FBE9E4` (cercle).
- **PNG:** 256 × 256 px, amb fons transparent fora del cercle.
- **SVG:** disseny vectorial escalable amb metadades i rol d'imatge.
- **Font original:** Tabler Icons *outline* (versió 3.50.0).

El procés automatitzat genera **4.000 fitxers d'actius visuals** (1.000 icones × 2 colors × 2 formats a `docs/assets/{blau,coral}/{svg,png}/`), a més dels catàlegs de dades i els favicons web adaptatius.

## Categories i organització

El catàleg de 1.000 icones està estructurat en **8 categories principals** i **27 subcategories temàtiques**:

1. **Aprenentatge i docència** (`aprenentatge`): 145 icones
2. **Imatge i so** (`multimedia`): 150 icones
3. **Verificació i seguretat** (`avaluacio`): 145 icones
4. **Organització i planificació** (`organitzacio`): 130 icones
5. **IA i tecnologia** (`ia-tecnologia`): 120 icones
6. **Comunicació i col·laboració** (`comunicacio`): 120 icones
7. **Accions i navegació** (`accions`): 100 icones
8. **Inclusió i benestar** (`benestar`): 90 icones

Per garantir la compatibilitat amb materials creats anteriorment, es conserven íntegrament els registres històrics a `config/original-800.json` (les 800 icones precedents) i a `config/original-600.json` (les 600 icones inicials). La selecció completa vigent es manté a `config/selected-icons.txt`.

## Catàleg web

El [catàleg interactiu](https://miquelangelfuentes.github.io/f-tabler-icons/) permet explorar i utilitzar les icones directament des del navegador:

- **Exploració per àmbits:** navegació per categories principals, subcategories temàtiques i bloc de selecció ràpida.
- **Cerca integrada:** cerca global per nom de la icona, àmbit i paraules clau associades.
- **Criteri d'ordenació:** visualització per rellevància (*Recomanades*) o per ordre alfabètic (*Nom A–Z*).
- **Càrrega progressiva:** paginació dinàmica de 36 en 36 icones per a una navegació fluida.
- **Descàrrega i enllaços directes:** descàrrega en SVG/PNG o còpia de l'URL al portapapers mitjançant el botó **Copia URL** per a inserció ràpida.
- **Tema dinàmic:** selector blau/coral amb memòria d'estat (`localStorage`) i canvi dinàmic dels favicons de la pestanya del navegador.

## Ús en presentacions

1. Localitzeu la icona que desitgeu al catàleg web.
2. Descarregueu el fitxer **PNG** o **SVG** (o premeu **Copia URL** per enganxar l'enllaç directe).
3. Inseriu la imatge a la diapositiva o document. Per a targetes informatives, botons o llistats es pot aplicar una mida uniforme (per exemple, 42 × 42 px). **No cal afegir cap cercle addicional al fons.**

## Generació local

La GitHub Action (`.github/workflows/build-and-publish.yml`) compila els actius, valida el resultat i desplega el catàleg a GitHub Pages a cada canvi rellevant.

Per generar i validar la biblioteca en un entorn local:

```bash
# 1. Instal·lar el paquet oficial de Tabler Icons
npm install --ignore-scripts --no-audit --no-fund

# 2. Instal·lar dependències de Python (CairoSVG i Pillow)
python -m pip install -r requirements.txt

# 3. Compilar els 4.000 fitxers SVG/PNG i actualitzar el catàleg
python scripts/build.py

# 4. Validar la integritat i quotes de les icones generades
python scripts/validate.py

# 5. Generar els favicons web adaptatius per a blau i coral
python scripts/build_favicons.py
```

> [!NOTE]
> `CairoSVG` requereix que el sistema tingui instal·lada la biblioteca nativa `libcairo`.

## Autoria i llicència

- Les icones originals pertanyen al projecte **Tabler Icons**, obra de **Paweł Kuna i col·laboradors**, sota **llicència MIT**. Vegeu `LICENSE-TABLER.txt` i https://github.com/tabler/tabler-icons.
- El codi de compilació, els scripts auxiliars i el catàleg web d'aquest repositori també utilitzen la **llicència MIT** (vegeu `LICENSE`).

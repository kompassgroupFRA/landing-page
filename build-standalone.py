#!/usr/bin/env python3
"""Genera una versione a file singolo della landing page.

index.html carica le immagini da images/ con percorsi relativi: aprendolo da solo,
fuori dalla sua cartella, i riquadri restano vuoti. Questo script produce
replymind-landing.html con le immagini compresse e incorporate come data URI,
quindi apribile con un doppio clic ovunque e allegabile a un'email.

index.html resta la versione autorevole: modificare quella e poi rilanciare
questo script.

Uso:  python3 build-standalone.py
Richiede: Pillow  (pip install Pillow)
"""

import base64
import io
import os
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Serve Pillow: pip install Pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(HERE, "index.html")
OUTPUT = os.path.join(HERE, "replymind-landing.html")

# Le immagini sono sfondi decorativi: JPEG a 900px è indistinguibile a schermo
# e tiene il file singolo sotto il mezzo megabyte.
MAX_SIDE = 900
JPEG_QUALITY = 78


def encode(path):
    """Ridimensiona e comprime un'immagine, restituendo un data URI."""
    with Image.open(path) as im:
        im = im.convert("RGB")
        if max(im.size) > MAX_SIDE:
            ratio = MAX_SIDE / max(im.size)
            im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    raw = buf.getvalue()
    return "data:image/jpeg;base64," + base64.b64encode(raw).decode("ascii"), len(raw)


def main():
    with open(SOURCE, encoding="utf-8") as f:
        html = f.read()

    # Trova ogni riferimento a images/<file> nel CSS inline e nei meta tag.
    refs = sorted(set(re.findall(r"images/([\w.-]+\.(?:png|jpg|jpeg))", html)))
    if not refs:
        sys.exit("Nessun riferimento a images/ trovato in index.html")

    total = 0
    for name in refs:
        path = os.path.join(HERE, "images", name)
        if not os.path.exists(path):
            sys.exit("Immagine mancante: " + path)
        uri, size = encode(path)
        before = os.path.getsize(path)
        html = html.replace("images/" + name, uri)
        total += size
        print("  {:<24} {:>7.0f} KB  ->  {:>6.0f} KB".format(name, before / 1024, size / 1024))

    # L'anteprima social non può usare un data URI: rimando al file nel repository.
    html = html.replace(
        '<meta property="og:image" content="data:image/jpeg;base64,',
        '<meta property="og:image" data-inlined="1" content="data:image/jpeg;base64,',
        1,
    )

    banner = (
        "<!-- Generato da build-standalone.py — NON modificare a mano.\n"
        "     Modificare index.html e rilanciare lo script. -->\n"
    )
    html = banner + html

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(html)

    print("\n  immagini incorporate: {:.0f} KB".format(total / 1024))
    print("  scritto: {} ({:.0f} KB)".format(os.path.basename(OUTPUT), os.path.getsize(OUTPUT) / 1024))


if __name__ == "__main__":
    main()

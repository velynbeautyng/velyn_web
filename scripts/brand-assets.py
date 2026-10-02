"""Extract brand photos from the guide PDF and build PNG icons.
Run from the repo root: python scripts/brand-assets.py
"""
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

ROOT = Path("..") / "nuvenebeauty.com"
PHOTOS = Path("src/assets/photos")
PUBLIC = Path("public/brand")
PHOTOS.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

# Page number in the guide -> output name. Each page's largest image is the photo.
PAGES = {1: "hero-cream", 7: "shopping-bag", 8: "store-shelves", 9: "shipping-box", 10: "team-tee"}

doc = fitz.open(ROOT / "NUVENE BRAND GUIDE.pdf")
for page_no, name in PAGES.items():
    page = doc[page_no - 1]
    best = max(page.get_images(full=True), key=lambda im: im[2] * im[3])
    pix = fitz.Pixmap(doc, best[0])
    if pix.n != 3 or pix.alpha:  # CMYK, greyscale or alpha: flatten to plain RGB
        pix = fitz.Pixmap(fitz.csRGB, pix, 0)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img.save(PHOTOS / f"{name}.jpg", quality=88, optimize=True, progressive=True)
    print(name, img.size)

icon = Image.open(ROOT / "LOGOS/PNG/ICON/ICON COLORED.png").convert("RGBA")
linen = (225, 218, 198, 255)
for size, target in [(180, Path("src/app/apple-icon.png")), (192, PUBLIC / "nuvene-icon-192.png"), (512, PUBLIC / "nuvene-icon-512.png")]:
    canvas = Image.new("RGBA", (size, size), linen)
    mark = icon.copy()
    mark.thumbnail((int(size * 0.7), int(size * 0.7)), Image.LANCZOS)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    canvas.convert("RGB").save(target, optimize=True)
    print(target, size)

primary = Image.open(ROOT / "LOGOS/PNG/PRIMARY LOGO/PRIMARY LOGO COLORED.png")
primary.thumbnail((1200, 1200), Image.LANCZOS)
primary.save(PUBLIC / "nuvene-primary.png", optimize=True)
print("primary", primary.size)

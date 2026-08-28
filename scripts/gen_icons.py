from PIL import Image, ImageDraw

SIZES = [16, 32, 48, 128]
BG_TOP = (20, 60, 110, 255)
BG_BOTTOM = (10, 150, 150, 255)
ACCENT = (255, 255, 255, 255)
DOT = (255, 170, 60, 255)

def make_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    for y in range(size):
        t = y / max(size - 1, 1)
        r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
        for x in range(size):
            px[x, y] = (r, g, b, 255)

    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    radius = max(2, size // 5)
    mdraw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)

    rounded = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rounded.paste(img, (0, 0), mask)
    draw = ImageDraw.Draw(rounded)

    cx, cy = size * 0.42, size * 0.58
    r1 = size * 0.24
    draw.ellipse([cx - r1, cy - r1, cx + r1, cy + r1], outline=ACCENT, width=max(1, size // 16))

    dr = size * 0.11
    dx, dy = size * 0.72, size * 0.30
    draw.ellipse([dx - dr, dy - dr, dx + dr, dy + dr], fill=DOT)

    return rounded

for s in SIZES:
    make_icon(s).save(f"/home/user/Ux-ui-ies-tf/icons/icon{s}.png")

print("done")

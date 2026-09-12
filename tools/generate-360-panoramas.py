from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "public" / "images"
OUTPUT_DIR = ROOT / "public" / "360"
WIDTH = 6144
HEIGHT = 3072
SEGMENT_WIDTH = WIDTH // 3
SEAM = 240
QUALITY = 91

SCENES: dict[str, tuple[str, str, str]] = {
    "beachfront": ("hero-beach.jpg", "beach-01.jpg", "beach-02.jpg"),
    "grounds": ("stay-01.jpg", "stay-02.jpg", "stay-03.jpg"),
    "deluxe-room": ("room-01.jpg", "room-03.jpg", "stay-01.jpg"),
    "beachview-suite": ("room-02.jpg", "stay-02.jpg", "room-03.jpg"),
    "agotata": ("food-01.jpg", "food-02.jpg", "food-03.jpg"),
    "aquasports": ("aqua-01.jpg", "aqua-02.jpg", "aqua-03.jpg"),
    "bohol-tours": ("tour-01.jpg", "tour-02.jpg", "tour-03.jpg"),
    "events": ("event-01.jpg", "event-02.jpg", "event-03.jpg"),
}


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def vignette_mask(size: tuple[int, int], edge: int = 150) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 255)
    pixels = mask.load()
    for y in range(height):
        distance = min(y, height - 1 - y)
        if distance >= edge:
            alpha = 255
        else:
            alpha = int(255 * smoothstep(distance / edge))
        for x in range(width):
            pixels[x, y] = alpha
    return mask


def make_panel(path: Path) -> Image.Image:
    source = Image.open(path).convert("RGB")

    # The soft full-height plate keeps the poles filled while preserving the
    # source image's own palette rather than inventing architecture.
    background = ImageOps.fit(
        source,
        (SEGMENT_WIDTH, HEIGHT),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    ).filter(ImageFilter.GaussianBlur(34))
    background = ImageEnhance.Color(background).enhance(0.82)
    background = ImageEnhance.Brightness(background).enhance(0.84)

    # Keep the photographic direction legible around the horizon. A modest
    # vertical stretch compensates for the very tall spherical segment while
    # retaining essentially the whole original frame horizontally.
    fitted = ImageOps.contain(
        source,
        (SEGMENT_WIDTH, int(HEIGHT * 0.58)),
        method=Image.Resampling.LANCZOS,
    )
    fitted = fitted.resize(
        (fitted.width, min(int(fitted.height * 1.18), int(HEIGHT * 0.66))),
        Image.Resampling.LANCZOS,
    )
    fitted = ImageEnhance.Contrast(fitted).enhance(1.02)
    fitted = ImageEnhance.Color(fitted).enhance(1.03)

    x = (SEGMENT_WIDTH - fitted.width) // 2
    y = (HEIGHT - fitted.height) // 2
    mask = vignette_mask(fitted.size, edge=min(170, fitted.height // 4))
    background.paste(fitted, (x, y), mask)
    return background


def blend_vertical_seam(left: Image.Image, right: Image.Image, seam: int = SEAM) -> tuple[Image.Image, Image.Image]:
    left = left.copy()
    right = right.copy()
    left_strip = left.crop((SEGMENT_WIDTH - seam, 0, SEGMENT_WIDTH, HEIGHT))
    right_strip = right.crop((0, 0, seam, HEIGHT))

    blended = Image.new("RGB", (seam, HEIGHT))
    for x in range(seam):
        ratio = smoothstep(x / max(1, seam - 1))
        column_left = left_strip.crop((x, 0, x + 1, HEIGHT))
        column_right = right_strip.crop((x, 0, x + 1, HEIGHT))
        blended.paste(Image.blend(column_left, column_right, ratio), (x, 0))

    half = seam // 2
    left.paste(blended.crop((0, 0, half, HEIGHT)), (SEGMENT_WIDTH - half, 0))
    right.paste(blended.crop((half, 0, seam, HEIGHT)), (0, 0))
    return left, right


def make_panorama(images: Iterable[str], target: Path) -> None:
    panels = [make_panel(IMAGE_DIR / name) for name in images]

    panels[0], panels[1] = blend_vertical_seam(panels[0], panels[1])
    panels[1], panels[2] = blend_vertical_seam(panels[1], panels[2])

    # Wrap seam: blend the final direction back into the first direction so a
    # complete revolution has no hard cut at yaw ±180°.
    final_strip = panels[2].crop((SEGMENT_WIDTH - SEAM, 0, SEGMENT_WIDTH, HEIGHT))
    first_strip = panels[0].crop((0, 0, SEAM, HEIGHT))
    wrap = Image.new("RGB", (SEAM, HEIGHT))
    for x in range(SEAM):
        ratio = smoothstep(x / max(1, SEAM - 1))
        wrap.paste(
            Image.blend(
                final_strip.crop((x, 0, x + 1, HEIGHT)),
                first_strip.crop((x, 0, x + 1, HEIGHT)),
                ratio,
            ),
            (x, 0),
        )
    half = SEAM // 2
    panels[2].paste(wrap.crop((0, 0, half, HEIGHT)), (SEGMENT_WIDTH - half, 0))
    panels[0].paste(wrap.crop((half, 0, SEAM, HEIGHT)), (0, 0))

    panorama = Image.new("RGB", (WIDTH, HEIGHT))
    for index, panel in enumerate(panels):
        panorama.paste(panel, (index * SEGMENT_WIDTH, 0))

    # A restrained spherical vignette reduces attention on pole stretching.
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    alpha = overlay.getchannel("A")
    alpha_pixels = alpha.load()
    pole_band = int(HEIGHT * 0.19)
    for y in range(HEIGHT):
        pole_distance = min(y, HEIGHT - 1 - y)
        if pole_distance < pole_band:
            amount = 1.0 - smoothstep(pole_distance / pole_band)
            value = int(56 * amount)
            for x in range(WIDTH):
                alpha_pixels[x, y] = value
    overlay.putalpha(alpha)
    panorama = Image.alpha_composite(panorama.convert("RGBA"), overlay).convert("RGB")

    target.parent.mkdir(parents=True, exist_ok=True)
    panorama.save(target, "JPEG", quality=QUALITY, subsampling=0, optimize=True, progressive=True)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for scene, images in SCENES.items():
        missing = [name for name in images if not (IMAGE_DIR / name).exists()]
        if missing:
            raise FileNotFoundError(f"{scene}: missing {', '.join(missing)}")
        target = OUTPUT_DIR / f"{scene}.jpg"
        print(f"Generating {target.relative_to(ROOT)} from {', '.join(images)}")
        make_panorama(images, target)
    print(f"Generated {len(SCENES)} panoramas at {WIDTH}x{HEIGHT}.")


if __name__ == "__main__":
    main()

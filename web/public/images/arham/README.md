# ARHAM portrait assets

The supplied portrait was processed locally. The original file was not modified.

## Processing

- Removed the surrounding background and podium with human-segmentation masking.
- Refined the mask edge, removed background-colored edge fringing, and softened the alpha edge by about one pixel.
- Cropped to a chest-up portrait, converted to grayscale, increased contrast, and tinted the highlights silver.
- Preserved transparency on the cutout exports. The mobile version is a portrait crop for narrow layouts.

## Files

- `photo-cutout.png`, `photo-cutout.webp`, `photo-cutout.avif` — transparent master, 1744 × 1600.
- `photo-cutout-800.png`, `photo-cutout-800.webp`, `photo-cutout-800.avif` — transparent 800 px tall version, 872 × 800.
- `photo-cutout-480.png`, `photo-cutout-480.webp`, `photo-cutout-480.avif` — transparent 480 px tall version, 523 × 480.
- `photo-hero-mobile.png`, `photo-hero-mobile.webp`, `photo-hero-mobile.avif` — transparent portrait crop, 1080 × 1350.
- `photo-blur.png` — small, blurred transparent placeholder for image loading.

The cutouts are draft assets for review. The homepage and About section have not been integrated with them.

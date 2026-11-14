import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = path.resolve("public/brand/arham");
const mark = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-labelledby="title">
  <title id="title">ARHAM star mark</title>
  <rect width="64" height="64" fill="#0B0B0B"/>
  <path
    transform="translate(11 8)"
    d="M21 0L22.1089 20.2315C22.1536 21.0354 23.0188 21.5299 23.7418 21.1641L42 11.999L24.8507 23.0654C24.1683 23.5036 24.1683 24.4924 24.8507 24.9346L42 36.001L23.7418 26.8359C23.0147 26.4701 22.1536 26.9646 22.1089 27.7685L21 48L19.8911 27.7685C19.8464 26.9646 18.9812 26.4701 18.2582 26.8359L0 35.997L17.1493 24.9306C17.8317 24.4924 17.8317 23.5036 17.1493 23.0614L0 11.999L18.2582 21.1641C18.9853 21.5299 19.8464 21.0354 19.8911 20.2315L21 0Z"
    fill="#9B5CFF"
  />
</svg>
`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, "mark.svg"), mark, "utf8");
await writeFile(path.join(outputDirectory, "favicon.svg"), mark, "utf8");

for (const size of [16, 32, 180, 512]) {
  await sharp(Buffer.from(mark))
    .resize(size, size, { fit: "contain" })
    .png()
    .toFile(path.join(outputDirectory, `favicon-${size}.png`));
}

console.log(`Generated ARHAM star-mark assets in ${outputDirectory}`);

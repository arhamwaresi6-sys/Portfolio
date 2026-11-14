import { HeroPhoto } from "@/components/sections/HeroPhoto";
import { BrandMark } from "@/components/ui/BrandMark";

const screens = [
  {
    id: "mobile",
    label: "01 / Mobile",
    title: "A close, quiet introduction.",
    rationale:
      "The portrait leads without crowding the headline. Purple light and a bottom fade keep the cutout grounded in the black canvas.",
  },
  {
    id: "tablet",
    label: "02 / Tablet",
    title: "More room, same focus.",
    rationale:
      "The copy and portrait open into a two-column rhythm, while the generous negative space keeps the identity editorial rather than busy.",
  },
  {
    id: "desktop",
    label: "03 / Desktop",
    title: "A confident, full-width hero.",
    rationale:
      "The portrait anchors the right side with a restrained rim light. The left stays clear for the name, role, and a direct work link.",
  },
];

export default function HeroPhotoPreviewPage() {
  return (
    <main className="portrait-preview">
      <header className="portrait-preview__intro">
        <p className="portrait-preview__eyebrow">ARHAM / PORTRAIT STUDY</p>
        <h1>Hero portrait — responsive mockups</h1>
        <p>
          Draft only. Review the mobile layout first, followed by tablet and desktop. The live homepage and About
          section have not been changed.
        </p>
      </header>

      <section className="portrait-preview__screens" aria-label="Responsive hero mockups">
        {screens.map((screen) => (
          <article key={screen.id} className={`portrait-preview__screen portrait-preview__screen--${screen.id}`}>
            <div className="portrait-preview__screen-heading">
              <p>{screen.label}</p>
              <h2>{screen.title}</h2>
            </div>

            <div className={`portrait-mockup portrait-mockup--${screen.id}`}>
              <div className="portrait-mockup__nav">
                <span className="portrait-mockup__brand">
                  <BrandMark size={22} className="portrait-mockup__mark" />
                  <span>ARHAM</span>
                </span>
                <span className="portrait-mockup__menu">MENU <i aria-hidden="true" /></span>
              </div>

              <div className="portrait-mockup__copy">
                <p className="portrait-mockup__eyebrow">FULL-STACK DEVELOPER <span>— AVAILABLE FOR SELECT WORK</span></p>
                <h3>Built with<br />clarity. <em>Made to last.</em></h3>
                <span className="portrait-mockup__link">EXPLORE SELECTED WORK <span aria-hidden="true">↗</span></span>
              </div>

              {screen.id === "mobile" ? (
                <HeroPhoto
                  altText="Grayscale portrait of ARHAM.WARESI wearing glasses"
                  variant="mobile"
                  src="/images/arham/photo-hero-mobile.png"
                  width={1080}
                  height={1350}
                  priority
                  className="portrait-mockup__photo"
                />
              ) : (
                <HeroPhoto
                  altText="Grayscale portrait of ARHAM.WARESI wearing glasses"
                  variant="hero"
                  priority
                  className="portrait-mockup__photo"
                />
              )}

              <div className="portrait-mockup__footer">
                <span>INDEPENDENT DEVELOPER</span>
                <span>SCROLL TO DISCOVER <b aria-hidden="true">↓</b></span>
              </div>
            </div>

            <p className="portrait-preview__rationale">{screen.rationale}</p>
          </article>
        ))}
      </section>

      <section className="portrait-preview__about" aria-labelledby="about-portrait-title">
        <div>
          <p className="portrait-preview__eyebrow">SAME PORTRAIT / ABOUT VARIANT</p>
          <h2 id="about-portrait-title">A glass-framed treatment for the About section.</h2>
          <p>
            The About variant uses the same cutout and image description, placed in a subtle glass frame. It is
            previewed here only and is not connected to the live page yet.
          </p>
        </div>
        <div className="portrait-preview__about-frame">
          <HeroPhoto
            altText="Grayscale portrait of ARHAM.WARESI wearing glasses"
            variant="about"
            priority={false}
          />
          <span className="portrait-preview__about-caption">ABOUT / 01</span>
        </div>
      </section>
    </main>
  );
}

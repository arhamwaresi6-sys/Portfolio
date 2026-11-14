import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedProfileImageUrl } from "@/lib/site-settings";
import { CarouselHydrationReady } from "@/components/effects/CarouselHydrationReady";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { BrandMark } from "@/components/ui/BrandMark";

const navItems = [
  { href: "#info", label: "INFO" },
  { href: "#about", label: "ABOUT" },
  { href: "#skills", label: "SKILLS" },
  { href: "#work", label: "WORK" },
  { href: "#contact", label: "CONTACT" },
];

const contactEmail = "arhamwaresi6@gmail.com";
const contactSubject = "Portfolio inquiry";
const contactBody = "Hi Arham,\n\nI came across your portfolio and would like to get in touch.\n\n";
const contactEmailLink = `mailto:${contactEmail}?${new URLSearchParams({
  subject: contactSubject,
  body: contactBody,
})}`;
const gmailComposeLink = `https://mail.google.com/mail/?${new URLSearchParams({
  view: "cm",
  fs: "1",
  to: contactEmail,
  su: contactSubject,
  body: contactBody,
})}`;

const stats = [
  {
    label: "Services",
    value: (
      <>
        Full-stack development and
        <br />
        digital products
      </>
    ),
    alignRight: true,
  },
  { label: "Experience", value: "Building with care" },
  { label: "Timezone", value: "LOCAL", timezone: "Asia/Dhaka", timezonePrefix: "DHA" },
  { label: "availability", value: "Open to select projects" },
  { label: "Focus", value: "Web apps & systems" },
];

function PortraitImage({ src }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="sequence-placeholder" />;
}

async function ProfilePortrait() {
  await connection();
  const imageUrl = await getPublishedProfileImageUrl();
  return <PortraitImage src={imageUrl ?? "/images/arham-portrait.webp"} />;
}

async function WorkSection() {
  await connection();
  const { items: featuredProjects, error: projectsError } = await getPublishedProjects({
    featuredOnly: true,
  });
  const projects = featuredProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    type: project.category,
    image: project.image_urls?.[0] ?? "/images/project-placeholder.svg",
    video: project.video_media_url,
    liveUrl: project.live_url,
  }));

  return projects.length ? (
    <section
      id="work"
      data-glass-carousel=""
      data-scroll=""
      data-scroll-speed="-0.2"
      className="glass-carousel"
    >
      <CarouselHydrationReady />
      <canvas aria-hidden="true" data-glass-carousel-canvas="" className="glass-carousel__canvas" />

      <div className="glass-carousel__collection">
        <div data-glass-carousel-list="" className="glass-carousel__list">
          {projects.map((project) => (
            <div key={project.id} data-glass-carousel-item="" className="glass-carousel__item">
              <Link
                href={project.liveUrl || (project.slug ? `/projects/${project.slug}` : "/projects")}
                target={project.liveUrl ? "_blank" : undefined}
                rel={project.liveUrl ? "noopener noreferrer" : undefined}
                className="glass-carousel__item-link"
                aria-label={
                  project.liveUrl
                    ? `Visit ${project.title} live website in a new tab`
                    : `View ${project.title} project`
                }
              >
                <div
                  data-bunny-background-init={project.video ? "" : undefined}
                  data-player-src={project.video || undefined}
                  data-player-activated="false"
                  data-player-status="idle"
                  data-player-lazy="false"
                  data-player-autoplay={project.video ? "true" : "false"}
                  className="bunny-bg"
                >
                  {project.video ? (
                    <video
                      aria-hidden="true"
                      crossOrigin="anonymous"
                      muted
                      playsInline
                      preload="auto"
                      className="bunny-bg__video"
                    />
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src={project.image}
                    loading="lazy"
                    className="bunny-bg__placeholder"
                  />
                </div>

                <div data-glass-carousel-content="" className="glass-carousel__item-content">
                  <h3 className="glass-carousel__item-p">{project.title}</h3>
                  <p className="glass-carousel__item-p is--faded">{project.type}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div aria-live="polite" data-glass-carousel-caption="" className="glass-carousel__caption" />
      <div data-glass-carousel-counter="" className="glass-carousel__counter" />
    </section>
  ) : (
    <section id="work" className="padding-global">
      <p role={projectsError ? "status" : undefined} className="text-sm text-silver/70">
        {projectsError ?? "New project stories are on the way."}
      </p>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <div className="navbar-link-wrapper">
        {navItems.map((item) => (
          <a key={item.label} data-link-stagger="" href={item.href} className="nav-link">
            {item.label}
          </a>
        ))}
      </div>

      <nav id="nav" className="navbar" aria-label="Main navigation">
        <a href="#" className="nav-button w-inline-block" aria-label="ARHAM home">
          <div className="icon-1x1-medium w-embed">
            <BrandMark size={28} />
          </div>
        </a>

        <a href="#" className="nav-button is-menu w-inline-block" aria-label="Open menu" aria-expanded="false">
          <div className="menu-icon">
            <div className="menu-dot" />
            <div className="menu-dot" />
            <div className="menu-dot" />
            <div className="menu-dot" />
            <div className="menu-dot" />
          </div>
          <div>MENU</div>
        </a>
      </nav>

      <div data-scroll-container="" className="page-wrapper">
        <section id="header">
          <div className="padding-global">
            {/* Scroll image sequence — wire your frame assets later */}
            <div
              data-scroll-end="bottom top"
              data-sequence-wrap=""
              data-scroll-start="top top"
              className="image-sequence__wrap"
            >
              <div className="image-sequence__sticky">
                <div className="scroll-col">
                  <div data-sequence-element="" className="image-sequence__element">
                    {/*
                      TODO: provide scroll-sequence frames, then restore canvas attrs:
                      data-desktop-src="..."
                      data-mobile-src="..."
                      data-filetype="jpg"
                      data-frames="63"
                      data-digits="3"
                      data-index-start="1"
                      data-static-src="..."
                    */}
                    {/*
                    <canvas
                      data-sequence-canvas=""
                      data-desktop-src=""
                      data-mobile-src=""
                      data-filetype="jpg"
                      data-frames="63"
                      data-digits="3"
                      data-index-start="1"
                      data-static-src=""
                      className="image-sequence__canvas"
                    />
                    */}
                    <div className="asset-placeholder" aria-hidden="true">
                      <Suspense fallback={<PortraitImage src="/images/arham-portrait.webp" />}>
                        <ProfilePortrait />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section__header">
              <div data-reveal-group="" className="header-top">
          <h6>ARHAM.WARESI</h6>
                <h6>portfolio 2026</h6>
              </div>

              <div className="header-bottom">
                <div data-reveal-group="" className="header-intro__wrap">
                  <h6 className="hide-mobile-landscape">Hi there</h6>
                  <div className="header-text-wrapper">
                    <div className="star-icon w-embed">
                      <svg width="42" height="48" viewBox="0 0 42 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 0L22.1089 20.2315C22.1536 21.0354 23.0188 21.5299 23.7418 21.1641L42 11.999L24.8507 23.0654C24.1683 23.5036 24.1683 24.4924 24.8507 24.9346L42 36.001L23.7418 26.8359C23.0147 26.4701 22.1536 26.9646 22.1089 27.7685L21 48L19.8911 27.7685C19.8464 26.9646 18.9812 26.4701 18.2582 26.8359L0 35.997L17.1493 24.9306C17.8317 24.4924 17.8317 23.5036 17.1493 23.0614L0 11.999L18.2582 21.1641C18.9853 21.5299 19.8464 21.0354 19.8911 20.2315L21 0Z"
                          fill="#9B5CFF"
                        />
                      </svg>
                    </div>
                    <p>
                      I build digital products with clarity,
                      <br />
                      character, and care.
                    </p>
                  </div>
                </div>

                <div className="line" />

                <h1
                  data-stagger-char-delay="0.75"
                  data-scroll=""
                  data-scroll-speed="0.1"
                  data-stagger-char="line"
                  className="text-align-right"
                  aria-label="ARHAM.WARESI"
                >
                  arham<span className="text-color-orange">.</span>
                  <br />
                  <span className="text-color-orange">waresi</span>
                </h1>
              </div>
            </div>

            <div id="info" className="section__info">
              <div className="_2-col is-intro">
                <h6>About</h6>

                <div className="flex-vertical space-between is-stretch">
                  <div data-reveal-group="" className="flex-vertical">
                    {stats.map((item) => (
                      <div key={item.label} className="stats-wrapper">
                        <h6>{item.label}</h6>
                        <h6
                          className={item.alignRight ? "text-align-right" : undefined}
                          {...(item.timezone
                            ? {
                                "data-timezone": item.timezone,
                                ...(item.timezonePrefix
                                  ? { "data-timezone-prefix": item.timezonePrefix }
                                  : {}),
                              }
                            : {})}
                        >
                          {item.value}
                        </h6>
                        <div className="line is-top" />
                      </div>
                    ))}
                  </div>

                  <a data-button-097="" href="#work" className="button-097 w-inline-block">
                    <span className="button-097__hover">
                      <span className="button-097__bg is--hover" />
                      <span className="button-097__inner">
                        <span className="button-097__text">Click here</span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="button-097__default">
                      <span className="button-097__bg is--default" />
                      <span className="button-097__inner">
                        <span className="button-097__text">View work</span>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="padding-global">
            <div className="padding-vertical padding-xxhuge">
              <div className="margin-bottom margin-large">
                <h2 data-gradient-wave-text="" className="heading-2">
                  Digital products with clarity, character, and staying power
                </h2>
              </div>

              <div className="line" />

              <div className="margin-top margin-medium">
                <div data-reveal-group="" className="_2-col is-3-9">
                  <h6>Because</h6>
                  <p className="text-2-col">
                    ARHAM.WARESI builds purposeful digital products. From the first
                    interface to the systems behind it, the goal is simple: make software feel considered, work
                    reliably, and stay useful as it grows. Strategy, design sense, and engineering in one direction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SkillsSection />

        <section>
          <div className="padding-global">
            <div className="margin-top margin-huge">
              <h6>What you&apos;re here for (I guess)</h6>
              <h2 data-stagger-char="" className="heading-extreme">
                Work
              </h2>
            </div>
          </div>
        </section>

        <Suspense
          fallback={
            <section id="work" className="glass-carousel glass-carousel--loading" aria-busy="true">
              <p className="glass-carousel__loading-title">Selected work</p>
              <div className="glass-carousel__loading-card" aria-hidden="true" />
              <p role="status" className="glass-carousel__loading-status">Loading projects...</p>
            </section>
          }
        >
          <WorkSection />
        </Suspense>

        <section id="contact" className="section-footer">
          <div className="padding-global is-full">
            <div className="footer-base">
              <div className="padding-medium">
                <div data-reveal-group="" className="flex-horizontal space-between is-stretch">
                  <h6>ARHAM.WARESI</h6>
                  <h6>Portfolio 2026</h6>
                </div>
              </div>

              <div className="footer-last">
                <div className="padding-medium">
                  <div className="margin-bottom margin-small">
                    <div data-reveal-group="" className="flex-horizontal space-between is-stretch">
                      <div className="flex-vertical gap-s">
                        <div className="flex-vertical">
                          <h6>Phone</h6>
                          <a data-link-stagger="" href="tel:+8801623619790" className="heading-style-h6">
                            +880 1623-619790
                          </a>
                        </div>
                        <div className="flex-vertical">
                          <h6>Mail</h6>
                          <a href={contactEmailLink} data-link-stagger="" className="heading-style-h6">
                            {contactEmail}
                          </a>
                          <a
                            href={gmailComposeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open a new Gmail draft addressed to Arham Waresi"
                            className="mt-2 text-sm text-silver/70 underline underline-offset-4 transition hover:text-white"
                          >
                            Open Gmail
                          </a>
                        </div>
                      </div>

                      <div className="flex-vertical gap-s">
                        <div className="flex-vertical">
                          <h6 className="text-align-right">Linkedin</h6>
                          {/* TODO: replace with your LinkedIn */}
                          <a
                            data-link-stagger=""
                            href="#"
                            target="_blank"
                            rel="noreferrer"
                            className="heading-style-h6 text-align-right"
                          >
                            Profile coming soon
                          </a>
                        </div>
                        <div className="flex-vertical">
                          <h6 className="text-align-right">Instagram</h6>
                          <a
                            data-link-stagger=""
                            href="https://www.instagram.com/arham_waresi/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="heading-style-h6 text-align-right"
                          >
                            @arham_waresi
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="line" />
                </div>

                <div
                  data-marquee-duplicate="3"
                  data-marquee-scroll-direction-target=""
                  data-marquee-direction="right"
                  data-marquee-status="normal"
                  data-marquee-speed="14"
                  data-marquee-interactive=""
                  className="marquee-advanced"
                  aria-label="ARHAM.WARESI marquee — drag to interact"
                >
                  <div data-marquee-scroll-target="" className="marquee-advanced__scroll">
                    <div data-marquee-collection-target="" className="marquee-advanced__collection">
                      <div className="marquee-advanced__item">
                        <h3 className="marquee-text">
                          arham<span className="text-color-orange">.waresi</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*
                TODO: restore Spline 3D scene when you have the asset:
                <div
                  className="t-shape"
                  data-animation-type="spline"
                  data-spline-url="YOUR_SPLINE_SCENE_URL"
                >
                  <canvas />
                </div>
              */}
              <div className="t-shape t-shape-placeholder" aria-hidden="true" />
              <div className="footer-gradient" />
            </div>
          </div>
        </section>

        <div className="cursor-wrap">
          <div data-cursor-dot="" className="cursor-dot" />
          <canvas data-cursor-canvas="" className="cursor-canvas" />
        </div>
      </div>
    </>
  );
}

import Image from "next/image";

const skillGroups = [
  {
    number: "01",
    label: "WEB",
    title: "Frontend",
    description: "Building expressive, responsive experiences for the web.",
    skills: [
      { name: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
      { name: "CSS", icon: "https://cdn.simpleicons.org/css/663399" },
      { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
      { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
    ],
  },
  {
    number: "02",
    label: "SERVER",
    title: "Backend & code",
    description: "Turning product ideas into dependable application logic.",
    skills: [
      { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
      { name: "Flask", icon: "https://cdn.simpleicons.org/flask/FFFFFF" },
      { name: "C", icon: "https://cdn.simpleicons.org/c/A8B9CC" },
      { name: "C++", icon: "https://cdn.simpleicons.org/cplusplus/00599C" },
    ],
  },
  {
    number: "03",
    label: "DATA",
    title: "Databases",
    description: "Working with structured data and relational databases.",
    skills: [
      { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
      { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
    ],
  },
  {
    number: "04",
    label: "DESIGN / MOTION",
    title: "Design & interaction",
    description: "Pairing visual craft with motion that makes interfaces feel alive.",
    skills: [
      { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
      {
        name: "CSS animations",
        icon: "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/sparkles.svg",
        monochrome: true,
      },
      {
        name: "Scroll effects",
        icon: "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/chevrons-down.svg",
        monochrome: true,
      },
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="skills-section padding-global">
      <div className="skills-section__inner">
        <div className="skills-section__intro" data-reveal-group="" data-distance="1.5rem">
          <p className="skills-section__eyebrow">01 / SKILLSET</p>
          <div className="skills-section__heading-row">
            <h2 data-gradient-wave-text="" className="skills-section__heading">
              Skills
            </h2>
            <p className="skills-section__lede">
              From a first sketch to the final scroll interaction, I bring ideas to life
              across the stack.
            </p>
          </div>
          <div className="skills-section__rule" />
        </div>

        <div
          className="skills-grid"
          data-reveal-group=""
          data-stagger="120"
          data-distance="2rem"
        >
          {skillGroups.map((group) => (
            <article className="skills-card" key={group.number}>
              <span className="skills-card__glow" aria-hidden="true" />
              <div className="skills-card__meta">
                <span className="skills-card__number">{group.number}</span>
                <span className="skills-card__label">{group.label}</span>
              </div>
              <h3 className="skills-card__title">{group.title}</h3>
              <p className="skills-card__description">{group.description}</p>
              <ul className="skills-card__list" aria-label={`${group.title} skills`}>
                {group.skills.map((skill) => (
                  <li className="skills-card__chip" key={skill.name}>
                    <Image
                      className={`skills-card__icon${skill.monochrome ? " skills-card__icon--monochrome" : ""}`}
                      src={skill.icon}
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      unoptimized
                    />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

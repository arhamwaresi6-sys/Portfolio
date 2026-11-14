const skillGroups = [
  {
    number: "01",
    label: "WEB",
    title: "Frontend",
    description: "Building expressive, responsive experiences for the web.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
  },
  {
    number: "02",
    label: "SERVER",
    title: "Backend & code",
    description: "Turning product ideas into dependable application logic.",
    skills: ["Python", "Flask", "C", "C++"],
  },
  {
    number: "03",
    label: "DATA",
    title: "Databases",
    description: "Working with structured data and relational databases.",
    skills: ["MySQL", "PostgreSQL"],
  },
  {
    number: "04",
    label: "DESIGN / MOTION",
    title: "Design & interaction",
    description: "Pairing visual craft with motion that makes interfaces feel alive.",
    skills: ["Figma", "CSS animations", "Scroll effects"],
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
                  <li className="skills-card__chip" key={skill}>
                    {skill}
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

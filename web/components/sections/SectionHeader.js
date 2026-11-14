export function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`mb-10 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-accent">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl text-white sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-silver/85">{description}</p> : null}
    </div>
  );
}

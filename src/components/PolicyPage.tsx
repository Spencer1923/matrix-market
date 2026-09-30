// Shared layout for text pages: a title plus sections of heading + text
export default function PolicyPage({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; text: string }[];
}) {
  return (
    <main className="mx-auto max-w-2xl px-8 py-10">
      <h1 className="text-3xl font-bold text-navy">{title}</h1>
      <p className="mt-3 rounded-lg bg-cool p-3 text-sm text-muted">
        This is a portfolio demo. No real orders are processed, and this page contains sample text.
      </p>
      {sections.map((s) => (
        <section key={s.heading} className="mt-8">
          <h2 className="text-xl font-semibold text-navy">{s.heading}</h2>
          <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
        </section>
      ))}
    </main>
  );
}
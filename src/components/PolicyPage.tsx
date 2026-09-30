// Shared layout for text pages: a title plus sections of heading + text
export default function PolicyPage({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; text: string }[];
}) {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {sections.map((s) => (
        <section key={s.heading} className="mt-6">
          <h2 className="text-xl font-semibold">{s.heading}</h2>
          <p className="mt-2 text-gray-600">{s.text}</p>
        </section>
      ))}
    </main>
  );
}
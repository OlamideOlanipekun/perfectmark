const FILTERS = ["All", "Agricultural Science", "Arts", "Biology", "Chemistry", "Christian Religious Knowledge", "Commercial", "Economics", "English Language", "Financial Accounting", "General Mathematics", "Geography", "Government", "Languages", "Literature in English", "Oral English", "Physics", "Sciences", "Yoruba"];

export function CourseShowcase() {
  return (
    <section className="bg-gradient-soft py-16">
      <div className="container">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {FILTERS.map((f) => (
            <span
              key={f}
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-gradient-primary hover:text-white hover:border-primary transition-smooth shadow-card"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-xl mx-auto">
          <p className="font-bold text-primary">Catalogue coming soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re recording lessons right now. Subscribe to be first in line.
          </p>
        </div>
      </div>
    </section>
  );
}

import Card from "@/shared/components/Card";

const features = [
  {
    title: "Smart budgeting",
    description:
      "Create flexible budgets that adapt to your spending patterns and goals.",
  },
  {
    title: "Cash flow insights",
    description:
      "See where your money is going with clear category breakdowns and trends.",
  },
  {
    title: "Goal tracking",
    description:
      "Stay focused on saving for travel, home, or long-term financial freedom.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
          features
        </p>
        
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Everything you need to grow your money confidently.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="bg-slate-900 p-6 text-left">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-xl text-emerald-300">
              ✓
            </div>

            <h3 className="text-xl font-semibold text-white">
              {feature.title}
            </h3>

            <p className="mt-3 text-slate-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

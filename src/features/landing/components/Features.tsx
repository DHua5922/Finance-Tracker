import { Card } from "@/shared/components";
import styles from "./Features.module.css";

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
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent-foreground">
          features
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Everything you need to grow your money confidently.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className={styles.featureCard}>
            <div className={styles.featureIcon}>✓</div>

            <h3 className="text-xl font-semibold text-foreground">
              {feature.title}
            </h3>

            <p className="mt-3 text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

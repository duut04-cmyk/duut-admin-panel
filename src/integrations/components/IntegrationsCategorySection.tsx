import type { IntegrationCategory } from "@/data/integrationTypes";
import IntegrationCard from "./IntegrationCard";

type IntegrationsCategorySectionProps = {
  category: IntegrationCategory;
};

export default function IntegrationsCategorySection({
  category,
}: IntegrationsCategorySectionProps) {
  return (
    <section
      aria-labelledby={`integration-category-${category.id}`}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h2
          id={`integration-category-${category.id}`}
          className="text-subheading font-semibold leading-snug text-foreground"
        >
          {category.title}
        </h2>
        {category.description ? (
          <p className="text-small text-muted-foreground">{category.description}</p>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {category.items.map((item) => (
          <IntegrationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

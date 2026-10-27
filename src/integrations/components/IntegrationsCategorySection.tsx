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
      <div>
        <h2
          id={`integration-category-${category.id}`}
          className="text-subheading font-semibold leading-snug text-foreground"
        >
          {category.title}
        </h2>
        <p className="mt-1 text-small text-muted-foreground">{category.description}</p>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {category.items.map((item) => (
          <IntegrationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

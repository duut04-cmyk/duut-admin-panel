import type { DateRangeKey } from "@/data/orchestrationMetrics";
import type { PackageCategory, TopServiceCategory } from "@/data/dashboardMetrics";
import {
  formatTopServicePercent,
  resolveTopServicesDisplay,
} from "@/data/overviewDisplay";
import DashboardCardDateRange from "../DashboardCardDateRange";

type TopServicesWidgetProps = {
  categories: TopServiceCategory[];
  dateRange: DateRangeKey;
  onDateRangeChange: (value: DateRangeKey) => void;
};

type CategoryTheme = {
  iconBg: string;
  iconText: string;
  bar: string;
};

const categoryThemes: Record<PackageCategory, CategoryTheme> = {
  Medicine: {
    iconBg: "bg-teal-100",
    iconText: "text-teal-600",
    bar: "bg-teal-500",
  },
  Food: {
    iconBg: "bg-orange-100",
    iconText: "text-orange-600",
    bar: "bg-orange-500",
  },
  Documents: {
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    bar: "bg-violet-500",
  },
  Other: {
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    bar: "bg-blue-500",
  },
};

function CategoryIcon({ category }: { category: PackageCategory }) {
  const theme = categoryThemes[category];

  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.iconBg} ${theme.iconText}`}
      aria-hidden="true"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {category === "Medicine" && (
          <>
            <rect x="5" y="3" width="6" height="10" rx="3" />
            <path d="M8 3v10" />
          </>
        )}
        {category === "Food" && (
          <>
            <path d="M3 7h10v6H3z" strokeLinejoin="round" />
            <path d="M5 7V5a3 3 0 0 1 6 0v2" />
          </>
        )}
        {category === "Documents" && (
          <>
            <path d="M4 2h5l3 3v9H4z" strokeLinejoin="round" />
            <path d="M9 2v3h3M6 8h4M6 10.5h4" strokeLinecap="round" />
          </>
        )}
        {category === "Other" && (
          <>
            <rect x="3" y="3" width="10" height="10" rx="2" />
            <path d="M6 8h4M8 6v4" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}

export default function TopServicesWidget({
  categories,
  dateRange,
  onDateRangeChange,
}: TopServicesWidgetProps) {
  const displayCategories = resolveTopServicesDisplay(categories);

  return (
    <article
      className="flex h-full flex-col rounded-card border border-border/60 bg-background shadow-sm"
      aria-labelledby="top-services-heading"
    >
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4 sm:px-5">
        <h2
          id="top-services-heading"
          className="min-w-0 flex-1 text-subheading font-semibold leading-snug text-foreground"
        >
          Top Services
        </h2>
        <div className="flex shrink-0 items-center self-center">
          <DashboardCardDateRange
            value={dateRange}
            onChange={onDateRangeChange}
            compact
          />
        </div>
      </div>

      <ul className="flex-1 space-y-5 px-4 pb-4 pt-1 sm:px-5 md:space-y-8 xl:space-y-5">
        {displayCategories.map((item) => {
          const theme = categoryThemes[item.category];

          return (
            <li key={item.category}>
              <div className="flex items-start gap-3">
                <CategoryIcon category={item.category} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-small font-medium text-foreground">
                      {item.category}
                    </span>
                    <div className="flex shrink-0 items-center gap-4 text-caption">
                      <span className="min-w-[2.5rem] text-right font-semibold tabular-nums text-foreground">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="min-w-[3rem] text-right tabular-nums text-muted-foreground">
                        {formatTopServicePercent(item.percent)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-pill bg-surface">
                    <div
                      className={`h-full rounded-pill ${theme.bar}`}
                      style={{ width: `${Math.max(item.percent, 2)}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

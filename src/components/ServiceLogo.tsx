type ServiceLogoProps = {
  serviceName: string;
  className?: string;
};

const serviceStyles: Record<string, { bg: string; text: string; abbr: string }> =
  {
    FlashDrop: { bg: "bg-orange-100", text: "text-orange-600", abbr: "FD" },
    MoveX: { bg: "bg-blue-100", text: "text-blue-600", abbr: "MX" },
    CityFleet: { bg: "bg-violet-100", text: "text-violet-600", abbr: "CF" },
    SwiftGo: { bg: "bg-emerald-100", text: "text-emerald-600", abbr: "SG" },
    QuickRoute: { bg: "bg-sky-100", text: "text-sky-600", abbr: "QR" },
    "Doot Logistics": {
      bg: "bg-orange-100",
      text: "text-orange-600",
      abbr: "DL",
    },
  };

function getStyle(serviceName: string) {
  return (
    serviceStyles[serviceName] ?? {
      bg: "bg-surface",
      text: "text-foreground",
      abbr: serviceName.slice(0, 2).toUpperCase(),
    }
  );
}

export default function ServiceLogo({
  serviceName,
  className = "",
}: ServiceLogoProps) {
  const style = getStyle(serviceName);

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption font-bold ${style.bg} ${style.text} ${className}`}
      aria-hidden="true"
    >
      {style.abbr}
    </span>
  );
}

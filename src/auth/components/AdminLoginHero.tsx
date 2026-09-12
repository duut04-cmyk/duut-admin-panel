import Image from "next/image";

/** Plate color sampled from delivery.png (~center glow). */
const PLATE = "#E6F2FD";

export default function AdminLoginHero() {
  return (
    <div
      className="pointer-events-none relative z-[2] hidden w-full max-w-none lg:block"
      aria-hidden="true"
    >
      {/* Oversized plate underlay — extends past image so page + art share one field */}
      <div
        className="absolute left-1/2 top-[48%] h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 48%, ${PLATE} 0%, ${PLATE} 50%, rgba(230,242,253,0.85) 68%, rgba(230,242,253,0.35) 82%, transparent 92%)`,
        }}
      />

      <div className="relative mx-auto w-fit">
        <Image
          src="/images/delivery.png"
          alt=""
          width={1200}
          height={900}
          priority
          className="relative h-auto w-[min(120%,1240px)] max-h-[min(94vh,980px)] scale-[1.5] object-contain xl:w-[min(125%,1300px)] xl:scale-[1.55] [mask-image:radial-gradient(ellipse_at_center,black_36%,rgba(0,0,0,0.95)_48%,rgba(0,0,0,0.7)_58%,rgba(0,0,0,0.35)_68%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_36%,rgba(0,0,0,0.95)_48%,rgba(0,0,0,0.7)_58%,rgba(0,0,0,0.35)_68%,transparent_78%)]"
        />

        {/* Heavy rim wash: plate color paints over PNG circle edge into page */}
        <div
          className="pointer-events-none absolute inset-[-8%] scale-[1.5] xl:scale-[1.55]"
          style={{
            background: `radial-gradient(ellipse 55% 52% at 50% 47%, transparent 0%, transparent 40%, rgba(230,242,253,0.25) 52%, rgba(230,242,253,0.65) 62%, ${PLATE} 74%, ${PLATE} 100%)`,
          }}
        />

        {/* Extra outer fog so no rectangular / circular seam remains */}
        <div
          className="pointer-events-none absolute inset-[-18%] scale-[1.5] xl:scale-[1.55]"
          style={{
            background: `radial-gradient(ellipse 70% 65% at 50% 48%, transparent 0%, transparent 55%, rgba(230,242,253,0.5) 70%, ${PLATE} 85%, ${PLATE} 100%)`,
          }}
        />
      </div>
    </div>
  );
}

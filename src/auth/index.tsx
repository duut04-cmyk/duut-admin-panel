import AdminLoginBackground from "./components/AdminLoginBackground";
import AdminLoginCard from "./components/AdminLoginCard";
import AdminLoginFooter from "./components/AdminLoginFooter";
import AdminLoginHero from "./components/AdminLoginHero";
import AdminLoginMarketing from "./components/AdminLoginMarketing";

/** Matches left logo height + gap before tagline so form top aligns with tagline. */
const FORM_TAGLINE_ALIGN_SPACER = "h-[calc(2.375rem+0.5rem)]";

export default function AdminAuth() {
  return (
    <div className="relative min-h-screen overflow-x-hidden lg:h-screen lg:overflow-hidden">
      <AdminLoginBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-10 pt-14 sm:px-6 lg:h-full lg:min-h-0 lg:px-8 lg:pb-12 lg:pt-16 xl:pl-10 xl:pr-16">
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(320px,420px)_minmax(520px,1.5fr)_minmax(480px,600px)] lg:items-stretch lg:gap-x-2 xl:gap-x-3">
          <div className="relative z-20 flex min-h-0 flex-col lg:pb-10">
            <AdminLoginMarketing />
            <div className="hidden min-h-0 flex-1 lg:block" aria-hidden="true" />
            <div className="mt-10 lg:mt-0">
              <AdminLoginFooter />
            </div>
          </div>

          <div className="relative z-[2] -ml-6 hidden min-h-0 items-center justify-center lg:flex xl:-ml-10">
            <AdminLoginHero />
          </div>

          <div className="relative z-20 flex min-h-0 flex-col pt-8 lg:pt-0 lg:pb-10">
            <div
              className={`hidden shrink-0 lg:block ${FORM_TAGLINE_ALIGN_SPACER}`}
              aria-hidden="true"
            />
            <AdminLoginCard />
            <div className="hidden min-h-0 flex-1 lg:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

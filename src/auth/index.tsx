import AdminLoginBackground from "./components/AdminLoginBackground";
import AdminLoginCard from "./components/AdminLoginCard";
import AdminLoginFooter from "./components/AdminLoginFooter";
import AdminLoginHero from "./components/AdminLoginHero";
import AdminLoginMarketing from "./components/AdminLoginMarketing";

/** Matches left logo height + gap before tagline so form top aligns with tagline. */
const FORM_TAGLINE_ALIGN_SPACER = "h-[calc(2.375rem+0.5rem)]";
const FORM_TAGLINE_ALIGN_SPACER_COMPACT = "h-[calc(2rem+0.375rem)]";

export default function AdminAuth() {
  return (
    <div className="relative min-h-screen overflow-x-hidden lg:landscape:max-xl:overflow-y-auto xl:h-screen xl:overflow-hidden">
      <AdminLoginBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full min-w-0 max-w-[1440px] flex-col px-4 pb-10 pt-14 sm:px-6 portrait:max-xl:pt-10 lg:landscape:max-xl:px-8 lg:landscape:max-xl:pb-6 lg:landscape:max-xl:pt-8 xl:h-full xl:min-h-0 xl:px-8 xl:pb-12 xl:pt-16 2xl:pl-10 2xl:pr-16">
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-y-8 portrait:max-xl:gap-y-10 lg:landscape:max-xl:grid-cols-[minmax(0,0.82fr)_minmax(0,0.92fr)_minmax(0,1.26fr)] lg:landscape:max-xl:items-center lg:landscape:max-xl:gap-x-1 lg:landscape:max-xl:gap-y-0 xl:grid-cols-[minmax(320px,420px)_minmax(520px,1.5fr)_minmax(480px,600px)] xl:items-stretch xl:gap-x-2 2xl:gap-x-3">
          <div className="relative z-20 flex min-h-0 min-w-0 flex-col lg:landscape:max-xl:self-start lg:landscape:max-xl:pb-4 xl:col-start-1 xl:row-start-1 xl:pb-10">
            <AdminLoginMarketing />
            <div
              className="hidden min-h-0 flex-1 lg:landscape:max-xl:block xl:block"
              aria-hidden="true"
            />
            <div className="mt-10 lg:landscape:max-xl:mt-4 xl:mt-0">
              <AdminLoginFooter />
            </div>
          </div>

          <div className="relative z-[2] hidden min-h-0 min-w-0 items-center justify-start self-center overflow-visible lg:landscape:max-xl:col-start-2 lg:landscape:max-xl:row-start-1 lg:landscape:max-xl:-ml-2 lg:landscape:max-xl:flex xl:col-start-2 xl:row-start-1 xl:justify-center xl:ml-0 xl:flex xl:-ml-10">
            <div className="flex w-full items-center justify-start origin-center scale-[0.94] lg:landscape:max-xl:origin-left xl:origin-center xl:scale-100 xl:justify-center">
              <AdminLoginHero />
            </div>
          </div>

          <div className="relative z-20 flex min-h-0 min-w-0 flex-col pt-8 portrait:max-xl:items-center portrait:max-xl:pt-0 lg:landscape:max-xl:col-start-3 lg:landscape:max-xl:row-start-1 lg:landscape:max-xl:items-stretch lg:landscape:max-xl:self-start lg:landscape:max-xl:pt-0 xl:col-start-3 xl:row-start-1 xl:items-stretch xl:pt-0 xl:pb-10">
            <div
              className={`hidden shrink-0 lg:landscape:max-xl:block xl:hidden ${FORM_TAGLINE_ALIGN_SPACER_COMPACT}`}
              aria-hidden="true"
            />
            <div
              className={`hidden shrink-0 xl:block ${FORM_TAGLINE_ALIGN_SPACER}`}
              aria-hidden="true"
            />
            <AdminLoginCard />
            <div className="hidden min-h-0 flex-1 xl:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

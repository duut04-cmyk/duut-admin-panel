import AdminAuthHeader from "./AdminAuthHeader";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginCard() {
  return (
    <div className="w-full min-w-0 max-w-[600px] rounded-[24px] border border-white/70 bg-white/95 px-5 py-8 shadow-[0_24px_64px_rgba(15,23,42,0.08)] backdrop-blur-[2px] sm:px-10 sm:py-11 portrait:max-xl:mx-auto portrait:max-xl:max-w-[440px] lg:landscape:max-xl:w-full lg:landscape:max-xl:max-w-none lg:landscape:max-xl:px-8 lg:landscape:max-xl:py-8 xl:max-w-[600px] xl:px-10 xl:py-11">
      <AdminAuthHeader />
      <AdminLoginForm />
    </div>
  );
}

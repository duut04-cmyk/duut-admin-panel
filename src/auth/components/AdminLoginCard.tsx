import AdminAuthHeader from "./AdminAuthHeader";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginCard() {
  return (
    <div className="w-full max-w-[600px] rounded-[24px] border border-white/70 bg-white/95 px-10 py-11 shadow-[0_24px_64px_rgba(15,23,42,0.08)] backdrop-blur-[2px]">
      <AdminAuthHeader />
      <AdminLoginForm />
    </div>
  );
}

import AdminAuthHeader from "./components/AdminAuthHeader";
import AdminLoginForm from "./components/AdminLoginForm";

export default function AdminAuth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:py-12">
      <div className="w-full max-w-[400px]">
        <AdminAuthHeader />
        <AdminLoginForm />
      </div>
    </div>
  );
}

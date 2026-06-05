import { AuthToast } from "./_components/AuthToast";
import { RedirectIfAuthenticated } from "./_components/RedirectIfAuthenticated";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
      <AuthToast />
    </div>
  );
}

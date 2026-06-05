import { AuthToast } from "./_components/AuthToast";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
      <AuthToast />
    </div>
  );
}

import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NavbarComponent } from "./_components/NavbarComponent";
import { FooterComponent } from "./_components/FooterComponent";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EventMaster",
  description: "EventMaster is a comprehensive, user-friendly event management system that streamlines every aspect of event planning and execution.",
  icons: {
    icon: "/images/event-master-2.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <div className={jakarta.className}>
      <NavbarComponent />
      {children}
      <FooterComponent />
    </div>
  );
}
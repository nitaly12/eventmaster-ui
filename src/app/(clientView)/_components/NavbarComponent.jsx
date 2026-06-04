"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export const NavbarComponent = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 no-underline">
          <Image
            src="/images/image_237-removebg 1.png"
            alt="EventMaster"
            width={44}
            height={44}
            priority
          />
        </Link>

        <nav className="flex items-center gap-12">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative inline-block pb-1 text-[16px] font-medium leading-none no-underline transition-colors ${
                  isActive
                    ? "text-[#1D2939] after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:bg-[#7939EF] after:content-['']"
                    : "text-[#667085] hover:text-[#1D2939]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/login"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-[#7939EF] px-7 text-[15px] font-semibold leading-none text-white no-underline transition-colors hover:bg-[#6930d4]"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

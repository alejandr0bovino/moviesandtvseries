// app/not-found.tsx
import Link from 'next/link';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export default function NotFound() {
  return (
    <>
      <div
        className="w-full pt-10"
      >
        <div className="flex justify-center">
          <NavbarLogo />
        </div>

        <main className="flex min-h-100 flex-col items-center justify-center text-center p-6">

          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-lg mb-6">Sorry, the page you're looking for doesn't exist.</p>

          <Link
            href="/"
            className="px-4 py-2 bg-black text-white rounded-xl"
          >
            Go back home
          </Link>
        </main>
      </div>
    </>
  );
}





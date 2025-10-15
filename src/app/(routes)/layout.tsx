"use client"
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@heroui/react";

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
import { useState } from "react";
import { cn } from "@heroui/react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const navItems = [
    {
      name: "Movies",
      link: "/movies",
    },
    {
      name: "TV Series",
      link: "/tv-series",
    },
    {
      name: "People",
      link: "/people",
    }
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  // Manual refresh function - only refreshes when user clicks the button
  const handleManualRefresh = () => {
    // Get the refresh icon and trigger rotation animation
    const refreshIcon = document.querySelector('[title="Refresh page manually"] svg') as HTMLElement;
    if (refreshIcon) {
      refreshIcon.style.transform = 'rotate(360deg)';
    }

    // Small delay to allow animation to start before reload
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }

  return (
    <div
      className="w-full max-w-screen-xl mx-auto px-4 pt-20"
    >
      <div className="relative w-full">
        <Navbar className="c-navbar">
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />

            <NavItems items={navItems} activePath={pathname} />

            <div className="w-45 h-12 flex items-center justify-end">
              <SignedIn>
                <div className={`flex items-center ${pathname === '/dashboard' ? 'w-45' : 'w-38'} h-12`}>
                  {pathname === '/dashboard' && (
                    <button
                      onClick={handleManualRefresh}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded cursor-pointer"
                      title="Refresh page manually"
                    >
                      <svg
                        className="w-5 h-5 transition-transform duration-300 ease-in-out"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ transform: 'rotate(0deg)' }}
                        onAnimationEnd={(e) => {
                          e.currentTarget.style.transform = 'rotate(0deg)';
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}

                  <NavbarButton variant="secondary" href="/dashboard">Dashboard</NavbarButton>

                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
                </div>
              </SignedIn>

              <SignedOut>
                <div className={`flex items-center justify-end w-23 h-12`}>
                  <NavbarButton variant="secondary" href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}>Sign in</NavbarButton>
                </div>
              </SignedOut>
            </div>
          </NavBody>

          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >

              {navItems.map((item, idx) => {
                const isActive = pathname === item.link;
                return (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "relative block px-3 py-2 rounded-md text-md",
                      isActive
                        ? "bg-gray-200 text-black "
                        : "text-neutral-600 hover:bg-gray-100"
                    )}
                  >
                    {item.name}
                  </a>
                );
              })}


              <div className="flex w-full flex-col gap-4">
                <SignedIn>
                  <div className="flex items-center justify-flex-start">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="mr-2"
                      href="/dashboard"
                    >
                      Dashboard
                    </NavbarButton>
                    <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
                  </div>
                </SignedIn>

                <SignedOut>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                    href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}
                  >
                    Sign in
                  </NavbarButton>
                </SignedOut>

              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>

      {children}

    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-104 pt-10">
        <Spinner size="lg" />
      </div>
    }>

      <LayoutInner>{children}</LayoutInner>
    </Suspense >
  );
}

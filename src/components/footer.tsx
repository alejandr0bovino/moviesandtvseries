import React from "react";
import Link from "next/link";
import Image from 'next/image';
import MovieIcon from "@/icons/movie";
import LogoAIcon from "@/icons/logoa";
import { defaultNavigationLinks, defaultSocialLinks } from "@/constants/footer";

const Footer = ({
  brandName = "Movies & TV Series",
  navigationLinks = defaultNavigationLinks,
  socialLinks = defaultSocialLinks,
}) => {
  return (
    <footer className="bg-black text-gray-300 mt-20 overflow-hidden">
      <div className="w-full max-w-screen-xl px-4 mx-auto py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
          <div className="text-xl">
            <Link href="/" className="flex gap-2 items-center">
              <MovieIcon fill="#ffffff" width="25px" height="25px" /> <span className="font-bold tracking-tighter">{brandName}</span>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center space-x-6 text-md">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center space-x-4 items-center">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"

              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="cm-footer-sep mt-7.5 mb-7.5 pt-7.5 flex items-center justify-between">
          <Link href="https://www.themoviedb.org/" target="_blank">
            <Image
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB"
              width={129} height={16}
              style={{ width: "129px", height: "16px" }}
              priority
              className="saturate-[.40]"
            />
          </Link>

          <Link href="https://alejandro.uy/" target="_blank" className="flex items-center">
            <LogoAIcon />
            alejandro.uy
          </Link>
        </div>

        <div className="text-right">
          <p>&copy; {new Date().getFullYear()} {brandName}</p>
        </div>
      </div>

      <div className="text-center text-9xl text-gray-300 select-none">
        <h1 className="cm-outline">MOVIES &<br />TV SERIES</h1>
      </div>
    </footer>
  );
};

export default Footer;
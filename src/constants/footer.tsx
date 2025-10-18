import { IconBrandX, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";
import ImdbIcon from "@/icons/imdb";

export const defaultNavigationLinks = [
  { href: "/movies", label: "Movies" },
  { href: "/tv-series", label: "TV Series" },
  { href: "/people", label: "People" },
  { href: "/about-and-credits", label: "About & Credits" },
  { href: "/contact", label: "Contact" },
];

export const defaultSocialLinks = [
  { href: "https://youtube.com/alejandrobovino", icon: <IconBrandYoutube size={24} /> },
  { href: "https://x.com/alejandrobovino", icon: <IconBrandX size={24} /> },
  { href: "https://www.instagram.com/alejandro_bovino/", icon: <IconBrandInstagram size={28} /> },
  { href: "https://www.imdb.com/user/ur54182694", icon: <ImdbIcon width={50} height={50} fill="#D2D5DC" /> },
];


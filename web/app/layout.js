import "./globals.css";
import { SiteEffects } from "@/components/effects/SiteEffects";

export const metadata = {
  title: "ARHAM.WARESI — Full-stack developer",
  description:
    "ARHAM.WARESI builds considered digital products, web applications, and reliable software systems.",
  icons: {
    icon: "/brand/arham/favicon.svg",
    apple: "/brand/arham/favicon-180.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-mod-js">
      <head>
        <link href="https://cdn.prod.website-files.com" rel="preconnect" crossOrigin="anonymous" />
        <link href="/css/tdk-work.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SiteEffects />
      </body>
    </html>
  );
}

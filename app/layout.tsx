import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi-Leads - Pilot Program Request",
  description: "Standalone local build for the Mi-Leads dealership rep signup form.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Oswald:wght@400;600;700&family=Raleway:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Righteous&family=Russo+One&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

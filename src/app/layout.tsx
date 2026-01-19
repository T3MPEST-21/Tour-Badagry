import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tour Badagry | Premium Taxi & Tourism Services",
  description: "Reliable taxi and tourism services across Badagry and environs. Experience the coastal heart of Lagos with local experts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

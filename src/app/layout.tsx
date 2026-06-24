import type { Metadata } from "next";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CarCare Demo",
    template: "%s | CarCare Demo",
  },
  description: "A demo car care booking app for tyres, batteries, stock, and quotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

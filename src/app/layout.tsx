import type { Metadata } from "next";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lumière Atelier | Modern Fashion",
    template: "%s | Lumière Atelier",
  },
  description:
    "A modern Malaysian fashion boutique for considered everyday dressing.",
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

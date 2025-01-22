import { cn, constructMetadata } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Provider";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

export const metadata = constructMetadata();

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          inter.className
        )}
      >
        <Providers>
          <Toaster />
          <Navbar />
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}

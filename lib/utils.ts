import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function constructMetadata({
  title = "DocLens - PDFs made conversational",
  description = "DocLens is an open-source platform to make chatting to your PDF files easy.",
  siteName = "https://doculens.vercel.app/",
  image = "/thumbnail.jpeg",
  icons = "/favicon.ico",
  noIndex = false,
  url = "https://doculens.vercel.app/",
}: {
  title?: string;
  description?: string;
  siteName?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  url?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName,
      url,
      images: [
        {
          url: `https://doclens.vercel.app${image}`,
          secureUrl: `https://doclens.vercel.app${image}`,
          alt: "Preview image for DocuLens",
          width: 400,
          height: 400,
          type: "image/jpeg",
        },
      ],
      type: "website",
    },
    icons,
    metadataBase: new URL("https://doclens.vercel.app/"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

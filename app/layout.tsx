import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const ggsansBold = localFont({
  src: "./fonts/ggsansBold.ttf",
  variable: "--font-ggsans-bold",
  weight: "700",
  display: "swap",
});

const ggsansMedium = localFont({
  src: "./fonts/ggsansMedium.ttf",
  variable: "--font-ggsans-medium",
  weight: "500",
  display: "swap",
});

const ggsansRegular = localFont({
  src: "./fonts/ggsansRegular.ttf",
  variable: "--font-ggsans-regular",
  weight: "400",
  display: "swap",
});

const ggsansSemibold = localFont({
  src: "./fonts/ggsansSemibold.ttf",
  variable: "--font-ggsans-semibold",
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Socio",
  description:
    "Socio is a platform for communities to connect with one another. It is a cloud-based social chat platform that allows users to communicate with one another in real-time. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ggsansBold.variable} ${ggsansMedium.variable} ${ggsansRegular.variable} ${ggsansSemibold.variable} antialiased`}
      >
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}

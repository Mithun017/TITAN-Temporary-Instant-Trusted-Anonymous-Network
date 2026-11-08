import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Problems - LeetCode",
  description: "LeetCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="https://leetcode.com/favicon.ico" />
      </head>
      <body className="bg-[#1a1a1a] text-[#eff1f3] min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

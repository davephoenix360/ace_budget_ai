import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SideNav from "./dashboard/_components/SideNav";
import DashboardHeader from "./dashboard/_components/DashboardHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACE BUDGET AI",
  description: "AI powered budgeting tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div>
            <div className="fixed md:w-64 hidden md:block">
              <SideNav />
            </div>
            <div className="md:ml-64">
              <DashboardHeader />
              {children}
            </div>
          </div>
          
        </body>
      </html>
    </ClerkProvider>
  );
}

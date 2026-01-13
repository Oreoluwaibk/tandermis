"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConfigProvider, App as AntApp } from "antd";
import { theme } from "@/theme/themeConfig";
import { Provider } from "react-redux";
import { store } from "@/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Tandermis",
//   description: "Join the Future of Dermatology. Help AI Detect Skin Diseases with Precision!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Tandermis</title>
        <meta name="description" content="Join the Future of Dermatology. Help AI Detect Skin Diseases with Precision!" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
        <ConfigProvider theme={theme}>
          <AntApp>
          {children}
          </AntApp>
        </ConfigProvider>
        </Provider>
      </body>
    </html>
  );
}

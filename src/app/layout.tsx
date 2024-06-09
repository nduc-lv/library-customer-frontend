import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MenuComp from "./components/Menu";
import { UserProvider } from "./context/CustomerContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hust Library",
  description: "Simple Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <UserProvider>
    <html lang="en">
      <body className={inter.className}>
      <MenuComp></MenuComp>
        {children}
      {/* <div style={{padding: 50, textAlign:"center"}}>
        Hust Library ©{new Date().getFullYear()}
      </div> */}
      </body>
    </html>
  </UserProvider>
  );
}

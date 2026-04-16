import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "SP Enterprises | Pure Spices, Pure Taste",
  description: "Premium masala eCommerce experience for SP Enterprises."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}

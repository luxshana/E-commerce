import "./globals.css";
import HeaderWrapper from "../components/HeaderWrapper"; // Import client component here
import Footer from "../components/Footer";
import OverlaySearch from "../components/OverlaySearch";
import ClientWrapper from "../components/ClientWrapper";
import { CartProvider } from "../components/CartContext";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "My App",
  description: "Next.js 13+ App Router example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <AuthProvider>
            <ClientWrapper>
              <HeaderWrapper /> {/* Now a client component */}
              <OverlaySearch />
            
              {children}
              <Footer />
            </ClientWrapper>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crown X",
  description: "Customer Growth OS for Small Businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Flutterwave checkout script (for payments) */}
        <script
          src="https://checkout.flutterwave.com/v3.js"
          defer
        ></script>
      </head>

      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
import "./globals.css";

export const metadata = {
  title: "Apple Style SaaS Dashboard",
  description: "Premium Full Stack Student Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

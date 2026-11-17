import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "NEXORA — Commerce & CRM",
  description: "Магазин электроники и центр управления бизнесом NEXORA.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

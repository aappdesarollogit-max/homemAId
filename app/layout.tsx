import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HomeMaid | Asistente doméstico con IA",
    template: "%s | HomeMaid",
  },
  description:
    "HomeMaid ayuda a administrar inventario, compras, consumo y ahorro familiar con inteligencia artificial.",
  applicationName: "homemAId",
  manifest: "/manifest.webmanifest",
  keywords: [
    "asistente doméstico",
    "inventario del hogar",
    "ahorro familiar",
    "compras inteligentes",
    "IA para el hogar",
  ],
  authors: [{ name: "HomeMaid" }],
  creator: "HomeMaid",
  openGraph: {
    title: "HomeMaid | Asistente doméstico con IA",
    description:
      "Administra inventario, compras, consumo y ahorro familiar con inteligencia artificial.",
    siteName: "HomeMaid",
    locale: "es_CL",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "homemAId",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060814",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}

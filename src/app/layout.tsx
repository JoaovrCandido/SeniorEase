import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { AccessibilityProvider } from "@/presentation/store/AccessibilityContext";
import "./globals.css";

// Configurando as fontes para gerarem as variáveis CSS
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeniorEase - Autonomia Digital",
  description: "Plataforma acessível para organização acadêmica e profissional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${lora.variable}`}>
      <body>
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'PitStopEngine — Plataforma Distribuída de Telemetria e Gestão de F1',
  description: 'Pit Wall em tempo real para telemetria de F1, classificação ao vivo de pilotos e construtores e gestão de corridas com Spring Boot, Next.js e RabbitMQ.',
  keywords: ['F1', 'Formula 1', 'Telemetry', 'PitStopEngine', 'Spring Boot', 'Next.js', 'RabbitMQ', 'JWT'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} dark`}>
      <body id="pitstop-app-root" className="bg-[#0b0d12] text-gray-100 antialiased font-sans min-h-screen flex flex-col selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

import PitWallDashboard from '../components/PitWallDashboard';

/**
 * Server Component — Next.js App Router (SEO optimized).
 * This page is statically rendered at build time for search engines.
 * All interactive/client-side logic lives in <PitWallDashboard />.
 */
export default function Home() {
  // Schema.org Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'PitStopEngine — F1 Live Timing & Telemetry Platform',
    description:
      'Plataforma distribuída de telemetria e gestão de Fórmula 1 com classificação ao vivo (Live Timing), gráficos de evolução de voltas, gerenciamento de pilotos e equipes, e streaming SSE em tempo real.',
    sport: 'Formula 1',
    organizer: {
      '@type': 'Organization',
      name: 'BatistaSec',
      url: 'https://github.com/BatistaSec/PitStopEngineManager',
    },
    location: {
      '@type': 'VirtualLocation',
      url: 'http://localhost:3000',
    },
  };

  return (
    <>
      {/* Structured Data for SEO (invisible to users, visible to crawlers) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Client-side interactive dashboard */}
      <PitWallDashboard />
    </>
  );
}

import PitWallDashboard from '../../components/PitWallDashboard';

/**
 * Server Component — Next.js App Router
 * Renders the actual PitStopEngine dashboard application.
 */
export default function DashboardPage() {
  return (
    <>
      {/* Client-side interactive dashboard */}
      <PitWallDashboard />
    </>
  );
}

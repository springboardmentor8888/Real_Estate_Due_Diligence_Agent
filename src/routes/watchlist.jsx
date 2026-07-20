import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';

export default function WatchlistPage() {
  return (
    <AppShell>
      <PageHeader title="Watchlist" subtitle="Tracked properties" />
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Watchlist coming soon...</p>
      </div>
    </AppShell>
  );
}
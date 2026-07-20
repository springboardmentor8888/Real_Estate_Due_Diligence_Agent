import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';

export default function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader title="Analytics" subtitle="Portfolio analytics" />
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Analytics coming soon...</p>
      </div>
    </AppShell>
  );
}
import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeader title="Reports" subtitle="Due diligence reports" />
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Reports coming soon...</p>
      </div>
    </AppShell>
  );
}
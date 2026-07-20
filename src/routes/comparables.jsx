import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';

export default function ComparablesPage() {
  return (
    <AppShell>
      <PageHeader title="Comparables" subtitle="Compare properties side by side" />
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Comparables feature coming soon...</p>
      </div>
    </AppShell>
  );
}
import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="App settings" />
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Settings coming soon...</p>
      </div>
    </AppShell>
  );
}
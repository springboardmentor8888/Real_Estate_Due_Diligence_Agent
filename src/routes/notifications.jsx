import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';

export default function NotificationsPage() {
  return (
    <AppShell>
      <PageHeader title="Notifications" subtitle="Your alerts" />
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Notifications coming soon...</p>
      </div>
    </AppShell>
  );
}
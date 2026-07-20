import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeader title="Profile" subtitle="Your profile" />
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Profile coming soon...</p>
      </div>
    </AppShell>
  );
}
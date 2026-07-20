import React from 'react';
import { AppShell, PageHeader } from '../components/app-shell';
import { Building2, FileText, BellRing, Activity, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Properties Monitored", value: "1,248", icon: Building2, trend: "+12 this week" },
    { label: "Reports Generated", value: "842", icon: FileText, trend: "+34 this month" },
    { label: "Active Alerts", value: "5", icon: BellRing, trend: "Requires attention", urgent: true },
    { label: "Avg Portfolio Risk", value: "Low", icon: Activity, trend: "Stable" },
  ];

  return (
    <AppShell>
      <PageHeader title="Overview" subtitle="Welcome back to your due diligence command center." />
      
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass p-6 rounded-2xl border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.urgent ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-3xl font-bold mb-1">{stat.value}</h4>
                <p className="text-sm font-medium text-foreground">{stat.label}</p>
                <p className={`text-xs mt-2 ${stat.urgent ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  {stat.trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions / Getting Started */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent">
            <h3 className="text-xl font-semibold mb-2">Continue your research</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Pick up where you left off. Review the complete due diligence report for your recently viewed properties.
            </p>
            <Button onClick={() => navigate('/properties')} className="gap-2">
              View Properties <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="glass p-8 rounded-2xl border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">More widgets coming soon</h3>
            <p className="text-sm text-muted-foreground">
              Analytics, risk assessments, and portfolio tracking will be available in Milestone 3.
            </p>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
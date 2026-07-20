import React from 'react';
import { Badge } from '../ui/badge';
import { Waves, ShieldAlert, History, Calendar } from 'lucide-react';

export function FloodZone({ data }) {
  if (!data) return null;

  const isHighRisk = data.riskLevel.includes('High');
  const riskColorClass = isHighRisk 
    ? 'text-red-600 border-red-200 bg-red-50' 
    : data.riskLevel.includes('Moderate') 
      ? 'text-yellow-600 border-yellow-200 bg-yellow-50' 
      : 'text-green-600 border-green-200 bg-green-50';

  const riskBgClass = isHighRisk 
    ? 'bg-red-500/10 border-red-500/20' 
    : data.riskLevel.includes('Moderate') 
      ? 'bg-yellow-500/10 border-yellow-500/20' 
      : 'bg-green-500/10 border-green-500/20';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Risk Level Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${riskBgClass}`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-background rounded-full shadow-sm">
            <Waves className={`w-8 h-8 ${isHighRisk ? 'text-red-500' : 'text-green-500'}`} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.riskLevel}</h3>
            <p className="text-muted-foreground">FEMA Flood Zone: {data.floodZoneCode}</p>
          </div>
        </div>
        
        <div className="bg-background p-4 rounded-xl border flex items-center gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Insurance Requirement</p>
            <p className="font-semibold">{data.insuranceRequirement}</p>
          </div>
        </div>
      </div>

      {/* Historical Events */}
      <div className="glass rounded-2xl border overflow-hidden">
        <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Historical Flood Events</h3>
          </div>
          <span className="text-sm text-muted-foreground">Last assessed: {data.lastAssessment}</span>
        </div>
        
        <div className="p-6">
          {data.historicalEvents.length > 0 ? (
            <div className="relative border-l-2 border-muted ml-3 space-y-8">
              {data.historicalEvents.map((event, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <p className="text-foreground bg-muted/30 p-3 rounded-lg border inline-block mt-1">
                    {event.event}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No historical flood events recorded for this property.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

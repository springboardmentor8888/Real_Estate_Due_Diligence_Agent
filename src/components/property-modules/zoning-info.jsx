import React from 'react';
import { Badge } from '../ui/badge';
import { Map, AlertCircle, CheckCircle2, Building, Ruler, Info } from 'lucide-react';

export function ZoningInfo({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Zoning Info */}
        <div className="glass p-6 rounded-2xl border space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Zoning Classification</h3>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {data.governmentStatus}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50 border">
              <span className="text-muted-foreground flex items-center gap-2">
                <Building className="w-4 h-4" /> Zone Type
              </span>
              <span className="font-semibold">{data.zoneType}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50 border">
              <span className="text-muted-foreground flex items-center gap-2">
                <Map className="w-4 h-4" /> Land Use
              </span>
              <span className="font-semibold">{data.landUse}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50 border">
              <span className="text-muted-foreground flex items-center gap-2">
                <Ruler className="w-4 h-4" /> Building Height Limit
              </span>
              <span className="font-semibold">{data.buildingHeightLimit}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50 border">
              <span className="text-muted-foreground flex items-center gap-2">
                <Info className="w-4 h-4" /> Floor Space Index (FSI)
              </span>
              <span className="font-semibold">{data.fsi}</span>
            </div>
          </div>
        </div>

        {/* Restrictions and Usage */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">Restrictions</h3>
            </div>
            <ul className="space-y-2">
              {data.restrictions.map((restriction, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-destructive mt-1">•</span>
                  <span>{restriction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-600">Approved Usage</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.approvedUsage.map((usage, idx) => (
                <Badge key={idx} variant="outline" className="bg-background">
                  {usage}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

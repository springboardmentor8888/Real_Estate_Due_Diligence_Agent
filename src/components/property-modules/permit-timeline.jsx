import React from 'react';
import { Badge } from '../ui/badge';
import { FileText, Calendar, Building, CheckCircle2 } from 'lucide-react';

export function PermitTimeline({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass rounded-2xl border p-8">
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Building Permits & Approvals
        </h3>

        <div className="relative border-l-2 border-muted/50 ml-4 space-y-10">
          {data.map((permit, idx) => (
            <div key={permit.id} className="relative pl-8">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-4 border-primary shadow-sm" />
              
              <div className="bg-background/50 border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{permit.type}</h4>
                    <p className="font-mono text-xs text-muted-foreground mt-1">Permit #{permit.permitNumber}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={permit.status === 'Completed' || permit.status === 'Approved' ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 border-blue-200 bg-blue-50'}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {permit.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Issued: <span className="font-medium text-foreground">{permit.issueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Authority: <span className="font-medium text-foreground">{permit.authority}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

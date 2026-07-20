import React from 'react';
import { Leaf, Droplets, Mountain, FlaskConical, Factory, Shield, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';

export function EnvironmentalRecords({ data }) {
  if (!data) return null;

  const getStatusColor = (value) => {
    if (value.toLowerCase().includes('good') || value.toLowerCase().includes('pass') || value.toLowerCase().includes('free') || value.toLowerCase().includes('low') || value.toLowerCase().includes('none')) {
      return 'text-green-600 border-green-200 bg-green-50';
    }
    return 'text-yellow-600 border-yellow-200 bg-yellow-50';
  };

  const records = [
    { label: "Air Quality", value: data.airQuality, icon: Leaf },
    { label: "Water Quality", value: data.waterQuality, icon: Droplets },
    { label: "Soil Status", value: data.soilStatus, icon: Mountain },
    { label: "Hazardous Waste", value: data.hazardousWaste, icon: FlaskConical },
    { label: "Pollution Index", value: data.pollutionIndex, icon: Activity },
    { label: "Protected Areas", value: data.protectedAreas, icon: Shield }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record, idx) => (
          <div key={idx} className="glass p-5 rounded-2xl border flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <record.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{record.label}</p>
              <Badge variant="outline" className={getStatusColor(record.value)}>
                {record.value}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-2xl border mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Factory className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Nearby Industries</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {data.nearbyIndustries.map((industry, idx) => (
            <div key={idx} className="bg-background border px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {industry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Badge } from '../ui/badge';
import { Building2, MapPin, AreaChart, DollarSign, Calendar, RefreshCcw } from 'lucide-react';

export function PropertySummary({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Property Image Placeholder */}
      <div className="rounded-2xl overflow-hidden shadow-sm relative h-64 md:h-auto">
        <img 
          src={data.imageUrl} 
          alt="Property" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={data.status === 'Active' ? 'default' : 'secondary'} className="shadow-lg">
            {data.status}
          </Badge>
        </div>
      </div>

      {/* Property Details */}
      <div className="md:col-span-2 glass rounded-2xl p-6 border flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold">{data.id}</h2>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{data.address}</span>
              </div>
            </div>
            <Badge variant="outline" className={data.riskLevel === 'Low' ? 'text-green-500 border-green-200 bg-green-50' : 'text-yellow-500'}>
              {data.riskLevel} Risk
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Building2 className="w-4 h-4 mr-2" />
                Type
              </div>
              <p className="font-medium">{data.propertyType}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <DollarSign className="w-4 h-4 mr-2" />
                Market Value
              </div>
              <p className="font-medium">{data.marketValue}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <AreaChart className="w-4 h-4 mr-2" />
                Land Area
              </div>
              <p className="font-medium">{data.landArea}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Year Built
              </div>
              <p className="font-medium">{data.yearBuilt}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Last Updated
              </div>
              <p className="font-medium">{data.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell, PageHeader } from '../components/app-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Modules
import { ProgressTracker } from '../components/property-modules/progress-tracker';
import { PropertySummary } from '../components/property-modules/property-summary';
import { OwnershipRecords } from '../components/property-modules/ownership-records';
import { TaxHistory } from '../components/property-modules/tax-history';
import { ZoningInfo } from '../components/property-modules/zoning-info';
import { FloodZone } from '../components/property-modules/flood-zone';
import { EnvironmentalRecords } from '../components/property-modules/environmental-records';
import { PermitTimeline } from '../components/property-modules/permit-timeline';
import { ApiError } from '../components/ui/api-error';

// Mock Data
import { 
  propertySummaryMock, 
  ownershipMock, 
  taxHistoryMock, 
  zoningMock, 
  floodZoneMock, 
  environmentalMock, 
  permitTimelineMock 
} from '../data/mockData';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAggregating, setIsAggregating] = useState(true);
  const [hasError, setHasError] = useState(false);

  // In a real app, you would fetch data here based on the `id` param.
  // We're using a timeout to simulate the Milestone 2 data aggregation process.

  useEffect(() => {
    // Optionally simulate random API error for demonstration (disabled by default)
    // if (Math.random() > 0.8) setHasError(true);
  }, []);

  if (hasError) {
    return (
      <AppShell>
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/properties')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Button>
        </div>
        <PageHeader title={`Property ${id}`} subtitle="Due Diligence Report" />
        <div className="mt-12">
          <ApiError onRetry={() => setHasError(false)} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Button>
      </div>

      <PageHeader 
        title={isAggregating ? "Retrieving Property Data..." : propertySummaryMock.address} 
        subtitle={`Property ID: ${id} | Milestone 2 Dashboard`} 
      />

      {isAggregating ? (
        <ProgressTracker onComplete={() => setIsAggregating(false)} />
      ) : (
        <div className="mt-8 animate-in fade-in duration-700">
          <PropertySummary data={propertySummaryMock} />

          <Tabs defaultValue="ownership" className="mt-8">
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full justify-start inline-flex min-w-max">
                <TabsTrigger value="ownership">Ownership Records</TabsTrigger>
                <TabsTrigger value="tax">Tax History</TabsTrigger>
                <TabsTrigger value="zoning">Zoning Info</TabsTrigger>
                <TabsTrigger value="flood">Flood Zone</TabsTrigger>
                <TabsTrigger value="environment">Environmental</TabsTrigger>
                <TabsTrigger value="permits">Permits</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="mt-6">
              <TabsContent value="ownership">
                <OwnershipRecords data={ownershipMock} />
              </TabsContent>
              
              <TabsContent value="tax">
                <TaxHistory data={taxHistoryMock} />
              </TabsContent>
              
              <TabsContent value="zoning">
                <ZoningInfo data={zoningMock} />
              </TabsContent>
              
              <TabsContent value="flood">
                <FloodZone data={floodZoneMock} />
              </TabsContent>
              
              <TabsContent value="environment">
                <EnvironmentalRecords data={environmentalMock} />
              </TabsContent>
              
              <TabsContent value="permits">
                <PermitTimeline data={permitTimelineMock} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </AppShell>
  );
}
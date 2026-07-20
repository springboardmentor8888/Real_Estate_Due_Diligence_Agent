import React from 'react';
import { Badge } from '../ui/badge';
import { User, ShieldCheck, History, Calendar, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function OwnershipRecords({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Current Owner Card */}
      <div className="glass p-6 rounded-2xl border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">Current Ownership</h3>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {data.currentOwner.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Owner Name</p>
            <p className="font-medium">{data.currentOwner.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ownership Type</p>
            <p className="font-medium">{data.currentOwner.type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{data.currentOwner.purchaseDate}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Verified via Public Land Registry (ID: {data.currentOwner.verificationId})
        </div>
      </div>

      {/* Transfer History Table */}
      <div className="glass rounded-2xl border overflow-hidden">
        <div className="p-6 border-b bg-muted/20 flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Transfer History</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Previous Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead className="text-right">Transfer Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.previousOwners.map((owner) => (
                <TableRow key={owner.id}>
                  <TableCell className="font-medium">{owner.name}</TableCell>
                  <TableCell>{owner.type}</TableCell>
                  <TableCell>{owner.purchaseDate}</TableCell>
                  <TableCell>{owner.saleDate}</TableCell>
                  <TableCell className="text-right font-medium">{owner.transferValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

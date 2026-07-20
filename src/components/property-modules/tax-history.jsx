import React from 'react';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Search, Filter, CheckCircle2, Clock } from 'lucide-react';

export function TaxHistory({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass rounded-2xl border overflow-hidden">
        <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Property Tax History</h3>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search year or receipt..."
                className="w-full pl-9 bg-background/50"
              />
            </div>
            <button className="p-2 border rounded-md hover:bg-muted/50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Receipt Number</TableHead>
                <TableHead>Due Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{record.year}</TableCell>
                  <TableCell>{record.taxAmount}</TableCell>
                  <TableCell>{record.paymentDate}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{record.receiptNumber}</TableCell>
                  <TableCell>{record.dueAmount}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="outline" 
                      className={record.paidStatus === 'Paid' ? 'text-green-600 border-green-200 bg-green-50' : 'text-amber-600 border-amber-200 bg-amber-50'}
                    >
                      <div className="flex items-center gap-1">
                        {record.paidStatus === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {record.paidStatus}
                      </div>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t text-center text-sm text-muted-foreground flex items-center justify-between">
          <span>Showing 4 of 12 records</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-md hover:bg-muted/50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border rounded-md hover:bg-muted/50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

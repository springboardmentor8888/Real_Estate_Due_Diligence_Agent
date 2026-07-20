import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl glass border">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-2xl border overflow-hidden glass">
      <div className="p-4 border-b bg-muted/20">
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="p-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex p-4 border-b last:border-0 gap-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertySummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Skeleton className="h-64 w-full rounded-2xl md:col-span-1" />
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

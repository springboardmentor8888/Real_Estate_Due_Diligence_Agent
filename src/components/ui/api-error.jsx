import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/button';

export function ApiError({ title = "Unable to retrieve data", message = "There was a problem connecting to the external service. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl glass bg-destructive/5 border-destructive/20">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry Request
        </Button>
      )}
    </div>
  );
}

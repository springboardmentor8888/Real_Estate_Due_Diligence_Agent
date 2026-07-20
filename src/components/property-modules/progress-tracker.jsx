import React, { useEffect, useState } from 'react';
import { Progress } from '../ui/progress';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  "Searching Property...",
  "Loading Ownership...",
  "Loading Taxes...",
  "Loading Zoning...",
  "Loading Flood Data...",
  "Loading Environmental Records..."
];

export function ProgressTracker({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      setTimeout(() => onComplete(), 500);
      return;
    }

    const timer = setTimeout(() => {
      setProgress(((currentStep + 1) / steps.length) * 100);
      setCurrentStep(prev => prev + 1);
    }, 800); // Mock loading time per step

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 glass rounded-2xl border text-center">
      <div className="mb-6 flex justify-center">
        {currentStep >= steps.length ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-primary/20 p-4 rounded-full text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>
        ) : (
          <div className="bg-primary/10 p-4 rounded-full text-primary animate-pulse">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-2">
        {currentStep >= steps.length ? "Aggregation Complete" : "Aggregating Data"}
      </h2>
      
      <p className="text-muted-foreground mb-8 min-h-[1.5rem]">
        {currentStep >= steps.length ? "All external records successfully retrieved." : steps[currentStep]}
      </p>

      <Progress value={progress} className="h-2 w-full bg-secondary" />
      
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

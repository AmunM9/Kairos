import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ error }: { error: any }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-xl font-medium text-text-primary mb-2">
        El momento se nos escapó.
      </h3>
      <p className="text-text-secondary max-w-md">
        Ocurrió un error: {error?.message || 'Intenta de nuevo.'}
      </p>
    </div>
  );
};

export default ErrorState;

import React from 'react';
import { AlertCircle, FileX } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-credits' | 'empty';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-tertiary mb-6">
        {type === 'no-credits' ? <AlertCircle size={32} /> : <FileX size={32} />}
      </div>
      <h3 className="text-xl font-medium text-text-primary mb-2">
        {type === 'no-credits' ? 'Sin créditos en Apify' : 'Aún no hay momentos para esto.'}
      </h3>
      <p className="text-text-secondary max-w-md">
        {type === 'no-credits' 
          ? 'El mes próximo se renuevan, o puedes upgradeear tu plan en apify.com' 
          : 'Prueba con otras palabras o selecciona más plataformas para buscar.'}
      </p>
    </div>
  );
};

export default EmptyState;

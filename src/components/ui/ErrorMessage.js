import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
function ErrorMessage({ message, onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <AlertCircle size={48} className="text-error mb-4" />
      <p className="text-on-surface text-center mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors">
          <RefreshCw size={16} /> Try Again
        </button>
      )}
    </div>
  );
}
export default ErrorMessage;

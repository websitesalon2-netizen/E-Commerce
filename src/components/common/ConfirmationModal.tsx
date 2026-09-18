import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="confirmation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity"
    >
      <div 
        id="confirmation-modal-dialog"
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all p-6"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="confirmation-modal-title" className="text-lg font-bold text-stone-900 mb-2">
              {title}
            </h3>
            <p id="confirmation-modal-message" className="text-sm text-stone-600 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            id="confirmation-modal-close-btn"
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            id="confirmation-modal-cancel-btn"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            id="confirmation-modal-confirm-btn"
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition cursor-pointer ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-stone-900 hover:bg-stone-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { RotateCcw, CheckCircle2, Eye, X } from 'lucide-react';

interface UndoSendToastProps {
  isVisible: boolean;
  recipientSummary: string;
  subject: string;
  durationMs?: number;
  onUndo: () => void;
  onViewMessage?: () => void;
  onDismiss: () => void;
}

export const UndoSendToast: React.FC<UndoSendToastProps> = ({
  isVisible,
  recipientSummary,
  subject,
  durationMs = 6000,
  onUndo,
  onViewMessage,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      return;
    }

    const intervalTime = 50;
    const step = (intervalTime / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible, durationMs, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-md bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-3.5 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} />
        </div>
        <div className="text-xs">
          <div className="font-bold text-slate-100 flex items-center gap-1.5">
            <span>Dispatched to {recipientSummary}</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
            {subject || '(No Subject)'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          className="px-3 py-1.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Undo</span>
        </button>

        {onViewMessage && (
          <button
            type="button"
            onClick={onViewMessage}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="View message in sent folder"
          >
            <Eye size={14} />
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-500 hover:text-slate-300 p-1"
        >
          <X size={13} />
        </button>
      </div>

      {/* Progress Bar Countdown */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-accent-400 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

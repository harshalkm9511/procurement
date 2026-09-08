import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Sparkles, CheckCircle2, Loader2, X, Cpu } from 'lucide-react';

export const AIProcessingModal: React.FC = () => {
  const { aiProcessing, setAiProcessing, setActivePage } = useProcurement();

  if (!aiProcessing.isOpen) return null;

  const handleClose = () => {
    setAiProcessing(prev => ({ ...prev, isOpen: false }));
  };

  const handleViewResults = () => {
    handleClose();
    if (aiProcessing.resultData?.action === 'Purchase Plan Generated') {
      setActivePage('forecast');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden glass-panel border border-cyan-500/30 rounded-2xl shadow-2xl glow-cyan">
        
        {/* Top Glowing Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-600 animate-pulse" />

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  {aiProcessing.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  ProcureAI Autonomous Intelligence Engine
                </p>
              </div>
            </div>
            {aiProcessing.isComplete && (
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Step Progress List */}
          <div className="space-y-4 mb-6">
            {aiProcessing.steps.map((step, idx) => {
              const isDone = idx < aiProcessing.currentStep || aiProcessing.isComplete;
              const isCurrent = idx === aiProcessing.currentStep && !aiProcessing.isComplete;
              const isPending = idx > aiProcessing.currentStep && !aiProcessing.isComplete;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-blue-950/40 border border-blue-500/30 text-white shadow-lg'
                      : isDone
                      ? 'bg-slate-900/50 border border-slate-800/80 text-slate-300'
                      : 'opacity-40 text-slate-500'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isCurrent ? 'font-medium text-cyan-200' : ''}`}>
                      {step}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Result View if complete */}
          {aiProcessing.isComplete && aiProcessing.resultData && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-sm mb-6 animate-in fade-in duration-300">
              <p className="font-semibold text-cyan-300 mb-1">
                {aiProcessing.resultData.action}
              </p>
              <p className="text-xs text-cyan-200/80 leading-relaxed">
                {aiProcessing.resultData.details}
              </p>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!aiProcessing.isComplete ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Analyzing procurement vectors...
              </div>
            ) : (
              <button
                onClick={handleViewResults}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02]"
              >
                Complete & Close
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

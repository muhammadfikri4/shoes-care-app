import React from 'react';

type Step = 'CREATED' | 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'CANCELLED';

const steps: { key: Step; label: string }[] = [
  { key: 'CREATED', label: 'Pending' },
  { key: 'IN_PROGRESS', label: 'On Process' },
  { key: 'READY_FOR_PICKUP', label: 'Ready to Pick Up' },
  { key: 'PICKED_UP', label: 'Completed' },
];

export const TransactionTimeline: React.FC<{ status: Step }> = ({ status }) => {
  const currentIndex = steps.findIndex(s => s.key === status);
  const idx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((s, i) => {
          const done = i <= idx;
          return (
            <div key={s.key} className="flex items-center w-full">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${done ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{i+1}</div>
              <div className="ml-2 mr-4 text-sm text-slate-700">{s.label}</div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < idx ? 'bg-blue-600' : 'bg-slate-200'}`}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};


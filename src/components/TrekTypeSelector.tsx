import { Mountain, TrendingUp, Flag } from 'lucide-react';
import { TrekType } from '../App';

interface TrekTypeSelectorProps {
  selected: TrekType;
  onChange: (type: TrekType) => void;
}

const trekTypes: { value: TrekType; label: string; icon: React.ReactNode }[] = [
  { value: 'treks', label: 'Treks', icon: <Mountain className="w-5 h-5" /> },
  { value: 'expeditions', label: 'Expeditions', icon: <TrendingUp className="w-5 h-5" /> },
  { value: 'climbs', label: 'Climbs', icon: <Flag className="w-5 h-5" /> },
];

export function TrekTypeSelector({ selected, onChange }: TrekTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-2">Trek Type</label>
      <div className="grid grid-cols-3 gap-2">
        {trekTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selected === type.value
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              {type.icon}
              <span className="text-xs">{type.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

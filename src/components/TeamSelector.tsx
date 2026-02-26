import { Team } from '../App';

interface TeamSelectorProps {
  selected: Team;
  onChange: (team: Team) => void;
}

const teams: { value: Team; label: string; color: string }[] = [
  { value: 'ground-ops', label: 'Ground Ops', color: 'emerald' },
  { value: 'support', label: 'Support Team', color: 'blue' },
  { value: 'trip-leader', label: 'Trip Leader', color: 'purple' },
  { value: 'head-office', label: 'Head Office', color: 'orange' },
];

export function TeamSelector({ selected, onChange }: TeamSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-2">Team</label>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value as Team)}
          className="w-full p-3 pr-10 rounded-lg border-2 border-slate-200 bg-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
        >
          {teams.map((team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

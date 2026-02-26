import { Mountain, MapPin, Image, Trees, Sun, Flower, Globe } from 'lucide-react';

export interface BaseData {
  name: string;
  activeTrips: number;
  totalTrips: number;
  region: string;
}

interface BaseSelectionPageProps {
  bases: BaseData[];
  onSelectBase: (baseIndex: number) => void;
  onViewAllBases: () => void;
}

const getBaseIcon = (baseName: string) => {
  switch(baseName) {
    case 'Ladakh':
      return Sun; // High altitude desert
    case 'Uttarakhand':
      return Mountain; // Classic mountains
    case 'Himachal':
      return Trees; // Green valleys
    case 'Kashmir':
      return Image; // Picture-perfect landscapes - Dal Lake, mountains, scenic beauty
    case 'Sikkim':
      return Flower; // Rhododendrons and floral beauty
    default:
      return Globe; // Default
  }
};

const getIconColor = (baseName: string) => {
  switch(baseName) {
    case 'Ladakh':
      return 'text-amber-600'; // Warm desert tone
    case 'Uttarakhand':
      return 'text-emerald-700'; // Mountain green
    case 'Himachal':
      return 'text-emerald-600'; // Lush green
    case 'Kashmir':
      return 'text-blue-500'; // Water/lake blue
    case 'Sikkim':
      return 'text-pink-600'; // Rhododendron pink
    default:
      return 'text-gray-600';
  }
};

export function BaseSelectionPage({
  bases,
  onSelectBase,
  onViewAllBases
}: BaseSelectionPageProps) {
  
  const getCompletionPercentage = (base: BaseData) => {
    if (base.totalTrips === 0) return 0;
    return Math.round((base.activeTrips / base.totalTrips) * 100);
  };

  const getCardColor = (baseName: string) => {
    switch(baseName) {
      case 'Ladakh':
        return 'from-amber-100 to-amber-200 border-amber-300'; // Brown/desert
      case 'Uttarakhand':
        return 'from-amber-50 to-emerald-100 border-emerald-300'; // Brown to green transition
      case 'Himachal':
        return 'from-emerald-100 to-emerald-200 border-emerald-300'; // More green
      case 'Kashmir':
        return 'from-emerald-200 to-emerald-300 border-emerald-400'; // Greenest
      case 'Sikkim':
        return 'from-teal-200 to-teal-300 border-teal-400'; // Teal/deep green
      default:
        return 'from-slate-100 to-slate-200 border-slate-300'; // Default
    }
  };

  const getTextColor = (baseName: string) => {
    return 'text-gray-900';
  };

  const getSecondaryTextColor = (baseName: string) => {
    return 'text-gray-600';
  };

  const getProgressBarBg = (baseName: string) => {
    return 'bg-gray-200';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-amber-500';
    if (percentage <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mountain className="size-6" />
          <h1 className="text-center">Trek Task Manager</h1>
        </div>
        <p className="text-center text-emerald-100 text-sm">Select Your Base</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Stats */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl text-emerald-700 mb-1">
                {bases.reduce((sum, base) => sum + base.activeTrips, 0)}
              </div>
              <div className="text-base text-gray-600">Active Trips</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl text-blue-700 mb-1">
                {bases.reduce((sum, base) => sum + base.totalTrips, 0)}
              </div>
              <div className="text-base text-gray-600">Total Trips</div>
            </div>
          </div>
        </div>

        {/* Base Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bases.map((base, index) => {
            const percentage = getCompletionPercentage(base);
            const BaseIcon = getBaseIcon(base.name);
            
            return (
              <button
                key={base.name}
                onClick={() => onSelectBase(index)}
                className={`relative p-4 rounded-xl border-2 bg-gradient-to-br ${getCardColor(base.name)} transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 text-left`}
              >
                {/* Base Icon */}
                <div className="mb-3 flex justify-center">
                  <div className={`p-3 rounded-full bg-white/50`}>
                    <BaseIcon className={`size-8 ${getIconColor(base.name)}`} />
                  </div>
                </div>

                {/* Base Name */}
                <h3 className={`mb-3 text-center font-bold ${getTextColor(base.name)}`}>
                  {base.name}
                </h3>

                {/* Trip Count */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-base">
                    <span className={getSecondaryTextColor(base.name)}>Active:</span>
                    <span className={getTextColor(base.name)}>{base.activeTrips}</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className={getSecondaryTextColor(base.name)}>Total:</span>
                    <span className={getTextColor(base.name)}>{base.totalTrips}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-1">
                    <div className={`h-2 rounded-full overflow-hidden ${getProgressBarBg(base.name)}`}>
                      <div 
                        className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className={`text-sm text-center mt-1 ${getSecondaryTextColor(base.name)}`}>
                      {percentage}% active
                    </p>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            );
          })}

          {/* View All Bases Card */}
          <button
            onClick={onViewAllBases}
            className="relative p-4 rounded-xl border-2 border-dashed border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 flex flex-col items-center justify-center gap-3"
          >
            <div className="p-3 rounded-full bg-emerald-200 text-emerald-700">
              <MapPin className="size-6" />
            </div>
            <h3 className="text-emerald-800 text-center">
              View All Bases
            </h3>
            <p className="text-emerald-600 text-sm text-center">
              See trips from all locations
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
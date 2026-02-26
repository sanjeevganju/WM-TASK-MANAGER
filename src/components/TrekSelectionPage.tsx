import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TrekCarousel } from './TrekCarousel';
import { CircularProgress } from './CircularProgress';

export interface TrekData {
  name: string;
  startDate: Date;
  endDate: Date;
  numberOfClients: number;
  completed: number;
  total: number;
}

interface TrekSelectionPageProps {
  treks: TrekData[];
  selectedTeam: string; // Keep for internal logic but don't show selector
  onTeamChange: (team: any) => void; // Keep for compatibility
  onSelectTrek: (trekIndex: number) => void;
  onBack: () => void;
}

export function TrekSelectionPage({
  treks,
  onSelectTrek,
  onBack
}: TrekSelectionPageProps) {
  const [selectedTrekIndex, setSelectedTrekIndex] = useState(0);
  
  // Reset index if it's out of bounds
  const safeIndex = selectedTrekIndex >= treks.length ? 0 : selectedTrekIndex;
  const currentTrek = treks[safeIndex];

  const handleTrekSelection = (index: number) => {
    setSelectedTrekIndex(index);
  };

  const handleRingClick = () => {
    onSelectTrek(safeIndex);
  };

  // If no treks available, show empty state
  if (!treks || treks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sticky top-0 z-20 shadow-lg relative">
          {/* Back Button */}
          <button
            className="absolute left-4 top-4 text-white hover:bg-emerald-600 rounded-full p-1 transition-colors"
            onClick={onBack}
          >
            <ArrowLeft size={24} />
          </button>
          
          <h1 className="text-center">Trek Task Manager</h1>
          <p className="text-center text-emerald-100 text-base mt-1">Pre-Trek Operations Dashboard</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🏔️</div>
            <h2 className="text-gray-700 mb-2">No Treks Found</h2>
            <p className="text-gray-500 text-center max-w-xs">
              No treks available for the selected base.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sticky top-0 z-20 shadow-lg relative">
        {/* Back Button */}
        <button
          className="absolute left-4 top-4 text-white hover:bg-emerald-600 rounded-full p-1 transition-colors"
          onClick={onBack}
        >
          <ArrowLeft size={24} />
        </button>
        
        <h1 className="text-center">Trek Task Manager</h1>
        <p className="text-center text-emerald-100 text-base mt-1">Pre-Trek Operations Dashboard</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Trek Carousel */}
        <div className="pt-4">
          <TrekCarousel
            treks={treks.map(t => t.name)}
            selectedIndex={safeIndex}
            onSelectTrek={handleTrekSelection}
          />
        </div>

        {/* Main Progress Ring */}
        <div className="flex flex-col items-center py-8">
          <div className="mb-4">
            <h2 className="text-center text-gray-600 mb-2">Overall Progress</h2>
          </div>
          <CircularProgress
            completed={currentTrek.completed}
            total={currentTrek.total}
            size="lg"
            onClick={handleRingClick}
          />
          <p className="text-center text-gray-500 text-base mt-6 max-w-xs">
            Tap the ring to view task categories and details
          </p>
        </div>

        {/* Trek Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-gray-900 mb-3">{currentTrek.name}</h2>
            </div>
            <div className="text-center text-gray-700">
              <span className="font-semibold">{currentTrek.numberOfClients} pax</span>
            </div>
            <div className="text-center text-gray-700">
              <span>
                {currentTrek.startDate.toLocaleDateString('en-GB', { 
                  day: 'numeric',
                  month: 'short'
                })}-{currentTrek.endDate.toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="text-center text-gray-700">
              <span className="text-gray-600">Completion: </span>
              <span className="font-semibold">
                {currentTrek.total > 0 
                  ? Math.round((currentTrek.completed / currentTrek.total) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
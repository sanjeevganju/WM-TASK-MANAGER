import { ArrowLeft, Tent, FileText, Truck, Users, Utensils, IndianRupee } from 'lucide-react';
import { CircularProgress } from './CircularProgress';
import { TrekData } from './TrekSelectionPage';

export interface CategoryProgress {
  name: string;
  completed: number;
  total: number;
  icon: React.ReactNode;
}

interface TrekDetailPageProps {
  trek: TrekData;
  categories: CategoryProgress[];
  onBack: () => void;
  onSelectCategory: (categoryIndex: number) => void;
}

const iconMap = {
  'Transport': <Truck className="size-5" />,
  'Permits': <FileText className="size-5" />,
  'Equipment': <Tent className="size-5" />,
  'Kitchen': <Utensils className="size-5" />,
  'Team Assigned': <Users className="size-5" />,
  'Field Accounts': <IndianRupee className="size-5" />
};

export function TrekDetailPage({ 
  trek, 
  categories, 
  onBack, 
  onSelectCategory 
}: TrekDetailPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-center">{trek.name}</h1>
            <p className="text-center text-emerald-100 text-base mt-1">
              {trek.startDate.toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short'
              })}-{trek.endDate.toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-6">
        {/* Overall Progress Card */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 mb-1">Overall Progress</h2>
              <p className="text-gray-600 text-base">
                {trek.completed} of {trek.total} tasks completed
              </p>
            </div>
            <div className="text-3xl">
              {trek.total > 0 
                ? Math.round((trek.completed / trek.total) * 100) 
                : 0}%
            </div>
          </div>
        </div>

        {/* Category Rings Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="flex flex-col items-center"
            >
              <div className="mb-3 p-3 rounded-full bg-emerald-100 text-emerald-700">
                {iconMap[category.name as keyof typeof iconMap] || <FileText className="size-5" />}
              </div>
              <CircularProgress
                completed={category.completed}
                total={category.total}
                size="sm"
                onClick={() => onSelectCategory(index)}
                label={category.name}
                showLabel={true}
              />
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-emerald-800 text-base text-center">
            💡 Tap any category ring to view and manage its tasks
          </p>
        </div>
      </div>
    </div>
  );
}
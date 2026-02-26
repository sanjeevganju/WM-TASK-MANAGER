import { ArrowLeft, Tent, FileText, Truck, Users, Utensils, IndianRupee } from 'lucide-react';
import { TaskList } from './TaskList';
import { Task } from '../App';

interface CategoryTasksPageProps {
  trekName: string;
  categoryName: string;
  tasks: Task[];
  trekStartDate: Date;
  onBack: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const categoryIcons = {
  'Transport': <Truck className="size-6" />,
  'Permits': <FileText className="size-6" />,
  'Equipment': <Tent className="size-6" />,
  'Kitchen': <Utensils className="size-6" />,
  'Team Assigned': <Users className="size-6" />,
  'Field Accounts': <IndianRupee className="size-6" />
};

export function CategoryTasksPage({
  trekName,
  categoryName,
  tasks,
  trekStartDate,
  onBack,
  onUpdateTask
}: CategoryTasksPageProps) {
  // Check if trek has started (current date >= start date)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
  const trekStart = new Date(trekStartDate);
  trekStart.setHours(0, 0, 0, 0);
  const isReadOnly = today >= trekStart;

  // Calculate completion based on task input type
  const isTaskComplete = (t: Task) => {
    // If NA is checked, task is complete
    if (t.isNA) return true;
    
    // For budget-with-voucher, need both budgetAmount and voucherFile
    if (t.inputType === 'budget-with-voucher') {
      return !!(t.budgetAmount && t.voucherFile);
    }
    
    // For other types, check if inputValue exists
    return !!(t.inputValue && t.inputValue.trim());
  };
  
  const completed = tasks.filter(isTaskComplete).length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Determine color based on completion percentage
  const getColorClass = () => {
    if (percentage <= 25) return 'from-red-600 to-red-700';
    if (percentage <= 50) return 'from-amber-600 to-amber-700';
    if (percentage <= 75) return 'from-blue-600 to-blue-700';
    return 'from-green-600 to-green-700';
  };

  const handleUpdateInput = (taskId: string, inputValue: string) => {
    // Automatically update status based on input value
    const status = inputValue && inputValue.trim() ? 'completed' : 'not-started';
    onUpdateTask(taskId, { inputValue, status });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getColorClass()} text-white p-4 sticky top-0 z-20 shadow-lg`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-2">
              {categoryIcons[categoryName as keyof typeof categoryIcons]}
              <h1>{categoryName}</h1>
            </div>
            <p className="text-center text-white/90 text-base mt-1">
              {completed} of {total} tasks completed ({percentage}%)
            </p>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="h-2 bg-gray-200">
          <div 
            className={`h-full transition-all duration-500 ${
              percentage <= 25 ? 'bg-red-500' :
              percentage <= 50 ? 'bg-amber-500' :
              percentage <= 75 ? 'bg-blue-500' :
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Read-Only Banner */}
      {isReadOnly && (
        <div className="bg-amber-100 border-b-2 border-amber-300 px-4 py-3">
          <p className="text-base text-amber-800 text-center font-medium">
            ⚠️ Trek has started - No changes can be made
          </p>
        </div>
      )}

      {/* Task List */}
      <div className="p-4">
        <TaskList
          tasks={tasks}
          onUpdateInput={handleUpdateInput}
          onUpdateTask={onUpdateTask}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );
}
import { Calendar, Users } from 'lucide-react';
import { TrekInfo } from '../App';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

interface TrekInfoCardProps {
  trekInfo: TrekInfo;
  onUpdateTrekInfo: (updatedInfo: Partial<TrekInfo>) => void;
}

export function TrekInfoCard({ trekInfo, onUpdateTrekInfo }: TrekInfoCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const daysUntilTrek = Math.ceil(
    (trekInfo.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-emerald-700">{trekInfo.name}</h2>
          
          {/* Trek Start Date with picker */}
          <div className="flex items-center gap-2 mt-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Start:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm h-7 px-2 border-emerald-200 hover:border-emerald-400"
                >
                  {formatDate(trekInfo.startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={trekInfo.startDate}
                  onSelect={(date) => date && onUpdateTrekInfo({ startDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* First Booking Date with picker */}
          <div className="flex items-center gap-2 mt-1 text-slate-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">First booking:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm h-7 px-2 border-emerald-200 hover:border-emerald-400"
                >
                  {formatDate(trekInfo.firstBookingDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={trekInfo.firstBookingDate}
                  onSelect={(date) => date && onUpdateTrekInfo({ firstBookingDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="bg-emerald-50 px-3 py-2 rounded-lg text-center">
          <div className="text-2xl text-emerald-700">{daysUntilTrek}</div>
          <div className="text-xs text-emerald-600">days left</div>
        </div>
      </div>
    </div>
  );
}
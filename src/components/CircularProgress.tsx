interface CircularProgressProps {
  completed: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  label?: string;
  showLabel?: boolean;
}

export function CircularProgress({ 
  completed, 
  total, 
  size = 'md',
  onClick,
  label,
  showLabel = false
}: CircularProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  // Determine color based on completion percentage
  const getColor = () => {
    if (percentage <= 25) return { ring: 'stroke-red-500', bg: 'bg-red-50', text: 'text-red-700' };
    if (percentage <= 50) return { ring: 'stroke-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' };
    if (percentage <= 75) return { ring: 'stroke-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' };
    return { ring: 'stroke-green-500', bg: 'bg-green-50', text: 'text-green-700' };
  };

  const color = getColor();
  
  // Size configurations
  const sizeConfig = {
    sm: { dimension: 80, strokeWidth: 6, fontSize: 'text-sm', radius: 34 },
    md: { dimension: 140, strokeWidth: 10, fontSize: 'text-xl', radius: 60 },
    lg: { dimension: 200, strokeWidth: 14, fontSize: 'text-3xl', radius: 86 }
  };
  
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={!onClick}
        className={`relative transition-all duration-300 ${
          onClick ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''
        } ${!onClick && 'cursor-default'}`}
      >
        <svg
          width={config.dimension}
          height={config.dimension}
          viewBox={`0 0 ${config.dimension} ${config.dimension}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-gray-200"
          />
          
          {/* Progress circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={config.radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${color.ring} transition-all duration-500 ease-in-out`}
          />
        </svg>
        
        {/* Text in center */}
        <div className={`absolute inset-0 flex items-center justify-center ${config.fontSize} ${color.text}`}>
          <span className="font-semibold">{completed}/{total}</span>
        </div>
      </button>
      
      {/* Label below */}
      {showLabel && label && (
        <span className="text-sm text-gray-700 text-center px-2 max-w-[100px]">
          {label}
        </span>
      )}
    </div>
  );
}

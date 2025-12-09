import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Phase {
  id: number;
  name: string;
  completed: boolean;
  current?: boolean;
}

interface PhaseNavigatorProps {
  phases: Phase[];
  onPhaseClick?: (phaseId: number) => void;
  className?: string;
}

export function PhaseNavigator({ phases, onPhaseClick, className }: PhaseNavigatorProps) {
  const { t } = useLanguage();
  const completedCount = phases.filter(p => p.completed).length;
  const totalCount = phases.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("phaseNavigator.progress.title")}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {t("phaseNavigator.progress.percent", { percent: String(progressPercentage) })}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t("phaseNavigator.progress.details", {
            completed: String(completedCount),
            total: String(totalCount),
          })}
        </p>
      </div>

      {/* Phase Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10" />
        
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex flex-col items-center relative">
              {/* Circle Indicator */}
              <button
                onClick={() => onPhaseClick?.(phase.id)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  phase.completed 
                    ? "bg-green-500 border-green-500 text-white shadow-md hover:shadow-lg" 
                    : phase.current
                    ? "bg-blue-500 border-blue-500 text-white shadow-md animate-pulse"
                    : "bg-white border-gray-300 text-gray-400 hover:border-blue-400"
                )}
                data-testid={`phase-step-${phase.id}`}
              >
                {phase.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" fill={phase.current ? "currentColor" : "none"} />
                )}
              </button>

              {/* Phase Name */}
              <span 
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-[80px]",
                  phase.current 
                    ? "text-blue-600 font-bold" 
                    : phase.completed
                    ? "text-green-600"
                    : "text-gray-500"
                )}
              >
                {phase.name}
              </span>

              {/* Current Indicator */}
              {phase.current && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-md">
                    {t("phaseNavigator.current.label")}
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500 mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

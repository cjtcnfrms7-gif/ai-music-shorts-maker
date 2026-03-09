import { useEffect, useState } from "react";
import { Download, Brain, Type, Film, Check } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const steps = [
  { icon: Download, label: "영상 다운로드 중...", duration: 2000 },
  { icon: Brain, label: "AI 하이라이트 분석 중...", duration: 3000 },
  { icon: Type, label: "워딩 생성 중...", duration: 2000 },
  { icon: Film, label: "쇼츠 제작 중...", duration: 2500 },
];

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 50;
      setProgress(Math.min((elapsed / totalDuration) * 100, 100));

      let acc = 0;
      for (let i = 0; i < steps.length; i++) {
        acc += steps[i].duration;
        if (elapsed < acc) {
          setCurrentStep(i);
          break;
        }
        if (i === steps.length - 1) setCurrentStep(steps.length);
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="animate-step-in flex flex-col items-center justify-center min-h-[60vh] px-6 py-12">
      {/* Progress circle */}
      <div className="relative w-28 h-28 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            className="transition-all duration-100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isDone = currentStep > i;
          const isActive = currentStep === i;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive ? "bg-accent" : isDone ? "bg-surface" : "opacity-40"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isDone ? "bg-success" : isActive ? "bg-primary" : "bg-muted"
              }`}>
                {isDone ? (
                  <Check className="w-4 h-4 text-success-foreground" />
                ) : (
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                )}
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {isDone ? step.label.replace("중...", "완료") : step.label}
              </span>
              {isActive && (
                <div className="ml-auto flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot"
                      style={{ animationDelay: `${d * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingScreen;

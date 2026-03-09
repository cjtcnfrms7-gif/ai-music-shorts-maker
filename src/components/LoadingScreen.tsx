import { useEffect, useState } from "react";
import { Download, Brain, Type, Film, Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoadingScreenProps {
  onComplete: () => void;
}

const steps = [
  { icon: Download, label: "영상 다운로드 중...", doneLabel: "영상 다운로드 완료", duration: 2000 },
  { icon: Brain, label: "AI 하이라이트 분석 중...", doneLabel: "AI 하이라이트 분석 완료", duration: 3000 },
  { icon: Type, label: "워딩 생성 중...", doneLabel: "워딩 생성 완료", duration: 2000 },
  { icon: Film, label: "쇼츠 제작 중...", doneLabel: "쇼츠 제작 완료", duration: 2500 },
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
        if (i === steps.length - 1 && elapsed >= acc) setCurrentStep(steps.length);
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="animate-step-in px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent mb-1">
          <Brain className="w-6 h-6 text-accent-foreground" />
        </div>
        <h2 className="text-xl font-bold">AI 분석 중...</h2>
        <p className="text-sm text-muted-foreground">영상을 분석하여 최적의 쇼츠를 제작하고 있습니다</p>
      </div>

      {/* Overall progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>전체 진행률</span>
          <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2.5 rounded-full" />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isDone = currentStep > i;
          const isActive = currentStep === i;
          const isPending = currentStep < i;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive ? "bg-accent border border-primary/20" : isDone ? "bg-surface" : "bg-surface opacity-50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isDone ? "bg-success" : isActive ? "bg-primary" : "bg-muted"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-success-foreground" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">{i + 1}단계</span>
                  {isDone && (
                    <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">완료</span>
                  )}
                </div>
                <p className={`text-sm font-medium mt-0.5 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {isDone ? step.doneLabel : step.label}
                </p>
              </div>

              {isActive && (
                <div className="flex gap-1">
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

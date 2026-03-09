import { useState, useCallback } from "react";
import { toast } from "sonner";
import UploadScreen from "@/components/UploadScreen";
import LoadingScreen from "@/components/LoadingScreen";
import ResultScreen from "@/components/ResultScreen";
import TemplateScreen from "@/components/TemplateScreen";

type Step = "upload" | "loading" | "result" | "template";

const STEP_LABELS: Record<Step, string> = {
  upload: "업로드",
  loading: "분석",
  result: "결과",
  template: "템플릿",
};

const STEP_ORDER: Step[] = ["upload", "loading", "result", "template"];

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [clipCount, setClipCount] = useState(5);

  const handleUploadSubmit = useCallback(() => {
    setStep("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setStep("result");
  }, []);

  const handleResultNext = useCallback((clips: any[]) => {
    setClipCount(clips.length);
    setStep("template");
  }, []);

  const handleDownload = useCallback(() => {
    toast.success("다운로드가 시작되었습니다!", {
      description: "쇼츠 영상이 곧 준비됩니다.",
    });
  }, []);

  const currentIdx = STEP_ORDER.indexOf(step);

  return (
    <div className="min-h-screen bg-background">
      {/* Top progress bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-1">
            {STEP_ORDER.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i <= currentIdx
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${
                    i <= currentIdx ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {STEP_LABELS[s]}
                  </span>
                </div>
                {i < STEP_ORDER.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded transition-colors ${
                    i < currentIdx ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto pb-8">
        {step === "upload" && <UploadScreen onSubmit={handleUploadSubmit} />}
        {step === "loading" && <LoadingScreen onComplete={handleLoadingComplete} />}
        {step === "result" && <ResultScreen onNext={handleResultNext} />}
        {step === "template" && <TemplateScreen clipCount={clipCount} onDownload={handleDownload} />}
      </div>
    </div>
  );
};

export default Index;

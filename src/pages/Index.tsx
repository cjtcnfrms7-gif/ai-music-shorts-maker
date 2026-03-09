import { useState, useCallback } from "react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center border-b border-border px-4 bg-background sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />

            {/* Step progress */}
            <div className="flex items-center gap-1">
              {STEP_ORDER.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        i <= currentIdx
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:inline ${
                        i <= currentIdx ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {STEP_LABELS[s]}
                    </span>
                  </div>
                  {i < STEP_ORDER.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 rounded transition-colors ${
                        i < currentIdx ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto pb-8">
              {step === "upload" && <UploadScreen onSubmit={handleUploadSubmit} />}
              {step === "loading" && <LoadingScreen onComplete={handleLoadingComplete} />}
              {step === "result" && <ResultScreen onNext={handleResultNext} />}
              {step === "template" && (
                <TemplateScreen clipCount={clipCount} onDownload={handleDownload} />
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import UploadScreen from "@/components/UploadScreen";
import ResultScreen from "@/components/ResultScreen";

type Step = "upload" | "loading" | "result";

interface Clip {
  id: number;
  start_time: string;
  end_time: string;
  reason: string;
  file_path?: string;
}

const STEP_LABELS: Record<Step, string> = {
  upload: "업로드",
  loading: "처리 중",
  result: "결과",
};

const STEP_ORDER: Step[] = ["upload", "loading", "result"];

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [clips, setClips] = useState<Clip[]>([]);

  const handleUploadSubmit = useCallback((data: { clips: Clip[] }) => {
    setClips(data.clips);
    setStep("result");
  }, []);

  const handleProcessing = useCallback(() => {
    setStep("loading");
  }, []);

  const handleReset = useCallback(() => {
    setClips([]);
    setStep("upload");
  }, []);

  const currentIdx = STEP_ORDER.indexOf(step);

  return (
    <SidebarProvider>
      <motion.div
        className="min-h-screen flex w-full bg-background"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center border-b border-border px-4 bg-background sticky top-0 z-10">
            <SidebarTrigger className="mr-4 text-muted-foreground hover:text-foreground" />

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
              {step === "result" && <ResultScreen clips={clips} onReset={handleReset} />}
            </div>
          </main>
        </div>
      </motion.div>
    </SidebarProvider>
  );
};

export default Index;

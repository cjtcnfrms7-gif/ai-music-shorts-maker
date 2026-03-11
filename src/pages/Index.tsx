import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import UploadScreen from "@/components/UploadScreen";
import TemplateScreen from "@/components/TemplateScreen";
import ResultScreen from "@/components/ResultScreen";
import { apiEndpoints } from "@/config/api";

type Step = "upload" | "template" | "loading" | "result";

interface Clip {
  id: number;
  start_time: string;
  end_time: string;
  reason: string;
  file_path?: string;
}

interface UploadData {
  filePath: string;
  title: string;
  artist: string;
  releaseDate: string;
}

const STEP_LABELS: Record<Step, string> = {
  upload: "업로드",
  template: "템플릿",
  loading: "처리 중",
  result: "결과",
};

const STEP_ORDER: Step[] = ["upload", "template", "loading", "result"];

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [clips, setClips] = useState<Clip[]>([]);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [resultFilePath, setResultFilePath] = useState<string | undefined>();

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleUploadReady = useCallback(async (data: UploadData) => {
    setUploadData(data);
    setPreviewImages([]);
    setStep("template");
    try {
      const res = await fetch(
        apiEndpoints.previewTemplates({ filePath: data.filePath, title: data.title, artist: data.artist }),
        { method: "POST" }
      );
      if (!res.ok) throw new Error("미리보기 생성 실패");
      const json = await res.json();
      setPreviewImages(json.previews || []);
    } catch (err: any) {
      toast.error(err.message || "미리보기를 불러올 수 없습니다");
    }
  }, []);

  const handleTemplateSelect = useCallback(async (templateIndex: number) => {
    if (!uploadData) return;
    setStep("loading");
    try {
      const { filePath, title, artist, releaseDate } = uploadData;
      const res = await fetch(
        apiEndpoints.processLocal({ filePath, title, artist, releaseDate, templateIndex }),
        { method: "POST" }
      );
      if (!res.ok) throw new Error("처리 실패");
      const data = await res.json();
      const clips: Clip[] = (data.clips || data.results || []).map((c: any, i: number) => ({
        id: c.id || i + 1,
        start_time: c.start_time || c.startTime || "0:00",
        end_time: c.end_time || c.endTime || "0:30",
        reason: c.reason || c.description || "",
        file_path: c.file_path || c.filePath || "",
      }));
      toast.success(`${clips.length}개 클립 생성 완료`);
      setResultFilePath(data.file_path || data.filePath || filePath);
      setClips(clips);
      setStep("result");
    } catch (err: any) {
      toast.error(err.message || "처리 중 오류가 발생했습니다");
      setStep("template");
    }
  }, [uploadData]);

  const handleReset = useCallback(() => {
    setClips([]);
    setUploadData(null);
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
          <header className="h-14 flex items-center border-b border-border px-4 bg-background sticky top-0 z-10">
            <SidebarTrigger className="mr-4 text-muted-foreground hover:text-foreground" />
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

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto pb-8">
              {step === "upload" && <UploadScreen onReady={handleUploadReady} />}
              {step === "template" && <TemplateScreen onSelect={handleTemplateSelect} previewImages={previewImages} />}
              {step === "loading" && (
                <div className="flex flex-col items-center justify-center py-32 space-y-4 animate-step-in">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-medium text-muted-foreground">AI가 클립을 생성하고 있습니다...</p>
                </div>
              )}
              {step === "result" && (
                <ResultScreen
                  clips={clips}
                  onReset={handleReset}
                  filePath={resultFilePath || uploadData?.filePath}
                  onGenerateWithWording={(mainText, subText) => {
                    if (!uploadData) return;
                    setStep("loading");
                    const { filePath, title, artist, releaseDate } = uploadData;
                    fetch(
                      apiEndpoints.processLocal({ filePath, title, artist, releaseDate, mainText, subText }),
                      { method: "POST" }
                    )
                      .then((res) => {
                        if (!res.ok) throw new Error("처리 실패");
                        return res.json();
                      })
                      .then((data) => {
                        const newClips: Clip[] = (data.clips || data.results || []).map((c: any, i: number) => ({
                          id: c.id || i + 1,
                          start_time: c.start_time || c.startTime || "0:00",
                          end_time: c.end_time || c.endTime || "0:30",
                          reason: c.reason || c.description || "",
                          file_path: c.file_path || c.filePath || "",
                        }));
                        toast.success(`${newClips.length}개 클립 생성 완료`);
                        setClips(newClips);
                        setStep("result");
                      })
                      .catch((err) => {
                        toast.error(err.message || "처리 중 오류가 발생했습니다");
                        setStep("result");
                      });
                  }}
                />
              )}
            </div>
          </main>
        </div>
      </motion.div>
    </SidebarProvider>
  );
};

export default Index;

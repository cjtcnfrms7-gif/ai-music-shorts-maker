import { useState, useEffect } from "react";
import { Play, RotateCcw, Loader2, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiEndpoints } from "@/config/api";

interface Clip {
  id: number;
  start_time: string;
  end_time: string;
  reason: string;
  file_path?: string;
}

interface Wording {
  main: string;
  sub: string;
}

interface ResultScreenProps {
  clips: Clip[];
  onReset: () => void;
  filePath?: string;
  resultFilePath?: string;
  onGenerateWithWording?: (mainText: string, subText: string) => void;
}

const ResultScreen = ({ clips, onReset, filePath, resultFilePath, onGenerateWithWording }: ResultScreenProps) => {
  const [wordings, setWordings] = useState<Wording[]>([]);
  const [wordingsLoading, setWordingsLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [editMain, setEditMain] = useState("");
  const [editSub, setEditSub] = useState("");

  useEffect(() => {
    if (!filePath) return;
    setWordingsLoading(true);
    fetch(apiEndpoints.generateWordings(filePath), { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("워딩 생성 실패");
        return res.json();
      })
      .then((data) => {
        const list: Wording[] = (data.wordings || []).slice(0, 10);
        setWordings(list);
        if (list.length > 0) {
          setSelectedIdx(0);
          setEditMain(list[0].main);
          setEditSub(list[0].sub);
        }
      })
      .catch((err) => toast.error(err.message || "워딩을 불러올 수 없습니다"))
      .finally(() => setWordingsLoading(false));
  }, [filePath]);

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setEditMain(wordings[idx].main);
    setEditSub(wordings[idx].sub);
  };

  const handleGenerate = () => {
    if (!editMain.trim()) {
      toast.error("메인 워딩을 입력해주세요");
      return;
    }
    onGenerateWithWording?.(editMain, editSub);
  };

  return (
    <div className="animate-step-in space-y-5 px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-foreground">생성 결과</h2>
        <p className="text-sm text-muted-foreground">
          AI가 생성한 클립 {clips.length}개
        </p>
      </div>

      {/* Wording Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-base font-bold text-foreground">워딩 선택</h3>
        </div>

        {wordingsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">워딩 생성 중...</span>
          </div>
        ) : wordings.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {wordings.map((w, i) => {
                const isSelected = selectedIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`text-left rounded-xl p-3 border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <p className="text-xs font-bold text-foreground truncate">{w.main_text}</p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{w.sub_text}</p>
                  </button>
                );
              })}
            </div>

            {/* Edit fields */}
            <div className="space-y-2 bg-accent rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Pencil className="w-3.5 h-3.5 text-accent-foreground/60" />
                <span className="text-xs font-semibold text-accent-foreground/70">선택한 워딩 수정</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">MAIN</label>
                  <Input
                    value={editMain}
                    onChange={(e) => setEditMain(e.target.value)}
                    className="h-9 text-sm rounded-lg"
                    placeholder="메인 워딩"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">SUB</label>
                  <Input
                    value={editSub}
                    onChange={(e) => setEditSub(e.target.value)}
                    className="h-9 text-sm rounded-lg"
                    placeholder="서브 워딩"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                className="w-full h-10 text-sm font-semibold rounded-xl gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                이 워딩으로 영상 생성
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {/* Clips */}
      <div className="space-y-3">
        {clips.map((clip, i) => (
          <div
            key={clip.id}
            className="bg-card rounded-xl p-4 space-y-2.5 border border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  클립 {i + 1}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">
                <Play className="w-3 h-3" />
                {clip.start_time} ~ {clip.end_time}
              </div>
            </div>

            {/* Thumbnail placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent to-primary/5 rounded-lg flex items-center justify-center">
              <Play className="w-10 h-10 text-primary/30" />
            </div>

            {/* AI Reason */}
            {clip.reason && (
              <div className="bg-accent rounded-lg px-3 py-2.5">
                <p className="text-[11px] font-semibold text-accent-foreground/70 mb-0.5">
                  AI 선택 이유
                </p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {clip.reason}
                </p>
              </div>
            )}

            {/* File path */}
            {clip.file_path && (
              <p className="text-xs text-muted-foreground truncate">
                📁 {clip.file_path}
              </p>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="w-full h-12 text-base font-semibold rounded-xl gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        새로 만들기
      </Button>
    </div>
  );
};

export default ResultScreen;

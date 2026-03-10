import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Clip {
  id: number;
  start_time: string;
  end_time: string;
  reason: string;
  file_path?: string;
}

interface ResultScreenProps {
  clips: Clip[];
  onReset: () => void;
}

const ResultScreen = ({ clips, onReset }: ResultScreenProps) => {
  return (
    <div className="animate-step-in space-y-5 px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-foreground">생성 결과</h2>
        <p className="text-sm text-muted-foreground">
          AI가 생성한 클립 {clips.length}개
        </p>
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

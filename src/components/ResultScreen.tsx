import { useState } from "react";
import { Play, Edit3, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Clip {
  id: number;
  startTime: string;
  endTime: string;
  mainWording: string;
  subWording: string;
}

interface ResultScreenProps {
  onNext: (clips: Clip[]) => void;
}

const initialClips: Clip[] = [
  { id: 1, startTime: "0:32", endTime: "1:02", mainWording: "이 순간이 영원하길", subWording: "감성 터지는 하이라이트" },
  { id: 2, startTime: "1:15", endTime: "1:45", mainWording: "너를 위한 노래", subWording: "귀호강 보장 구간" },
  { id: 3, startTime: "2:08", endTime: "2:38", mainWording: "심장이 뛴다", subWording: "소름 돋는 고음 파트" },
  { id: 4, startTime: "2:55", endTime: "3:25", mainWording: "잊을 수 없는 멜로디", subWording: "중독성 200% 구간" },
  { id: 5, startTime: "3:40", endTime: "4:10", mainWording: "다시 한번 더", subWording: "반복 재생 각" },
];

const ResultScreen = ({ onNext }: ResultScreenProps) => {
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editField, setEditField] = useState<"main" | "sub" | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (clip: Clip, field: "main" | "sub") => {
    setEditingId(clip.id);
    setEditField(field);
    setEditValue(field === "main" ? clip.mainWording : clip.subWording);
  };

  const saveEdit = () => {
    if (editingId === null || !editField) return;
    setClips((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? { ...c, [editField === "main" ? "mainWording" : "subWording"]: editValue }
          : c
      )
    );
    setEditingId(null);
    setEditField(null);
  };

  return (
    <div className="animate-step-in space-y-5 px-4 py-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">분석 결과</h2>
        <p className="text-sm text-muted-foreground">하이라이트 클립 {clips.length}개가 생성되었습니다</p>
      </div>

      <div className="space-y-3">
        {clips.map((clip, i) => (
          <div key={clip.id} className="bg-surface rounded-xl p-4 space-y-3">
            {/* Clip header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                </div>
                <span className="text-sm font-medium">클립 {i + 1}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-2.5 py-1 rounded-full">
                <Play className="w-3 h-3" />
                {clip.startTime} - {clip.endTime}
              </div>
            </div>

            {/* Thumbnail placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent rounded-lg flex items-center justify-center">
              <Play className="w-10 h-10 text-primary/40" />
            </div>

            {/* Wordings */}
            <div className="space-y-2">
              {/* Main wording */}
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">메인 워딩</p>
                  {editingId === clip.id && editField === "main" ? (
                    <div className="flex gap-1.5">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" onClick={saveEdit} className="h-8 w-8 p-0">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-base font-bold leading-tight">{clip.mainWording}</p>
                  )}
                </div>
                {editingId !== clip.id || editField !== "main" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(clip, "main")}
                    className="h-7 w-7 p-0 text-muted-foreground mt-3"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                ) : null}
              </div>

              {/* Sub wording */}
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">서브 워딩</p>
                  {editingId === clip.id && editField === "sub" ? (
                    <div className="flex gap-1.5">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" onClick={saveEdit} className="h-8 w-8 p-0">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{clip.subWording}</p>
                  )}
                </div>
                {editingId !== clip.id || editField !== "sub" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(clip, "sub")}
                    className="h-7 w-7 p-0 text-muted-foreground mt-3"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={() => onNext(clips)} className="w-full h-12 text-base font-semibold rounded-xl gap-2">
        다음 단계
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ResultScreen;

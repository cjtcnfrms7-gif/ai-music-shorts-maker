import { useState } from "react";
import { Play, Edit3, Check, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Clip {
  id: number;
  startTime: string;
  endTime: string;
  reason: string;
}

interface ResultScreenProps {
  onNext: (clips: Clip[]) => void;
}

const initialClips: Clip[] = [
  { id: 1, startTime: "0:32", endTime: "1:02", reason: "보컬 하이라이트 구간 – 감성적 고음이 집중되는 파트" },
  { id: 2, startTime: "1:15", endTime: "1:45", reason: "후렴구 시작 – 멜로디 반복으로 중독성이 높은 구간" },
  { id: 3, startTime: "2:08", endTime: "2:38", reason: "브릿지 파트 – 곡의 전환점으로 임팩트가 강한 구간" },
  { id: 4, startTime: "2:55", endTime: "3:25", reason: "2절 후렴 – 악기 편성이 풍성해지는 클라이맥스" },
  { id: 5, startTime: "3:40", endTime: "4:10", reason: "아웃트로 – 여운이 남는 마무리 구간" },
];

const ResultScreen = ({ onNext }: ResultScreenProps) => {
  const [clips] = useState<Clip[]>(initialClips);
  const [mainWording, setMainWording] = useState("이 순간이 영원하길");
  const [subWording, setSubWording] = useState("감성 터지는 하이라이트 모음");
  const [editingMain, setEditingMain] = useState(false);
  const [editingSub, setEditingSub] = useState(false);
  const [tempValue, setTempValue] = useState("");

  const startEditMain = () => {
    setTempValue(mainWording);
    setEditingMain(true);
  };
  const startEditSub = () => {
    setTempValue(subWording);
    setEditingSub(true);
  };
  const saveMain = () => {
    setMainWording(tempValue);
    setEditingMain(false);
  };
  const saveSub = () => {
    setSubWording(tempValue);
    setEditingSub(false);
  };

  return (
    <div className="animate-step-in space-y-5 px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">분석 결과</h2>
        <p className="text-sm text-muted-foreground">AI가 생성한 워딩과 하이라이트 클립을 확인하세요</p>
      </div>

      {/* Wordings Section */}
      <div className="bg-surface rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">생성된 워딩</h3>

        {/* Main Wording */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">메인 워딩</span>
            {!editingMain && (
              <Button size="sm" variant="ghost" onClick={startEditMain} className="h-6 px-2 text-xs gap-1 text-muted-foreground">
                <Edit3 className="w-3 h-3" /> 수정
              </Button>
            )}
          </div>
          {editingMain ? (
            <div className="flex gap-2 items-center">
              <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="h-10 text-lg font-bold" autoFocus />
              <Button size="sm" onClick={saveMain} className="h-10 w-10 p-0 flex-shrink-0"><Check className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingMain(false)} className="h-10 w-10 p-0 flex-shrink-0"><X className="w-4 h-4" /></Button>
            </div>
          ) : (
            <p className="text-2xl font-bold leading-tight">{mainWording}</p>
          )}
        </div>

        {/* Sub Wording */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">서브 워딩</span>
            {!editingSub && (
              <Button size="sm" variant="ghost" onClick={startEditSub} className="h-6 px-2 text-xs gap-1 text-muted-foreground">
                <Edit3 className="w-3 h-3" /> 수정
              </Button>
            )}
          </div>
          {editingSub ? (
            <div className="flex gap-2 items-center">
              <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="h-9 text-sm" autoFocus />
              <Button size="sm" onClick={saveSub} className="h-9 w-9 p-0 flex-shrink-0"><Check className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingSub(false)} className="h-9 w-9 p-0 flex-shrink-0"><X className="w-4 h-4" /></Button>
            </div>
          ) : (
            <p className="text-base text-muted-foreground">{subWording}</p>
          )}
        </div>
      </div>

      {/* Clips */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold">하이라이트 클립 ({clips.length}개)</h3>
        {clips.map((clip, i) => (
          <div key={clip.id} className="bg-surface rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                </div>
                <span className="text-sm font-semibold">클립 {i + 1}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full font-medium">
                <Play className="w-3 h-3" />
                {clip.startTime} ~ {clip.endTime}
              </div>
            </div>

            {/* Thumbnail placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent to-primary/5 rounded-lg flex items-center justify-center">
              <Play className="w-10 h-10 text-primary/30" />
            </div>

            {/* AI Reason */}
            <div className="bg-accent/50 rounded-lg px-3 py-2.5">
              <p className="text-[11px] font-semibold text-accent-foreground/70 mb-0.5">AI 선택 이유</p>
              <p className="text-xs text-foreground/80 leading-relaxed">{clip.reason}</p>
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

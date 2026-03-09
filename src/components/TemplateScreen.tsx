import { useState } from "react";
import { Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateScreenProps {
  clipCount: number;
  onDownload: (selections: Record<number, number>) => void;
}

const templates = [
  {
    id: 0,
    name: "템플릿 0",
    desc: "상단 텍스트 + 하단 세로 영상",
    preview: (
      <div className="w-full h-full flex flex-col bg-foreground/5 rounded-md overflow-hidden">
        <div className="h-[25%] flex items-center justify-center bg-primary/15 px-1">
          <div className="w-[60%] h-1.5 rounded bg-primary/40" />
        </div>
        <div className="flex-1 bg-primary/8 m-1 rounded" />
      </div>
    ),
  },
  {
    id: 1,
    name: "템플릿 1",
    desc: "상단 텍스트 + 16:9 영상 + 하단 곡정보",
    preview: (
      <div className="w-full h-full flex flex-col bg-foreground/5 rounded-md overflow-hidden">
        <div className="h-[20%] flex items-center justify-center bg-primary/15 px-1">
          <div className="w-[50%] h-1.5 rounded bg-primary/40" />
        </div>
        <div className="h-[45%] bg-primary/8 mx-1 rounded" />
        <div className="flex-1 flex items-center justify-center px-1">
          <div className="w-[70%] h-1 rounded bg-muted-foreground/20" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    name: "템플릿 2",
    desc: "풀스크린 + 좌상단 텍스트",
    preview: (
      <div className="w-full h-full bg-primary/8 rounded-md overflow-hidden relative">
        <div className="absolute top-2 left-2 space-y-1">
          <div className="w-8 h-1 rounded bg-primary/50" />
          <div className="w-5 h-0.5 rounded bg-primary/30" />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: "템플릿 3",
    desc: "상단 텍스트 + 큰 영상 + 하단 곡정보",
    preview: (
      <div className="w-full h-full flex flex-col bg-foreground/5 rounded-md overflow-hidden">
        <div className="h-[15%] flex items-center justify-center bg-primary/15 px-1">
          <div className="w-[55%] h-1.5 rounded bg-primary/40" />
        </div>
        <div className="flex-1 bg-primary/8 mx-1 rounded" />
        <div className="h-[12%] flex items-center justify-center">
          <div className="w-[60%] h-1 rounded bg-muted-foreground/20" />
        </div>
      </div>
    ),
  },
  {
    id: 4,
    name: "템플릿 4",
    desc: "풀스크린 + 상단 중앙 텍스트",
    preview: (
      <div className="w-full h-full bg-primary/8 rounded-md overflow-hidden relative">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 space-y-1 flex flex-col items-center">
          <div className="w-8 h-1 rounded bg-primary/50" />
          <div className="w-5 h-0.5 rounded bg-primary/30" />
        </div>
      </div>
    ),
  },
];

const TemplateScreen = ({ clipCount, onDownload }: TemplateScreenProps) => {
  const [selections, setSelections] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    for (let i = 0; i < clipCount; i++) init[i] = 0;
    return init;
  });
  const [activeClip, setActiveClip] = useState(0);

  return (
    <div className="animate-step-in space-y-5 px-4 py-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">템플릿 선택</h2>
        <p className="text-sm text-muted-foreground">각 클립에 적용할 템플릿을 선택하세요</p>
      </div>

      {/* Clip tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {Array.from({ length: clipCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveClip(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeClip === i
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:bg-accent"
            }`}
          >
            클립 {i + 1}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-3">
        {templates.map((tmpl) => {
          const isSelected = selections[activeClip] === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => setSelections((s) => ({ ...s, [activeClip]: tmpl.id }))}
              className={`relative rounded-xl p-3 text-left transition-all border-2 ${
                isSelected
                  ? "border-primary bg-accent"
                  : "border-transparent bg-surface hover:border-border"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="aspect-[9/16] mb-2">{tmpl.preview}</div>
              <p className="text-xs font-semibold">{tmpl.name}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{tmpl.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold">선택 요약</p>
        <div className="space-y-1">
          {Array.from({ length: clipCount }).map((_, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">클립 {i + 1}</span>
              <span className="font-medium">템플릿 {selections[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onDownload(selections)}
        className="w-full h-12 text-base font-semibold rounded-xl gap-2"
      >
        <Download className="w-4 h-4" />
        최종 다운로드
      </Button>
    </div>
  );
};

export default TemplateScreen;

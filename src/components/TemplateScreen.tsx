import { useState } from "react";
import { Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateScreenProps {
  clipCount: number;
  onDownload: (templateId: number) => void;
}

const templates = [
  {
    id: 0,
    name: "템플릿 0",
    desc: "상단 텍스트 + 하단 세로 영상",
    preview: (
      <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-border">
        <div className="h-[28%] flex items-center justify-center bg-primary/12">
          <div className="space-y-1 flex flex-col items-center">
            <div className="w-12 h-1.5 rounded bg-primary/50" />
            <div className="w-8 h-1 rounded bg-primary/30" />
          </div>
        </div>
        <div className="flex-1 bg-primary/6 m-1.5 rounded" />
      </div>
    ),
  },
  {
    id: 1,
    name: "템플릿 1",
    desc: "상단 텍스트 + 중간 16:9 영상 + 하단 곡정보",
    preview: (
      <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-border">
        <div className="h-[22%] flex items-center justify-center bg-primary/12">
          <div className="w-10 h-1.5 rounded bg-primary/50" />
        </div>
        <div className="h-[40%] bg-primary/6 mx-1.5 rounded" />
        <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2">
          <div className="w-14 h-1 rounded bg-muted-foreground/20" />
          <div className="w-10 h-0.5 rounded bg-muted-foreground/15" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    name: "템플릿 2",
    desc: "풀스크린 + 좌상단 텍스트",
    preview: (
      <div className="w-full h-full bg-primary/6 rounded-lg overflow-hidden relative border border-border">
        <div className="absolute top-3 left-3 space-y-1">
          <div className="w-10 h-1.5 rounded bg-primary/50" />
          <div className="w-7 h-1 rounded bg-primary/30" />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: "템플릿 3",
    desc: "상단 텍스트 + 큰 영상 + 하단 곡정보",
    preview: (
      <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-border">
        <div className="h-[18%] flex items-center justify-center bg-primary/12">
          <div className="w-12 h-1.5 rounded bg-primary/50" />
        </div>
        <div className="flex-1 bg-primary/6 mx-1.5 rounded" />
        <div className="h-[14%] flex items-center justify-center">
          <div className="w-12 h-1 rounded bg-muted-foreground/20" />
        </div>
      </div>
    ),
  },
  {
    id: 4,
    name: "템플릿 4",
    desc: "풀스크린 + 상단 중앙 텍스트",
    preview: (
      <div className="w-full h-full bg-primary/6 rounded-lg overflow-hidden relative border border-border">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 space-y-1 flex flex-col items-center">
          <div className="w-10 h-1.5 rounded bg-primary/50" />
          <div className="w-7 h-1 rounded bg-primary/30" />
        </div>
      </div>
    ),
  },
];

const TemplateScreen = ({ clipCount, onDownload }: TemplateScreenProps) => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className="animate-step-in space-y-5 px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white">어떤 템플릿으로 만들까요?</h2>
        <p className="text-sm text-muted-foreground">쇼츠에 적용할 레이아웃을 선택하세요</p>
      </div>

      {/* Template list */}
      <div className="space-y-3">
        {templates.map((tmpl) => {
          const isSelected = selected === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => setSelected(tmpl.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all border-2 ${
                isSelected
                  ? "border-primary bg-accent"
                  : "border-transparent bg-card hover:border-border"
              }`}
            >
              {/* Preview */}
              <div className="w-16 h-28 flex-shrink-0">
                {tmpl.preview}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{tmpl.name}</p>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tmpl.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Download */}
      <Button
        onClick={() => onDownload(selected)}
        className="w-full h-12 text-base font-semibold rounded-xl gap-2"
      >
        <Download className="w-4 h-4" />
        최종 다운로드
      </Button>
    </div>
  );
};

export default TemplateScreen;

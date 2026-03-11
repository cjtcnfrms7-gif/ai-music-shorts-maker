import { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateScreenProps {
  onSelect: (templateIndex: number) => void;
  previewImages: string[];
}

const templates = [
  { id: 0, name: "템플릿 1", desc: "흰 배경 / 상단 텍스트 / 영상 하단 전체" },
  { id: 1, name: "템플릿 2", desc: "흰 배경 / 상단 텍스트 / 16:9 영상 중앙 / 하단 곡정보" },
  { id: 2, name: "템플릿 3", desc: "회색 풀배경 / 좌측 상단 텍스트 / 영상=배경" },
  { id: 3, name: "템플릿 4", desc: "흰 배경 / 상단 텍스트 / 큰 영상 중앙 / 하단 곡정보" },
  { id: 4, name: "템플릿 5", desc: "회색 풀배경 / 상단 중앙 텍스트 / 영상=배경" },
];

const TemplateScreen = ({ onSelect, previewImages }: TemplateScreenProps) => {
  const [selected, setSelected] = useState<number>(0);
  const loading = previewImages.length === 0;

  return (
    <div className="animate-step-in space-y-5 px-4 py-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-foreground">어떤 템플릿으로 만들까요?</h2>
        <p className="text-sm text-muted-foreground">쇼츠에 적용할 레이아웃을 선택하세요</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {templates.map((tmpl) => {
          const isSelected = selected === tmpl.id;
          const imgSrc = previewImages[tmpl.id];
          return (
            <button
              key={tmpl.id}
              onClick={() => setSelected(tmpl.id)}
              className={`relative flex flex-col rounded-xl overflow-hidden transition-all border-2 ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-transparent hover:border-border"
              }`}
            >
              <div className="aspect-[9/16] w-full overflow-hidden bg-muted flex items-center justify-center">
                {loading ? (
                  <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                ) : (
                  <img
                    src={imgSrc}
                    alt={tmpl.name}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#333' }}
                    onError={(e) => console.error('Image load failed:', imgSrc, e)}
                  />
                )}
              </div>
              <div className="p-2 bg-card text-center">
                <p className="text-xs font-semibold text-foreground">{tmpl.name}</p>
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Button
        onClick={() => onSelect(selected)}
        disabled={loading}
        className="w-full h-12 text-base font-semibold rounded-xl gap-2"
      >
        <ArrowRight className="w-4 h-4" />
        분석 시작
      </Button>
    </div>
  );
};

export default TemplateScreen;

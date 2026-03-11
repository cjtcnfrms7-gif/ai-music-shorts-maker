import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiEndpoints } from "@/config/api";

const STYLES = [
  { label: "감성적", value: "emotional" },
  { label: "충격적", value: "shocking" },
  { label: "유머러스", value: "humorous" },
  { label: "공감형", value: "empathy" },
];

interface Wording {
  main: string;
  sub: string;
}

interface AIWordingPanelProps {
  filePath: string;
  onSelect: (main: string, sub: string) => void;
}

const AIWordingPanel = ({ filePath, onSelect }: AIWordingPanelProps) => {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState("emotional");
  const [wordings, setWordings] = useState<Wording[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const url = `${apiEndpoints.generateWordings(filePath)}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}${style ? `&style=${encodeURIComponent(style)}` : ""}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("워딩 생성 실패");
      const data = await res.json();
      setWordings(data.wordings || []);
      if ((data.wordings || []).length === 0) {
        toast.info("생성된 워딩이 없습니다");
      }
    } catch (err: any) {
      toast.error(err.message || "워딩 생성 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">AI 워딩 재생성</h4>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">키워드</Label>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 이별, 그리움, 설렘"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">스타일</Label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                style === s.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        variant="secondary"
        className="gap-2 w-full"
        size="sm"
      >
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        재생성
      </Button>

      {wordings.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {wordings.map((w, i) => (
            <button
              key={i}
              onClick={() => onSelect(w.main, w.sub)}
              className="w-full text-left p-3 rounded-md border border-border bg-background hover:border-primary/50 hover:bg-accent/50 transition-colors"
            >
              <p className="text-sm font-medium text-foreground leading-snug">{w.main}</p>
              <p className="text-xs text-muted-foreground mt-1">{w.sub}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIWordingPanel;

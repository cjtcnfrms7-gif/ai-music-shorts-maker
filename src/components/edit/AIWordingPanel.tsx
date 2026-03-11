import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiEndpoints } from "@/config/api";

interface Wording {
  main: string;
  sub: string;
}

interface AIWordingPanelProps {
  filePath: string;
  onSelect: (main: string, sub: string) => void;
}

const AIWordingPanel = ({ filePath, onSelect }: AIWordingPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [wordings, setWordings] = useState<Wording[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const url = `${apiEndpoints.generateWordings(filePath)}${prompt ? `&prompt=${encodeURIComponent(prompt)}` : ""}`;
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

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="예: 임팩트 강하고 직설적으로 다시 써줘"
        className="min-h-[60px] resize-none"
      />

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

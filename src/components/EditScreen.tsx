import { useState } from "react";
import { ArrowLeft, Download, RefreshCw, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL, apiEndpoints } from "@/config/api";

const FONT_COLORS = [
  { label: "흰색", value: "white", tw: "bg-white border border-border" },
  { label: "검정", value: "black", tw: "bg-black" },
  { label: "노랑", value: "yellow", tw: "bg-yellow-400" },
  { label: "빨강", value: "red", tw: "bg-red-500" },
];

const BG_COLORS = [
  { label: "흰색", value: "white", tw: "bg-white border border-border" },
  { label: "검정", value: "black", tw: "bg-black" },
  { label: "회색", value: "gray", tw: "bg-gray-400" },
  { label: "베이지", value: "beige", tw: "bg-amber-100" },
];

interface EditScreenProps {
  videoPath: string;
  initialMainText?: string;
  initialSubText?: string;
  uploadData: {
    filePath: string;
    title: string;
    artist: string;
    releaseDate: string;
  };
  onBack: () => void;
  onBackToWordings: () => void;
  onVideoUpdated: (newPath: string) => void;
}

const EditScreen = ({
  videoPath,
  initialMainText = "",
  initialSubText = "",
  uploadData,
  onBack,
  onBackToWordings,
  onVideoUpdated,
}: EditScreenProps) => {
  const [mainText, setMainText] = useState(initialMainText);
  const [subText, setSubText] = useState(initialSubText);
  const [fontColor, setFontColor] = useState("white");
  const [bgColor, setBgColor] = useState("black");
  const [currentVideoPath, setCurrentVideoPath] = useState(videoPath);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const videoUrl = `${API_BASE_URL}${currentVideoPath}`;

  const handleDownload = async () => {
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentVideoPath.split("/").pop() || "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(videoUrl, "_blank");
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch(
        apiEndpoints.processLocal({
          filePath: uploadData.filePath,
          title: uploadData.title,
          artist: uploadData.artist,
          releaseDate: uploadData.releaseDate,
          templateIndex: 0,
          mainText,
          subText,
          fontColor,
          bgColor,
        }),
        { method: "POST" }
      );
      if (!res.ok) throw new Error("처리 실패");
      const data = await res.json();
      const clips = data.clips || data.results || [];
      const newPath = clips[0]?.file_path || data.file_path || data.filePath || currentVideoPath;
      setCurrentVideoPath(newPath);
      onVideoUpdated(newPath);
      toast.success("영상이 재생성되었습니다");
    } catch (err: any) {
      toast.error(err.message || "재생성 중 오류가 발생했습니다");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-8 px-4 animate-step-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
        <Button variant="outline" onClick={onBackToWordings} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          워딩 다시 선택
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Preview */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="w-full max-w-sm aspect-[9/16] rounded-lg overflow-hidden border border-border bg-muted">
            {isRegenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">영상 재생성 중...</p>
              </div>
            ) : (
              <video
                key={currentVideoPath}
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <Button onClick={handleDownload} disabled={isRegenerating} className="gap-2 w-full max-w-sm">
            <Download className="w-4 h-4" />
            다운로드
          </Button>
        </div>

        {/* Edit Panel */}
        <div className="flex-1 space-y-5 rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">텍스트 편집</h3>

          <div className="space-y-2">
            <Label htmlFor="mainText" className="text-xs text-muted-foreground">메인 텍스트</Label>
            <Input
              id="mainText"
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="메인 텍스트 입력"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subText" className="text-xs text-muted-foreground">서브 텍스트</Label>
            <Input
              id="subText"
              value={subText}
              onChange={(e) => setSubText(e.target.value)}
              placeholder="서브 텍스트 입력"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">폰트 색상</Label>
            <div className="flex gap-2">
              {FONT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setFontColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.tw} transition-all ${
                    fontColor === c.value
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "hover:scale-110"
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">배경색</Label>
            <div className="flex gap-2">
              {BG_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setBgColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.tw} transition-all ${
                    bgColor === c.value
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "hover:scale-110"
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="gap-2 w-full"
          >
            {isRegenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            영상 재생성
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditScreen;

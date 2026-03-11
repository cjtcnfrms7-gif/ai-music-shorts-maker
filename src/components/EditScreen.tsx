import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/api";

interface EditScreenProps {
  videoPath: string;
  onBack: () => void;
}

const EditScreen = ({ videoPath, onBack }: EditScreenProps) => {
  const videoUrl = `${API_BASE_URL}${videoPath}`;

  const handleDownload = async () => {
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = videoPath.split("/").pop() || "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(videoUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 animate-step-in">
      <div className="w-full flex justify-start">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
      </div>

      <div className="w-full max-w-md aspect-[9/16] rounded-lg overflow-hidden border border-border bg-muted">
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
      </div>

      <Button onClick={handleDownload} className="gap-2 w-full max-w-md">
        <Download className="w-4 h-4" />
        다운로드
      </Button>
    </div>
  );
};

export default EditScreen;

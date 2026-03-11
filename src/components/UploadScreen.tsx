import { useState, useCallback } from "react";
import { Upload, Music, Calendar, User, ArrowRight, Loader2, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UploadScreenProps {
  onReady: (data: { filePath: string; title: string; artist: string; releaseDate: string }) => void;
}

const UploadScreen = ({ onReady }: UploadScreenProps) => {
  const [filePath, setFilePath] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("업로드 실패");
      const data = await res.json();
      setFilePath(data.file_path || data.path || "");
      setFileName(file.name);
      toast.success("파일 업로드 완료");
    } catch (err: any) {
      toast.error(err.message || "업로드 중 오류가 발생했습니다");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleNext = () => {
    onReady({ filePath, title, artist, releaseDate });
  };

  const isValid = filePath && title && artist;

  return (
    <div className="animate-step-in space-y-6 px-4 py-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-2">
          <Music className="w-7 h-7 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI 쇼츠 자동 제작</h1>
        <p className="text-sm text-muted-foreground">영상을 업로드하면 AI가 자동으로 쇼츠를 생성합니다</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging ? "border-primary bg-accent" : "border-border bg-input hover:border-primary/40"}
          ${fileName ? "border-primary/50 bg-primary/5" : ""}
        `}
      >
        <input
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        {uploading ? (
          <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
        ) : (
          <Upload className={`w-8 h-8 mx-auto mb-2 ${fileName ? "text-primary" : "text-muted-foreground"}`} />
        )}
        {fileName ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground">업로드 완료</p>
          </div>
        ) : uploading ? (
          <p className="text-sm font-medium text-foreground">업로드 중...</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, MP3, WAV 지원</p>
          </>
        )}
      </div>

      {filePath && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5 text-foreground">
            <FileVideo className="w-4 h-4 text-muted-foreground" />
            파일 경로
          </label>
          <Input
            value={filePath}
            readOnly
            className="h-11 bg-input border-border text-foreground opacity-70 cursor-default"
          />
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">곡 정보</h3>
        <div className="space-y-2.5">
          <div className="relative">
            <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="곡 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={uploading}
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="아티스트명"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={uploading}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="발매일 (YYYY.MM.DD)"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={uploading}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={!isValid || uploading}
        className="w-full h-12 text-base font-semibold rounded-xl gap-2"
      >
        <ArrowRight className="w-4 h-4" />
        다음: 템플릿 선택
      </Button>
    </div>
  );
};

export default UploadScreen;

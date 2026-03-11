import { useState, useCallback } from "react";
import { Upload, Music, Calendar, User, Play, Loader2, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const API_BASE = "";

interface Clip {
  id: number;
  start_time: string;
  end_time: string;
  reason: string;
  file_path?: string;
}

interface UploadScreenProps {
  onSubmit: (data: { clips: Clip[] }) => void;
  onProcessing?: () => void;
}

const UploadScreen = ({ onSubmit, onProcessing }: UploadScreenProps) => {
  const [filePath, setFilePath] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
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

  const handleSubmit = async () => {
    setProcessing(true);
    onProcessing?.();
    try {
      const res = await fetch(
        `/process-local?file_path=${encodeURIComponent(filePath)}&song_title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&release_date=${encodeURIComponent(releaseDate)}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("처리 실패");
      const data = await res.json();
      const clips: Clip[] = (data.clips || data.results || []).map((c: any, i: number) => ({
        id: c.id || i + 1,
        start_time: c.start_time || c.startTime || "0:00",
        end_time: c.end_time || c.endTime || "0:30",
        reason: c.reason || c.description || "",
        file_path: c.file_path || c.filePath || "",
      }));
      toast.success(`${clips.length}개 클립 생성 완료`);
      onSubmit({ clips });
    } catch (err: any) {
      toast.error(err.message || "처리 중 오류가 발생했습니다");
    } finally {
      setProcessing(false);
    }
  };

  const isValid = filePath && title && artist;
  const isLoading = uploading || processing;

  return (
    <div className="animate-step-in space-y-6 px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-2">
          <Music className="w-7 h-7 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI 쇼츠 자동 제작</h1>
        <p className="text-sm text-muted-foreground">영상을 업로드하면 AI가 자동으로 쇼츠를 생성합니다</p>
      </div>

      {/* File Upload */}
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
          disabled={isLoading}
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

      {/* File Path (auto-filled) */}
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

      {/* Song Info */}
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
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="아티스트명"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="발매일 (YYYY.MM.DD)"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full h-12 text-base font-semibold rounded-xl gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            처리 중...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            분석 시작
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadScreen;

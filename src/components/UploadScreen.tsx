import { useState, useCallback } from "react";
import { Upload, Link, Music, Calendar, User, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadScreenProps {
  onSubmit: (data: {
    url?: string;
    title: string;
    artist: string;
    releaseDate: string;
  }) => void;
}

const UploadScreen = ({ onSubmit }: UploadScreenProps) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

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
    if (file) setFileName(file.name);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = () => {
    onSubmit({ url: url || undefined, title, artist, releaseDate });
  };

  const isValid = (url || fileName) && title && artist;

  return (
    <div className="animate-step-in space-y-6 px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-2">
          <Music className="w-7 h-7 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AI 쇼츠 자동 제작</h1>
        <p className="text-sm text-muted-foreground">유튜브 영상을 분석하여 쇼츠를 자동으로 만들어 드립니다</p>
      </div>

      {/* YouTube URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1.5">
          <Link className="w-4 h-4 text-muted-foreground" />
          유튜브 URL
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 h-11 bg-surface border-border"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">또는</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* File Upload */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging ? "border-primary bg-accent" : "border-border bg-surface hover:border-primary/40"}
          ${fileName ? "border-success bg-success/5" : ""}
        `}
      >
        <input
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className={`w-8 h-8 mx-auto mb-2 ${fileName ? "text-success" : "text-muted-foreground"}`} />
        {fileName ? (
          <p className="text-sm font-medium">{fileName}</p>
        ) : (
          <>
            <p className="text-sm font-medium">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, MP3, WAV 지원</p>
          </>
        )}
      </div>

      {/* Song Info */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">곡 정보</h3>
        <div className="space-y-2.5">
          <div className="relative">
            <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="곡 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10 h-11 bg-surface"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="아티스트명"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="pl-10 h-11 bg-surface"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="발매일 (YYYY.MM.DD)"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="pl-10 h-11 bg-surface"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full h-12 text-base font-semibold rounded-xl gap-2"
      >
        <Play className="w-4 h-4" />
        분석 시작
      </Button>
    </div>
  );
};

export default UploadScreen;

// API configuration
export const API_BASE_URL = "http://localhost:8000";

export const apiEndpoints = {
  upload: `${API_BASE_URL}/upload`,
  generateWordings: (filePath: string) =>
    `${API_BASE_URL}/generate-wordings?file_path=${encodeURIComponent(filePath)}`,
  previewTemplates: (data: { filePath: string; title: string; artist: string }) =>
    `${API_BASE_URL}/preview-templates?file_path=${encodeURIComponent(data.filePath)}&song_title=${encodeURIComponent(data.title)}&artist=${encodeURIComponent(data.artist)}`,
  processLocal: (params: {
    filePath: string;
    title: string;
    artist: string;
    releaseDate: string;
    templateIndex?: number;
    mainText?: string;
    subText?: string;
    fontColor?: string;
    bgColor?: string;
  }) => {
    let url = `${API_BASE_URL}/process-local?file_path=${encodeURIComponent(params.filePath)}&song_title=${encodeURIComponent(params.title)}&artist=${encodeURIComponent(params.artist)}&release_date=${encodeURIComponent(params.releaseDate)}&skip_whisper=true`;
    if (params.templateIndex !== undefined) {
      url += `&template_index=${params.templateIndex}`;
    }
    if (params.mainText !== undefined) {
      url += `&main_text=${encodeURIComponent(params.mainText)}`;
      url += `&sub_text=${encodeURIComponent(params.subText || "")}`;
    }
    if (params.fontColor) {
      url += `&font_color=${encodeURIComponent(params.fontColor)}`;
    }
    if (params.bgColor) {
      url += `&bg_color=${encodeURIComponent(params.bgColor)}`;
    }
    return url;
  },
};

export type ContentMode = 
    | "📰 Tin ngắn"
    | "🧾 Bài phân tích"
    | "🎬 Kịch bản phóng sự truyền hình"
    | "🎙️ Bản tin phát thanh"
    | "📜 Tạp chí chuyên đề"
    | "🎥 Phóng sự ngắn"
    | "🎞️ Phóng sự"
    | "🔍 Viết Phản ánh";

export type ContentTone = 
    | "Trang trọng - Báo chính luận"
    | "Tự nhiên - Báo mạng điện tử"
    | "Truyền cảm - Phát thanh/TV"
    | "Phóng sự - Sinh động, đời thường";

export interface GenerationOptions {
    mode: ContentMode;
    tone: ContentTone;
    length: number;
}

// Types for Audio Tool
export type VoiceName = 'Puck' | 'Kore' | 'Charon' | 'Fenrir' | 'Zephyr' | 'Aoede';
export type VoiceStyle = 
    | 'news' 
    | 'broadcast_news'
    | 'documentary' 
    | 'investigative' 
    | 'commentary' 
    | 'neutral';
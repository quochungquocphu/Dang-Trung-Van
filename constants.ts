import { type ContentMode, type ContentTone, type VoiceStyle, type VoiceName } from './types';

export const MODES: ContentMode[] = [
    "📰 Tin ngắn",
    "🧾 Bài phân tích",
    "🎬 Kịch bản phóng sự truyền hình",
    "🎙️ Bản tin phát thanh",
    "📜 Tạp chí chuyên đề",
    "🎥 Phóng sự ngắn",
    "🎞️ Phóng sự",
    "🔍 Viết Phản ánh"
];

export const TONES: ContentTone[] = [
    "Trang trọng - Báo chính luận",
    "Tự nhiên - Báo mạng điện tử",
    "Truyền cảm - Phát thanh/TV",
    "Phóng sự - Sinh động, đời thường"
];


// Constants for Audio Tool
export const PREBUILT_VOICES: { value: VoiceName; label: string }[] = [
    { value: 'Kore', label: 'Nữ - Giọng Miền Bắc (Chuẩn)' },
    { value: 'Aoede', label: 'Nữ - Miền Bắc (Trẻ trung, năng động)' },
    { value: 'Zephyr', label: 'Nữ - Giọng Miền Nam (Nhẹ nhàng)' },
    { value: 'Puck', label: 'Nam - Giọng Miền Nam (Trầm ấm)' },
    { value: 'Charon', label: 'Nam - Giọng Miền Bắc (Trẻ trung)' },
    { value: 'Fenrir', label: 'Nam - Giọng Trung niên (Mạnh mẽ)' },
];

export const VOICE_STYLES: { value: VoiceStyle; label: string }[] = [
    { value: 'news', label: 'Tin tức (Chuẩn, phát thanh)' },
    { value: 'broadcast_news', label: 'Tin tức thanh thoát (Truyền hình)' },
    { value: 'documentary', label: 'Phóng sự (Kể chuyện, truyền cảm)' },
    { value: 'investigative', label: 'Phóng sự điều tra (Nhấn nhá, nghiêm túc)' },
    { value: 'commentary', label: 'Thời sự chính luận (Hùng hồn, dứt khoát)' },
    { value: 'neutral', label: 'Trung tính (Đọc sách, trợ lý ảo)' },
];

export const VOICE_STYLE_INSTRUCTIONS: Record<VoiceStyle, string> = {
    news: 'Hãy đọc nội dung sau với giọng đọc chuẩn của một phát thanh viên tin tức',
    broadcast_news: 'Hãy đọc bản tin sau với giọng điệu thanh thoát, truyền cảm và lôi cuốn của một phát thanh viên truyền hình chuyên nghiệp',
    documentary: 'Hãy kể lại câu chuyện sau với giọng kể truyền cảm, sâu lắng của một bộ phim tài liệu',
    investigative: 'Hãy đọc bài viết sau với giọng điệu nghiêm túc, nhấn nhá của một phóng sự điều tra',
    commentary: 'Hãy bình luận vấn đề sau với giọng điệu hùng hồn, dứt khoát của một bài bình luận chính luận',
    neutral: 'Hãy đọc văn bản sau với giọng đọc trung tính, rõ ràng',
};
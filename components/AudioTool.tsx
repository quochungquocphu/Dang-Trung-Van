import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData, createWavBlob, downloadBlob } from '../utils/audioUtils';
import { type VoiceName, type VoiceStyle } from '../types';
import { PREBUILT_VOICES, VOICE_STYLES } from '../constants';
import { DownloadIcon, SpeakerIcon, LoadingSpinnerIcon } from './icons';

interface AudioToolProps {
    initialText: string;
}

export const AudioTool: React.FC<AudioToolProps> = ({ initialText }) => {
    const [voiceName, setVoiceName] = useState<VoiceName>('Puck');
    const [style, setStyle] = useState<VoiceStyle>('news');
    const [lexicon, setLexicon] = useState<string>('');
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
    
    const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Reset audio player when new text is generated
    useEffect(() => {
        setAudioUrl(null);
        setGeneratedBlob(null);
    }, [initialText]);
    
    // Clear preview error when voice or style changes
    useEffect(() => {
        if (previewError) {
            setPreviewError(null);
        }
    }, [voiceName, style]);


    const handleVoicePreview = async () => {
        setIsPreviewLoading(true);
        setPreviewError(null);
        try {
            const previewText = "Đây là giọng đọc mẫu được tạo bởi trí tuệ nhân tạo.";
            const base64Audio = await generateSpeech(previewText, voiceName, style, ''); // Use current voice & style

            const previewAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                previewAudioContext,
                24000,
                1
            );
            
            const source = previewAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(previewAudioContext.destination);
            source.start();

        } catch (e) {
            console.error("Voice preview failed:", e);
            setPreviewError("Lỗi khi nghe thử.");
        } finally {
            setIsPreviewLoading(false);
        }
    };


    const handlePreview = async () => {
        if (!initialText.trim()) {
            setError('Không có nội dung văn bản để chuyển đổi.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAudioUrl(null);
        setGeneratedBlob(null);

        try {
            const base64Audio = await generateSpeech(initialText, voiceName, style, lexicon);

            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputAudioContext,
                24000,
                1
            );
            
            const wavBlob = createWavBlob(audioBuffer);
            setGeneratedBlob(wavBlob);
            
            const url = URL.createObjectURL(wavBlob);
            setAudioUrl(url);

        } catch (e) {
            console.error(e);
            setError(`Đã xảy ra lỗi khi tạo âm thanh: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadWav = () => {
        if (generatedBlob) {
            downloadBlob(generatedBlob, 'audio.wav');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-inner border border-gray-100 space-y-6">
            {/* Settings Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Tùy chọn Giọng đọc (Tiếng Việt)</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="voice-name" className="block text-sm font-medium text-gray-700 mb-1">Giọng đọc:</label>
                            <div className="flex items-center space-x-2">
                                <select 
                                    id="voice-name"
                                    value={voiceName}
                                    onChange={(e) => setVoiceName(e.target.value as VoiceName)}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
                                >
                                    {PREBUILT_VOICES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleVoicePreview}
                                    disabled={isPreviewLoading}
                                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait flex-shrink-0"
                                    aria-label="Nghe thử giọng đọc"
                                    title="Nghe thử giọng đọc"
                                >
                                    {isPreviewLoading ? (
                                        <LoadingSpinnerIcon className="h-5 w-5 text-indigo-600" />
                                    ) : (
                                        <SpeakerIcon className="h-5 w-5 text-gray-600" />
                                    )}
                                </button>
                            </div>
                             {previewError && <p className="text-xs text-red-500 mt-1">{previewError}</p>}
                        </div>
                        <div>
                            <label htmlFor="voice-style" className="block text-sm font-medium text-gray-700 mb-1">Phong cách:</label>
                            <select
                                id="voice-style"
                                value={style}
                                onChange={(e) => setStyle(e.target.value as VoiceStyle)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {VOICE_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Bổ sung phát âm tùy chỉnh</h3>
                    <label htmlFor="custom-lexicon" className="block text-sm font-medium text-gray-700 mb-1">Định nghĩa từ (Định dạng: Viết tắt=Đọc là):</label>
                    <textarea
                        id="custom-lexicon"
                        rows={5}
                        value={lexicon}
                        onChange={(e) => setLexicon(e.target.value)}
                        placeholder={"Ví dụ:\nTPHCM = Thành phố Hồ Chí Minh\nBTC = Ban tổ chức\nBộ GD&ĐT = Bộ giáo dục và đào tạo"}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                    ></textarea>
                </div>
            </div>

            {/* Preview and Download Block */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Nghe thử & Tải xuống</h3>
                <p className="text-sm text-gray-600 mb-4">Sử dụng các tùy chọn ở trên để tạo âm thanh từ bài viết đã hoàn thành.</p>
                
                <button
                    id="preview-button"
                    onClick={handlePreview}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tạo âm thanh...
                        </>
                    ) : 'Nghe thử'}
                </button>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {audioUrl && (
                     <div className="mt-4">
                        <audio ref={audioRef} id="audio-preview" controls src={audioUrl} className="w-full"></audio>
                        <div className="flex items-center space-x-4 mt-4">
                            <button 
                                id="download-wav" 
                                onClick={handleDownloadWav}
                                disabled={!generatedBlob}
                                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <DownloadIcon />
                                <span className="ml-2">Tải về .WAV (Nguyên bản)</span>
                            </button>
                            <button id="download-mp3" disabled className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 cursor-not-allowed">
                            Tải về .MP3 (Sắp ra mắt)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
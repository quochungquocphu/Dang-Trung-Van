import React from 'react';
import { downloadAsDocx, downloadAsTxt } from '../utils/fileUtils';
import { RocketIcon, DownloadIcon } from './icons';
import { AudioTool } from './AudioTool';

interface MainContentProps {
    userInput: string;
    setUserInput: (input: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    result: string;
    setResult: (result: string) => void;
    error: string | null;
    imagePreviews: string[];
}

export const MainContent: React.FC<MainContentProps> = ({
    userInput,
    setUserInput,
    onGenerate,
    isLoading,
    result,
    setResult,
    error,
    imagePreviews,
}) => {

    const handleDownloadDocx = () => {
        downloadAsDocx(result, "baiviet_ai.docx");
    };

    const handleDownloadTxt = () => {
        downloadAsTxt(result, "baiviet_ai.txt");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col flex-grow">
            <div className="flex-grow flex flex-col">
                <label htmlFor="user-input" className="block text-sm font-medium text-gray-700 mb-1">✍️ Nhập yêu cầu hoặc nội dung bài viết:</label>
                <textarea
                    id="user-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ví dụ: Viết bài 300 chữ về Hội nghị tổng kết công tác Mặt trận xã..."
                    className="w-full flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows={8}
                />
                {imagePreviews.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Ảnh đã tải lên:</p>
                        <div className="mt-2 flex flex-wrap gap-4">
                           {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`Xem trước ${index + 1}`} className="rounded-lg max-h-40 object-contain border border-gray-200" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-6">
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <RocketIcon />
                            <span className="ml-2">TẠO NỘI DUNG</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            {result && !isLoading && (
                 <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">✅ Hoàn tất! Dưới đây là bài viết:</h3>
                         <div className="flex space-x-2">
                            <button onClick={handleDownloadDocx} className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium p-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">
                                <DownloadIcon/>
                                <span className="ml-1">.docx</span>
                            </button>
                            <button onClick={handleDownloadTxt} className="flex items-center text-sm text-green-600 hover:text-green-800 font-medium p-2 rounded-md bg-green-50 hover:bg-green-100 transition-colors">
                                <DownloadIcon/>
                                <span className="ml-1">.txt</span>
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md resize-none"
                        rows={15}
                    />

                    <div className="mt-8 border-t-2 border-gray-100 pt-6">
                         <h2 className="text-2xl font-bold text-sky-600 mb-4 text-center">🎙️ Chuyển bài viết thành âm thanh</h2>
                        <AudioTool initialText={result} />
                    </div>
                </div>
            )}
        </div>
    );
};

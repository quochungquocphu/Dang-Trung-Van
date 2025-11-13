
import React, { useState, useEffect } from 'react';
import { type ContentMode, type ContentTone } from '../types';
import { MODES, TONES } from '../constants';
import { UploadIcon, GearIcon, FileTextIcon } from './icons';

interface SidebarProps {
    mode: ContentMode;
    setMode: (mode: ContentMode) => void;
    tone: ContentTone;
    setTone: (tone: ContentTone) => void;
    length: number;
    setLength: (length: number) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    uploadedFiles: File[];
}

const FileItem: React.FC<{ file: File }> = ({ file }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    const getIcon = () => {
         const extension = file.name.split('.').pop()?.toLowerCase();
         switch (extension) {
            case 'pdf':
                return <FileTextIcon className="h-full w-full text-red-500" />;
            case 'doc':
            case 'docx':
                return <FileTextIcon className="h-full w-full text-blue-500" />;
            case 'txt':
                return <FileTextIcon className="h-full w-full text-gray-500" />;
            default:
                return <FileTextIcon className="h-full w-full text-gray-400" />;
         }
    }

    return (
         <div className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
             <div className="flex-shrink-0 h-10 w-10 mr-3 flex items-center justify-center bg-white rounded-md overflow-hidden border">
                 {file.type.startsWith('image/') && previewUrl ? (
                     <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
                 ) : (
                     <div className="p-1">{getIcon()}</div>
                 )}
             </div>
             <div className="flex-1 min-w-0">
                 <p className="text-sm text-gray-800 font-medium truncate" title={file.name}>{file.name}</p>
                 <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
             </div>
         </div>
    )
}

export const Sidebar: React.FC<SidebarProps> = ({
    mode,
    setMode,
    tone,
    setTone,
    length,
    setLength,
    onFileChange,
    uploadedFiles,
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col h-full">
            <div> {/* Top settings container */}
                <h2 className="text-xl font-bold text-blue-600 border-b pb-2 flex items-center">
                    <GearIcon className="h-6 w-6 text-yellow-500 mr-2" />
                    <span>Tùy chọn công cụ</span>
                </h2>

                <div className="space-y-6 mt-6">
                    <div>
                        <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-1">Chọn loại nội dung</label>
                        <select
                            id="content-type"
                            value={mode}
                            onChange={(e) => setMode(e.target.value as ContentMode)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">Phong cách thể hiện</label>
                        <select
                            id="tone"
                            value={tone}
                            onChange={(e) => setTone(e.target.value as ContentTone)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">Độ dài (từ): <span className="font-bold text-indigo-600">{length}</span></label>
                        <input
                            id="length"
                            type="range"
                            min="100"
                            max="3000"
                            step="50"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            
            <div className="mt-6 border-t pt-6 flex flex-col flex-grow min-h-0"> {/* File upload section */}
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Tải nội dung</label>
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 border border-gray-300 p-2 flex items-center justify-center">
                    <UploadIcon />
                    <span className="ml-2">{uploadedFiles.length > 0 ? `Đã chọn ${uploadedFiles.length} file` : 'Chọn file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept=".txt,.jpg,.jpeg,.png,.doc,.docx,.pdf" multiple />
                </label>
                 <p className="text-xs text-gray-500 mt-1 flex-shrink-0">Hỗ trợ: .txt, .doc, .docx, .pdf, .jpg, .png</p>

                {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-3 flex-1 overflow-y-auto pr-2 -mr-2">
                        {uploadedFiles.map((file, index) => (
                            <FileItem key={`${file.name}-${index}`} file={file} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

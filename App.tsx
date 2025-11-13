
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { generateJournalistContent } from './services/geminiService';
import { fileToBase64, readTextFile, readDocxFile, readPdfFile } from './utils/fileUtils';
import { type ContentMode, type ContentTone } from './types';
import { MODES, TONES } from './constants';

const App: React.FC = () => {
    const [mode, setMode] = useState<ContentMode>(MODES[0]);
    const [tone, setTone] = useState<ContentTone>(TONES[0]);
    const [length, setLength] = useState<number>(300);
    const [userInput, setUserInput] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setUploadedFiles(fileArray);

            const imageFiles = fileArray.filter((f: File) => f.type.startsWith('image/'));
            
            // Reset previews
            setImagePreviews([]);
            
            // FIX: Explicitly type 'file' as File to prevent type inference issues.
            const previewPromises = imageFiles.map((file: File) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(previewPromises).then(previews => {
                setImagePreviews(previews);
            });

        } else {
            setUploadedFiles([]);
            setImagePreviews([]);
        }
    };

    const handleGenerate = async () => {
        if (!userInput && uploadedFiles.length === 0) {
            setError("⚠️ Vui lòng nhập nội dung hoặc tải file lên.");
            return;
        }

        setIsLoading(true);
        setResult('');
        setError(null);

        try {
            let fileContents: string[] = [];
            let imageBase64Parts: { mimeType: string; data: string }[] = [];
            
            for (const file of uploadedFiles) {
                const fileName = file.name.toLowerCase();
                if (file.type.startsWith('image/')) {
                    const { data, mimeType } = await fileToBase64(file);
                    imageBase64Parts.push({ data, mimeType });
                } else if (fileName.endsWith('.txt')) {
                    fileContents.push(await readTextFile(file));
                } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
                    fileContents.push(await readDocxFile(file));
                } else if (fileName.endsWith('.pdf')) {
                    fileContents.push(await readPdfFile(file));
                } else {
                     setError("Một trong các file có định dạng không được hỗ trợ. Vui lòng chỉ tải file .txt, .doc, .docx, .pdf hoặc ảnh.");
                     setIsLoading(false);
                     return;
                }
            }
            
            let finalUserInput = userInput;
            if (imageBase64Parts.length > 0 && fileContents.length === 0 && !userInput.trim()) {
                finalUserInput = "Hãy viết bài báo dựa trên nội dung của (các) hình ảnh này.";
            }

            const combinedInput = `${finalUserInput}\n\n${fileContents.join('\n\n---\n\n')}`.trim();

            const generatedText = await generateJournalistContent(
                { mode, tone, length },
                combinedInput,
                imageBase64Parts
            );

            setResult(generatedText);
        } catch (e) {
            console.error(e);
            setError(`Đã xảy ra lỗi khi tạo nội dung: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <header className="bg-sky-500 shadow-md">
                 <div className="container mx-auto text-center py-4">
                    <h1 className="text-3xl font-bold text-white">VIẾT NỘI DUNG BÁO CHÍ</h1>
                    <p className="text-md text-sky-100 mt-1">Hỗ trợ viết tin, bài, kịch bản và tạo âm thanh phóng sự hiện đại.</p>
                </div>
            </header>
            <div className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    <aside className="lg:col-span-3">
                        <Sidebar
                            mode={mode}
                            setMode={setMode}
                            tone={tone}
                            setTone={setTone}
                            length={length}
                            setLength={setLength}
                            onFileChange={handleFileChange}
                            uploadedFiles={uploadedFiles}
                        />
                    </aside>
                    <main className="lg:col-span-9 flex flex-col">
                        <MainContent
                            userInput={userInput}
                            setUserInput={setUserInput}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                            result={result}
                            setResult={setResult}
                            error={error}
                            imagePreviews={imagePreviews}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;
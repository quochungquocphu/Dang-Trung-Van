// This script assumes the 'docx' library is loaded globally via a script tag in index.html
declare const docx: any;
declare const mammoth: any;
declare const pdfjsLib: any;

/**
 * Reads a text file and returns its content as a string.
 */
export const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file, 'UTF-8');
    });
};

/**
 * Reads a .docx file and returns its content as a string.
 */
export const readDocxFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target?.result;
            if (arrayBuffer) {
                mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                    .then((result: { value: string }) => resolve(result.value))
                    .catch(reject);
            } else {
                reject(new Error("Không thể đọc file .docx."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};


/**
 * Reads a .pdf file and returns its content as a string.
 */
export const readPdfFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target?.result;
            if (!arrayBuffer) {
                return reject(new Error("Không thể đọc file .pdf."));
            }
            try {
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
                }
                resolve(fullText);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};


/**
 * Converts an image file to a base64 string for API usage.
 */
export const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const data = result.split(',')[1];
            resolve({ data, mimeType: file.type });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

/**
 * Triggers a browser download for a text file.
 */
export const downloadAsTxt = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Creates and triggers a download for a .docx file using the docx library.
 * This version uses async/await for robust, unified error handling.
 */
export const downloadAsDocx = async (content: string, filename: string): Promise<void> => {
    if (typeof docx === 'undefined') {
        alert("Thư viện 'docx' chưa được tải. Không thể tạo file .docx.");
        return;
    }

    try {
        const paragraphs = content.split('\n').map(line => {
            // This approach is robust and handles empty lines correctly by wrapping
            // them in a TextRun object, preventing crashes within the docx library.
            return new docx.Paragraph({
                children: [new docx.TextRun(line)],
            });
        });

        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        const blob = await docx.Packer.toBlob(doc);
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (err) {
        console.error("Lỗi khi tạo file .docx:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        alert(`Đã xảy ra lỗi khi tạo file .docx: ${errorMessage}`);
    }
};

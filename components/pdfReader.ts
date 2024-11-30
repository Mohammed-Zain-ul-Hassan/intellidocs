import pdfParse from 'pdf-parse';

export const readPDFContent = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();  // Converts the file to an ArrayBuffer
    const data = await pdfParse(Buffer.from(buffer));  // Parse PDF using `Buffer`
    return data.text;  // Return the extracted text
};

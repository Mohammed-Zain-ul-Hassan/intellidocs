declare module "pdf-parse/lib/pdf-parse" {
  interface PdfInfo {
    [key: string]: string | number | boolean | undefined;
  }

  interface PdfMetadata {
    _metadata: Record<string, unknown>; // Adjust if you have specific metadata structures.
  }

  interface PdfData {
    text: string;
    numpages: number;
    numrender: number;
    info: PdfInfo;
    metadata: PdfMetadata | null;
    version: string;
  }

  type PdfParse = (buffer: Buffer | Uint8Array) => Promise<PdfData>;

  const pdf: PdfParse;
  export default pdf;
}

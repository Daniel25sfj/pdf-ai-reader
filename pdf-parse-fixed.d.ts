declare module "pdf-parse-fixed" {
  interface PdfParseResult {
    text: string;
    // Include any other properties without strict typing
    [key: string]: unknown;
  }

  type PdfParse = (data: Buffer | Uint8Array) => Promise<PdfParseResult>;

  const pdfParse: PdfParse;
  export default pdfParse;
}

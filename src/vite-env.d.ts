/// <reference types="vite/client" />

declare module '*?url' {
  const src: string;
  export default src;
}

declare module '@pdfsmaller/pdf-encrypt-lite' {
  export function encryptPDF(
    pdfBytes: Uint8Array,
    userPassword: string,
    ownerPassword?: string
  ): Promise<Uint8Array>;
}

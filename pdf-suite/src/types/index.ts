export type PdfToolId =
  | 'merge'
  | 'split'
  | 'rotate'
  | 'delete'
  | 'images-to-pdf'
  | 'pdf-to-images'
  | 'watermark'
  | 'protect';

export interface ToolMetadata {
  id: PdfToolId;
  title: string;
  shortDesc: string;
  badge?: string;
  iconName: string;
}

export interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export interface PageThumbnailInfo {
  pageNumber: number; // 1-indexed
  dataUrl: string;
  width: number;
  height: number;
  originalRotation: number; // 0, 90, 180, 270
  currentRotation: number;  // 0, 90, 180, 270
  selected: boolean;
  deleted: boolean;
}

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  dataUrl: string;
  width: number;
  height: number;
}

export interface ImageToPdfOptions {
  orientation: 'auto' | 'portrait' | 'landscape';
  pageSize: 'a4' | 'letter' | 'fit';
  margin: 'none' | 'small' | 'normal';
}

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  colorHex: string;
  opacity: number;
  rotationAngle: number;
  position: 'center' | 'diagonal' | 'top' | 'bottom';
}

export interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  title: string;
  message?: string;
  progress?: number; // 0 to 100
}

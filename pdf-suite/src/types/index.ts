export type PdfToolId =
  | 'edit'
  | 'merge'
  | 'split'
  | 'rotate'
  | 'delete'
  | 'images-to-pdf'
  | 'pdf-to-images'
  | 'watermark'
  | 'protect';

export interface PdfAnnotationText {
  id: string;
  type: 'text';
  pageIndex: number; // 0-based
  x: number; // relative 0-1 or px
  y: number;
  text: string;
  fontSize: number;
  colorHex: string;
}

export interface PdfAnnotationDrawing {
  id: string;
  type: 'drawing';
  pageIndex: number;
  points: { x: number; y: number }[];
  colorHex: string;
  thickness: number;
}

export interface PdfAnnotationShape {
  id: string;
  type: 'shape';
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  colorHex: string;
  fillOpacity: number;
  strokeColorHex?: string;
}

export interface PdfAnnotationImage {
  id: string;
  type: 'image';
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

export type PdfAnnotation =
  | PdfAnnotationText
  | PdfAnnotationDrawing
  | PdfAnnotationShape
  | PdfAnnotationImage;

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

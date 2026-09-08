import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Trigger browser download for a Blob or Uint8Array using file-saver
 */
export function downloadFile(data: Blob | Uint8Array, filename: string): void {
  const blob = data instanceof Blob ? data : new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
  saveAs(blob, filename);
}

/**
 * Bundle multiple files (Blobs or Uint8Arrays) into a single ZIP archive and trigger download
 */
export async function downloadAsZip(
  files: { name: string; content: Blob | Uint8Array }[],
  zipFilename: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.content as unknown as Blob);
  }

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  saveAs(zipBlob, zipFilename);
}

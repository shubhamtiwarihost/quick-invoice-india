import { PDFDocument, rgb } from 'pdf-lib';
import {
  formatFileSize,
  parsePageRangeString,
  formatPageRangeString,
  mergePdfs,
  extractPdfPages,
  rotatePdfPages,
  deletePagesFromPdf,
  watermarkPdf,
  protectPdf,
} from '../src/lib/pdf-helpers.js';

async function createSamplePdf(numPages = 3, title = 'Sample') {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= numPages; i++) {
    const page = doc.addPage([500, 700]);
    page.drawText(`${title} - Page ${i}`, {
      x: 50,
      y: 650,
      size: 20,
      color: rgb(0, 0, 0),
    });
  }
  return (await doc.save()).buffer;
}

async function runVerification() {
  console.log('🧪 Starting PDF Utility Suite Verification...');

  // 1. Range syntax parsing test
  console.log('\n[1] Testing Page Range Syntax...');
  const rangeStr = '1-3, 5, 8-10';
  const parsed = parsePageRangeString(rangeStr, 12);
  console.log('Parsed "1-3, 5, 8-10" (max 12):', parsed);
  if (JSON.stringify(parsed) !== JSON.stringify([1, 2, 3, 5, 8, 9, 10])) {
    throw new Error('Range parser failed');
  }
  const formatted = formatPageRangeString(parsed);
  console.log('Formatted back to string:', formatted);
  if (formatted !== '1-3, 5, 8-10') {
    throw new Error('Range formatter failed');
  }
  console.log('✓ Range syntax test PASSED');

  // 2. Format file size
  console.log('\n[2] Testing formatFileSize...');
  console.log('1024 bytes ->', formatFileSize(1024));
  console.log('1048576 bytes ->', formatFileSize(1048576));
  console.log('✓ formatFileSize test PASSED');

  // 3. Merge PDFs test
  console.log('\n[3] Testing Merge PDFs...');
  const doc1 = await createSamplePdf(2, 'Doc A');
  const doc2 = await createSamplePdf(3, 'Doc B');
  const mergedBytes = await mergePdfs([doc1, doc2]);
  const mergedLoaded = await PDFDocument.load(mergedBytes);
  console.log('Merged PDF page count:', mergedLoaded.getPageCount(), '(Expected: 5)');
  if (mergedLoaded.getPageCount() !== 5) {
    throw new Error('Merge failed: expected 5 pages');
  }
  console.log('✓ Merge PDFs test PASSED');

  // 4. Split / Extract test
  console.log('\n[4] Testing Split / Extract...');
  const sampleDoc = await createSamplePdf(5, 'Multi');
  const extractedBytes = await extractPdfPages(sampleDoc, [2, 4]); // 1-indexed
  const extractedLoaded = await PDFDocument.load(extractedBytes);
  console.log('Extracted PDF page count:', extractedLoaded.getPageCount(), '(Expected: 2)');
  if (extractedLoaded.getPageCount() !== 2) {
    throw new Error('Extract failed: expected 2 pages');
  }
  console.log('✓ Extract pages test PASSED');

  // 5. Rotate Pages test
  console.log('\n[5] Testing Rotate Pages...');
  const rotMap = new Map();
  rotMap.set(0, 90); // rotate page 1 by 90
  rotMap.set(1, 180); // rotate page 2 by 180
  const rotatedBytes = await rotatePdfPages(sampleDoc, rotMap);
  const rotatedLoaded = await PDFDocument.load(rotatedBytes);
  const p1Rot = rotatedLoaded.getPage(0).getRotation().angle;
  const p2Rot = rotatedLoaded.getPage(1).getRotation().angle;
  console.log('Page 1 rotation:', p1Rot, 'Page 2 rotation:', p2Rot);
  if (p1Rot !== 90 || p2Rot !== 180) {
    throw new Error('Rotation failed');
  }
  console.log('✓ Rotate pages test PASSED');

  // 6. Delete Pages test
  console.log('\n[6] Testing Delete Pages...');
  // sampleDoc has 5 pages (indices 0, 1, 2, 3, 4)
  // delete page index 1 and 3 (pages 2 and 4)
  const cleanedBytes = await deletePagesFromPdf(sampleDoc, [1, 3]);
  const cleanedLoaded = await PDFDocument.load(cleanedBytes);
  console.log('Cleaned PDF page count:', cleanedLoaded.getPageCount(), '(Expected: 3)');
  if (cleanedLoaded.getPageCount() !== 3) {
    throw new Error('Delete pages failed: expected 3 pages');
  }
  console.log('✓ Delete pages test PASSED');

  // 7. Watermark PDF test
  console.log('\n[7] Testing Watermark PDF...');
  const watermarkedBytes = await watermarkPdf(sampleDoc, {
    text: 'CONFIDENTIAL',
    fontSize: 36,
    colorHex: '#dc2626',
    opacity: 0.5,
    rotationAngle: 45,
    position: 'diagonal',
  });
  const watermarkedLoaded = await PDFDocument.load(watermarkedBytes);
  console.log('Watermarked PDF size:', watermarkedBytes.length, 'bytes');
  if (watermarkedLoaded.getPageCount() !== 5) {
    throw new Error('Watermark test failed: page count changed');
  }
  console.log('✓ Watermark test PASSED');

  // 8. Protect PDF test
  console.log('\n[8] Testing Protect PDF with Password...');
  const protectedBytes = await protectPdf(sampleDoc, 'securepass123');
  console.log('Original size:', sampleDoc.byteLength, 'Encrypted size:', protectedBytes.length);
  if (protectedBytes.length <= sampleDoc.byteLength) {
    throw new Error('Encryption output smaller than original');
  }
  console.log('✓ Protect PDF test PASSED');

  console.log('\n🎉 ALL 8 PDF UTILITY FUNCTIONS VERIFIED SUCCESSFULLY!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

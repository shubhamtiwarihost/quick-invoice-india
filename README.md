# DocuShield PDF — 100% Client-Side PDF Utility Suite 🛡️📄

A production-ready, zero-server-leakage PDF utility web application built with **Vite**, **React 19**, **TypeScript**, and **Tailwind CSS**.

> **100% Secure & Private — Files Never Leave Your Browser**  
> Every file operation, rendering pipeline, and PDF modification executes strictly inside the user's browser memory (Web APIs, ArrayBuffer, and Blobs). There are zero remote API endpoints, zero telemetry tracking, and zero cloud storage.

---

## 🚀 Core Features & PDF Tools

The suite provides 8 dedicated client-side PDF utilities in a single modern dashboard:

1. **Merge PDF**: Select 2 or more PDFs, reorder them with drag-and-drop or move buttons, inspect page counts and file sizes, and merge into a single PDF via `pdf-lib`.
2. **Split / Extract Pages**: Upload a PDF, visually browse rendered page thumbnails (`pdfjs-dist`), select pages via click or custom range syntax (e.g., `1-3, 5, 8-10`), and download as a single new PDF or export all pages as individual PDFs in a ZIP archive (`jszip` + `file-saver`).
3. **Rotate PDF**: Interactive card grid for all pages with real-time CSS rotation preview, individual +90°/-90°/180° controls, and batch apply controls to rotate all pages at once.
4. **Delete Pages**: Visual thumbnail preview where users can click a trash icon to remove unwanted pages (with instant restore support) and export the cleaned document.
5. **Images to PDF**: Multi-image uploader (JPG, PNG, WebP) with reordering, customizable page orientation (Auto, Portrait, Landscape), page format (A4, Letter, Fit to image), and margins using `jspdf`.
6. **PDF to Images**: High-resolution rasterization of PDF pages via `pdfjs-dist` to crisp PNG or JPEG images with selectable scale (1x, 1.5x, 2x, 3x) and one-click "Download All as ZIP".
7. **Watermark PDF**: Add customizable text watermarks (opacity, font size, rotation angle, preset/custom colors, and positions) with live interactive preview on page 1 before applying across all pages.
8. **Protect PDF**: Set user passwords to lock PDFs locally in memory using standard 128-bit RC4 PDF encryption (`@pdfsmaller/pdf-encrypt-lite`) before download.

---

## 🔒 Zero Server Data Leakage Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Bundler & Compiler** | Vite 6 + React 19 + TypeScript | Lightning-fast static bundle generation |
| **PDF Binary Engine** | `pdf-lib` | In-memory PDF merging, extraction, rotation, watermarking, and page removal |
| **Rendering Engine** | `pdfjs-dist` (ESM Worker) | Canvas rasterization & live thumbnail previews without network requests |
| **Image-to-PDF** | `jspdf` | High-fidelity image layout compilation |
| **Packaging & Export** | `jszip` + `file-saver` | In-memory ZIP archive generation & direct browser file download |
| **Client-Side Encryption** | `@pdfsmaller/pdf-encrypt-lite` | Pure in-memory 128-bit RC4 PDF encryption |
| **Styling** | Tailwind CSS v4 (Slate & Indigo) | Minimal, responsive, accessible dashboard UI |

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- npm or pnpm

### Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
The compiled, tree-shaken static bundle will be emitted to `dist/`.

### Preview Production Build Locally
```bash
npm run preview
```

### Automated Utility Verification Test
```bash
npx tsx scripts/verify-pdf-suite.mjs
```

---

## 🌐 Deploying to Hostinger Shared Web Hosting (`public_html`)

The application is specifically engineered for shared hosting (Hostinger, cPanel, Apache):

1. **Relative Asset Paths**: `vite.config.ts` uses `base: './'`, ensuring scripts and stylesheets load properly whether uploaded to the root domain (`public_html/`) or any subdirectory (e.g., `public_html/pdf-tools/`).
2. **Apache `.htaccess` Pre-configured**:
   - URL rewrite rules for Single Page Application (SPA) routing fallback.
   - Proper MIME types for ES module workers (`application/javascript` for `.mjs`).
   - 1-year immutable caching for hashed assets (`.js`, `.css`, `.png`, `.svg`, `.mjs`).
   - Instant HTML revalidation (`max-age=0, must-revalidate`).

### Step-by-Step Deployment:
1. Run `npm run build` on your machine.
2. Open Hostinger **File Manager** (or connect via SFTP).
3. Navigate to `public_html/` (or your domain root / subdirectory).
4. Upload all files and folders from inside your local `dist/` directory:
   ```
   dist/
   ├── .htaccess
   ├── index.html
   ├── pdf.worker.min.mjs
   └── assets/
       ├── index-*.js
       ├── index-*.css
       └── ...
   ```
5. Done! Your client-side PDF utility suite is now live with 100% privacy and zero backend dependencies.

---

## 📄 License
MIT License. 100% Free & Open-Source Client-Side Software.

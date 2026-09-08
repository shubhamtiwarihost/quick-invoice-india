export async function downloadInvoicePdf(
  element: HTMLElement,
  fileName: string,
): Promise<void> {
  const [html2canvasMod, jsPdfMod] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const html2canvas = html2canvasMod.default || html2canvasMod;
  const jsPDF = jsPdfMod.jsPDF || jsPdfMod.default;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(element.id || "invoice-a4");
      if (clonedEl) {
        clonedEl.style.transform = "none";
        clonedEl.style.boxShadow = "none";
        clonedEl.style.margin = "0";
        let parent = clonedEl.parentElement;
        while (parent) {
          parent.style.transform = "none";
          if (parent.style.display === "none") {
            parent.style.display = "block";
          }
          parent.classList?.remove("hidden");
          parent = parent.parentElement;
        }
      }
    },
  });

  if (!canvas || !canvas.width || !canvas.height) {
    throw new Error("Unable to capture invoice canvas (empty or invalid dimensions).");
  }

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 2) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}

export function whatsappInvoiceText(params: {
  seller: string;
  invoiceNo: string;
  buyer: string;
  total: string;
  dueDate: string;
}): string {
  const message = `Invoice from ${params.seller}
Invoice No: ${params.invoiceNo}
Bill To: ${params.buyer}
Amount: ${params.total}
Due: ${params.dueDate}

Generated with SwiftGST (swiftgst.in).`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

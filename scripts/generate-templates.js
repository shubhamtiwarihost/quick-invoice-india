import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { jsPDF } from "jspdf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const templatesDir = path.join(rootDir, "public", "templates");

if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// 1. Generate Printable Blank GST Bill Template PDF
function generateBlankPdf() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Outer Border
  doc.setDrawColor(15, 118, 110); // Teal 700
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

  // Header Banner
  doc.setFillColor(15, 118, 110);
  doc.rect(margin, margin, contentWidth, 16, "F");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("TAX INVOICE", pageWidth / 2, margin + 9, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "[Issued under Section 31 of Central Goods and Services Tax Act, 2017 & Rule 46]",
    pageWidth / 2,
    margin + 13.5,
    { align: "center" }
  );

  // Seller Details Box (Left) & Invoice Meta Box (Right)
  const metaTop = margin + 16;
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.3);
  doc.line(margin, metaTop + 36, margin + contentWidth, metaTop + 36);
  doc.line(margin + 110, metaTop, margin + 110, metaTop + 36);

  // Seller Info (Left)
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SUPPLIER / SELLER DETAILS", margin + 4, metaTop + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Business Name: __________________________________________", margin + 4, metaTop + 12);
  doc.text("Address: ________________________________________________", margin + 4, metaTop + 17);
  doc.text("City, State, Pincode: _________________  State Code: _______", margin + 4, metaTop + 22);
  doc.text("GSTIN: _______________________  PAN: ____________________", margin + 4, metaTop + 27);
  doc.text("Phone / Email: __________________________________________", margin + 4, metaTop + 32);

  // Invoice Details (Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("INVOICE PARTICULARS", margin + 114, metaTop + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Invoice No: ______________________", margin + 114, metaTop + 12);
  doc.text("Invoice Date: ____________________", margin + 114, metaTop + 17);
  doc.text("Due Date: _______________________", margin + 114, metaTop + 22);
  doc.text("Place of Supply: _________________", margin + 114, metaTop + 27);
  doc.text("Reverse Charge: [  ] Yes   [  ] No", margin + 114, metaTop + 32);

  // Buyer Details Box
  const buyerTop = metaTop + 36;
  doc.line(margin, buyerTop + 26, margin + contentWidth, buyerTop + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILL TO (RECIPIENT / BUYER)", margin + 4, buyerTop + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Client / Business Name: __________________________________", margin + 4, buyerTop + 12);
  doc.text("Billing Address: __________________________________________", margin + 4, buyerTop + 17);
  doc.text("Buyer GSTIN: _______________________  State Code: _______", margin + 4, buyerTop + 22);

  // Table Headers
  const tableTop = buyerTop + 26;
  const tableHeaderHeight = 9;
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(margin, tableTop, contentWidth, tableHeaderHeight, "F");
  doc.line(margin, tableTop + tableHeaderHeight, margin + contentWidth, tableTop + tableHeaderHeight);

  // Column definitions: x offsets and widths
  const cols = [
    { label: "Sr", w: 10, align: "center" },
    { label: "Item Description & Goods / Services", w: 68, align: "left" },
    { label: "HSN/SAC", w: 18, align: "center" },
    { label: "Qty", w: 14, align: "center" },
    { label: "Unit", w: 12, align: "center" },
    { label: "Rate (₹)", w: 18, align: "right" },
    { label: "GST %", w: 14, align: "center" },
    { label: "Tax (₹)", w: 15, align: "right" },
    { label: "Amount (₹)", w: 17, align: "right" },
  ];

  let currentX = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  for (let i = 0; i < cols.length; i++) {
    const col = cols[i];
    const textX =
      col.align === "center"
        ? currentX + col.w / 2
        : col.align === "right"
        ? currentX + col.w - 2
        : currentX + 2;

    doc.text(col.label, textX, tableTop + 5.5, { align: col.align });
    if (i > 0) {
      doc.line(currentX, tableTop, currentX, tableTop + 110);
    }
    currentX += col.w;
  }

  // 10 Blank Rows
  const rowHeight = 10;
  for (let r = 1; r <= 10; r++) {
    const y = tableTop + tableHeaderHeight + r * rowHeight;
    doc.line(margin, y, margin + contentWidth, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(String(r), margin + 5, y - 3.5, { align: "center" });
  }

  // Bottom Summary Section
  const summaryTop = tableTop + tableHeaderHeight + 10 * rowHeight;
  doc.setLineWidth(0.4);
  doc.line(margin, summaryTop, margin + contentWidth, summaryTop);

  // Bank Details (Left Bottom)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("BANK & PAYMENT SETTLEMENT DETAILS", margin + 4, summaryTop + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Bank Name: _____________________________________", margin + 4, summaryTop + 12);
  doc.text("Account Number: _________________________________", margin + 4, summaryTop + 17);
  doc.text("IFSC Code: ________________  Account Type: Current", margin + 4, summaryTop + 22);
  doc.text("UPI VPA ID: ____________________________________", margin + 4, summaryTop + 27);
  doc.text("Amount in Words: ________________________________", margin + 4, summaryTop + 33);
  doc.text("_______________________________________________", margin + 4, summaryTop + 38);

  // Totals Breakdown (Right Bottom)
  doc.line(margin + 120, summaryTop, margin + 120, summaryTop + 42);
  const totalLabels = [
    { label: "Taxable Amount:", val: "₹ ________________" },
    { label: "Add CGST:", val: "₹ ________________" },
    { label: "Add SGST:", val: "₹ ________________" },
    { label: "Add IGST (Inter-State):", val: "₹ ________________" },
    { label: "Round Off (+/-):", val: "₹ ________________" },
    { label: "GRAND TOTAL:", val: "₹ ________________", bold: true },
  ];

  let ty = summaryTop + 6;
  totalLabels.forEach((t) => {
    doc.setFont("helvetica", t.bold ? "bold" : "normal");
    doc.setFontSize(8);
    doc.text(t.label, margin + 123, ty);
    doc.text(t.val, margin + contentWidth - 3, ty, { align: "right" });
    ty += 6;
  });

  // Footer: Terms & Signature
  const footerTop = summaryTop + 44;
  doc.setLineWidth(0.3);
  doc.line(margin, footerTop, margin + contentWidth, footerTop);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("TERMS & CONDITIONS", margin + 4, footerTop + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("1. Goods/services once supplied cannot be refunded.", margin + 4, footerTop + 9);
  doc.text("2. Interest @ 18% per annum will be charged on overdue bills.", margin + 4, footerTop + 13);
  doc.text("3. Subject to jurisdiction of local courts.", margin + 4, footerTop + 17);

  // Signature box
  doc.line(margin + 120, footerTop, margin + 120, pageHeight - margin);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("For ___________________________________", margin + 124, footerTop + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("(Authorized Signatory & Official Stamp)", margin + 124, footerTop + 20);

  fs.writeFileSync(
    path.join(templatesDir, "printable-blank-gst-bill-template.pdf"),
    Buffer.from(doc.output("arraybuffer"))
  );
  console.log("✓ Created printable-blank-gst-bill-template.pdf");
}

// 2. Generate XML Spreadsheet (Standard B2B XLS / XLSX compatible)
function generateExcelB2b() {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F766E" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SectionHeader">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F766E"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="NumberCell">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
  <Style ss:ID="TotalCell">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#0F766E"/>
   <Interior ss:Color="#CCFBF1" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="₹#,##0.00"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="B2B Tax Invoice">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="220"/>
   <Column ss:Width="80"/>
   <Column ss:Width="60"/>
   <Column ss:Width="60"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="60"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="100"/>
   <Row ss:Height="35">
    <Cell ss:MergeAcross="10" ss:StyleID="HeaderTitle"><Data ss:Type="String">GST TAX INVOICE (B2B FORMAT)</Data></Cell>
   </Row>
   <Row ss:Height="10"></Row>
   <Row>
    <Cell ss:MergeAcross="4" ss:StyleID="SectionHeader"><Data ss:Type="String">SUPPLIER / SELLER DETAILS</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:MergeAcross="4" ss:StyleID="SectionHeader"><Data ss:Type="String">INVOICE PARTICULARS</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">Company Name: Aarav Enterprises Pvt Ltd</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">Invoice No: INV-2026-001</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">GSTIN: 27AAPCA1234A1Z5 | PAN: AAPCA1234A</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">Invoice Date: 05-Sep-2026</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">Address: Fort Business Centre, Mumbai, MH - 400001</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">Place of Supply: 27-Maharashtra</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">State Code: 27 | Phone: +91 98765 43210</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">Reverse Charge: No</Data></Cell>
   </Row>
   <Row ss:Height="10"></Row>
   <Row>
    <Cell ss:MergeAcross="10" ss:StyleID="SectionHeader"><Data ss:Type="String">BILL TO: RECIPIENT / BUYER DETAILS</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="10"><Data ss:Type="String">Client Name: Zenith Technologies Ltd | GSTIN: 27AABCZ9876K1Z1 | State Code: 27</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="10"><Data ss:Type="String">Address: Sector 5, Hinjawadi Phase 1, Pune, Maharashtra - 411057</Data></Cell>
   </Row>
   <Row ss:Height="15"></Row>
   <Row ss:Height="25">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">S.No</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Item Description</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">HSN/SAC</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Qty</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Unit</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Rate (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Taxable (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">GST %</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">CGST (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">SGST (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Total (₹)</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="Number">1</Data></Cell>
    <Cell><Data ss:Type="String">Enterprise ERP Cloud Software Consulting</Data></Cell>
    <Cell><Data ss:Type="String">998314</Data></Cell>
    <Cell><Data ss:Type="Number">1</Data></Cell>
    <Cell><Data ss:Type="String">Nos</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">45000</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=RC[-3]*RC[-1]"><Data ss:Type="Number">45000</Data></Cell>
    <Cell><Data ss:Type="Number">18</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=(RC[-2]*0.09)"><Data ss:Type="Number">4050</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=(RC[-3]*0.09)"><Data ss:Type="Number">4050</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=RC[-4]+RC[-2]+RC[-1]"><Data ss:Type="Number">53100</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="Number">2</Data></Cell>
    <Cell><Data ss:Type="String">System Integration &amp; API Setup Deliverables</Data></Cell>
    <Cell><Data ss:Type="String">998313</Data></Cell>
    <Cell><Data ss:Type="Number">20</Data></Cell>
    <Cell><Data ss:Type="String">Hrs</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">2500</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=RC[-3]*RC[-1]"><Data ss:Type="Number">50000</Data></Cell>
    <Cell><Data ss:Type="Number">18</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=(RC[-2]*0.09)"><Data ss:Type="Number">4500</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=(RC[-3]*0.09)"><Data ss:Type="Number">4500</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=RC[-4]+RC[-2]+RC[-1]"><Data ss:Type="Number">59000</Data></Cell>
   </Row>
   <Row ss:Height="20"></Row>
   <Row>
    <Cell ss:MergeAcross="5"><Data ss:Type="String">Bank: HDFC Bank | A/c: 50200012345678 | IFSC: HDFC0000001 | UPI: aarav@okhdfcbank</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=SUM(R[-3]C:R[-2]C)"><Data ss:Type="Number">95000</Data></Cell>
    <Cell><Data ss:Type="String">TOTALS</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=SUM(R[-3]C:R[-2]C)"><Data ss:Type="Number">8550</Data></Cell>
    <Cell ss:StyleID="NumberCell" ss:Formula="=SUM(R[-3]C:R[-2]C)"><Data ss:Type="Number">8550</Data></Cell>
    <Cell ss:StyleID="TotalCell" ss:Formula="=SUM(R[-3]C:R[-2]C)"><Data ss:Type="Number">112100</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  fs.writeFileSync(path.join(templatesDir, "standard-b2b-tax-invoice-format.xlsx"), xmlContent, "utf8");
  fs.writeFileSync(path.join(templatesDir, "standard-b2b-tax-invoice-format.xls"), xmlContent, "utf8");
  console.log("✓ Created standard-b2b-tax-invoice-format.xlsx / .xls");
}

// 3. Generate Word Document (Freelancer Simple Bill DOCX / DOC compatible)
function generateWordFreelancer() {
  const docContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Freelancer Invoice Template</title>
<style>
  body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; margin: 40px; color: #1e293b; }
  .header { border-bottom: 3px solid #0f766e; padding-bottom: 12px; margin-bottom: 24px; }
  .title { font-size: 24px; font-weight: bold; color: #0f766e; margin: 0; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
  .meta-table { width: 100%; margin-bottom: 24px; }
  .meta-table td { vertical-align: top; font-size: 13px; }
  .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
  .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  .items-table th { background: #0f766e; color: white; text-align: left; padding: 10px; font-size: 12px; }
  .items-table td { border-bottom: 1px solid #e2e8f0; padding: 10px; font-size: 13px; }
  .total-row td { font-weight: bold; font-size: 15px; color: #0f766e; border-top: 2px solid #0f766e; }
  .bank-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; font-size: 12px; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">TAX INVOICE / FREELANCE BILL</div>
    <div class="subtitle">Issued under Central Goods and Services Tax Act 2017</div>
  </div>

  <table class="meta-table">
    <tr>
      <td width="50%">
        <div class="box">
          <strong>FREELANCER / CONSULTANT</strong><br>
          Name: <em>Aditi Rao (UI/UX Consultant)</em><br>
          Address: Mindspace Business Park, Malad West, Mumbai 400064<br>
          GSTIN: 27AAPCA9876K1Z2 | PAN: AAPCA9876K<br>
          Email: aditi@example.com | Phone: +91 98200 12345
        </div>
      </td>
      <td width="5%"></td>
      <td width="45%">
        <div class="box">
          <strong>INVOICE DETAILS</strong><br>
          Invoice No: <strong>INV-2026-088</strong><br>
          Date: 05-Sep-2026 | Due Date: 20-Sep-2026<br>
          Place of Supply: 29-Karnataka (Inter-State IGST)<br>
          LUT Reference (if export): ARN-AD270326001234F
        </div>
      </td>
    </tr>
  </table>

  <div class="box" style="margin-bottom: 20px;">
    <strong>BILLED TO (CLIENT)</strong><br>
    Company: Nexus Tech Solutions Pvt Ltd | GSTIN: 29AABCN4321D1ZE<br>
    Address: Electronic City Phase 1, Bangalore, Karnataka - 560100
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Sr</th>
        <th>Description of Services</th>
        <th>SAC</th>
        <th>Qty/Hrs</th>
        <th>Rate (₹)</th>
        <th>Taxable (₹)</th>
        <th>GST</th>
        <th>Total (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Full-Stack Web Application Development Sprint</td>
        <td>998314</td>
        <td>40 Hrs</td>
        <td>₹2,500</td>
        <td>₹1,00,000</td>
        <td>18% IGST</td>
        <td>₹1,18,000</td>
      </tr>
      <tr>
        <td>2</td>
        <td>UI/UX Mobile App Figma Design System</td>
        <td>998314</td>
        <td>1 Nos</td>
        <td>₹35,000</td>
        <td>₹35,000</td>
        <td>18% IGST</td>
        <td>₹41,300</td>
      </tr>
      <tr class="total-row">
        <td colspan="5" style="text-align: right;">GRAND TOTAL:</td>
        <td>₹1,35,000</td>
        <td>₹24,300</td>
        <td>₹1,59,300</td>
      </tr>
    </tbody>
  </table>

  <div class="bank-box">
    <strong>PAYMENT &amp; SETTLEMENT DETAILS</strong><br>
    Bank Name: HDFC Bank Ltd | A/c No: 50200012345678 | IFSC: HDFC0000128<br>
    Account Holder: Aditi Rao | Instant UPI VPA: aditirao@okhdfcbank<br>
    <em>TDS Section 194J applicable for Indian corporate clients. Please forward Form 16A TDS certificate to freelancer email.</em>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(templatesDir, "freelancer-simple-bill-format.docx"), docContent, "utf8");
  fs.writeFileSync(path.join(templatesDir, "freelancer-simple-bill-format.doc"), docContent, "utf8");
  console.log("✓ Created freelancer-simple-bill-format.docx / .doc");
}

// 4. Boutique and Kirana formats
function generateAdditionalTemplates() {
  const boutiqueContent = fs.readFileSync(path.join(templatesDir, "standard-b2b-tax-invoice-format.xlsx"), "utf8")
    .replace(/GST TAX INVOICE \(B2B FORMAT\)/g, "BOUTIQUE & TAILORING GST INVOICE")
    .replace(/Enterprise ERP Cloud Software Consulting/g, "Designer Bridal Lehenga Custom Stitching (SAC 998822)")
    .replace(/System Integration &amp; API Setup Deliverables/g, "Pure Banarasi Silk Fabric Material (HSN 5007)");
  fs.writeFileSync(path.join(templatesDir, "boutique-tailoring-bill-format.xlsx"), boutiqueContent, "utf8");

  const kiranaContent = fs.readFileSync(path.join(templatesDir, "freelancer-simple-bill-format.docx"), "utf8")
    .replace(/TAX INVOICE \/ FREELANCE BILL/g, "KIRANA STORE RETAIL BILL & CASH MEMO")
    .replace(/Full-Stack Web Application Development Sprint/g, "Aashirvaad Chakki Atta (10kg) - 0% GST")
    .replace(/UI\/UX Mobile App Figma Design System/g, "Fortune Sunflower Refined Oil (1L) - 5% GST");
  fs.writeFileSync(path.join(templatesDir, "kirana-retail-cash-memo-format.docx"), kiranaContent, "utf8");

  console.log("✓ Created boutique-tailoring-bill-format.xlsx and kirana-retail-cash-memo-format.docx");
}

generateBlankPdf();
generateExcelB2b();
generateWordFreelancer();
generateAdditionalTemplates();
console.log("All static invoice templates generated successfully in /public/templates/!");

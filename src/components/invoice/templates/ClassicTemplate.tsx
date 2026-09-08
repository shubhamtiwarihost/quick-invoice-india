import { formatDateIN } from "@/lib/format";
import { clientBlock, clientShippingBlock, cleanTerms, formatCurrency, sanitizeImageUrl, sellerBlock, type TemplateProps } from "./shared";

export function ClassicTemplate({ draft, summary, qrDataUrl }: TemplateProps) {
  const { seller, client, items, meta, config } = draft;
  const gst = config.gstMode === "gst";
  const color = config.accentColor;
  const safeLogo = sanitizeImageUrl(seller.logo);
  const safeSignature = sanitizeImageUrl(seller.signatureImage);

  return (
    <div className="flex min-h-[1122px] flex-col bg-white p-1 text-slate-900">
      <div className="border-2" style={{ borderColor: color }}>
        <div className="px-4 py-3 text-center text-white" style={{ backgroundColor: color }}>
          <h1 className="text-lg font-bold uppercase tracking-wide">
            {gst ? "Tax Invoice" : "Bill of Supply"}
          </h1>
          <p className="text-[11px] opacity-90">{seller.businessName}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 border-b px-4 py-3 text-[11px]">
          <div>
            {safeLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={safeLogo} alt="" height={48} className="mb-2 h-12 max-w-[140px] object-contain" />
            ) : null}
            <p>{sellerBlock(draft)}</p>
            <p>Phone: {seller.phone}</p>
            <p>Email: {seller.email}</p>
            {gst && seller.gstin ? <p>GSTIN: {seller.gstin}</p> : null}
            {seller.pan ? <p>PAN: {seller.pan}</p> : null}
          </div>
          <div className="text-right">
            <p>Invoice No: <strong>{meta.invoiceNo}</strong></p>
            <p>Invoice Date: {formatDateIN(meta.invoiceDate)}</p>
            <p>Due Date: {formatDateIN(meta.dueDate)}</p>
            <p>POS: {client.placeOfSupply} ({client.placeOfSupplyCode})</p>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b text-[11px]">
          <div className="border-r px-4 py-3">
            <p className="font-bold uppercase">Buyer (Bill to)</p>
            <p className="mt-1 font-semibold">{client.name}</p>
            <p>{clientBlock(draft)}</p>
            {client.gstin ? <p>GSTIN: {client.gstin}</p> : null}
          </div>
          <div className="px-4 py-3">
            <p className="font-bold uppercase">Ship to</p>
            <p className="mt-1">{clientShippingBlock(draft)}</p>
            {config.reverseCharge ? (
              <p className="mt-2 font-semibold">Reverse Charge Applicable</p>
            ) : null}
          </div>
        </div>

        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border-b border-r px-2 py-2">S.No</th>
              <th className="border-b border-r px-2 py-2 text-left">Description of Goods / Services</th>
              <th className="border-b border-r px-2 py-2">HSN/SAC</th>
              <th className="border-b border-r px-2 py-2 whitespace-nowrap">Qty</th>
              <th className="border-b border-r px-2 py-2 text-right whitespace-nowrap">Rate</th>
              {gst ? <th className="border-b border-r px-2 py-2 whitespace-nowrap">Tax %</th> : null}
              <th className="border-b px-2 py-2 text-right whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="text-slate-900">
                <td className="border-b border-r border-slate-300 px-2.5 py-2 text-center font-mono text-slate-800">{i + 1}</td>
                <td className="border-b border-r border-slate-300 px-2.5 py-2 font-semibold text-slate-900">{item.description}</td>
                <td className="border-b border-r border-slate-300 px-2.5 py-2 text-center font-mono text-slate-800">{item.hsnSac || "—"}</td>
                <td className="border-b border-r border-slate-300 px-2.5 py-2 text-center font-medium text-slate-900 whitespace-nowrap">
                  {item.quantity} {item.unit}
                </td>
                <td className="border-b border-r border-slate-300 px-2.5 py-2 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                  {formatCurrency(item.rate, meta.currency)}
                </td>
                {gst ? (
                  <td className="border-b border-r border-slate-300 px-2.5 py-2 text-center font-medium text-slate-800 whitespace-nowrap">
                    {item.gstSlab}%
                  </td>
                ) : null}
                <td className="border-b border-slate-300 px-2.5 py-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  {formatCurrency(summary.lines[i]?.lineTotal ?? 0, meta.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Amount in words bar */}
        <div className="border-b border-slate-200 bg-slate-50/90 px-4 py-2 text-[11px] text-slate-800">
          <span className="font-bold text-slate-900">Amount in Words: </span>
          <span className="font-medium italic text-slate-800">{summary.amountInWords}</span>
        </div>

        <div className="grid grid-cols-2 text-[11px]">
          <div className="px-4 py-3">
            <p className="font-bold text-slate-900">Bank Details</p>
            <div className="mt-1 space-y-0.5 text-slate-700 text-[10px]">
              <p><span className="text-slate-500">Bank:</span> {seller.bank.bankName}</p>
              <p><span className="text-slate-500">A/C No:</span> <strong className="font-mono text-slate-900">{seller.bank.accountNumber}</strong></p>
              <p><span className="text-slate-500">IFSC:</span> <strong className="font-mono text-slate-900">{seller.bank.ifsc}</strong></p>
              <p><span className="text-slate-500">UPI ID:</span> <strong className="font-mono text-teal-800">{seller.bank.upiId}</strong></p>
            </div>
            {qrDataUrl ? (
              <div className="mt-3 pt-2 border-t border-slate-200">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Scan & Pay via UPI</p>
                <div className="h-20 w-20 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="UPI QR Code"
                    width={80}
                    height={80}
                    className="h-20 w-20 aspect-square rounded-md border border-slate-300 bg-white p-[2px] shadow-2xs"
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div className="border-l px-4 py-3">
            <Line k="Taxable" v={formatCurrency(summary.taxableValue, meta.currency)} />
            {gst && summary.supplyType === "intra" ? (
              <>
                <Line k="CGST" v={formatCurrency(summary.cgst, meta.currency)} />
                <Line k="SGST" v={formatCurrency(summary.sgst, meta.currency)} />
              </>
            ) : null}
            {gst && summary.supplyType === "inter" ? (
              <Line k="IGST" v={formatCurrency(summary.igst, meta.currency)} />
            ) : null}
            <Line k="Round off" v={formatCurrency(summary.roundOff, meta.currency)} />
            <div className="mt-2 flex justify-between border-t-2 pt-2 font-bold whitespace-nowrap" style={{ borderColor: color }}>
              <span>Grand Total</span>
              <span>{formatCurrency(summary.grandTotal, meta.currency)}</span>
            </div>
            <div className="mt-8 text-right">
              <p>For {seller.businessName}</p>
              {safeSignature ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={safeSignature} alt="" height={40} className="ml-auto mt-2 h-10 max-w-[160px] object-contain" />
              ) : (
                <div className="h-10" />
              )}
              <p className="font-semibold">{seller.signatoryName}</p>
              <p>Authorised Signatory</p>
            </div>
          </div>
        </div>
        <div className="border-t px-4 py-2 text-[10px] whitespace-pre-wrap">{cleanTerms(meta.terms)}</div>
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}

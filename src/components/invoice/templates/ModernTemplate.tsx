import { formatDateIN } from "@/lib/format";
import { clientBlock, cleanTerms, formatCurrency, sellerBlock, type TemplateProps } from "./shared";

export function ModernTemplate({ draft, summary, qrDataUrl }: TemplateProps) {
  const { seller, client, items, meta, config } = draft;
  const gst = config.gstMode === "gst";
  const color = config.accentColor;

  return (
    <div className="flex min-h-[1122px] flex-col bg-white text-slate-800">
      <header className="flex items-start justify-between gap-4 border-b-4 pb-5" style={{ borderColor: color }}>
        <div className="flex items-start gap-3">
          {seller.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seller.logo} alt="" width={56} height={56} className="h-14 w-14 aspect-square rounded-lg object-cover" />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {seller.businessName.slice(0, 1) || "Q"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{seller.businessName}</h1>
            <p className="mt-1 max-w-xs text-[11px] leading-4 text-slate-500">{sellerBlock(draft)}</p>
            {gst && seller.gstin ? (
              <p className="mt-1 text-[11px] font-medium">GSTIN: {seller.gstin}</p>
            ) : null}
            {seller.pan ? <p className="text-[11px]">PAN: {seller.pan}</p> : null}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color }}>
            {gst ? "Tax Invoice" : "Bill of Supply"}
          </p>
          <p className="mt-1 text-lg font-semibold">{meta.invoiceNo}</p>
          <p className="text-[11px] text-slate-500">Date: {formatDateIN(meta.invoiceDate)}</p>
          <p className="text-[11px] text-slate-500">Due: {formatDateIN(meta.dueDate)}</p>
        </div>
      </header>

      <section className="mt-5 grid grid-cols-2 gap-4 text-[11px]">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Billed to</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{client.name || "—"}</p>
          <p className="mt-1 leading-4 text-slate-600">{clientBlock(draft)}</p>
          {client.gstin ? <p className="mt-1">GSTIN: {client.gstin}</p> : null}
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Supply</p>
          <p className="mt-2">Place of Supply: {client.placeOfSupply} ({client.placeOfSupplyCode})</p>
          <p>Type: {summary.supplyType === "intra" ? "Intra-state (CGST + SGST)" : summary.supplyType === "inter" ? "Inter-state (IGST)" : "Non-GST"}</p>
          {config.reverseCharge ? <p className="mt-1 font-medium text-amber-700">Reverse Charge: Yes</p> : <p>Reverse Charge: No</p>}
        </div>
      </section>

      <table className="mt-5 w-full border-collapse text-[10px]">
        <thead>
          <tr style={{ backgroundColor: color }} className="text-white">
            <th className="px-2.5 py-2 text-left font-semibold">#</th>
            <th className="px-2.5 py-2 text-left font-semibold">Item</th>
            <th className="px-2.5 py-2 text-left font-semibold">HSN/SAC</th>
            <th className="px-2.5 py-2 text-right font-semibold whitespace-nowrap">Qty</th>
            <th className="px-2.5 py-2 text-right font-semibold whitespace-nowrap">Rate</th>
            <th className="px-2.5 py-2 text-right font-semibold whitespace-nowrap">Disc.</th>
            {gst ? <th className="px-2.5 py-2 text-right font-semibold whitespace-nowrap">GST</th> : null}
            <th className="px-2.5 py-2 text-right font-semibold whitespace-nowrap">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const line = summary.lines[i];
            return (
              <tr key={item.id} className="border-b border-slate-200 text-slate-900">
                <td className="px-2.5 py-2 font-mono text-slate-800">{i + 1}</td>
                <td className="px-2.5 py-2 font-semibold text-slate-900">{item.description || "—"}</td>
                <td className="px-2.5 py-2 font-mono text-slate-800">{item.hsnSac || "—"}</td>
                <td className="px-2.5 py-2 text-right font-medium text-slate-900 whitespace-nowrap">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-2.5 py-2 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                  {formatCurrency(item.rate, meta.currency)}
                </td>
                <td className="px-2.5 py-2 text-right font-mono text-slate-800 whitespace-nowrap">
                  {line?.discountAmount ? formatCurrency(line.discountAmount, meta.currency) : "—"}
                </td>
                {gst ? <td className="px-2.5 py-2 text-right font-medium text-slate-800 whitespace-nowrap">{item.gstSlab}%</td> : null}
                <td className="px-2.5 py-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  {formatCurrency(line?.lineTotal ?? 0, meta.currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <section className="mt-4 ml-auto w-64 text-[11px]">
        <Row label="Taxable value" value={formatCurrency(summary.taxableValue, meta.currency)} />
        {gst && summary.supplyType === "intra" ? (
          <>
            <Row label="CGST" value={formatCurrency(summary.cgst, meta.currency)} />
            <Row label="SGST/UTGST" value={formatCurrency(summary.sgst, meta.currency)} />
          </>
        ) : null}
        {gst && summary.supplyType === "inter" ? (
          <Row label="IGST" value={formatCurrency(summary.igst, meta.currency)} />
        ) : null}
        <Row label="Round off" value={formatCurrency(summary.roundOff, meta.currency)} />
        <div
          className="mt-2 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-white whitespace-nowrap shadow-xs"
          style={{ backgroundColor: color }}
        >
          <span>Total</span>
          <span className="font-mono">{formatCurrency(summary.grandTotal, meta.currency)}</span>
        </div>
      </section>

      {/* Amount in Words clean bar */}
      <div className="my-3.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-[11px] text-slate-800">
        <span className="font-bold text-slate-900">Amount in Words: </span>
        <span className="font-medium italic text-slate-800">{summary.amountInWords}</span>
      </div>

      {config.reverseCharge ? (
        <p className="mt-1 text-[10px] text-slate-500">
          Tax payable under reverse charge: the recipient is liable to pay GST as applicable.
        </p>
      ) : null}

      <section className="mt-5 grid grid-cols-2 gap-4 text-[10px]">
        <div className="rounded-xl border border-slate-200 p-3.5">
          <p className="font-bold text-slate-900 text-[11px]">Bank / Payment Details</p>
          <div className="mt-2 space-y-0.5 text-[10px] text-slate-700">
            <p><span className="text-slate-500">Bank:</span> <strong className="text-slate-900">{seller.bank.bankName}</strong></p>
            <p><span className="text-slate-500">A/C:</span> <strong className="font-mono text-slate-900">{seller.bank.accountNumber}</strong></p>
            <p><span className="text-slate-500">IFSC:</span> <strong className="font-mono text-slate-900">{seller.bank.ifsc}</strong></p>
            <p><span className="text-slate-500">UPI:</span> <strong className="font-mono text-teal-800">{seller.bank.upiId}</strong></p>
          </div>
          {qrDataUrl ? (
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Scan & Pay via UPI</p>
              <div className="h-24 w-24 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="UPI QR Code"
                  width={96}
                  height={96}
                  className="h-24 w-24 aspect-square rounded-lg border border-slate-200 bg-white p-[2px] shadow-2xs"
                />
              </div>
            </div>
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="font-semibold">Terms</p>
          <pre className="mt-1 whitespace-pre-wrap font-sans text-[10px] leading-4 text-slate-600">
            {cleanTerms(meta.terms)}
          </pre>
          <div className="mt-6 text-right">
            {seller.signatureImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={seller.signatureImage} alt="" height={40} className="ml-auto h-10 max-w-[160px] object-contain" />
            ) : null}
            <p className="font-medium">{seller.signatoryName}</p>
            <p className="text-slate-400">Authorised signatory</p>
          </div>
        </div>
      </section>

      <p className="mt-auto pt-6 text-center text-[9px] text-slate-400">
        This is a computer-generated invoice.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-slate-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}

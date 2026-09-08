import { formatDateIN } from "@/lib/format";
import { clientBlock, cleanTerms, formatCurrency, sellerBlock, sanitizeImageUrl, type TemplateProps } from "./shared";

export function CreativeTemplate({ draft, summary, qrDataUrl }: TemplateProps) {
  const { seller, client, items, meta, config } = draft;
  const gst = config.gstMode === "gst";
  const color = config.accentColor;
  const safeSignature = sanitizeImageUrl(seller.signatureImage);

  return (
    <div className="flex min-h-[1122px] flex-col overflow-hidden bg-white text-slate-800">
      <header className="relative px-5 py-6 text-white" style={{ backgroundColor: color }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">SwiftGST</p>
            <h1 className="mt-1 text-2xl font-semibold">{seller.businessName}</h1>
            <p className="mt-1 max-w-sm text-[11px] opacity-90">{sellerBlock(draft)}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-3 text-right backdrop-blur">
            <p className="text-xs uppercase tracking-widest">{gst ? "Invoice" : "Bill of Supply"}</p>
            <p className="text-lg font-semibold">{meta.invoiceNo}</p>
            <p className="text-[11px]">{formatDateIN(meta.invoiceDate)}</p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 px-5 py-5 text-[11px]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
            Client
          </p>
          <p className="mt-1 text-base font-semibold">{client.name}</p>
          <p className="text-slate-500">{clientBlock(draft)}</p>
          {client.gstin ? <p className="mt-1">GSTIN {client.gstin}</p> : null}
        </div>
        <div className="text-right">
          <p>Due {formatDateIN(meta.dueDate)}</p>
          <p>POS {client.placeOfSupply}</p>
          {seller.gstin && gst ? <p>Our GSTIN {seller.gstin}</p> : null}
        </div>
      </section>

      <div className="px-5">
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-[10px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2">HSN</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Qty</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Rate</th>
                {gst ? <th className="px-3 py-2 text-right whitespace-nowrap">GST</th> : null}
                <th className="px-3 py-2 text-right whitespace-nowrap">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-t border-slate-200 text-slate-900">
                  <td className="px-3 py-2.5 font-semibold text-slate-900">{item.description}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-slate-800">{item.hsnSac || "—"}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-slate-900 whitespace-nowrap">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                    {formatCurrency(item.rate, meta.currency)}
                  </td>
                  {gst ? (
                    <td className="px-3 py-2.5 text-right font-medium text-slate-800 whitespace-nowrap">
                      {item.gstSlab}%
                    </td>
                  ) : null}
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(summary.lines[i]?.lineTotal ?? 0, meta.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-5 flex items-start justify-between gap-4 px-5">
        <div className="max-w-[55%] text-[10px] text-slate-700">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-[10px] text-slate-800">
            <span className="font-bold text-slate-900">Amount in Words: </span>
            <span className="font-medium italic text-slate-800">{summary.amountInWords}</span>
          </div>

          {qrDataUrl ? (
            <div className="mt-3.5 flex items-center gap-3">
              <div className="h-20 w-20 aspect-square shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="UPI QR Code"
                  width={80}
                  height={80}
                  className="h-20 w-20 aspect-square rounded-xl border border-slate-200 bg-white p-[2px] shadow-2xs"
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Scan & Pay via UPI</p>
                <p className="font-mono text-[11px] font-bold text-teal-900">{seller.bank.upiId}</p>
                <p className="text-[10px] text-slate-500">{seller.bank.bankName}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="w-64 min-w-[240px] rounded-2xl p-3 text-[11px] text-white" style={{ backgroundColor: color }}>
          <div className="flex justify-between opacity-90 whitespace-nowrap">
            <span>Taxable</span>
            <span>{formatCurrency(summary.taxableValue, meta.currency)}</span>
          </div>
          {gst && summary.supplyType === "intra" ? (
            <>
              <div className="flex justify-between opacity-90 whitespace-nowrap">
                <span>CGST</span>
                <span>{formatCurrency(summary.cgst, meta.currency)}</span>
              </div>
              <div className="flex justify-between opacity-90 whitespace-nowrap">
                <span>SGST</span>
                <span>{formatCurrency(summary.sgst, meta.currency)}</span>
              </div>
            </>
          ) : null}
          {gst && summary.supplyType === "inter" ? (
            <div className="flex justify-between opacity-90 whitespace-nowrap">
              <span>IGST</span>
              <span>{formatCurrency(summary.igst, meta.currency)}</span>
            </div>
          ) : null}
          <div className="flex justify-between opacity-90 whitespace-nowrap">
            <span>Round off</span>
            <span>{formatCurrency(summary.roundOff, meta.currency)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-white/30 pt-2 text-sm font-semibold whitespace-nowrap">
            <span>Total</span>
            <span>{formatCurrency(summary.grandTotal, meta.currency)}</span>
          </div>
        </div>
      </section>

      <footer className="mt-auto flex items-end justify-between px-5 py-6 text-[10px]">
        <pre className="max-w-xs whitespace-pre-wrap font-sans text-slate-500">{cleanTerms(meta.terms)}</pre>
        <div className="text-right">
          {safeSignature ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={safeSignature} alt="" height={40} className="ml-auto h-10 max-w-[160px] object-contain" />
          ) : null}
          <p className="font-semibold">{seller.signatoryName}</p>
          <p className="text-slate-400">Authorised signatory</p>
        </div>
      </footer>
    </div>
  );
}

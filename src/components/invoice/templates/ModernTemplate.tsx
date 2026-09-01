import { formatDateIN } from "@/lib/format";
import { clientBlock, money, sellerBlock, type TemplateProps } from "./shared";

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
            <img src={seller.logo} alt="" className="h-14 w-14 rounded-lg object-cover" />
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
            <th className="px-2 py-2 text-left font-medium">#</th>
            <th className="px-2 py-2 text-left font-medium">Item</th>
            <th className="px-2 py-2 text-left font-medium">HSN/SAC</th>
            <th className="px-2 py-2 text-right font-medium">Qty</th>
            <th className="px-2 py-2 text-right font-medium">Rate</th>
            <th className="px-2 py-2 text-right font-medium">Disc.</th>
            {gst ? <th className="px-2 py-2 text-right font-medium">GST</th> : null}
            <th className="px-2 py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const line = summary.lines[i];
            return (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="px-2 py-2">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{item.description || "—"}</td>
                <td className="px-2 py-2">{item.hsnSac}</td>
                <td className="px-2 py-2 text-right">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-2 py-2 text-right">{money(item.rate, meta.currency)}</td>
                <td className="px-2 py-2 text-right">{money(line?.discountAmount ?? 0, meta.currency)}</td>
                {gst ? <td className="px-2 py-2 text-right">{item.gstSlab}%</td> : null}
                <td className="px-2 py-2 text-right font-medium">{money(line?.lineTotal ?? 0, meta.currency)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <section className="mt-4 ml-auto w-64 text-[11px]">
        <Row label="Taxable value" value={money(summary.taxableValue, meta.currency)} />
        {gst && summary.supplyType === "intra" ? (
          <>
            <Row label="CGST" value={money(summary.cgst, meta.currency)} />
            <Row label="SGST/UTGST" value={money(summary.sgst, meta.currency)} />
          </>
        ) : null}
        {gst && summary.supplyType === "inter" ? (
          <Row label="IGST" value={money(summary.igst, meta.currency)} />
        ) : null}
        <Row label="Round off" value={money(summary.roundOff, meta.currency)} />
        <div
          className="mt-2 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          <span>Total</span>
          <span>{money(summary.grandTotal, meta.currency)}</span>
        </div>
      </section>

      <p className="mt-3 text-[11px] italic text-slate-600">{summary.amountInWords}</p>
      {config.reverseCharge ? (
        <p className="mt-1 text-[10px] text-slate-500">
          Tax payable under reverse charge: the recipient is liable to pay GST as applicable.
        </p>
      ) : null}

      <section className="mt-6 grid grid-cols-2 gap-4 text-[10px]">
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="font-semibold">Bank / UPI</p>
          <p className="mt-1">{seller.bank.bankName}</p>
          <p>A/C: {seller.bank.accountNumber}</p>
          <p>IFSC: {seller.bank.ifsc}</p>
          <p>UPI: {seller.bank.upiId}</p>
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="UPI QR" className="mt-2 h-24 w-24" />
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="font-semibold">Terms</p>
          <pre className="mt-1 whitespace-pre-wrap font-sans text-[10px] leading-4 text-slate-600">
            {meta.terms}
          </pre>
          <div className="mt-6 text-right">
            {seller.signatureImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={seller.signatureImage} alt="" className="ml-auto h-10 object-contain" />
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

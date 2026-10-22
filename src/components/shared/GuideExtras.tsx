export interface GuideBlock {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export function GuideExtras({ title, blocks }: { title: string; blocks: GuideBlock[] }) {
  return (
    <section className="mx-auto mt-12 max-w-4xl space-y-8 text-slate-700">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      {blocks.map((b) => (
        <div key={b.heading}>
          <h3 className="text-lg font-bold text-slate-900">{b.heading}</h3>
          {b.paragraphs?.map((p) => (
            <p key={p} className="mt-2 text-sm leading-relaxed">
              {p}
            </p>
          ))}
          {b.bullets ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {b.bullets.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      <p className="text-xs text-slate-500">
        This is general information, not tax advice. Rules and rates change, so confirm with the
        latest CBIC notification or your chartered accountant.
      </p>
    </section>
  );
}

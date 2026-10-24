'use client';
import { HOME_EXAMPLE_ROWS, HOME_EXAMPLE_SCORES } from '@/shared/const/home.const';
import { useI18n } from '@/shared/hooks/use-i18n';

/** The PRODUCT.md §2 example, set like a page from a printed report. */
export const ExampleComparison = () => {
  const { t } = useI18n();
  const example = t.home.example;

  return (
    <figure className="rounded-lg border border-border bg-card">
      <figcaption className="border-b border-border px-5 py-4 font-heading text-xl">{example.title}</figcaption>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="w-1/4 px-5 py-3 font-normal" />
            <th scope="col" className="px-3 py-3 font-mono text-xs font-normal uppercase tracking-wider text-muted-foreground">
              {example.columnA}
            </th>
            <th scope="col" className="px-3 py-3 pr-5 font-mono text-xs font-normal uppercase tracking-wider text-muted-foreground">
              {example.columnB}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <th scope="row" className="px-5 py-3 font-normal text-muted-foreground">{example.rows.score}</th>
            <td className="px-3 py-3 font-heading text-3xl">
              {HOME_EXAMPLE_SCORES.a}
              <span className="text-sm text-muted-foreground">/100</span>
            </td>
            <td className="px-3 py-3 pr-5 font-heading text-3xl">
              {HOME_EXAMPLE_SCORES.b}
              <span className="text-sm text-muted-foreground">/100</span>
            </td>
          </tr>
          {HOME_EXAMPLE_ROWS.map((row) => (
            <tr key={row} className="align-top">
              <th scope="row" className="px-5 py-3 font-normal text-muted-foreground">{example.rows[row]}</th>
              <td className={row === 'risk' ? 'px-3 py-3 text-brick' : 'px-3 py-3'}>{example.a[row]}</td>
              <td className={row === 'risk' ? 'px-3 py-3 pr-5 text-brick' : 'px-3 py-3 pr-5'}>{example.b[row]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-border px-5 py-4">
        <p className="font-mono text-xs text-muted-foreground">{example.note}</p>
      </div>
    </figure>
  );
};

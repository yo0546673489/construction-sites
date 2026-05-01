/**
 * JsonLd — מטמיע Schema.org structured data בדף.
 * משמש כדי לעזור לגוגל להציג rich snippets (כוכבים, אינפו, מיקום).
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

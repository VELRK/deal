export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  faqs?: FaqItem[] | null;
  title?: string;
  className?: string;
};

export default function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  className = "",
}: Props) {
  const items = (faqs ?? []).filter(
    (f) => f?.question?.trim() && f?.answer?.trim(),
  );
  if (!items.length) return null;

  return (
    <section className={`seo-faq-section py-4 ${className}`.trim()}>
      <div className="container">
        <h3 className="font-classic mb-3">{title}</h3>
        <div className="d-grid gap-3">
          {items.map((faq, i) => (
            <details
              key={`${i}-${faq.question.slice(0, 24)}`}
              className="seo-faq-item border-bottom pb-3"
              open={i === 0}
            >
              <summary className="fw-semibold" style={{ cursor: "pointer" }}>
                {faq.question}
              </summary>
              <div
                className="text-body-1 cl-text-2 mt-2"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

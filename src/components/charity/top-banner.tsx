import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

/**
 * באנר עליון full-width עם:
 *  - תמונה במלוא הרוחב (h-auto, ratio טבעי)
 *  - overlay כחול-כהה עדין (12%) להתאמה לפלטה
 *  - אנימציית slow-zoom איטית (22s loop)
 */
export function TopBanner({ src, alt }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* container עם overflow:hidden כדי שה-zoom לא יחרוג */}
      <div className="relative w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={1672}
          height={941}
          priority
          sizes="100vw"
          className="block h-auto w-full slow-zoom"
        />
        {/* overlay עדין — מוסיף עומק וקושר לפלטת המותג */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,30,55,0.05) 0%, transparent 25%, transparent 70%, rgba(15,30,55,0.18) 100%)",
          }}
        />
      </div>
    </section>
  );
}

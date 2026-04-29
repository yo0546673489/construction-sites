"use client";

import Image from "next/image";

type Item = { src: string; caption: string };

type Props = {
  items: Item[];
};

/**
 * Ken Burns gallery — תמונות עם זום איטי מתמשך.
 * כל תמונה מבצעת לולאת זום עדינה משלה (delays שונים → לא סינכרון).
 */
export function KenBurnsGallery({ items }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      {items.map((img, i) => {
        // גודל משתנה לפי אינדקס — feel "מסונרי" יותר
        const isLarge = i === 0 || i === 4;
        const aspect = isLarge ? "aspect-[4/5]" : "aspect-[3/4]";
        const colSpan = isLarge ? "md:col-span-2 md:row-span-2" : "";
        // delays שונים כדי שכל תמונה תזוז בקצב משלה
        const animDelay = `${(i * 1.3) % 6}s`;

        return (
          <figure
            key={`${img.src}-${i}`}
            className={`group relative overflow-hidden rounded-3xl bg-zinc-200 shadow-md ${colSpan}`}
          >
            <div className={`relative ${aspect} ${isLarge ? "md:aspect-auto md:h-full" : ""}`}>
              <Image
                src={img.src}
                alt={img.caption}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover ken-burns"
                style={{ animationDelay: animDelay }}
              />
              {/* gradient תחתון לקריאות הכיתוב */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent transition-opacity group-hover:opacity-90" />
              {/* כיתוב */}
              <figcaption className="absolute right-5 bottom-5 left-5 translate-y-2 opacity-90 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-md md:text-base">
                  {img.caption}
                </span>
              </figcaption>
            </div>
          </figure>
        );
      })}
    </div>
  );
}

"use client";

import Image from "next/image";
import { Reveal } from "./reveal";

type Item = { src: string; caption: string };

type Props = {
  items: Item[];
};

/**
 * Gallery — גריד אחיד 2/3 עמודות (לא מסונרי), יחס תמונה זהה (4/5),
 * רווחים שווים, פינות אחידות. כל אריח עם:
 *   - Ken Burns slow zoom (16s loop, delays שונים → לא מסונכרן)
 *   - Reveal-zoom בכניסה לתצוגה
 *   - hover-lift + overlay טקסט שעולה ב-hover
 */
export function KenBurnsGallery({ items }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
      {items.map((img, i) => {
        const animDelay = `${(i * 1.3) % 6}s`;

        return (
          <Reveal
            key={`${img.src}-${i}`}
            variant="zoom"
            delayMs={(i % 3) * 100}
            as="figure"
          >
            <div className="group hover-lift relative overflow-hidden rounded-2xl bg-zinc-200 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-200/60">
              <div className="relative aspect-[4/5]">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover ken-burns"
                  style={{ animationDelay: animDelay }}
                />
                {/* gradient תחתון לקריאות הכיתוב */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
                {/* כיתוב — מופיע ב-hover */}
                <figcaption className="absolute right-4 bottom-4 left-4 translate-y-3 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md md:text-sm">
                    {img.caption}
                  </span>
                </figcaption>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

/**
 * באנר עליון full-width — נטען עם הגודל הטבעי של הקובץ (banner.png הוא 1672×941),
 * נמתח לרוחב מלא של המסך עם גובה אוטומטי שמשמר את הפרופורציות.
 *
 * `object-cover` מבטיח שאין רקע לבן בצדדים — אפילו אם תחליף לבאנר עם יחס שונה.
 */
export function TopBanner({ src, alt }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* תמונה עם גובה אוטומטי — לא חותכת, ממלאה את כל הרוחב */}
      <Image
        src={src}
        alt={alt}
        width={1672}
        height={941}
        priority
        sizes="100vw"
        className="block h-auto w-full"
      />
    </section>
  );
}

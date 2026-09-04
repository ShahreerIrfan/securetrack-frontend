import Image from "next/image";
import clsx from "clsx";

export interface SectionHeadingProps {
  /** Small uppercase label above the heading, e.g. "OUR SERVICES". */
  eyebrow: string;
  /** First heading line - rendered solid. */
  title: string;
  /** Second heading line - rendered through the brand gradient. */
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  /** Dark navy sections invert the eyebrow and heading to white. */
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  description,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={clsx(
        centered && "mx-auto max-w-2xl text-center",
        !centered && "max-w-xl",
        className,
      )}
    >
      <span
        className={clsx(
          "inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em]",
          tone === "dark" ? "text-white" : "text-brand",
        )}
      >
        <Image src="/icons/shield.svg" alt="" width={16} height={16} className="size-4" />
        {eyebrow}
      </span>

      <h2
        className={clsx(
          "mt-3 font-display text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[42px]",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {title}
        {titleAccent && (
          <>
            {" "}
            <span className="text-brand-gradient">{titleAccent}</span>
          </>
        )}
      </h2>

      {description && (
        <p
          className={clsx(
            "mt-4 text-[15px] leading-relaxed",
            tone === "dark" ? "text-white/70" : "text-slate",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

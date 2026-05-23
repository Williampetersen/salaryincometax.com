import Image from "next/image";

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
  flagSrc?: string;
  className?: string;
  size?: number;
}

export function CountryFlag({
  countryCode,
  countryName,
  flagSrc,
  className,
  size = 28,
}: CountryFlagProps): JSX.Element {
  if (flagSrc) {
    return (
      <Image
        alt={`${countryName} flag`}
        className={className ?? "rounded-full object-cover"}
        height={size}
        src={flagSrc}
        width={size}
      />
    );
  }

  return (
    <span
      className={
        className ??
        "flex items-center justify-center rounded-full bg-ink/10 text-[11px] font-bold text-ink"
      }
      style={{ height: size, width: size }}
    >
      {countryCode}
    </span>
  );
}

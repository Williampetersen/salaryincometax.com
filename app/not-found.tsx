import Link from "next/link";

export default function NotFound(): JSX.Element {
  return (
    <div className="shell py-20">
      <div className="panel max-w-2xl p-8">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-bold">
          That calculator route does not exist.
        </h1>
        <p className="mt-4 text-sm leading-7 text-ink/65">
          Pick one of the supported country pages from the homepage to continue.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-semibold text-white transition hover:bg-coral"
          href="/"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}

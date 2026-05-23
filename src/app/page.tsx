import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link
        href="/dashboard"
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Go To Dashboard
      </Link>
    </div>
  );
}
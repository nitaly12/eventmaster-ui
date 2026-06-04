import Link from "next/link";

export default function RegisterNotFound() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-2xl font-bold text-[#1D2939]">Event not found</h1>
      <p className="mt-3 text-[#667085]">
        We could not find this event registration.
      </p>
      <Link
        href="/#content"
        className="mt-8 inline-flex rounded-full bg-[#7939EF] px-8 py-3 text-sm font-semibold text-white no-underline"
      >
        Back to events
      </Link>
    </div>
  );
}

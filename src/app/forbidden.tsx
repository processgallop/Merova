import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f5f1eb] px-6 text-center">
      <p className="eyebrow">Access restricted</p>
      <h1 className="mt-4 font-display text-3xl font-bold">You don&apos;t have permission to view this.</h1>
      <p className="mt-2 max-w-md text-sm">Your role does not include this area. Ask a Super Administrator if you need access.</p>
      <Link href="/admin" className="btn btn-sm mt-6"><span>Back to dashboard</span></Link>
    </div>
  );
}

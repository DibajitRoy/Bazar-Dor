import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-black text-primary">404</h1>

      <div className="my-4 flex items-center justify-center gap-3">
        <span className="h-px w-16 bg-green-400"></span>
        <span className="h-2 w-2 rounded-full bg-green-600"></span>
        <span className="h-px w-16 bg-green-400"></span>
      </div>

      <h2 className="mb-2 text-2xl font-bold">পেজটি খুঁজে পাওয়া যায়নি</h2>
      <p className="mb-6 text-neutral-600">
        আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা সরিয়ে নেওয়া হয়েছে।
      </p>

      <Link href="/" className="btn btn-primary rounded-full px-8">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default NotFound;
import Link from "next/link";

const EmptyState = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="bg-gradient-to-b from-green-500 to-green-800 bg-clip-text text-8xl font-black leading-none text-transparent select-none sm:text-9xl">
        404
      </h1>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px w-16 bg-green-400" />
        <span className="size-2 rounded-full bg-green-600" />
        <span className="h-px w-16 bg-green-400" />
      </div>

      <h2 className="mb-2 text-2xl font-bold sm:text-3xl">{title}</h2>
      <p className="mb-6 max-w-md text-neutral-600">{message}</p>

      <Link href="/" className="btn btn-primary rounded-full px-8">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default EmptyState;
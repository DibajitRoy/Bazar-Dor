"use client";

import { authClient } from "@/lib/auth-client";
import { signOutWithToast } from "@/lib/sign-out";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSignout = () => {
    signOutWithToast(() => {
      router.push("/");
      router.refresh();
    });
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-24 rounded-box" />
        <div className="skeleton h-40 rounded-box" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="mb-4 text-sm text-neutral-600">
        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
      </p>

      <div className="mb-4 flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="avatar avatar-placeholder">
            <div className="size-16 rounded-2xl bg-primary text-2xl text-primary-content">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={user.name} src={user.image} />
              ) : (
                <span>{user?.name?.charAt(0)}</span>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.name}</h2>
            <p className="text-sm text-neutral-600">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleSignout}
          className="btn btn-outline btn-error btn-sm"
        >
          ↩ সাইন আউট
        </button>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-5">
        <h3 className="mb-3 font-bold">তথ্য</h3>
        <div className="mb-4 space-y-1 text-sm">
          <p>
            <span className="text-neutral-500">নাম: </span>
            {user?.name}
          </p>
          <p>
            <span className="text-neutral-500">ইমেইল: </span>
            {user?.email}
          </p>
        </div>

        <Link href="/profile/update" className="btn btn-primary w-full">
          তথ্য আপডেট করুন
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
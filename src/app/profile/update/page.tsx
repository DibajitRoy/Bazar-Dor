"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { signOutWithToast } from "@/lib/sign-out";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UpdateProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  const handleSignout = () => {
    signOutWithToast(() => {
      router.push("/");
      router.refresh();
    });
  };

  const handleUpdateProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      toast.error("নাম লিখুন");
      return;
    }

    setLoading(true);
    const { error } = await authClient.updateUser({ name });
    setLoading(false);

    if (error) {
      toast.error(error.message || "তথ্য আপডেট করা যায়নি");
      return;
    }

    toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
    router.push("/profile");
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-64" />
        <div className="skeleton h-24 rounded-box" />
        <div className="skeleton h-52 rounded-box" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="mb-4 text-sm text-neutral-600">
        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
      </p>

      <div className="space-y-4">
        
        <div className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="avatar avatar-placeholder">
              <div className="size-16 rounded-2xl bg-primary text-2xl text-primary-content">
                {user?.image ? (
                 
                  <img alt="" src={user.image} referrerPolicy="no-referrer" />
                ) : (
                  <span>{user?.name?.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold">{user?.name}</h2>
              <p className="truncate text-sm text-neutral-600">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignout}
            className="btn btn-outline btn-error btn-sm shrink-0"
          >
            ↩ সাইন আউট
          </button>
        </div>

        
        <div className="rounded-box border border-base-300 bg-base-100 p-5">
          <h3 className="mb-3 font-bold">তথ্য</h3>

         
          <form key={user?.id} onSubmit={handleUpdateProfile}>
            <fieldset className="fieldset">
              <label className="label">নাম</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={user?.name}
                className="input w-full"
                placeholder="আপনার নাম"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary mt-4 w-full"
              >
                {loading && <span className="loading loading-spinner loading-sm" />}
                আপডেট
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
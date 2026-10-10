"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UpdateProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

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
      <div className="mx-auto max-w-md space-y-4 py-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-40 rounded-box" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-6">
      <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
      <p className="mb-4 text-sm text-neutral-600">আপনার নাম পরিবর্তন করুন।</p>

      <div className="rounded-box border border-base-300 bg-base-100 p-5 sm:p-6">
       
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
              className="btn btn-primary mt-4"
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              তথ্য আপডেট করুন
            </button>
          </fieldset>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-neutral-500">
        <Link href="/profile">← প্রোফাইলে ফিরে যান</Link>
      </p>
    </div>
  );
};

export default UpdateProfilePage;
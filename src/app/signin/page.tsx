"use client";

import { Suspense, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const SignInForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  // login এর পর যেখানে ফিরবে (শুধু নিজের সাইটের path)
  const raw = params.get("redirect");
  const redirectTo =
    raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";

  // protected পেজ থেকে এলে toast
  useEffect(() => {
    if (params.get("from") === "protected") {
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন", { id: "protected" });
    }
  }, [params]);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    setLoading(true);
    const { data, error } = await authClient.signIn.email(user);
    setLoading(false);

    if (error) {
      toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল");
      return;
    }

    if (data) {
      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold">সাইন ইন</h1>
        <p className="text-sm text-neutral-600">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-5 sm:p-6">
        <form onSubmit={onSubmit}>
          <fieldset className="fieldset">
            <label className="label">ইমেইল</label>
            <input
              name="email"
              type="email"
              required
              className="input w-full"
              placeholder="you@example.com"
            />

            <label className="label">পাসওয়ার্ড</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="input w-full"
              placeholder="কমপক্ষে ৮ অক্ষর"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-4"
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              সাইন ইন
            </button>
          </fieldset>
        </form>

        <div className="divider text-xs">অথবা</div>

        <SocialButtons callbackURL={redirectTo} />

        <p className="mt-5 text-center text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-semibold text-primary">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <p className="mt-5 text-center text-sm text-neutral-500">
        <Link href="/">← হোম পেজে ফিরে যান</Link>
      </p>
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense
      fallback={<div className="skeleton mx-auto h-96 max-w-md rounded-box" />}
    >
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
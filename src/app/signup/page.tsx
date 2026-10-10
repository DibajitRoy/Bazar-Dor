"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    if (user.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);
    const { data, error } = await authClient.signUp.email({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
      return;
    }

    if (data) {
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
      router.push("/signin");
    }
  };

  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="text-sm text-neutral-600">
          বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-5 sm:p-6">
        <form onSubmit={onSubmit}>
          <fieldset className="fieldset">
            <label className="label">নাম</label>
            <input
              name="name"
              type="text"
              required
              className="input w-full"
              placeholder="যেমন: রহিম উদ্দিন"
            />

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

            <label className="label">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="input w-full"
              placeholder="আবার লিখুন"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-4"
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              অ্যাকাউন্ট তৈরি করুন
            </button>
          </fieldset>
        </form>

        <div className="divider text-xs">অথবা</div>

        <SocialButtons callbackURL="/" />

        <p className="mt-5 text-center text-sm">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-semibold text-primary">
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <p className="mt-5 text-center text-sm text-neutral-500">
        <Link href="/">← হোম পেজে ফিরে যান</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
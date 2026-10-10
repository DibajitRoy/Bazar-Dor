"use client";

import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SocialButtons = ({ callbackURL = "/" }: { callbackURL?: string }) => {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackURL,
    });
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: callbackURL,
    });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button onClick={handleGoogleSignIn} className="btn btn-sm h-10 text-xs">
        <FcGoogle size={18} />
        Google দিয়ে চালিয়ে যান
      </button>

      <button onClick={handleGithubSignIn} className="btn btn-sm h-10 text-xs">
        <FaGithub size={18} />
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
};

export default SocialButtons;
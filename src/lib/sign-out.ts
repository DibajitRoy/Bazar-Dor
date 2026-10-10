import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export const signOutWithToast = async (onDone?: () => void) => {
  const { error } = await authClient.signOut();

  if (error) {
    toast.error(error.message || "সাইন আউট করা যায়নি");
    return;
  }

  toast.success("সফলভাবে সাইন আউট হয়েছে");
  onDone?.();
};
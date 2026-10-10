"use client";

import { authClient } from "@/lib/auth-client";
import { signOutWithToast } from "@/lib/sign-out";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserInfo = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;


  const closeMenu = () => (document.activeElement as HTMLElement | null)?.blur();

  const handleSignout = () => {
    closeMenu();
    signOutWithToast(() => {
      router.push("/");
      router.refresh();
    });
  };

  if (isPending) {
    return <div className="skeleton h-9 w-28 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/signin" className="btn btn-ghost btn-sm sm:btn-md">
          সাইন ইন
        </Link>
        <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-sm sm:btn-md gap-2"
      >
       
        <div className="avatar avatar-placeholder">
          <div className="size-8 rounded-full bg-primary text-primary-content">
            {user.image ? (
          
              <img alt="" src={user.image} referrerPolicy="no-referrer" />
            ) : (
              <span className="text-sm">{user.name?.charAt(0)}</span>
            )}
          </div>
        </div>
        <span className="hidden max-w-24 truncate text-sm sm:inline">
          {user.name}
        </span>
        <span className="text-[10px] text-neutral-500">▾</span>
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-4 shadow-lg"
      >
        <p className="font-semibold">{user.name}</p>
        <p className="truncate text-xs text-neutral-500">{user.email}</p>
        <div className="my-3 border-t border-base-300" />
        <Link
          href="/profile"
          onClick={closeMenu}
          className="block py-1 text-sm hover:text-primary"
        >
          👤 আমার প্রোফাইল
        </Link>
        <button
          onClick={handleSignout}
          className="mt-1 cursor-pointer py-1 text-sm text-red-600"
        >
          ↩ সাইন আউট
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
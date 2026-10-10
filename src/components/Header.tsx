import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import UserInfo from "./UserInfo";
import { getCategories } from "@/lib/api";
import { getBanglaDate } from "@/lib/format";

const Header = async () => {
  const date = getBanglaDate();
  const categories = await getCategories();

  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 pt-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary sm:size-10">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={22}
                height={22}
                className="brightness-0 invert"
                priority
              />
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-base font-bold sm:text-lg">বাজার দর</span>
              <span className="text-[10px] text-neutral-500 sm:text-xs">{date}</span>
            </div>
          </Link>

          <div className="shrink-0">
            <UserInfo />
          </div>
        </div>

        <NavLinks categories={categories} />
      </div>
    </header>
  );
};

export default Header;
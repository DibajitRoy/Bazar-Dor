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
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={22}
                height={22}
                className="brightness-0 invert"
                priority
              />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold">বাজার দর</span>
              <span className="text-xs text-neutral-500">{date}</span>
            </div>
          </Link>

          <UserInfo />
        </div>

        <NavLinks categories={categories} />
      </div>
    </header>
  );
};

export default Header;
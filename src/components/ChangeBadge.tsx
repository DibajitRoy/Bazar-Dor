import TrendIcon, { getTrend } from "./TrendIcon";
import { formatPercent } from "@/lib/format";

const ChangeBadge = ({ change }: { change: number }) => {
  const dir = getTrend(change);

  const style =
    dir === "up"
      ? "bg-red-50 text-red-600"
      : dir === "down"
        ? "bg-green-50 text-green-700"
        : "bg-base-200 text-neutral-500";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${style}`}
    >
      <TrendIcon dir={dir} className="size-2.5" />
      {formatPercent(change)}
    </span>
  );
};

export default ChangeBadge;
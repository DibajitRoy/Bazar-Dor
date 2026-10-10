export type Trend = "up" | "down" | "flat";

export const getTrend = (change: number): Trend =>
  change > 0 ? "up" : change < 0 ? "down" : "flat";

const TrendIcon = ({
  dir,
  className = "size-3",
}: {
  dir: Trend;
  className?: string;
}) => {
  if (dir === "flat") {
    return (
      <svg
        viewBox="0 0 16 16"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M3 8h10" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {dir === "up" ? <path d="M8 3 14.5 13h-13z" /> : <path d="M8 13 1.5 3h13z" />}
    </svg>
  );
};

export default TrendIcon;
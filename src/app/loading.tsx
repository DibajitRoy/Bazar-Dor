import ProductGridSkeleton from "@/components/ProductGridSkeleton";

const Loading = () => {
  return (
    <div className="space-y-8">
      <div className="skeleton h-56 rounded-box" />
      <div className="space-y-4">
        <div className="skeleton h-6 w-40" />
        <ProductGridSkeleton />
      </div>
      <div className="space-y-4">
        <div className="skeleton h-6 w-40" />
        <ProductGridSkeleton />
      </div>
    </div>
  );
};

export default Loading;
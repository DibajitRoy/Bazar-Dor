import ProductGridSkeleton from "@/components/ProductGridSkeleton";

const CategoryLoading = () => {
  return (
    <div className="space-y-4">
      <div className="skeleton h-20 rounded-box" />
      <div className="skeleton h-16 rounded-box" />
      <ProductGridSkeleton count={6} />
    </div>
  );
};

export default CategoryLoading;
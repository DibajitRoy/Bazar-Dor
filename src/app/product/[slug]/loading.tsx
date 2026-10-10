const ProductLoading = () => {
  return (
    <div className="space-y-5">
      <div className="skeleton h-5 w-48" />
      <div className="skeleton h-36 rounded-box" />
      <div className="skeleton h-96 rounded-box" />
    </div>
  );
};

export default ProductLoading;
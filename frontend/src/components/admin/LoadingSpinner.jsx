import React from "react";

const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default LoadingSpinner;
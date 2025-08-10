import React from "react";

const ErrorMessage = ({ error }) =>
  error ? (
    <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-3 mb-4">
      {error}
    </div>
  ) : null;

export default ErrorMessage;
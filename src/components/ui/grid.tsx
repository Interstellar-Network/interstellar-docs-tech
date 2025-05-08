import React from "react";

export function Grid({ children }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {children}
    </div>
  );
}
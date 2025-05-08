import * as React from "react";
import clsx from "clsx";

type BadgeType = 
| "yes" 
| "no" 
| "high" 
| "medium" 
| "low" 
| "very-high" 
| "unknown";


const badgeStyles: Record<BadgeType, string> = {
  yes: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  no: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  high: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "very-high": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  unknown: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const badgeIcons: Record<BadgeType, string> = {
  yes: "✅",
  no: "❌",
  high: "🟢",
  "very-high": "🚀",
  medium: "⚠️",
  low: "🟠",
  unknown: "❓",
};

interface BadgeProps {
  value: BadgeType;
  label?: string;
}

export function Badge({ value, label }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
        badgeStyles[value]
      )}
    >
      {badgeIcons[value]} {label ?? value.replace("-", " ")}
    </span>
  );
}


export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-100 text-left dark:bg-gray-800">
      <tr className="border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </tr>
    </thead>
  );
}



interface FeatureTableProps {
  headers: string[];
  rows: (React.ReactNode | BadgeType)[][];
}

export function FeatureTable({ headers, rows }: FeatureTableProps) {
  return (
    <div className="overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left table-auto">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-4 py-2 font-semibold whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black">
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 whitespace-nowrap">
                  {typeof cell === "string" && badgeStyles[cell as BadgeType] ? (
                    <Badge value={cell as BadgeType} />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

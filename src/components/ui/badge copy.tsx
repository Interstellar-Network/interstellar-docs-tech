import * as React from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Rocket,
  HelpCircle,
  Gauge,
  MinusCircle,
  Minus,
} from "lucide-react";
import clsx from "clsx";

export type BadgeType =
  | "yes"
  | "no"
  | "high"
  | "medium"
  | "low"
  | "very-high"
  | "partial"
  | "unknown";

const badgeStyles: Record<BadgeType, string> = {
  yes: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  no: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  high: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "very-high": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  partial: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  unknown: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const badgeIconsLucide: Record<BadgeType, React.ReactNode> = {
  yes: <CheckCircle size={16} className="stroke-current" />,
  no: <XCircle size={16} className="stroke-current" />,
  high: <Gauge size={16} className="stroke-current" />,
  "very-high": <Rocket size={16} className="stroke-current" />,
  medium: <AlertCircle size={16} className="stroke-current" />,
  low: <MinusCircle size={16} className="stroke-current" />,
  partial: <Minus size={16} className="stroke-current" />, // new icon
  unknown: <HelpCircle size={16} className="stroke-current" />,
};

const badgeEmojis: Record<BadgeType, string> = {
  yes: "✅",
  no: "❌",
  high: "🟢",
  "very-high": "🚀",
  medium: "⚠️",
  low: "🟠",
  partial: "➖",
  unknown: "❓",
};

interface BadgeProps {
  value: BadgeType;
  label?: string;
  useEmoji?: boolean;
  customIcon?: React.ReactNode;
}

export function Badge({ value, label, useEmoji = false, customIcon }: BadgeProps) {
  const icon = customIcon
    ? customIcon
    : useEmoji
    ? badgeEmojis[value]
    : badgeIconsLucide[value];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
        badgeStyles[value]
      )}
    >
      {icon} {label ?? value.replace("-", " ")}
    </span>
  );
}

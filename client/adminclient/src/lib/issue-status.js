import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

/**
 * Single source of truth for how an issue status is labelled, coloured and
 * iconed. Every list, card and table reads from here.
 */
export const ISSUE_STATUS = {
  pending: {
    label: "Pending",
    icon: Clock,
    badge: "pending",
    bar: "w-1/3 bg-amber-500",
  },
  inprogress: {
    label: "In Progress",
    icon: AlertTriangle,
    badge: "progress",
    bar: "w-2/3 bg-blue-500",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    badge: "resolved",
    bar: "w-full bg-emerald-500",
  },
};

export function getStatusInfo(status) {
  return ISSUE_STATUS[status] || ISSUE_STATUS.pending;
}

/** "3 days ago" / "12 minutes ago" — used on issue cards. */
export function formatRelativeTime(value) {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.floor((Date.now() - then) / 1000);
  const units = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, size] of units) {
    const amount = Math.floor(seconds / size);
    if (amount > 0) return `${amount} ${unit}${amount === 1 ? "" : "s"} ago`;
  }
  return `${Math.max(seconds, 0)} seconds ago`;
}

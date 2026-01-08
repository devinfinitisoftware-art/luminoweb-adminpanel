import React from "react";
import {
  FiTarget,
  FiUsers,
  FiStar,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import Card from "../ui/shared/Card";
import { useTimeframe, TIMEFRAMES } from "../../context/TimeframeContext";
import { api } from "../../utils/api";
import LoadingSpinner from "../ui/shared/LoadingSpinner";

const defaultMetrics = [
  {
    id: "totalActivities",
    label: "Total Activities",
    value: 0,
    delta: "0% vs Last Month",
    trend: "neutral",
    icon: FiTarget,
  },
  {
    id: "activeUsers",
    label: "Active Users",
    value: 0,
    delta: "0% vs Last Month",
    trend: "neutral",
    icon: FiUsers,
  },
  {
    id: "avgRating",
    label: "Avg. Rating",
    value: 0,
    delta: "0% vs Last Month",
    trend: "neutral",
    icon: FiStar,
    isRaw: true,
    hidePerTimeframe: true,
  },
  {
    id: "badgesEarned",
    label: "Badges Earned",
    value: 0,
    delta: "0% vs Last Month",
    trend: "neutral",
    icon: FiAward,
  },
];

const getDeltaColor = (trend) => {
  if (trend === "up") return "text-emerald-500";
  if (trend === "down") return "text-rose-500";
  return "text-slate-500";
};

const scaleFactor = (tf) => {
  switch (tf) {
    case "day":
      return 0.03;
    case "week":
      return 0.25;
    case "month":
      return 1;
    case "year":
      return 12;
    default:
      return 1;
  }
};

const tfLabel = (key) => TIMEFRAMES.find((t) => t.key === key)?.label || key;

const DashboardMetrics = ({ metrics: propMetrics }) => {
  const { timeframe } = useTimeframe();
  const [metrics, setMetrics] = React.useState(defaultMetrics);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      // Only show loading on initial load when there's no data
      const hasNoData = metrics.length === 0 || metrics.every(m => m.value === 0);
      if (hasNoData) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Fetch platform stats and activity stats
        const [platformStats, activityStats] = await Promise.all([
          api.getPlatformStats(),
          api.getAdminActivityStats('30d'),
        ]);

        // Calculate percentage change
        const calculateDelta = (current, previous) => {
          // If previous is not available, return null to indicate no comparison available
          if (previous === undefined || previous === null) {
            return null;
          }
          
          if (previous === 0) {
            // If previous was 0 and current > 0, it's infinite increase
            if (current > 0) {
              return { value: "∞", trend: "up" };
            }
            return { value: "0%", trend: "neutral" };
          }
          
          const change = ((current - previous) / previous) * 100;
          const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
          const sign = change > 0 ? "+" : "";
          return { value: `${sign}${Math.round(change)}%`, trend };
        };

        // Get current values
        const currentTotalActivities = activityStats.cards?.totalActivities || platformStats.totalActivities || 0;
        const currentActiveUsers = platformStats.totalSubscribers || 0;
        const currentAvgRating = activityStats.cards?.avgRatingGlobal || 0;
        const currentCompletedActivities = activityStats.cards?.totalCompletedActivities || platformStats.TotalActvitiesCompleted || 0;

        // Note: Backend doesn't currently support previous period queries
        // For now, we'll show "-" to indicate comparison data is not available
        // TODO: Implement previous period comparison when backend supports it
        
        // Calculate deltas (all will be null since we don't have previous period data)
        const totalActivitiesDelta = null;
        const activeUsersDelta = null;
        const avgRatingDelta = null;
        const completedActivitiesDelta = null;

        // Helper to format delta display
        const formatDelta = (delta) => {
          if (delta === null) {
            return { text: "—", trend: "neutral" };
          }
          return { text: `${delta.value} vs Last Month`, trend: delta.trend };
        };

        // Map API data to metrics
        const newMetrics = [
          {
            id: "totalActivities",
            label: "Total Activities",
            value: currentTotalActivities,
            delta: formatDelta(totalActivitiesDelta).text,
            trend: formatDelta(totalActivitiesDelta).trend,
            icon: FiTarget,
          },
          {
            id: "activeUsers",
            label: "Active Users",
            value: currentActiveUsers,
            delta: formatDelta(activeUsersDelta).text,
            trend: formatDelta(activeUsersDelta).trend,
            icon: FiUsers,
          },
          {
            id: "avgRating",
            label: "Avg. Rating",
            value: currentAvgRating,
            delta: formatDelta(avgRatingDelta).text,
            trend: formatDelta(avgRatingDelta).trend,
            icon: FiStar,
            isRaw: true,
            hidePerTimeframe: true,
          },
          {
            id: "badgesEarned",
            label: "Completed Activities",
            value: currentCompletedActivities,
            delta: formatDelta(completedActivitiesDelta).text,
            trend: formatDelta(completedActivitiesDelta).trend,
            icon: FiAward,
          },
        ];

        setMetrics(newMetrics);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        setError(err.message);
        // Keep default metrics on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Use propMetrics if provided (for testing/override), otherwise use fetched metrics
  const displayMetrics = propMetrics || metrics;
  const factor = scaleFactor(timeframe);

  // Show loading only on initial load when there's no data
  if (isLoading && (metrics.length === 0 || metrics.every(m => m.value === 0))) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex min-h-[7.5rem] items-center justify-center rounded-2xl border border-slate-100 bg-white/95 px-4 py-3.5 shadow-sm">
            <LoadingSpinner size="sm" showLabel={false} />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
        Error loading metrics: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {displayMetrics.map((metric) => {
        const Icon = metric.icon || FiTrendingUp;
        const isRaw = metric.isRaw || false;
        const hidePerTimeframe = metric.hidePerTimeframe || false;

        const rawValue = metric.value;
        let displayValue = rawValue;

        if (!isRaw && typeof rawValue === "number") {
          displayValue =
            Math.round((rawValue * factor + Number.EPSILON) * 100) / 100;
        }

        if (typeof displayValue === "number") {
          displayValue = displayValue.toLocaleString("en-US");
        }

        const replacedDelta = (metric.delta || "").replace(
          /Last Month/gi,
          `Last ${tfLabel(timeframe)}`
        );
        const match = replacedDelta.match(/^([+\-]?\d+%)(.*)$/);
        const deltaValue = match ? match[1] : replacedDelta;
        const deltaSuffix = match ? match[2].trim() : "";
        
        // Don't show delta if it's null, empty, or "—"
        const shouldShowDelta = metric.delta && metric.delta !== "—" && metric.delta.trim() !== "";

        return (
          <Card
            key={metric.id}
            className="flex flex-col rounded-2xl border border-slate-100 bg-white/95 px-4 py-3.5 shadow-sm"
          >
            {/* Top row: icon + delta */}
            <div className="flex items-start justify-between">
              <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F0FF] text-[#3B82F6]">
                <Icon className="text-lg" />
              </div>
              {shouldShowDelta && (
                <div className="flex items-center text-[11px] font-medium">
                  <span className={getDeltaColor(metric.trend)}>
                    {deltaValue}
                  </span>
                  {deltaSuffix && (
                    <span className="ml-1 text-slate-500">{deltaSuffix}</span>
                  )}
                </div>
              )}
            </div>

            {/* Label */}
            <div className="mt-2 text-xs text-slate-600">{metric.label}</div>

            {/* Value */}
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {displayValue}
              {!hidePerTimeframe && !isRaw && (
                <span className="ml-1 text-xs font-normal text-slate-500">
                  / {tfLabel(timeframe)}
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ChartCard from "../ui/shared/ChartCard";
import SelectField from "../ui/shared/SelectField";
import { useTimeframe } from "../../context/TimeframeContext";
import { api } from "../../utils/api";
import LoadingSpinner from "../ui/shared/LoadingSpinner";

const baseDataByRange = {
  this_month: [
    { name: "Emotional Health", value: 40, color: "#FF6B81", trend: "up" },
    { name: "Self-care", value: 25, color: "#C084FC", trend: "down" },
    { name: "Entrepreneurship", value: 15, color: "#F97316", trend: "up" },
    { name: "Gratitude", value: 15, color: "#22C55E", trend: "up" },
    { name: "Financial Literacy", value: 5, color: "#38BDF8", trend: "down" },
  ],
  last_month: [
    { name: "Emotional Health", value: 35, color: "#FF6B81", trend: "down" },
    { name: "Self-care", value: 28, color: "#C084FC", trend: "up" },
    { name: "Entrepreneurship", value: 16, color: "#F97316", trend: "up" },
    { name: "Gratitude", value: 14, color: "#22C55E", trend: "down" },
    { name: "Financial Literacy", value: 7, color: "#38BDF8", trend: "up" },
  ],
  this_year: [
    { name: "Emotional Health", value: 38, color: "#FF6B81", trend: "up" },
    { name: "Self-care", value: 24, color: "#C084FC", trend: "down" },
    { name: "Entrepreneurship", value: 18, color: "#F97316", trend: "up" },
    { name: "Gratitude", value: 15, color: "#22C55E", trend: "up" },
    { name: "Financial Literacy", value: 5, color: "#38BDF8", trend: "down" },
  ],
};

const timeRangeOptions = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
];

// Color mapping for learning domains
const getColorForDomain = (domain, index) => {
  const colorMap = {
    'Emotional Health': '#FF6B81',
    'Self-care': '#C084FC',
    'Entrepreneurship': '#F97316',
    'Gratitude': '#22C55E',
    'Financial Literacy': '#38BDF8',
  };
  
  const defaultColors = ['#FF6B81', '#C084FC', '#F97316', '#22C55E', '#38BDF8', '#8B5CF6', '#EC4899', '#14B8A6'];
  
  return colorMap[domain] || defaultColors[index % defaultColors.length];
};

const CompletionBreakdownChart = () => {
  const [range, setRange] = React.useState("this_month");
  const [donutData, setDonutData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { timeframe } = useTimeframe();

  React.useEffect(() => {
    const fetchData = async () => {
      // Only show loading on initial load or if we have no data
      if (donutData.length === 0) {
        setIsLoading(true);
      }
      setError(null);

      try {
        
        // Map range to API range format
        const rangeMap = {
          'this_month': '30d',
          'last_month': '30d', // You may want to adjust this
          'this_year': '90d',
        };
        
        const apiRange = rangeMap[range] || '30d';
        const response = await api.getAdminActivityStats(apiRange);
        
        if (response.success && response.donut) {
          // Calculate percentages and format data
          const total = response.donut.reduce((sum, item) => sum + item.value, 0);
          const formatted = response.donut.map((item, index) => ({
            name: item.label || 'Unknown',
            value: total > 0 ? Math.round((item.value / total) * 100) : 0,
            color: getColorForDomain(item.label, index),
            trend: 'up', // TODO: Calculate trend from previous period
          }));
          
          setDonutData(formatted);
        } else {
          setDonutData([]);
        }
      } catch (err) {
        console.error('Error fetching donut chart data:', err);
        setError(err.message);
        setDonutData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  const handleChangeRange = (e) => setRange(e.target.value);

  const scaleFactor = (tf) => {
    switch (tf) {
      case "day":
        return 0.03;
      case "week":
        return 0.25;
      case "month":
        return 1;
      case "year":
        return 1.2;
      default:
        return 1;
    }
  };

  // Use API data if available, otherwise fallback to static data
  const rawData = donutData.length > 0 
    ? donutData 
    : (baseDataByRange[range] || baseDataByRange.this_month);

  // Normalise to percentages and slightly react to global timeframe
  const normalized = (() => {
    const factor = scaleFactor(timeframe);
    const scaled = rawData.map((d) => ({ ...d, value: d.value * factor }));
    const total = scaled.reduce((sum, x) => sum + x.value, 0) || 1;
    return scaled.map((s) => ({
      ...s,
      value: Math.round((s.value / total) * 100),
    }));
  })();

  if (error) {
    return (
      <ChartCard
        title="Activities by Learning Area"
        headerRight={
          <SelectField
            size="xs"
            variant="soft"
            className="min-w-[124px]"
            selectClassName="font-semibold"
            value={range}
            onChange={handleChangeRange}
            options={timeRangeOptions}
          />
        }
      >
        <div className="flex min-h-[18rem] items-center justify-center md:h-[18rem]">
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
            Error loading chart data: {error}
          </div>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Activities by Learning Area"
      headerRight={
        <SelectField
          size="xs"
          variant="soft"
          className="min-w-[124px]"
          selectClassName="font-semibold"
          value={range}
          onChange={handleChangeRange}
          options={timeRangeOptions}
        />
      }
    >
      {/* Layout matches Figma: donut on left, legend on right */}
      <div className="flex min-h-[18rem] flex-col gap-4 md:h-[18rem] md:flex-row md:items-center md:justify-between md:gap-6">
        {isLoading && donutData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner size="md" showLabel={false} />
          </div>
        ) : (
          <>
            {/* Donut */}
            <div className="flex h-40 w-full shrink-0 items-center justify-center md:h-52 md:w-auto md:min-w-[200px] md:max-w-[50%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={normalized}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {normalized.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `${val}%`}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with percentages & arrows */}
            <div className="custom-scrollbar flex min-w-0 flex-1 flex-col overflow-hidden md:max-h-[18rem] md:overflow-y-auto md:pr-2">
              <div className="space-y-2 text-xs md:pr-1">
                {normalized.map((item) => {
                  const trendColor =
                    item.trend === "up" ? "text-emerald-500" : "text-rose-500";
                  const arrow = item.trend === "up" ? "↑" : "↓";

                  return (
                    <div
                      key={item.name}
                      className="flex min-w-0 items-center justify-between gap-2"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                          className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate text-slate-700">{item.name}</span>
                      </div>
                      <div className={`shrink-0 text-[11px] font-medium ${trendColor} whitespace-nowrap`}>
                        {item.value.toString().padStart(2, "0")}%
                        <span className="ml-1">{arrow}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </ChartCard>
  );
};

export default CompletionBreakdownChart;

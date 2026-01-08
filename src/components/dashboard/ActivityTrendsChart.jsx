import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../ui/shared/ChartCard";
import SelectField from "../ui/shared/SelectField";
import { useTimeframe } from "../../context/TimeframeContext";
import { api } from "../../utils/api";
import LoadingSpinner from "../ui/shared/LoadingSpinner";

// Two series so the filter actually changes the curve
const seriesByRange = {
  this_year: [
    { month: "Jan", value: 320 },
    { month: "Feb", value: 280 },
    { month: "Mar", value: 360 },
    { month: "Apr", value: 420 },
    { month: "May", value: 390 },
    { month: "Jun", value: 450 },
    { month: "Jul", value: 430 },
    { month: "Aug", value: 470 },
    { month: "Sep", value: 440 },
    { month: "Oct", value: 460 },
    { month: "Nov", value: 410 },
    { month: "Dec", value: 480 },
  ],
  last_year: [
    { month: "Jan", value: 280 },
    { month: "Feb", value: 260 },
    { month: "Mar", value: 310 },
    { month: "Apr", value: 340 },
    { month: "May", value: 360 },
    { month: "Jun", value: 380 },
    { month: "Jul", value: 390 },
    { month: "Aug", value: 400 },
    { month: "Sep", value: 370 },
    { month: "Oct", value: 390 },
    { month: "Nov", value: 360 },
    { month: "Dec", value: 410 },
  ],
};

const rangeOptions = [
  { value: "this_year", label: "This Year" },
  { value: "last_year", label: "Last Year" },
];

const ActivityTrendsChart = () => {
  const [range, setRange] = React.useState("this_year");
  const [trendData, setTrendData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { timeframe } = useTimeframe();

  React.useEffect(() => {
    const fetchData = async () => {
      // Only show loading on initial load or if we have no data
      if (trendData.length === 0) {
        setIsLoading(true);
      }
      setError(null);

      try {
        
        // Map range to API range format
        const rangeMap = {
          'this_year': '90d',
          'last_year': '90d', // You may want to adjust this
        };
        
        const apiRange = rangeMap[range] || '30d';
        const response = await api.getAdminActivityStats(apiRange);
        
        if (response.success && response.trend) {
          // Format trend data for chart
          let formatted = [];
          
          if (timeframe === 'month' || timeframe === 'year') {
            // Aggregate daily data by month
            const monthlyData = new Map();
            
            response.trend.forEach((item) => {
              // Parse date properly - item.date is in "YYYY-MM-DD" format
              const date = new Date(item.date + 'T00:00:00');
              if (isNaN(date.getTime())) {
                // Fallback if date parsing fails
                return;
              }
              
              // For "This Year" view, show just month name; for other views, include year
              const monthKey = range === 'this_year' 
                ? date.toLocaleDateString('en-US', { month: 'short' })
                : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              
              // Use a composite key with date for sorting (year * 100 + month)
              const sortKey = date.getFullYear() * 100 + date.getMonth();
              
              if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, {
                  month: monthKey,
                  value: 0,
                  sortKey: sortKey,
                });
              }
              
              const monthEntry = monthlyData.get(monthKey);
              monthEntry.value += (item.completed || 0);
            });
            
            // Convert to array and sort by date
            formatted = Array.from(monthlyData.values()).sort((a, b) => a.sortKey - b.sortKey);
            // Remove sortKey before displaying
            formatted = formatted.map(item => ({ month: item.month, value: item.value }));
          } else {
            // For daily/weekly view, show daily data
            formatted = response.trend.map((item) => {
              const date = new Date(item.date);
              let label = '';
              
              if (timeframe === 'week') {
                label = date.toLocaleDateString('en-US', { weekday: 'short' });
              } else {
                label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
              }
              
              return {
                month: label,
                value: item.completed || 0,
              };
            });
          }
          
          setTrendData(formatted);
        } else {
          setTrendData([]);
        }
      } catch (err) {
        console.error('Error fetching trend data:', err);
        setError(err.message);
        setTrendData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range, timeframe]);

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
        return 12;
      default:
        return 1;
    }
  };

  // linear interpolation to change point count based on timeframe
  const resampleArray = (values, targetLen) => {
    if (!values || values.length === 0) return [];
    if (targetLen <= 0) return [];
    if (targetLen === values.length) return values.slice();

    const out = [];
    const srcLen = values.length;
    for (let i = 0; i < targetLen; i++) {
      const t = (i * (srcLen - 1)) / (targetLen - 1);
      const i0 = Math.floor(t);
      const i1 = Math.min(i0 + 1, srcLen - 1);
      const frac = t - i0;
      const v = values[i0] * (1 - frac) + values[i1] * frac;
      out.push(Math.round(v * 100) / 100);
    }
    return out;
  };

  // Labels + number of points based on global timeframe (daily / weekly / monthly / yearly)
  let targetLen = 12;
  let labels = seriesByRange.this_year.map((d) => d.month);

  switch (timeframe) {
    case "day":
      targetLen = 7;
      labels = Array.from({ length: targetLen }, (_, i) => `Day ${i + 1}`);
      break;
    case "week":
      targetLen = 7;
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      break;
    case "month":
      targetLen = 12;
      labels = seriesByRange.this_year.map((d) => d.month);
      break;
    case "year": {
      targetLen = 5;
      const y = new Date().getFullYear();
      labels = Array.from({ length: targetLen }, (_, i) =>
        String(y - (targetLen - 1 - i))
      );
      break;
    }
    default:
      targetLen = 12;
  }

  // Use API data if available, otherwise fallback to static data
  let dataForChart;
  
  if (trendData.length > 0) {
    // Use API data directly
    dataForChart = trendData;
  } else {
    // Fallback to static data
    const baseSeries = seriesByRange[range] || seriesByRange.this_year;
    const baseValues = baseSeries.map((d) => d.value);
    const resampled = resampleArray(baseValues, targetLen);
    const factor = scaleFactor(timeframe);
    
    dataForChart = labels.map((label, idx) => ({
      month: label,
      value: Math.round(resampled[idx] * factor * 100) / 100,
    }));
  }

  if (error) {
    return (
      <ChartCard
        title="Engagement Growth"
        headerRight={
          <SelectField
            size="xs"
            variant="soft"
            className="min-w-[124px]"
            selectClassName="font-semibold"
            value={range}
            onChange={handleChangeRange}
            options={rangeOptions}
          />
        }
      >
        <div className="flex h-60 w-full items-center justify-center sm:h-64 lg:h-72">
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
            Error loading chart data: {error}
          </div>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Engagement Growth"
      headerRight={
        <SelectField
          size="xs"
          variant="soft"
          className="min-w-[124px]"
          selectClassName="font-semibold"
          value={range}
          onChange={handleChangeRange}
          options={rangeOptions}
        />
      }
    >
      <div className="h-60 w-full sm:h-64 lg:h-72">
        {isLoading && trendData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner size="md" showLabel={false} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dataForChart}
            margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="engagementGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#C084FC" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#C084FC" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              width={32}
            />
            <Tooltip
              contentStyle={{
                fontSize: "11px",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#A855F7"
              strokeWidth={2}
              fill="url(#engagementGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
};

export default ActivityTrendsChart;

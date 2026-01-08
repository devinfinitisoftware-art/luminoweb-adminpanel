import React, { createContext, useContext, useState } from "react";

const TimeframeContext = createContext(null);

export const TIMEFRAMES = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

export function TimeframeProvider({ children }) {
  const [timeframe, setTimeframe] = useState("month");

  const value = {
    timeframe,
    setTimeframe,
    options: TIMEFRAMES,
  };

  return (
    <TimeframeContext.Provider value={value}>
      {children}
    </TimeframeContext.Provider>
  );
}

export function useTimeframe() {
  const ctx = useContext(TimeframeContext);
  if (!ctx)
    throw new Error("useTimeframe must be used within TimeframeProvider");
  return ctx;
}

export default TimeframeContext;

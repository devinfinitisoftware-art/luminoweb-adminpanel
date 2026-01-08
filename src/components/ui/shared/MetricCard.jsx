import React from "react";
import Card from "./Card";

const trendColors = {
  up: "text-emerald-500",
  down: "text-rose-500",
  neutral: "text-slate-500",
};

const MetricCard = ({ icon, label, value, delta, trend = "neutral" }) => (
  <Card className="flex items-center gap-4 rounded-2xl bg-white/90 px-4 py-3">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F1FF] text-[11px] font-semibold text-[#3B82F6]">
      {icon}
    </div>
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between text-[11px] font-medium">
        <span className="text-slate-500">{label}</span>
        {delta && (
          <span className={trendColors[trend] || trendColors.neutral}>
            {delta}
          </span>
        )}
      </div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  </Card>
);

export default MetricCard;

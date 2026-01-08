import React from "react";
import Card from "./Card";

const SectionCard = ({ title, description, children, className }) => (
  <Card className={`p-4 sm:p-5 ${className || ""}`}>
    {(title || description) && (
      <header className="mb-3">
        {title && (
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        )}
        {description && (
          <p className="mt-1 text-[11px] text-slate-500">{description}</p>
        )}
      </header>
    )}
    {children}
  </Card>
);

export default SectionCard;

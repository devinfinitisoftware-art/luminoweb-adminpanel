import React from "react";
import clsx from "clsx";

const Card = ({ as = "div", className, children, ...rest }) => {
  const Component = as;
  return (
    <Component
      className={clsx(
        "rounded-2xl bg-white shadow-sm border border-slate-100",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Card;

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({
  className,
  variant = "default",
  children,
  ...props
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    error: "bg-red-100 text-red-800 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
    active: "bg-green-100 text-green-800 hover:bg-green-200",
    inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    present: "bg-green-100 text-green-800 hover:bg-green-200",
    absent: "bg-red-100 text-red-800 hover:bg-red-200",
    late: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    excused: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export default Badge;
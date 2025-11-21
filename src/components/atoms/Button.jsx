import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({
  children,
  className,
  variant = "primary",
  size = "default",
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:ring-primary-500 transform hover:scale-[1.02] hover:shadow-lg",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white focus:ring-secondary-500 transform hover:scale-[1.02] hover:shadow-lg",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700 focus:ring-primary-500",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 transform hover:scale-[1.02] hover:shadow-lg"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    default: "px-6 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-3 text-base rounded-xl",
    icon: "p-2 rounded-lg"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
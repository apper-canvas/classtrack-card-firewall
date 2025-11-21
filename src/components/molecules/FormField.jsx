import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  type = "text", 
  children,
  className,
  required = false,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
        {label}
      </Label>
      {children || (
        type === "select" ? (
          <Select error={!!error} {...props} />
        ) : (
          <Input type={type} error={!!error} {...props} />
        )
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
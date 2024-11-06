import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/Form";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <input
      type={type}
      className={cn(
        "mt-1 mb-1 flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
        className,
        error && "border-red-500",
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

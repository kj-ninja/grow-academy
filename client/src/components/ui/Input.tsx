import * as React from "react";
import { cn } from "@/lib/utils";
import { useInputError } from "@/hooks/useInputError";

// todo: extract input types
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, iconRight, ...props }, ref) => {
    const error = useInputError(name);

    return (
      <div className="relative flex w-full items-center">
        <input
          type={type}
          className={cn(
            "border-input placeholder:text-placeholder focus-visible:ring-ring my-1 flex h-9 w-full rounded-md border bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-50",
            className,
            error && "border-red-500"
          )}
          ref={ref}
          {...props}
        />
        {iconRight && iconRight}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

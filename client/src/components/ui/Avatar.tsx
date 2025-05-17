import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { Image, User } from "lucide-react";

const sizeVariants = {
  "2xs": 24,
  xs: 32,
  sm: 36,
  lg: 40,
  xl: 48,
  "2xl": 58,
  "3xl": 64,
  "4xl": 72,
  "5xl": 104,
};

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: keyof typeof sizeVariants;
    shape?: "circle" | "rounded" | "square";
  }
>(({ className, size = "lg", shape = "circle", ...props }, ref) => {
  const shapeClass = {
    circle: "rounded-full",
    rounded: "rounded-lg",
    square: "rounded-none",
  }[shape];

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex shrink-0 overflow-hidden", shapeClass, className)}
      style={{ width: sizeVariants[size], height: sizeVariants[size] }}
      {...props}
    />
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    type: "user" | "classroom";
    size?: number;
  }
>(({ className, type, size = 18, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "bg-backgroundSecondary flex h-full w-full items-center justify-center rounded-full",
      className
    )}
    {...props}
  >
    <div className="flex items-center justify-center">
      {type === "user" ? <User size={size} /> : <Image size={size} />}
    </div>
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

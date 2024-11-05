import * as React from "react";
import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import { getStylesForMaxLines } from "./getStylesForMaxLines";

const textVariants = cva("text-typography-primary", {
  variants: {
    type: {
      h1: "text-h1 font-bold",
      h2: "text-h2 font-bold",
      subtitle: "text-subtitle font-bold",
      body: "text-body",
      bodyBold: "text-body font-bold",
      bodySmall: "text-bodySmall",
      bodySmallBold: "text-bodySmall font-bold",
      bodyXSmall: "text-bodyXSmall",
      bodyXSmallBold: "text-bodyXSmall font-bold",
      bodyXXSmall: "text-bodyXXSmall",
      bodyXXSmallBold: "text-bodyXXSmall font-bold",
    },
  },
  defaultVariants: {
    type: "body",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  maxLines?: number;
  type: NonNullable<VariantProps<typeof textVariants>["type"]>;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, type = "body", maxLines, ...props }, ref) => {
    const tagMap = {
      h1: "h1",
      h2: "h2",
      subtitle: "h3",
      body: "p",
      bodyBold: "p",
      bodySmall: "p",
      bodySmallBold: "p",
      bodyXSmall: "p",
      bodyXSmallBold: "p",
      bodyXXSmall: "p",
      bodyXXSmallBold: "p",
    };

    const style = maxLines ? getStylesForMaxLines(maxLines) : undefined;
    const Tag = tagMap[type];

    return React.createElement(Tag, {
      ref,
      className: clsx(textVariants({ type }), className),
      style,
      ...props,
    });
  },
);

Text.displayName = "Text";

export default Text;

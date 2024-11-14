import { ReactNode } from "react";

interface BadgeDisplayProps {
  icon: ReactNode;
  text: ReactNode;
}

export function Badge({ icon, text }: BadgeDisplayProps) {
  return (
    <div className="flex gap-1 bg-backgroundSecondary rounded-full items-center px-1.5 py-[2px]">
      {icon}
      {text}
    </div>
  );
}

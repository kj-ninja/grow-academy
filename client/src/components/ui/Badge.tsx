import { ReactNode } from "react";

interface BadgeDisplayProps {
  icon: ReactNode;
  text: ReactNode;
}

export function Badge({ icon, text }: BadgeDisplayProps) {
  return (
    <div className="bg-backgroundSecondary flex items-center gap-1 rounded-full px-2 py-1">
      {icon}
      {text}
    </div>
  );
}

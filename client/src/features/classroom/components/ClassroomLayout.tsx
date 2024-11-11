import { Outlet } from "react-router-dom";

export function ClassroomLayout() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}

import { Outlet } from "react-router-dom";
// import { ClassroomMembersSidePanel } from "@/features/classroom/components/ClassroomSidePanel/ClassroomMembersSidePanel";

export function ClassroomLayout() {
  return (
    <div className="w-full">
      <Outlet />
      {/*<ClassroomMembersSidePanel />*/}
    </div>
  );
}

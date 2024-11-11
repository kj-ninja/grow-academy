import { useClassroom } from "@/features/classroom/hooks/useClassroom";

function ClassroomSettingsPage() {
  const { classroom } = useClassroom();

  return (
    <div className="flex justify-center mt-20">
      Edit Classroom: {classroom.classroomName}
    </div>
  );
}

export const Component = ClassroomSettingsPage;

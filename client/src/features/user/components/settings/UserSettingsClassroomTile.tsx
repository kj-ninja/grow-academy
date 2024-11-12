import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text/Text";
import { ClassroomResponse } from "@/features/classroom/api/classroomApi";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { Earth, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserSettingsClassroomTile({
  classroom,
}: {
  classroom: ClassroomResponse;
}) {
  const { image } = useBinaryImage(classroom.avatarImage);
  const navigate = useNavigate();

  return (
    <div
      className="flex gap-4 my-2 p-2 rounded-lg cursor-pointer hover:bg-background"
      onClick={() => navigate(`/classroom/${classroom.handle}/settings/edit`)}
    >
      <Avatar size="xl">
        <AvatarImage src={image} alt="Classroom profile image" />
        <AvatarFallback type="classroom" />
      </Avatar>

      <div className="flex flex-col justify-center">
        <div className="flex gap-4">
          <Text type="bodyBold">{classroom.classroomName}</Text>
        </div>
        <Text type="bodySmallBold" className="!text-secondary">
          #{classroom.handle}
        </Text>
      </div>

      <div className="flex gap-2 items-start">
        <div className="flex gap-1 bg-backgroundSecondary rounded-full items-center px-1.5 py-[2px]">
          <User size={14} fill="black" />
          <Text type="bodySmallBold">{classroom.membersCount}</Text>
        </div>
        <div className="flex gap-1 bg-backgroundSecondary rounded-full items-center px-1.5 py-[2px]">
          <Earth size={14} />
          <Text type="bodySmallBold">{classroom.accessType}</Text>
        </div>
      </div>
    </div>
  );
}

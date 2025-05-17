import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text/Text";
import { ClassroomResponse } from "@/features/classroom/api/classroomApi";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { Earth, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";

export function UserSettingsClassroomTile({
  classroom,
}: {
  classroom: ClassroomResponse;
}) {
  const { image } = useBinaryImage(classroom.avatarImage);
  const navigate = useNavigate();

  return (
    <div
      className="hover:bg-background my-2 flex cursor-pointer gap-4 rounded-lg p-2"
      onClick={() => navigate(`/classroom/${classroom.id}/settings/profile`)}
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

      <div className="flex items-start gap-2">
        <Badge
          icon={<User size={14} fill="black" />}
          text={<Text type="bodySmallBold">{classroom.membersCount || 0}</Text>}
        />
        <Badge
          icon={<Earth size={14} />}
          text={<Text type="bodySmallBold">{classroom.accessType}</Text>}
        />
      </div>
    </div>
  );
}

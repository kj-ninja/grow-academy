import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

import { Text } from "@/components/ui/Text/Text";
import { SimpleUser } from "@/features/auth/stores/authStore";
import { useNavigate } from "react-router-dom";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { cn } from "@/lib/utils";

interface ClassroomSettingsMemberProps {
  member: SimpleUser;
  ActionsComponent?: React.ComponentType<{ member: SimpleUser }>;
  className?: string;
}

export function ClassroomSettingsMember({
  member,
  ActionsComponent,
  className,
}: ClassroomSettingsMemberProps) {
  const { image } = useBinaryImage(member.avatarImage);
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "hover:bg-background my-2 flex cursor-pointer items-center gap-4 rounded-lg p-2",
        className
      )}
      onClick={() => navigate(`/user/${member.username}`)}
    >
      <Avatar size="xl">
        <AvatarImage src={image} alt="Member profile image" />
        <AvatarFallback type="user" />
      </Avatar>

      <div className="flex flex-col justify-center">
        <div className="flex gap-4">
          <Text type="bodyBold">
            {member.firstName} {member.lastName}
          </Text>
        </div>
        <Text type="bodySmallBold" className="!text-secondary">
          @{member.username}
        </Text>
      </div>

      {ActionsComponent && (
        <div className="ml-auto flex gap-2">
          <ActionsComponent member={member} />
        </div>
      )}
    </div>
  );
}

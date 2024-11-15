import React from "react";
import { Text } from "@/components/ui/Text/Text";
import { ClassroomResponse } from "@/features/classroom/api/classroomApi";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { Badge } from "@/components/ui/Badge";
import { Earth, User } from "lucide-react";

interface ClassroomCardProps {
  classroom: ClassroomResponse;
  onClassroomClick: (handle: string) => void;
}

export function ClassroomCard({
  classroom,
  onClassroomClick,
}: ClassroomCardProps) {
  const { image: avatarImage } = useBinaryImage(classroom.avatarImage);
  const { image: backgroundImage } = useBinaryImage(classroom.backgroundImage);
  const { image: ownerImage } = useBinaryImage(classroom.owner.avatarImage);

  return (
    <Card
      className="flex flex-col bg-white w-full cursor-pointer group"
      onClick={() => onClassroomClick(classroom.handle)}
    >
      <CardContent>
        <img
          src={backgroundImage || "/fallback_banner.jpg"}
          alt={"Community background picture"}
          className="w-full h-48 object-cover rounded-t-lg bg-background-secondary group-hover:opacity-80"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 pt-6">
        <div className="flex gap-3">
          <Avatar size="2xl">
            <AvatarImage src={avatarImage} />
            <AvatarFallback type="classroom" size={32} />
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-start">
              <Badge
                icon={<User size={14} fill="black" />}
                text={
                  <Text type="bodySmallBold">
                    {classroom.membersCount || 0}
                  </Text>
                }
              />
              <Badge
                icon={<Earth size={14} />}
                text={<Text type="bodySmallBold">{classroom.accessType}</Text>}
              />
            </div>

            <Text type="body" className="!text-secondary">
              @{classroom.handle}
            </Text>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex gap-1.5 items-center">
            <Avatar size="2xs">
              <AvatarImage src={ownerImage} />
              <AvatarFallback type="user" size={16} className="bg-background" />
            </Avatar>
            <Text type="bodySmallBold">
              {classroom.owner?.firstName} {classroom.owner?.lastName}
            </Text>
            <Text type="bodyXSmall">Owner</Text>
          </div>
          <div className="flex gap-1.5 items-center"></div>
        </div>
      </CardFooter>
    </Card>
  );
}

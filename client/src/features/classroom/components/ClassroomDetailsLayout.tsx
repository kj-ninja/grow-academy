import { ProfilePageWrapper } from "@/components/layout/pages/ProfilePageWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text/Text";
import { Badge } from "@/components/ui/Badge";
import { Earth } from "lucide-react";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";

interface ClassroomDetailsLayoutProps {
  button?: React.ReactNode;
}

export function ClassroomDetailsLayout({
  button,
}: ClassroomDetailsLayoutProps) {
  const { classroom } = useClassroom();

  const { image: avatarImage } = useBinaryImage(classroom.avatarImage);
  const { image: backgroundImage } = useBinaryImage(classroom.backgroundImage);
  const { image: ownerImage } = useBinaryImage(classroom.owner.avatarImage);

  const navigate = useNavigate();

  const dateString = classroom?.createdAt || "";
  const formattedDate = dayjs(dateString).format("DD-MM-YYYY");

  return (
    <>
      <div className="border-b-2 bg-white pb-6">
        <ProfilePageWrapper>
          <div className="relative h-[300px]">
            {backgroundImage ? (
              <img
                src={backgroundImage}
                alt="User banner image"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-red bg-primary/20" />
            )}

            <Avatar
              className="border-2 border-white bg-background absolute left-4 bottom-[-32px]"
              size="5xl"
            >
              <AvatarImage src={avatarImage} alt="User profile image" />
              <AvatarFallback type="classroom" size={48} />
            </Avatar>
          </div>

          <div className="flex flex-col gap-2 pt-10">
            <div className="flex items-end gap-2">
              <Text type="h1">{classroom?.classroomName}</Text>
              <Text type="bodyBold" className="!text-secondary">
                @{classroom?.handle}
              </Text>
            </div>

            <div className="flex justify-between mb-2">
              <div className="flex gap-2 mb-2">
                <Badge
                  icon={
                    <span className="font-bold text-sm">
                      {classroom?.membersCount || 0}
                    </span>
                  }
                  text={<Text type="bodySmall">Members</Text>}
                />
                <Badge
                  icon={<Earth size={14} />}
                  text={
                    <Text type="bodySmallBold">{classroom.accessType}</Text>
                  }
                />
              </div>
            </div>

            {/*todo: add info about members*/}
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <Avatar size="xs">
                  <AvatarImage src={ownerImage} alt="Classroom profile image" />
                  <AvatarFallback type="classroom" />
                </Avatar>
                <div className="flex flex-col items-baseline">
                  <Text type="bodySmall">
                    Owner:{" "}
                    <span className="font-bold">
                      {classroom.owner.firstName} {classroom.owner.lastName}
                    </span>
                  </Text>
                  <Text
                    type="bodySmallBold"
                    className="!text-secondary hover:opacity-80 cursor-pointer grow-0"
                    onClick={() =>
                      navigate(`/user/${classroom.owner.username}`)
                    }
                  >
                    @{classroom.owner.username}
                  </Text>
                </div>
              </div>
              {button}
            </div>
          </div>
        </ProfilePageWrapper>
      </div>
      {/*todo: add tags*/}
      <ProfilePageWrapper>
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col gap-1">
            <Text type="bodyBold">Bio</Text>
            <Text type="bodySmall">
              {classroom?.description ||
                "There is no description about that classroom yet."}
            </Text>
          </div>
          <div className="flex flex-col">
            <Text type="bodyBold">More info</Text>
            <Text type="bodySmall">Created on: {formattedDate}</Text>
          </div>
        </div>
      </ProfilePageWrapper>
    </>
  );
}

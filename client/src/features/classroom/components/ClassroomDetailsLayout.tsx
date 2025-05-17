import { ProfilePageWrapper } from "@/components/layout/pages/ProfilePageWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text/Text";
import { Badge } from "@/components/ui/Badge";
import { Earth, Tag } from "lucide-react";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import React from "react";

interface ClassroomDetailsLayoutProps {
  button?: React.ReactNode;
  children?: React.ReactNode;
}

export function ClassroomDetailsLayout({
  button,
  children,
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
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="bg-red bg-primary/20 h-full w-full" />
            )}

            <Avatar
              className="bg-background absolute bottom-[-32px] left-4 border-2 border-white"
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

            <div className="mb-2 flex justify-between">
              <div className="mb-2 flex gap-2">
                <Badge
                  icon={
                    <span className="text-sm font-bold">
                      {classroom?.membersCount || 0}
                    </span>
                  }
                  text={<Text type="bodySmall">Members</Text>}
                />
                <Badge
                  icon={<Earth size={14} />}
                  text={<Text type="bodySmallBold">{classroom.accessType}</Text>}
                />
              </div>
            </div>

            {/*todo: add info about members*/}
            <div className="flex items-end justify-between">
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
                    className="!text-secondary grow-0 cursor-pointer hover:opacity-80"
                    onClick={() => navigate(`/user/${classroom.owner.username}`)}
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
          <div className="flex flex-col gap-1">
            <Text type="bodyBold">More info</Text>
            <Text type="bodySmall">Created on: {formattedDate}</Text>
          </div>

          {/* todo: extract tags to separate component and use it also in classroom list page */}
          <div className="flex flex-col gap-1.5">
            <Text type="bodyBold">Tags</Text>
            <div className="flex flex-wrap gap-2">
              {classroom.tags.map((tag) => (
                <Badge
                  key={tag}
                  icon={<Tag size={12} />}
                  text={<Text type="bodyXSmallBold">{tag}</Text>}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">{children}</div>
        </div>
      </ProfilePageWrapper>
    </>
  );
}

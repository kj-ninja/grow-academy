import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserQueries } from "@/features/user/api/queryKeys";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import zod from "zod";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useBinaryImage } from "@/hooks/useBinaryImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ProfilePageWrapper } from "@/components/layout/pages/ProfilePageWrapper";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";
import { Settings } from "lucide-react";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/Badge";

export function UserProfile() {
  const { username } = useValidateRouteParams({
    username: zod.string().min(1),
  });
  const { currentUser } = useCurrentUser();
  const { data: user } = useQuery(UserQueries.getUser(username));

  const { image: avatarImage } = useBinaryImage(user?.avatarImage);
  const { image: backgroundImage } = useBinaryImage(user?.backgroundImage);

  const dateString = user?.createdAt || "";
  const formattedDate = dayjs(dateString).format("DD-MM-YYYY");

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
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
              <AvatarFallback type="user" size={48} />
            </Avatar>
          </div>
          <div className="flex flex-col gap-3 pt-10">
            <div className="flex items-end gap-2">
              <Text type="h1">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text type="bodyBold" className="!text-secondary">
                @{user?.username}
              </Text>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  icon={<span className="font-bold text-sm">0</span>}
                  text={<Text type="bodySmall">Followers</Text>}
                />
                <Badge
                  icon={<span className="font-bold text-sm">0</span>}
                  text={<Text type="bodySmall">Following</Text>}
                />
                <Badge
                  icon={
                    <span className="font-bold text-sm">
                      {user?.ownedClassroomCount || 0}
                    </span>
                  }
                  text={<Text type="bodySmall">Classrooms</Text>}
                />
              </div>
              {currentUser?.username === user?.username && (
                // todo: think about buttons styles and variants
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    navigate(`/user/${currentUser?.username}/settings/profile`)
                  }
                >
                  <Settings size={18} />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </ProfilePageWrapper>
      </div>

      <ProfilePageWrapper>
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col gap-1">
            <Text type="bodyBold">Bio</Text>
            <Text type="bodySmall">
              {user?.bio || "There is no bio about that user yet."}
            </Text>
          </div>
          <div className="flex flex-col">
            <Text type="bodyBold">More info</Text>
            <Text type="bodySmall">Joined on: {formattedDate}</Text>
          </div>
        </div>
      </ProfilePageWrapper>
    </div>
  );
}

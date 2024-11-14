import { Spinner } from "@/components/ui/Spinner";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/Sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";
import { Calendar, User } from "lucide-react";

const SidePanelLoader = () => (
  <div className="flex items-center justify-center w-full h-full">
    <Spinner />
  </div>
);

function Separator() {
  return <div className="border-b-[1px] mx-4 border-tints-white-10" />;
}

function InfoTile({
  title,
  value,
}: {
  iconName: string;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-new-grey2 text-new-grey1">
        <Calendar size={16} />
      </div>
      <div className="flex flex-row gap-1">
        <Text type="bodySmall" className="!text-new-grey1">
          {title}
        </Text>
        <Text type="bodySmall" className="!text-white">
          {value}
        </Text>
      </div>
    </div>
  );
}

export const ClassroomMembersSidePanel = () => {
  const [open, setOpen] = useState(false);
  const [isLoading] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[369px] overflow-y-auto mb-16 border-tints-gigaverseDarkBlue-75 b-l-[1px] bg-primary-gigaverseBlack">
        <div className="flex flex-col h-full pb-4 gap-4">
          {isLoading ? (
            <SidePanelLoader />
          ) : (
            <>
              <SheetHeader className="p-2 flex-col items-center pt-16">
                <div
                  className="flex h-[120px] rounded-2 p-2 bg-cover bg-center absolute top-2 left-2 right-2"
                  style={{}}
                />
                <Avatar
                  size="5xl"
                  className="border-[4px] border-primary-gigaverseBlack"
                >
                  <AvatarImage src={undefined} />
                  <AvatarFallback type="user" />
                </Avatar>
              </SheetHeader>
              <div className="flex flex-col items-center px-4 gap-1">
                <Text type="h2" className="!text-white pt-[12px]">
                  Name
                </Text>
                <Text type="body" className="!text-gray-500">
                  @Username
                </Text>
              </div>
              <div className="flex gap-3 w-full px-4 pb-2 justify-center">
                <Button onClick={() => {}} size="sm" className="flex-1">
                  <User size={16} />
                  <Text type="bodySmallBold">See Profile</Text>
                </Button>
              </div>
              <Separator />
              <div className="flex gap-3 p-4 w-full justify-center">
                <div className="flex-1 text-center">
                  <Text type="bodySmall" className="!text-new-grey1">
                    Followers
                  </Text>
                </div>
                <div className="flex-1 text-center">
                  <Text type="bodySmall" className="!text-new-grey1">
                    Following
                  </Text>
                </div>
              </div>
              <Separator />
              <Separator />
              <div className="flex flex-col gap-6 w-full px-4 pt-2 pb-4">
                <InfoTile
                  iconName="calendar-regular"
                  title="Joined: "
                  value={undefined}
                />
                <InfoTile
                  iconName="circle-plus-regular"
                  title="Language: "
                  value="English"
                />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

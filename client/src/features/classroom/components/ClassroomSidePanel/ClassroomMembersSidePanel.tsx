import { Spinner } from "@/components/ui/Spinner";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/Sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";
import { Calendar, User } from "lucide-react";

const SidePanelLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Spinner />
  </div>
);

function Separator() {
  return <div className="border-tints-white-10 mx-4 border-b-[1px]" />;
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
      <div className="bg-new-grey2 text-new-grey1 flex h-8 w-8 items-center justify-center rounded-full">
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
      <SheetContent className="b-l-[1px] mb-16 w-[369px] overflow-y-auto">
        <div className="flex h-full flex-col gap-4 pb-4">
          {isLoading ? (
            <SidePanelLoader />
          ) : (
            <>
              <SheetHeader className="flex-col items-center p-2 pt-16">
                <div
                  className="rounded-2 absolute left-2 right-2 top-2 flex h-[120px] bg-cover bg-center p-2"
                  style={{}}
                />
                <Avatar size="5xl" className="border-[4px]">
                  <AvatarImage src={undefined} />
                  <AvatarFallback type="user" />
                </Avatar>
              </SheetHeader>
              <div className="flex flex-col items-center gap-1 px-4">
                <Text type="h2" className="pt-[12px] !text-white">
                  Name
                </Text>
                <Text type="body" className="!text-gray-500">
                  @Username
                </Text>
              </div>
              <div className="flex w-full justify-center gap-3 px-4 pb-2">
                <Button onClick={() => {}} className="flex-1">
                  <User size={16} />
                  <Text type="bodySmallBold">See Profile</Text>
                </Button>
              </div>
              <Separator />
              <div className="flex w-full justify-center gap-3 p-4">
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
              <div className="flex w-full flex-col gap-6 px-4 pb-4 pt-2">
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

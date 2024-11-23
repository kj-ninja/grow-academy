import { useState } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CreateClassroomModal } from "@/features/classroom/components/CreateClassroomModal";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { House, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AppNavbarLink } from "@/components/layout/navbars/AppNavbarLink";

export const AppNavbar = () => {
  const [isCreateClassroomModalOpen, setIsCreateClassroomModalOpen] =
    useState(false);

  const { data } = useInfiniteQuery({
    ...ClassroomInfiniteQueries.classrooms({
      pageSize: 10,
      filterByOwner: true,
    }),
    select: (data) => data.pages.flatMap((page) => page.classrooms),
  });

  return (
    <header className="bg-backgroundSecondary min-w-[70px] flex flex-col flex-shrink-0 items-center w-appNavbar px-1.5 py-2.5 border-r border-tints-gigaverseDarkBlue-75 gap-2">
      <Link
        to="/"
        className="w-10 h-10 rounded-2xl flex justify-center items-center overflow-hidden bg-gigaverse-darkBlue active:bg-background-appNavbarHomeTile hover-overlay"
      >
        <House />
      </Link>

      <span className="h-[1px] w-full bg-placeholder" />

      <nav className="py-2">
        <ul className="flex flex-col gap-2">
          {data?.map((classroom) => (
            <AppNavbarLink
              key={classroom.id}
              path={`/classroom/${classroom.id}`}
              avatarImage={classroom.avatarImage}
            />
          ))}
        </ul>
      </nav>

      <span className="h-[1px] w-full bg-placeholder" />

      <Button
        variant="ghost"
        className="w-10 h-10 rounded-2xl flex justify-center items-center bg-tints-white-5 border-dashed border-2 border-tints-white-10 hover:border-tints-white-25 hover:bg-tints-white-10"
        onClick={() => setIsCreateClassroomModalOpen(true)}
      >
        <Plus />
      </Button>

      {isCreateClassroomModalOpen && (
        <CreateClassroomModal
          isOpen={isCreateClassroomModalOpen}
          setIsOpen={setIsCreateClassroomModalOpen}
        />
      )}
    </header>
  );
};

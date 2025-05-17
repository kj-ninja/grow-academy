import { useState } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CreateClassroomModal } from "@/features/classroom/components/CreateClassroomModal";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { House, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AppNavbarLink } from "@/components/layout/navbars/AppNavbarLink";

export const AppNavbar = () => {
  const [isCreateClassroomModalOpen, setIsCreateClassroomModalOpen] = useState(false);

  const { data } = useInfiniteQuery({
    ...ClassroomInfiniteQueries.classrooms({
      pageSize: 10,
      filterByOwner: true,
    }),
    select: (data) => data.pages.flatMap((page) => page.classrooms),
  });

  return (
    <header className="bg-backgroundSecondary w-appNavbar flex min-w-[70px] flex-shrink-0 flex-col items-center gap-2 border-r px-1.5 py-2.5">
      <Link
        to="/"
        className="active:bg-background-appNavbarHomeTile hover-overlay flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl"
      >
        <House />
      </Link>

      <span className="bg-placeholder h-[1px] w-full" />

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

      <span className="bg-placeholder h-[1px] w-full" />

      <Button
        variant="ghost"
        className="bg-tints-white-5 border-tints-white-10 hover:border-tints-white-25 hover:bg-tints-white-10 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-dashed"
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { CreateClassroomForm } from "@/features/classroom/forms/CreateClassroomForm";

interface CreateClassroomModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function CreateClassroomModal({ isOpen, setIsOpen }: CreateClassroomModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogDescription />
        <DialogHeader>
          <DialogTitle className="">Create Classroom</DialogTitle>
        </DialogHeader>
        <CreateClassroomForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

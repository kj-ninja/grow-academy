import { ClassroomWithDetailsResponse } from "@/features/classroom/api/classroomApi";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

export function useClassroomPolicy(
  classroom: ClassroomWithDetailsResponse | undefined | null,
) {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    throw new Error("useClassroomPolicy: currentUser is not defined.");
  }

  const isOwner = classroom?.ownerId === currentUser.id;
  const isMember = classroom?.isMember;

  const canJoin = () => {
    return !isMember && !isOwner && classroom?.accessType === "Public";
  };

  const canLeave = () => {
    return isMember;
  };

  const mustRequestToJoin = () => {
    return !isMember && classroom?.accessType === "Private";
  };

  const isConnected = () => {
    return isOwner || isMember;
  };

  const isPendingRequest = () => {
    return classroom?.isPendingRequest;
  };

  return {
    isOwner,
    isMember,
    canJoin: canJoin(),
    canLeave: canLeave(),
    mustRequestToJoin: mustRequestToJoin(),
    isConnected: isConnected(),
    isPendingRequest: isPendingRequest(),
  };
}

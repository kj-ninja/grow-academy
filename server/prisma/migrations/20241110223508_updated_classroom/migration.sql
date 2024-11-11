-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN "tags" TEXT;

-- CreateIndex
CREATE INDEX "ClassroomsMembers_classroomId_idx" ON "ClassroomsMembers"("classroomId");

-- CreateIndex
CREATE INDEX "ClassroomsMembers_userId_idx" ON "ClassroomsMembers"("userId");

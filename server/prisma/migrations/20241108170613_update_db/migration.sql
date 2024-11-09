/*
  Warnings:

  - You are about to drop the column `communityAvatarImage` on the `Classroom` table. All the data in the column will be lost.
  - You are about to drop the column `communityBackgroundImage` on the `Classroom` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL DEFAULT 'classroom',
    "description" TEXT,
    "accessType" TEXT NOT NULL DEFAULT 'public',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "classroomAvatarImage" BLOB,
    "classroomBackgroundImage" BLOB,
    "getStreamChannel" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Classroom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Classroom" ("accessType", "createdAt", "description", "getStreamChannel", "id", "isLive", "name", "ownerId", "updatedAt") SELECT "accessType", "createdAt", "description", "getStreamChannel", "id", "isLive", "name", "ownerId", "updatedAt" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
CREATE UNIQUE INDEX "Classroom_classroomId_key" ON "Classroom"("classroomId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `classroomAvatarImage` on the `Classroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroomBackgroundImage` on the `Classroom` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Classroom` table. All the data in the column will be lost.
  - Added the required column `classroomName` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classroomName" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT,
    "accessType" TEXT NOT NULL DEFAULT 'public',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "avatarImage" BLOB,
    "backgroundImage" BLOB,
    "getStreamChannelId" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Classroom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Classroom" ("accessType", "createdAt", "description", "getStreamChannelId", "handle", "id", "isLive", "ownerId", "updatedAt") SELECT "accessType", "createdAt", "description", "getStreamChannelId", "handle", "id", "isLive", "ownerId", "updatedAt" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
CREATE UNIQUE INDEX "Classroom_handle_key" ON "Classroom"("handle");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

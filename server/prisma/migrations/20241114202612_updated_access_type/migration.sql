-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classroomName" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT,
    "accessType" TEXT NOT NULL DEFAULT 'Public',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "avatarImage" BLOB,
    "backgroundImage" BLOB,
    "getStreamChannelId" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT,
    CONSTRAINT "Classroom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Classroom" ("accessType", "avatarImage", "backgroundImage", "classroomName", "createdAt", "description", "getStreamChannelId", "handle", "id", "isLive", "ownerId", "tags", "updatedAt") SELECT "accessType", "avatarImage", "backgroundImage", "classroomName", "createdAt", "description", "getStreamChannelId", "handle", "id", "isLive", "ownerId", "tags", "updatedAt" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
CREATE UNIQUE INDEX "Classroom_handle_key" ON "Classroom"("handle");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

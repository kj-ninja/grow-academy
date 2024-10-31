-- CreateTable
CREATE TABLE "ClassroomsMembers" (
    "classroomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "memberShipStatus" TEXT NOT NULL DEFAULT 'pending',

    PRIMARY KEY ("userId", "classroomId"),
    CONSTRAINT "ClassroomsMembers_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassroomsMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "accessType" TEXT NOT NULL DEFAULT 'public',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "communityAvatarImage" BLOB,
    "communityBackgroundImage" BLOB,
    "getStreamChannel" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Classroom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "avatarImage" BLOB,
    "isActive" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("avatarImage", "bio", "createdAt", "firstName", "id", "isActive", "lastName", "password", "role", "username") SELECT "avatarImage", "bio", "createdAt", "firstName", "id", "isActive", "lastName", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_name_key" ON "Classroom"("name");

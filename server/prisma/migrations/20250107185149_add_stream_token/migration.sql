-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "avatarImage" BLOB,
    "backgroundImage" BLOB,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "streamToken" TEXT NOT NULL DEFAULT 'streamTokenDefault'
);
INSERT INTO "new_User" ("avatarImage", "backgroundImage", "bio", "createdAt", "firstName", "id", "isActive", "lastName", "password", "role", "updatedAt", "username") SELECT "avatarImage", "backgroundImage", "bio", "createdAt", "firstName", "id", "isActive", "lastName", "password", "role", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

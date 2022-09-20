/*
  Warnings:

  - The primary key for the `LikeBy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `postsId` on table `LikeBy` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LikeBy" DROP CONSTRAINT "LikeBy_postsId_fkey";

-- AlterTable
ALTER TABLE "LikeBy" DROP CONSTRAINT "LikeBy_pkey",
ALTER COLUMN "postsId" SET NOT NULL,
ADD CONSTRAINT "LikeBy_pkey" PRIMARY KEY ("username", "postsId");

-- AddForeignKey
ALTER TABLE "LikeBy" ADD CONSTRAINT "LikeBy_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

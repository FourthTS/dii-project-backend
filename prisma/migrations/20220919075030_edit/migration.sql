-- CreateTable
CREATE TABLE "LikeBy" (
    "username" TEXT NOT NULL,
    "postsId" TEXT,

    CONSTRAINT "LikeBy_pkey" PRIMARY KEY ("username")
);

-- AddForeignKey
ALTER TABLE "LikeBy" ADD CONSTRAINT "LikeBy_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

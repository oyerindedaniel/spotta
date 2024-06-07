-- AlterTable
ALTER TABLE "ReviewComment" ADD COLUMN     "asAnonymous" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "ReviewCommentReaction" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "likeCommentId" TEXT,
    "dislikeCommentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewCommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewCommentReaction_userId_idx" ON "ReviewCommentReaction"("userId");

-- CreateIndex
CREATE INDEX "ReviewCommentReaction_likeCommentId_idx" ON "ReviewCommentReaction"("likeCommentId");

-- CreateIndex
CREATE INDEX "ReviewCommentReaction_dislikeCommentId_idx" ON "ReviewCommentReaction"("dislikeCommentId");

-- CreateIndex
CREATE INDEX "ReviewCommentReaction_type_idx" ON "ReviewCommentReaction"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewCommentReaction_userId_likeCommentId_key" ON "ReviewCommentReaction"("userId", "likeCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewCommentReaction_userId_dislikeCommentId_key" ON "ReviewCommentReaction"("userId", "dislikeCommentId");

-- AddForeignKey
ALTER TABLE "ReviewCommentReaction" ADD CONSTRAINT "ReviewCommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCommentReaction" ADD CONSTRAINT "ReviewCommentReaction_likeCommentId_fkey" FOREIGN KEY ("likeCommentId") REFERENCES "ReviewComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCommentReaction" ADD CONSTRAINT "ReviewCommentReaction_dislikeCommentId_fkey" FOREIGN KEY ("dislikeCommentId") REFERENCES "ReviewComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

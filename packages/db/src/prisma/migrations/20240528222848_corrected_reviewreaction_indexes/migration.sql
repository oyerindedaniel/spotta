-- DropIndex
DROP INDEX "ReviewReaction_dislikeReviewId_type_idx";

-- DropIndex
DROP INDEX "ReviewReaction_likeReviewId_type_idx";

-- CreateIndex
CREATE INDEX "ReviewReaction_userId_idx" ON "ReviewReaction"("userId");

-- CreateIndex
CREATE INDEX "ReviewReaction_likeReviewId_idx" ON "ReviewReaction"("likeReviewId");

-- CreateIndex
CREATE INDEX "ReviewReaction_dislikeReviewId_idx" ON "ReviewReaction"("dislikeReviewId");

-- CreateIndex
CREATE INDEX "ReviewReaction_type_idx" ON "ReviewReaction"("type");

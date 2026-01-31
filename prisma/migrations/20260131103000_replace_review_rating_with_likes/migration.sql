-- AlterTable
ALTER TABLE `Review` DROP COLUMN `reviewRating`,
ADD COLUMN `likesCount` INT NOT NULL DEFAULT 0;

-- Add userName column with backfill from email before enforcing NOT NULL/unique.
ALTER TABLE `User` ADD COLUMN `userName` VARCHAR(191) NULL;

UPDATE `User`
SET `userName` = SUBSTRING_INDEX(`email`, '@', 1)
WHERE `userName` IS NULL OR `userName` = '';

ALTER TABLE `User` MODIFY `userName` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `User_userName_key` ON `User`(`userName`);

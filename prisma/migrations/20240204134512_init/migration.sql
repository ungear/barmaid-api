-- CreateTable
CREATE TABLE `AlcType` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingredient` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Drink` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `AlcTypeId` INTEGER NOT NULL,
    `Glass` VARCHAR(255) NOT NULL,
    `Instructions` TEXT NOT NULL,
    `ThumbImageUrl` VARCHAR(1000) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrinkIngredient` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `IngredientId` INTEGER NOT NULL,
    `DrinkId` INTEGER NOT NULL,
    `Measure` VARCHAR(255) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Drink` ADD CONSTRAINT `Drink_AlcTypeId_fkey` FOREIGN KEY (`AlcTypeId`) REFERENCES `AlcType`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrinkIngredient` ADD CONSTRAINT `DrinkIngredient_IngredientId_fkey` FOREIGN KEY (`IngredientId`) REFERENCES `Ingredient`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrinkIngredient` ADD CONSTRAINT `DrinkIngredient_DrinkId_fkey` FOREIGN KEY (`DrinkId`) REFERENCES `Drink`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

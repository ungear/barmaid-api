/*
  Warnings:

  - The primary key for the `AlcType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `AlcType` table. All the data in the column will be lost.
  - The primary key for the `Drink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AlcTypeId` on the `Drink` table. All the data in the column will be lost.
  - You are about to drop the column `Glass` on the `Drink` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `Drink` table. All the data in the column will be lost.
  - You are about to drop the column `Instructions` on the `Drink` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Drink` table. All the data in the column will be lost.
  - You are about to drop the column `ThumbImageUrl` on the `Drink` table. All the data in the column will be lost.
  - The primary key for the `DrinkIngredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `DrinkId` on the `DrinkIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `DrinkIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `IngredientId` on the `DrinkIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `Measure` on the `DrinkIngredient` table. All the data in the column will be lost.
  - The primary key for the `Ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Ingredient` table. All the data in the column will be lost.
  - Added the required column `id` to the `AlcType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alcTypeId` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `glass` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructions` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbImageUrl` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drinkId` to the `DrinkIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `DrinkIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `DrinkIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Drink` DROP FOREIGN KEY `Drink_AlcTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `DrinkIngredient` DROP FOREIGN KEY `DrinkIngredient_DrinkId_fkey`;

-- DropForeignKey
ALTER TABLE `DrinkIngredient` DROP FOREIGN KEY `DrinkIngredient_IngredientId_fkey`;

-- AlterTable
ALTER TABLE `AlcType` DROP PRIMARY KEY,
    DROP COLUMN `Id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Drink` DROP PRIMARY KEY,
    DROP COLUMN `AlcTypeId`,
    DROP COLUMN `Glass`,
    DROP COLUMN `Id`,
    DROP COLUMN `Instructions`,
    DROP COLUMN `Name`,
    DROP COLUMN `ThumbImageUrl`,
    ADD COLUMN `alcTypeId` INTEGER NOT NULL,
    ADD COLUMN `glass` VARCHAR(255) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `instructions` TEXT NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `thumbImageUrl` VARCHAR(1000) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `DrinkIngredient` DROP PRIMARY KEY,
    DROP COLUMN `DrinkId`,
    DROP COLUMN `Id`,
    DROP COLUMN `IngredientId`,
    DROP COLUMN `Measure`,
    ADD COLUMN `drinkId` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `ingredientId` INTEGER NOT NULL,
    ADD COLUMN `measure` VARCHAR(255) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Ingredient` DROP PRIMARY KEY,
    DROP COLUMN `Id`,
    DROP COLUMN `Name`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Drink` ADD CONSTRAINT `Drink_alcTypeId_fkey` FOREIGN KEY (`alcTypeId`) REFERENCES `AlcType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrinkIngredient` ADD CONSTRAINT `DrinkIngredient_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrinkIngredient` ADD CONSTRAINT `DrinkIngredient_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

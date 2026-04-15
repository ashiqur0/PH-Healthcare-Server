/*
  Warnings:

  - Made the column `registrationNumber` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qualification` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentWorkingPlace` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `designation` on table `doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "doctor" ALTER COLUMN "registrationNumber" SET NOT NULL,
ALTER COLUMN "qualification" SET NOT NULL,
ALTER COLUMN "currentWorkingPlace" SET NOT NULL,
ALTER COLUMN "designation" SET NOT NULL;

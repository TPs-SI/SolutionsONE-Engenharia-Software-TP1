-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `key` VARCHAR(191) NOT NULL,
    `cellphone` VARCHAR(191) NULL,
    `birth` VARCHAR(191) NULL,
    `github` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'Pending',
    `role` VARCHAR(191) NULL,
    `idGoogle` VARCHAR(191) NULL,
    `resetToken` VARCHAR(191) NULL,
    `tokenExpires` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_github_key`(`github`),
    UNIQUE INDEX `User_idGoogle_key`(`idGoogle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contract` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `nameClient` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `archivePath` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contractId` INTEGER NOT NULL,
    `date` VARCHAR(191) NULL,

    UNIQUE INDEX `Project_contractId_key`(`contractId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersProjects` (
    `userId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `function` VARCHAR(191) NOT NULL,

    INDEX `UsersProjects_projectId_fkey`(`projectId`),
    PRIMARY KEY (`userId`, `projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersProjects` ADD CONSTRAINT `UsersProjects_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersProjects` ADD CONSTRAINT `UsersProjects_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

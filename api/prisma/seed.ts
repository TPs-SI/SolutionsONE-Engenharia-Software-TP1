import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const DEFAULT_PASSWORD_1 = "$2b$10$3eKKl/Z6.rwE1TF.HA4xy.3OyPc0qdjNTupORRDQwp1tX2S25ZoiK"; // 1234567Ab@
const DEFAULT_PASSWORD_2 = "$2b$10$5oT72HzWhctnb0q4EYMLNeF/E44BOfz.61WtbwzgE2YwCkEv6RtDq"; // !Teste123

async function main() {

    // Create users
    await prisma.user.createMany({
        data: [
            {
                name: 'Allan Dayrell',
                email: "allan@mail.com",
                key: "",
                photo: "https://avatars.githubusercontent.com/u/82408363?v=4",
                password: DEFAULT_PASSWORD_1,
                role: "Member",
                birth: "01/01/1990",
                cellphone: "31999999999",
            },
            {
                name: 'Bernardo Viggiano',
                email: "beviggiano@gmail.com",
                key: "",
                photo: "https://avatars.githubusercontent.com/u/126487673?v=4",
                password: DEFAULT_PASSWORD_2,
                role: "Administrator",
                birth: "01/01/1990",
                cellphone: "31999999999",
            },
            {
                name: 'Bruno Silva',
                email: "bruno@mail.com",
                key: "",
                photo: "https://avatars.githubusercontent.com/u/134235945?v=4",
                password: DEFAULT_PASSWORD_1,
                role: "Manager",
                birth: "01/01/1990",
                cellphone: "31999999999",
            },
            {
                name: 'Eduardo Correia',
                email: "eduardo@mail.com",
                key: "",
                photo: "https://avatars.githubusercontent.com/u/60967470?v=4",
                password: DEFAULT_PASSWORD_2,
                role: "Member",
                birth: "01/01/1990",
                cellphone: "31999999999",
            },
        ]
    });

    // Create contracts
    await prisma.contract.createMany({
        data: [
            {
                title: 'Contract 1',
                nameClient: 'Client 1',
                date: "26/01/2024",
                value: 1000,
                archivePath: "uploads/Contrato1-EngSoftware.pdf",
            },
            {
                title: 'Contract 2',
                nameClient: 'Client 3',
                date: "12/12/2024",
                value: 5000,
                archivePath: "uploads/Contrato2-EngSoftware.pdf",
            },
            {
                title: 'Contract 3',
                nameClient: 'Client 3',
                date: "19/02/2025",
                value: 3000,
                archivePath: "uploads/Contrato3-EngSoftware.pdf",
            },
            {
                title: 'Contract 4',
                nameClient: 'Client 4',
                date: "22/08/2023",
                value: 1000000,
                archivePath: "uploads/Contrato4-EngSoftware.pdf",
            },
        ]
    });

    // Create projects
    await prisma.project.createMany({
        data: [
            {
                name: 'Project A',
                contractId: 1,
                date: "2024-01-26",
            },
            {
                name: 'Project B',
                contractId: 2,
                date: "2025-02-19",
            },
            {
                name: 'Project C',
                contractId: 3,
                date: "2021-11-16",
            },
            {
                name: 'Project D',
                contractId: 4,
                date: "2019-07-02",
            },
        ]
    });

    // Create users and projects relations
    await prisma.usersProjects.createMany({
        data: [
            {
                userId: 1,
                projectId: 1,
                function: "Tech Lead",
            },
            {
                userId: 2,
                projectId: 1,
                function: "Developer",
            },
            {
                userId: 3,
                projectId: 4,
                function: "Developer",
            },
            {
                userId: 4,
                projectId: 1,
                function: "QA",
            },
        ]
    });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const username = "superadmin";
    const email = "admin@caughtcrafthanded.com";
    const password = "admin_secure_password_replace_me"; // The user should change this immediately

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await prisma.user.upsert({
        where: { email },
        update: {
            username,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            isActive: true,
        },
        create: {
            username,
            email,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            isActive: true,
        },
    });

    console.log("Super Admin created/updated:", superAdmin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

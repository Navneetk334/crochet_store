const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function verify() {
    console.log("Verifying credentials...");
    const email = "admin@caughtcrafthanded.com";
    const password = "admin_secure_password_replace_me";

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log("❌ User not found!");
        return;
    }

    console.log("User found:", user.username, user.email);
    console.log("Role:", user.role);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        console.log("✅ Password match! Credentials are valid.");
    } else {
        console.log("❌ Password DOES NOT match.");
        console.log("Stored hash:", user.password);
        // Gen a new one to see
        const newHash = await bcrypt.hash(password, 10);
        console.log("Expected hash format example:", newHash);
    }
}

verify()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

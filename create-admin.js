const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (existingUser) {
      return { success: true, message: 'Admin user already exists' };
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('umami', 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      },
    });

    return { success: true, message: `Admin user created successfully: ${user.username}` };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser().then(result => {
  if (result.success) {
    process.stdout.write(result.message);
  } else {
    process.stderr.write(`Error: ${result.error}`);
    process.exit(1);
  }
});

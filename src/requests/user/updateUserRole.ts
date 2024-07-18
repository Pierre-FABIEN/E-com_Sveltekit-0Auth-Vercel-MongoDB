// src/requests/user/updateUserRole.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUserRole = async (id: string, role: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role }
    });
    console.log('User role updated:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

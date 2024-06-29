// src/lib/functions/checkAuth.ts

import prisma from "$lib/prisma";

export const checkAuth = async (session: any) => {
  let user;

  if (session?.user?.email) {
    try {      
      
      user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
      
      if (!user) {        
        user = await prisma.user.create({
          data: {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: 'user',
          },
        });        
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  return user;
};

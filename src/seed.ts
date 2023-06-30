import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  const passwordBell = await bcrypt.hash('password-bells', roundsOfHashing);
  const passwordBrock = await bcrypt.hash('password-brock', roundsOfHashing);

  // const user1 = await prisma.user.upsert({
  //   where: { email: 'bells@gmail.com' },
  //   update: {
  //     password: passwordBell,
  //   },
  //   create: {
  //     firstName: 'James',
  //     lastName: 'Bells',
  //     password: passwordBell,
  //     email: 'bells@gmail.com',
  //     displayName: 'JBells',
  //   },
  // });

  // const user2 = await prisma.user.upsert({
  //   where: { email: 'alex@ruheni.com' },
  //   update: {
  //     password: passwordBrock,
  //   },
  //   create: {
  //     firstName: 'Sarah',
  //     lastName: 'Brock',
  //     password: passwordBrock,
  //     email: 'brock@gmail.com',
  //     displayName: 'Brocker',
  //   },
  // });

  const post1 = await prisma.post.createMany({
    // where: { title: ""},
    //   update: {
    //     password: passwordBrock,
    //   },
    data: [
      {
        title: 'Post One',
        content: 'This is a content of post Three',
        authorId: '3ad7ffac-f307-4ea4-afd3-e28de2faea26',
        image: 'https://www.npmjs.com//',
      },
      {
        title: 'Post Two',
        content: 'This is a content of post Four',
        authorId: 'f74e0954-6354-4ed8-8e63-ef0b88c6b7e9',
        image: 'https://www.npmjs.com//',
      },
    ],
  });

  const post2 = {
    data: {
      title: 'Post Three',
      content: 'This is a content of post Three',
      authorId: 'f74e0954-6354-4ed8-8e63-ef0b88c6b7e9',
    },
  };

  console.log(post1, post2);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
const roundsOfHashing = 10;
async function main() {
    const passwordBell = await bcrypt.hash('password-bells', roundsOfHashing);
    const passwordBrock = await bcrypt.hash('password-brock', roundsOfHashing);
    const post1 = await prisma.post.createMany({
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
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
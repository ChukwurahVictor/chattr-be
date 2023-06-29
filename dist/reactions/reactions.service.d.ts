import { PrismaService } from 'src/prisma/prisma.service';
export declare class ReactionsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(): Promise<string>;
    getAllReactions(): Promise<string>;
    getAReaction(): Promise<string>;
    updateReaction(): Promise<string>;
    removeReaction(): Promise<string>;
}

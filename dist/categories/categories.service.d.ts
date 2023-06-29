import { PrismaService } from "src/prisma/prisma.service";
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
    }, unknown, never> & {}>;
    getAllCategories(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
    }, unknown, never> & {})[]>;
    getACategory(id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
    }, unknown, never> & {}>;
    updateCategory(): Promise<string>;
    removeCategory(): Promise<string>;
}

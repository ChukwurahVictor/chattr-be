import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
    }, unknown, never> & {}>;
    getCategories(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
    }, unknown, never> & {})[]>;
    getCategory(id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
    }, unknown, never> & {}>;
    updateCategory(): Promise<string>;
    removeCategory(): Promise<string>;
}

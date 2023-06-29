"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const categoryExists = await this.prisma.category.findFirst({ where: { name: createCategoryDto.name } });
        if (categoryExists) {
            throw new common_1.HttpException('Category already exists.', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.category.create({ data: createCategoryDto });
    }
    async getAllCategories() {
        try {
            const categories = await this.prisma.category.findMany();
            return categories;
        }
        catch (error) {
            throw new common_1.HttpException(`${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getACategory(id) {
        try {
            const category = await this.prisma.category.findUnique({ where: { id: id } });
            if (!category) {
                throw new common_1.HttpException('Category not found.', common_1.HttpStatus.NOT_FOUND);
            }
            return category;
        }
        catch (error) {
            throw new common_1.HttpException(`${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateCategory() {
        try {
            return 'Update Category';
        }
        catch (error) {
            throw new common_1.HttpException(`${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeCategory() {
        try {
            return 'Delete Category';
        }
        catch (error) {
            throw new common_1.HttpException(`${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map
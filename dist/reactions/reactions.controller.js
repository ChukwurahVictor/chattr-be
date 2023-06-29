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
exports.ReactionsController = void 0;
const common_1 = require("@nestjs/common");
const response_interceptor_1 = require("../interceptors/response.interceptor");
const response_message_decorator_1 = require("../interceptors/response_message.decorator");
const reactions_service_1 = require("./reactions.service");
let ReactionsController = class ReactionsController {
    constructor(reactionsService) {
        this.reactionsService = reactionsService;
    }
    async createReaction() {
        return await this.reactionsService.create();
    }
    async getReactions() {
        return await this.reactionsService.getAllReactions();
    }
    async getReaction() {
        return await this.reactionsService.getAReaction();
    }
    async updateReaction() {
        return await this.reactionsService.updateReaction();
    }
    async removeReaction() {
        return await this.reactionsService.removeReaction();
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, response_message_decorator_1.ResponseMessage)('Reaction created successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "createReaction", null);
__decorate([
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)('Reactions fetched successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "getReactions", null);
__decorate([
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)('Reaction fetched successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "getReaction", null);
__decorate([
    (0, common_1.Patch)(),
    (0, response_message_decorator_1.ResponseMessage)('Reaction updated successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "updateReaction", null);
__decorate([
    (0, common_1.Delete)(),
    (0, response_message_decorator_1.ResponseMessage)('Reaction deleted successfully'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "removeReaction", null);
ReactionsController = __decorate([
    (0, common_1.Controller)('comments'),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [reactions_service_1.ReactionsService])
], ReactionsController);
exports.ReactionsController = ReactionsController;
//# sourceMappingURL=reactions.controller.js.map